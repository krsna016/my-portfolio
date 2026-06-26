/* ==========================================================================
   TACTILE CYBER-SOUND HUD & HAPTICS ENGINE
   Synthesizes sci-fi UI blips using HTML5 Web Audio API (No files needed)
   ========================================================================== */

window.CyberSound = (function() {
    let audioCtx = null;
    let enabled = false;

    function initCtx() {
        if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function playTone(freq, type, duration, vol=0.05) {
        if (!enabled) return;
        initCtx();
        if (!audioCtx) return;

        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            
            gain.gain.setValueAtTime(vol, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch(e) {}
    }

    return {
        toggle: function() {
            enabled = !enabled;
            const pill = document.getElementById('hud-audio-toggle');
            if (pill) {
                pill.className = `hud-audio-pill ${enabled ? 'enabled' : ''}`;
                pill.innerHTML = enabled ? `<i class="fa-solid fa-volume-high"></i> HUD Audio: ON` : `<i class="fa-solid fa-volume-xmark"></i> HUD Audio: OFF`;
            }
            if (enabled) this.playBlip();
            return enabled;
        },
        isEnabled: () => enabled,
        playHover: function() { playTone(440, 'sine', 0.05, 0.02); },
        playClick: function() { playTone(880, 'triangle', 0.08, 0.04); },
        playBlip: function() { playTone(1200, 'sine', 0.1, 0.05); },
        playSuccess: function() {
            if (!enabled) return;
            playTone(523.25, 'sine', 0.1, 0.05);
            setTimeout(() => playTone(659.25, 'sine', 0.1, 0.05), 80);
            setTimeout(() => playTone(783.99, 'sine', 0.15, 0.05), 160);
        }
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    // Inject floating audio toggle pill
    if (!document.getElementById('hud-audio-toggle')) {
        const pill = document.createElement('button');
        pill.id = 'hud-audio-toggle';
        pill.className = 'hud-audio-pill';
        pill.innerHTML = `<i class="fa-solid fa-volume-xmark"></i> HUD Audio: OFF`;
        pill.title = "Toggle sci-fi tactile UI sound design";
        pill.onclick = () => window.CyberSound.toggle();
        document.body.appendChild(pill);
    }

    // Attach global click sound to interactive buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('a, button, .btn, .glass, .dsa-bar, .ide-tab')) {
            window.CyberSound.playClick();
        }
    });
});
