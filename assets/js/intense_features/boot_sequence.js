/**
 * Ultra-Premium Boot Sequence
 * Elite Cybersecurity OS Theme
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if user has already seen the boot sequence
    if (localStorage.getItem('ap_portfolio_booted_v1')) {
        return; // Instantly skip
    }

    // Inject CSS
    const style = document.createElement('style');
    style.textContent = `
        #premium-boot-sequence {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: #050505;
            z-index: 2147483647;
            color: rgba(255, 255, 255, 0.85);
            font-family: 'SF Mono', 'JetBrains Mono', 'IBM Plex Mono', monospace;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            padding: 3vw 4vw;
            box-sizing: border-box;
            transition: opacity 0.6s cubic-bezier(0.8, 0, 0.2, 1), filter 0.6s ease;
            font-size: 13px;
            line-height: 1.6;
        }
        #premium-boot-sequence::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background-image: 
                linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
            background-size: 40px 40px;
            pointer-events: none;
            z-index: 1;
            opacity: 0.5;
        }
        /* Film grain */
        #premium-boot-sequence::after {
            content: '';
            position: absolute;
            top: -50%; left: -50%; right: -50%; bottom: -50%;
            background: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.08%22/%3E%3C/svg%3E');
            animation: boot-grain 4s steps(10) infinite;
            pointer-events: none;
            z-index: 2;
        }
        @keyframes boot-grain {
            0%, 100% { transform: translate(0, 0); }
            10% { transform: translate(-5%, -10%); }
            20% { transform: translate(-15%, 5%); }
            30% { transform: translate(7%, -25%); }
            40% { transform: translate(-5%, 25%); }
            50% { transform: translate(-15%, 10%); }
            60% { transform: translate(15%, 0%); }
            70% { transform: translate(0%, 15%); }
            80% { transform: translate(3%, 35%); }
            90% { transform: translate(-10%, 10%); }
        }
        
        .boot-content {
            position: relative;
            z-index: 10;
            flex: 1;
            display: flex;
            flex-direction: column;
            width: 100%;
            max-width: 1000px;
            margin: 0 auto;
        }

        .boot-line {
            display: flex;
            align-items: flex-start;
            margin-bottom: 4px;
            opacity: 0;
            transform: translateY(4px);
            animation: boot-fade-up 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .boot-timestamp {
            color: rgba(255, 255, 255, 0.4);
            margin-right: 16px;
            min-width: 110px;
        }
        
        .boot-text {
            color: rgba(255, 255, 255, 0.85);
        }
        
        .boot-highlight {
            color: #fff;
            font-weight: 600;
        }

        .boot-success {
            color: #fff;
        }

        @keyframes boot-fade-up {
            to { opacity: 1; transform: translateY(0); }
        }
        
        .boot-cursor {
            display: inline-block;
            width: 8px;
            height: 15px;
            background: #fff;
            vertical-align: middle;
            animation: boot-blink 1s step-end infinite;
            margin-left: 4px;
        }
        @keyframes boot-blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }

        .boot-progress-container {
            width: 100%;
            max-width: 300px;
            height: 2px;
            background: rgba(255, 255, 255, 0.1);
            margin: 16px 0;
            position: relative;
            overflow: hidden;
            display: none;
        }
        
        .boot-progress-bar {
            position: absolute;
            top: 0; left: 0; height: 100%;
            background: #fff;
            width: 0%;
            transition: width 0.1s linear;
        }

        .boot-auth-box {
            margin-top: 32px;
            display: none;
            flex-direction: column;
        }

        .boot-welcome {
            margin-top: 40px;
            font-size: 24px;
            font-weight: 300;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            opacity: 0;
            display: none;
            transition: opacity 0.8s ease;
        }

        .boot-grid-status {
            display: none;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-top: 40px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 24px;
        }

        .boot-grid-item {
            display: flex;
            flex-direction: column;
            opacity: 0;
            transform: translateY(4px);
        }

        .boot-grid-label {
            color: rgba(255, 255, 255, 0.4);
            font-size: 11px;
            text-transform: uppercase;
            margin-bottom: 4px;
        }

        .boot-grid-val {
            color: #fff;
            font-weight: 500;
        }

        .boot-flash {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: #fff;
            z-index: 2147483648;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.5s ease-out;
        }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.id = 'premium-boot-sequence';
    
    const content = document.createElement('div');
    content.className = 'boot-content';
    container.appendChild(content);

    const flash = document.createElement('div');
    flash.className = 'boot-flash';
    document.body.appendChild(flash);
    
    document.body.appendChild(container);

    // Lock body scroll
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // State
    let isSkipped = false;
    let sequenceTimeout;

    // Audio context (lazy)
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let actx = null;
    function getCtx() {
        if (!actx) actx = new AudioContext();
        if (actx.state === 'suspended') actx.resume();
        return actx;
    }
    
    function playClick(freq = 800, dur = 0.03, vol = 0.02) {
        if (isSkipped) return;
        try {
            const ctx = getCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq/2, ctx.currentTime + dur);
            gain.gain.setValueAtTime(vol, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + dur);
        } catch(e) {}
    }

    function getTimestamp() {
        const d = new Date();
        return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}.${String(d.getMilliseconds()).padStart(3,'0')}`;
    }

    function appendLine(html) {
        if (isSkipped) return null;
        const line = document.createElement('div');
        line.className = 'boot-line';
        line.innerHTML = `<span class="boot-timestamp">${getTimestamp()}</span><span class="boot-text">${html}</span>`;
        content.appendChild(line);
        playClick(1200, 0.02, 0.01);
        return line;
    }

    async function sleep(ms) {
        return new Promise(resolve => {
            sequenceTimeout = setTimeout(resolve, ms);
        });
    }

    async function runSequence() {
        // Phase 1: Wake
        const initLine = appendLine(`> <span id="boot-typewriter"></span><span class="boot-cursor"></span>`);
        await sleep(400);
        
        const typeTarget = "Initializing Secure Environment...";
        const typer = document.getElementById('boot-typewriter');
        
        for (let i = 0; i < typeTarget.length; i++) {
            if (isSkipped) return;
            typer.textContent += typeTarget[i];
            playClick(2000, 0.01, 0.005);
            await sleep(20 + Math.random() * 30);
        }
        
        await sleep(300);

        // Phase 2: System Initialization
        const modules = [
            "[✓] Bootloader Loaded",
            "[✓] Kernel Initialized (2026.07)",
            "[✓] GPU Renderer Ready",
            "[✓] Motion Engine Started",
            "[✓] Loading Portfolio Assets",
            "[✓] Loading Experience Database",
            "[✓] Initializing Knowledge Graph",
            "[✓] Synchronizing GitHub Activity",
            "[✓] Loading Research Archive",
            "[✓] Starting Interactive Components",
            "[✓] Connecting Terminal Interface",
            "[✓] Optimizing Render Pipeline",
            "[✓] Security Modules Enabled"
        ];

        for (let mod of modules) {
            if (isSkipped) return;
            appendLine(`<span class="boot-success">${mod}</span> <span style="opacity:0.3; margin-left:8px;">[0x${Math.floor(Math.random()*0xFFFF).toString(16).toUpperCase()}]</span>`);
            await sleep(40 + Math.random() * 60);
        }

        await sleep(200);

        // Phase 3: Authentication
        appendLine(`Authenticating Identity...`);
        
        const progCont = document.createElement('div');
        progCont.className = 'boot-progress-container';
        const progBar = document.createElement('div');
        progBar.className = 'boot-progress-bar';
        progCont.appendChild(progBar);
        content.appendChild(progCont);
        progCont.style.display = 'block';

        for (let i = 0; i <= 100; i += (Math.random() * 15 + 5)) {
            if (isSkipped) return;
            if (i > 100) i = 100;
            progBar.style.width = i + '%';
            playClick(600, 0.02, 0.01);
            await sleep(30);
        }
        progBar.style.width = '100%';
        await sleep(100);

        appendLine(`Public Key Verified`);
        await sleep(100);
        appendLine(`Digital Signature Verified`);
        await sleep(100);
        appendLine(`Identity Confirmed.`);
        playClick(1500, 0.1, 0.03); // Success beep
        await sleep(200);

        const welcome = document.createElement('div');
        welcome.className = 'boot-welcome';
        welcome.innerHTML = `Welcome,<br><span style="color:#fff; font-weight:600;">ANURAG PAREEK</span>`;
        content.appendChild(welcome);
        welcome.style.display = 'block';
        
        // Force reflow
        void welcome.offsetWidth;
        welcome.style.opacity = '1';

        await sleep(400);

        // Phase 4: System Scan (Grid)
        const grid = document.createElement('div');
        grid.className = 'boot-grid-status';
        content.appendChild(grid);
        grid.style.display = 'grid';

        const stats = [
            { l: "CPU", v: "Online" },
            { l: "Memory", v: "Stable" },
            { l: "Renderer", v: "Accelerated" },
            { l: "GitHub", v: "Connected" },
            { l: "Projects", v: "Loaded" },
            { l: "Security", v: "Verified" }
        ];

        for (let stat of stats) {
            if (isSkipped) return;
            const item = document.createElement('div');
            item.className = 'boot-grid-item';
            item.innerHTML = `<div class="boot-grid-label">${stat.l}</div><div class="boot-grid-val">${stat.v}</div>`;
            grid.appendChild(item);
            
            item.animate([
                { opacity: 0, transform: 'translateY(4px)' },
                { opacity: 1, transform: 'translateY(0)' }
            ], { duration: 300, fill: 'forwards', easing: 'ease-out' });
            
            playClick(2500, 0.01, 0.005);
            await sleep(60);
        }

        await sleep(400);
        appendLine(`Launching Personal Operating System...`);
        await sleep(300);

        finishSequence();
    }

    function finishSequence() {
        if (isSkipped) return;
        isSkipped = true;
        clearTimeout(sequenceTimeout);

        localStorage.setItem('ap_portfolio_booted_v1', 'true');

        // Phase 5: Final Launch
        flash.style.opacity = '0.1';
        playClick(400, 0.5, 0.02); // Deep hum
        
        container.style.opacity = '0';
        container.style.filter = 'blur(10px) brightness(2)';
        container.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            flash.style.opacity = '0';
        }, 100);

        document.body.style.overflow = origOverflow;

        setTimeout(() => {
            container.remove();
            flash.remove();
        }, 800);
    }

    function skipSequence() {
        if (isSkipped) return;
        isSkipped = true;
        clearTimeout(sequenceTimeout);
        localStorage.setItem('ap_portfolio_booted_v1', 'true');
        
        container.style.transition = 'opacity 0.3s ease';
        container.style.opacity = '0';
        document.body.style.overflow = origOverflow;

        setTimeout(() => {
            container.remove();
            flash.remove();
        }, 300);
    }

    // Bind skip events
    const skipHandler = (e) => {
        if (!isSkipped) skipSequence();
    };
    
    document.addEventListener('keydown', (e) => {
        if (['Escape', ' ', 'Enter'].includes(e.key)) {
            skipHandler();
        }
    });
    
    container.addEventListener('click', skipHandler);

    // Start sequence
    runSequence();
});
