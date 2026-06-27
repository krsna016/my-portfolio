/* ==========================================================================
   TACTILE CYBER-SOUND HUD & HAPTICS ENGINE
   Synthesizes sci-fi UI blips using HTML5 Web Audio API (No files needed)
   ========================================================================== */

window.CyberSound = (function() {
    let audioCtx = null;
    let enabled = false;

    try {
        if (localStorage.getItem('hud_audio_enabled') === 'true') {
            enabled = true;
        }
    } catch(e) {}

    function initCtx() {
        if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playTone(freq, type, duration, vol=0.04) {
        if (!enabled) return;
        initCtx();
        if (!audioCtx) return;

        try {
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, now);
            
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.linearRampToValueAtTime(vol, now + 0.005);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now);
            osc.stop(now + duration);
        } catch(e) {}
    }

    return {
        toggle: function() {
            enabled = !enabled;
            try { localStorage.setItem('hud_audio_enabled', enabled); } catch(e) {}
            initCtx();
            const pill = document.getElementById('hud-audio-toggle');
            if (pill) {
                pill.className = `hud-audio-pill ${enabled ? 'enabled' : ''}`;
                pill.innerHTML = enabled ? `<i class="fa-solid fa-volume-high" style="color:#2ed573;"></i> HUD Audio: ON` : `<i class="fa-solid fa-volume-xmark"></i> HUD Audio: OFF`;
            }
            if (enabled) this.playBlip();
            return enabled;
        },
        isEnabled: () => enabled,
        playHover: function() { playTone(440, 'sine', 0.04, 0.02); },
        playClick: function() { 
            playTone(900, 'triangle', 0.04, 0.05);
            setTimeout(() => playTone(300, 'sine', 0.05, 0.02), 15);
        },
        playBlip: function() { playTone(1200, 'sine', 0.1, 0.05); },
        playType: function(e) {
            if (!enabled) return;
            if (e.key === 'Backspace') {
                playTone(420, 'sawtooth', 0.02, 0.02);
            } else if (e.key === 'Enter') {
                playTone(850, 'sine', 0.05, 0.04);
                setTimeout(() => playTone(400, 'triangle', 0.04, 0.02), 15);
            } else if (e.key === ' ') {
                playTone(320, 'sine', 0.04, 0.04);
            } else if (e.key && e.key.length === 1) {
                playTone(650 + Math.random() * 140, 'triangle', 0.02, 0.03);
            }
        },
        playSuccess: function() {
            if (!enabled) return;
            playTone(523.25, 'sine', 0.1, 0.05);
            setTimeout(() => playTone(659.25, 'sine', 0.1, 0.05), 80);
            setTimeout(() => playTone(783.99, 'sine', 0.15, 0.05), 160);
        }
    };
})();

function initAudioHUD() {
    const isEn = window.CyberSound.isEnabled();
    if (!document.getElementById('hud-audio-toggle')) {
        const pill = document.createElement('button');
        pill.id = 'hud-audio-toggle';
        pill.className = `hud-audio-pill ${isEn ? 'enabled' : ''}`;
        pill.innerHTML = isEn ? `<i class="fa-solid fa-volume-high" style="color:#2ed573;"></i> HUD Audio: ON` : `<i class="fa-solid fa-volume-xmark"></i> HUD Audio: OFF`;
        pill.title = "Toggle sci-fi tactile UI sound design";
        pill.onclick = () => window.CyberSound.toggle();
        document.body.appendChild(pill);
    }

    document.addEventListener('click', (e) => {
        if (window.CyberSound.isEnabled() && e.target.id !== 'hud-audio-toggle' && !e.target.closest('#hud-audio-toggle')) {
            window.CyberSound.playClick();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (window.CyberSound.isEnabled()) {
            window.CyberSound.playType(e);
        }
    });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAudioHUD); else initAudioHUD();
