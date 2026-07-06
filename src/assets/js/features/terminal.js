/* ==========================================================================
   DROPDOWN QUAKE HACKER TERMINAL HUD
   Triggered by pressing `~` (backtick) or clicking footer trigger
   ========================================================================== */

function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function initQuakeTerm() {
    if (document.getElementById('quake-terminal')) return;

    const termHUD = document.createElement('div');
    termHUD.id = 'quake-terminal';
    termHUD.className = 'quake-terminal-hud';
    termHUD.innerHTML = `
        <div class="term-header">
            <div class="term-header-left">
                <div class="term-traffic-lights">
                    <span class="term-dot red" onclick="toggleTerm()" style="cursor:pointer;" title="Close"></span>
                    <span class="term-dot yellow"></span>
                    <span class="term-dot green"></span>
                </div>
                <strong style="margin-left: 10px; color: #00d2ff; letter-spacing:1px;"><i class="fa-solid fa-terminal"></i> root@system:~</strong>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
                <span style="font-size: 0.75rem;">Press <kbd style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;">~</kbd> or <kbd style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;">ESC</kbd> to close</span>
                <span onclick="toggleTerm()" style="cursor:pointer; color:#ff0055; font-weight:bold; font-size:1.1rem; padding: 0 5px;" title="Close Terminal">[ X ]</span>
            </div>
        </div>
        <div class="term-body" id="term-body">
            <div class="term-output">
                <div>Welcome to Anurag Pareek's Root CLI [v2.5.0-agentic]</div>
                <div style="color: #c8d6e5;">Type <span style="color: #00d2ff;">help</span> to see available system commands.</div>
            </div>
            <div class="term-input-row">
                <span class="term-prompt">anurag@engineer:~$</span>
                <input type="text" id="term-input" class="term-input" autocomplete="off" spellcheck="false" autofocus>
            </div>
        </div>
    `;
    
    // Add modal overlay for consistency
    const termOverlay = document.createElement('div');
    termOverlay.className = 'modal'; 
    termOverlay.id = 'quake-terminal-overlay';
    termOverlay.style.zIndex = '999999'; 
    termOverlay.style.cursor = 'pointer';
    
    // Clicking overlay closes terminal
    termOverlay.addEventListener('click', toggleTerm);

    document.body.appendChild(termOverlay);
    document.body.appendChild(termHUD);

    const input = document.getElementById('term-input');
    const body = document.getElementById('term-body');

    // Make it draggable
    const header = termHUD.querySelector('.term-header');
    header.style.cursor = 'move';
    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        
        // Get the current visual bounds BEFORE removing transform
        const rect = termHUD.getBoundingClientRect();
        
        termHUD.classList.add('dragged');
        
        // Calculate offset from mouse to top-left of the modal
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        
        // Override the initial centered transform so we can freely move it with top/left
        termHUD.style.transition = 'none';
        termHUD.style.transform = 'none';
        termHUD.style.left = rect.left + 'px';
        termHUD.style.top = rect.top + 'px';
        
        document.body.style.userSelect = 'none'; // prevent text selection
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;
        
        // Optional boundary checks to prevent dragging off-screen completely
        newY = Math.max(0, Math.min(newY, window.innerHeight - 50));
        newX = Math.max(10 - termHUD.offsetWidth, Math.min(newX, window.innerWidth - 50));
        
        termHUD.style.left = newX + 'px';
        termHUD.style.top = newY + 'px';
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            document.body.style.userSelect = '';
        }
    });

    function toggleTerm() {
        termHUD.classList.toggle('open');
        if (termHUD.classList.contains('open')) {
            termOverlay.classList.add('show');
            termOverlay.style.display = 'flex';
            setTimeout(() => input.focus(), 100);
            if (window.CyberSound) window.CyberSound.playBlip();
        } else {
            termOverlay.classList.remove('show');
            termOverlay.style.display = 'none';
        }
    }

    // Trigger on `~` or `\` or `Ctrl+~`
    window.addEventListener('keydown', (e) => {
        if (e.key === '`' || e.key === '~') {
            // Prevent if user is typing in modal textarea or normal input
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                toggleTerm();
            } else if (e.target.id === 'term-input') {
                e.preventDefault();
                toggleTerm();
            }
        } else if (e.key === 'Escape' && termHUD.classList.contains('open')) {
            toggleTerm();
        }
    });

    window.toggleTerm = toggleTerm;

    // Attach trigger to Hero CTA button or footer trigger if present
    const heroBtn = document.getElementById('hero-cli-trigger');
    if (heroBtn) heroBtn.onclick = toggleTerm;
    const footerBtn = document.getElementById('terminal-trigger');
    if (footerBtn) footerBtn.onclick = toggleTerm;

    function printOut(html) {
        const out = document.createElement('div');
        out.className = 'term-output';
        out.innerHTML = html;
        body.insertBefore(out, input.parentNode);
        body.scrollTop = body.scrollHeight;
    }

    let cmdHistory = [];
    let historyIdx = -1;

    input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (cmdHistory.length > 0 && historyIdx < cmdHistory.length - 1) {
                historyIdx++;
                input.value = cmdHistory[cmdHistory.length - 1 - historyIdx];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIdx > 0) {
                historyIdx--;
                input.value = cmdHistory[cmdHistory.length - 1 - historyIdx];
            } else if (historyIdx === 0) {
                historyIdx = -1;
                input.value = '';
            }
        } else if (e.key === 'Enter') {
            const raw = input.value;
            const cmd = raw.trim().toLowerCase();
            input.value = '';
            historyIdx = -1;

            if (cmd !== '') cmdHistory.push(raw);

            printOut(`<span style="color: #6c5ce7;">anurag@engineer:~$</span> ${escapeHTML(raw)}`);

            if (cmd === 'help') {
                printOut(`
                    <div style="color:#e1e1e6; margin-bottom:6px;"><strong>⚡ ANURAG'S AGENTIC ROOT CLI (32 INTENSE COMMANDS)</strong></div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 6px; font-size: 0.8rem;">
                        <div><b style="color:#00d2ff;">help</b> : Show this command index</div>
                        <div><b style="color:#00d2ff;">cat resume</b> : Executive summary & education</div>
                        <div><b style="color:#00d2ff;">skills</b> : Data analytics & AI tech stack</div>
                        <div><b style="color:#00d2ff;">projects</b> : Featured engineering projects</div>
                        <div><b style="color:#00d2ff;">ping anurag</b> : Live response latency test</div>
                        <div><b style="color:#2ed573;">sudo hire</b> : Instant contact redirect + celebration</div>
                        <div><b style="color:#ff5f56;">clear</b> : Clear terminal console output</div>
                        <div><b style="color:#00ff66;">matrix</b> : Launch digital rain simulation</div>
                        <div><b style="color:#ff007f;">cyberpunk</b> : Switch theme to Neon Pink</div>
                        <div><b style="color:#ffee00;">theme reset</b> : Restore Cyan & Cyber Violet</div>
                        <div><b style="color:#00d2ff;">hack</b> : Run mock security breach trace</div>
                        <div><b style="color:#c8d6e5;">coffee</b> : Dispense virtual double espresso</div>
                        <div><b style="color:#00ff66;">neofetch</b> : Display OS & neural architecture specs</div>
                        <div><b style="color:#ffee00;">crypto</b> : Live ticker ($BTC, $ANURAG coin)</div>
                        <div><b style="color:#00d2ff;">ai twin</b> : Converse with AI autonomous clone</div>
                        <div><b style="color:#6c5ce7;">sql</b> : Run mock DB query SELECT * FROM impact</div>
                        <div><b style="color:#ff007f;">arcade</b> : Launch retro gaming easter egg</div>
                        <div><b style="color:#2ed573;">fortune</b> : Dispense legendary engineering quote</div>
                        <div><b style="color:#00d2ff;">whoami</b> : Display root user privileges</div>
                        <div><b style="color:#c8d6e5;">uname -a</b> : Output system kernel architecture</div>
                        <div><b style="color:#00ff66;">uptime</b> : Display server SLA availability</div>
                        <div><b style="color:#ff5f56;">top</b> : Live CPU/RAM process monitor ticker</div>
                        <div><b style="color:#ffee00;">rickroll</b> : Play retro 8-bit chiptune surprise</div>
                        <div><b style="color:#ff007f;">party</b> : Trigger site-wide confetti strobe</div>
                        <div><b style="color:#00d2ff;">zen</b> : Print The Zen of Data Engineering</div>
                        <div><b style="color:#c8d6e5;">date</b> : High-precision stardate timestamp</div>
                        <div><b style="color:#6c5ce7;">history</b> : List command execution history</div>
                        <div><b style="color:#ff5f56;">exit</b> : Close Quake terminal modal</div>
                        <div><b style="color:#c8d6e5;">cat /etc/passwd</b> : Print root shadow creds</div>
                        <div><b style="color:#2ed573;">chmod 777 career</b> : Unlock limitless growth</div>
                        <div><b style="color:#00d2ff;">curl weather</b> : Fetch coding weather conditions</div>
                        <div><b style="color:#ff5f56;">rm -rf /</b> : Test quantum fault shields</div>
                    </div>
                `);
            } else if (cmd === 'cat resume' || cmd === 'resume') {
                printOut(`
                    <div style="color: #e1e1e6; border-left: 2px solid #00d2ff; padding-left: 10px;">
                        <strong>ANURAG PAREEK</strong> - Staff Data Analyst & Software Developer<br>
                        🎓 Education: B.Tech at GLA University (AI & Data Systems)<br>
                        📜 Certs: Harvard CS50P, Postman API Fundamentals<br>
                        💡 Focus: Interactive Dashboards, Python Automation, Distributed Web Systems
                    </div>
                `);
            } else if (cmd === 'skills') {
                printOut(`
                    <div style="color: #00ff66;">
                        [Python] [SQL / MySQL / Postgres] [Power BI] [Advanced Excel] [Tableau]<br>
                        [JavaScript / HTML5 / CSS3] [Git / GitHub] [REST APIs / JSON] [Scikit-Learn]
                    </div>
                `);
            } else if (cmd === 'projects') {
                printOut(`
                    <div style="color: #c8d6e5;">
                        1. 📊 Interactive Agentic Portfolio & Blog Platform<br>
                        2. 🦖 Chrome T-Rex & Retro Arcade Physics Engine<br>
                        3. 📈 Financial Data Analytics & Forecasting Dashboard
                    </div>
                `);
            } else if (cmd.startsWith('ping')) {
                printOut(`PING anuragpareek016.engineer (127.0.0.1): 56 data bytes...`);
                setTimeout(() => printOut(`64 bytes from anurag: icmp_seq=0 ttl=64 time=0.12 ms <strong style="color:#2ed573;">[ONLINE & READY TO BUILD]</strong>`), 300);
            } else if (cmd === 'sudo hire' || cmd === 'hire') {
                printOut(`<strong style="color: #2ed573;">🎉 ROOT ACCESS GRANTED: Redirecting to contact scheduler...</strong>`);
                if (window.CyberSound) window.CyberSound.playSuccess();
                if (window.confetti) window.confetti({particleCount:120, spread:80, origin:{y:0.6}});
                setTimeout(() => { window.location.href = 'contact.html'; }, 1400);
            } else if (cmd === 'clear') {
                body.querySelectorAll('.term-output').forEach(el => el.remove());
            } else if (cmd === 'matrix') {
                printOut(`<strong style="color:#00ff66;">[MATRIX PROTOCOL INITIATED]</strong>`);
                const mbox = document.createElement('div');
                mbox.style = "color:#00ff66; font-family:monospace; line-height:1.1; font-size:11px; margin:4px 0; letter-spacing:2px;";
                body.insertBefore(mbox, input.parentNode);
                let mlines = 0;
                const mint = setInterval(() => {
                    let str = "";
                    for(let i=0; i<35; i++) str += String.fromCharCode(0x30A0 + Math.floor(Math.random()*96)) + " ";
                    mbox.innerHTML += `<div>${str}</div>`;
                    body.scrollTop = body.scrollHeight;
                    mlines++;
                    if(mlines > 12) { clearInterval(mint); }
                }, 70);
            } else if (cmd === 'cyberpunk') {
                document.documentElement.style.setProperty('--primary-color', '#ff007f');
                printOut(`<strong style="color:#ff007f;">[THEME OVERRIDE]: Cyberpunk Neon Pink color matrix active!</strong>`);
            } else if (cmd === 'theme reset' || cmd === 'reset') {
                document.documentElement.style.removeProperty('--primary-color');
                printOut(`<strong style="color:#00d2ff;">[THEME RESTORED]: Electric Cyan & Cyber Violet operational.</strong>`);
            } else if (cmd === 'hack' || cmd === 'nmap') {
                printOut(`<div style="color:#00d2ff;">Initiating trace route to target target_auth_server...</div>`);
                setTimeout(() => printOut(`<div style="color:#ffee00;">Bypassing firewall [port 443 open]... SSL verification OK</div>`), 400);
                setTimeout(() => printOut(`<strong style="color:#2ed573;">[INTRUSION SUCCESS]: Root database unlocked. Anurag is a legendary engineer.</strong>`), 900);
            } else if (cmd === 'coffee' || cmd === 'brew') {
                printOut(`
<pre style="color:#c8d6e5; margin:4px 0; font-size:10px;">
    (  )   ( )
     )  ( )
   ........
  |        |]
  \\        /
   \`------'
</pre>
                <div style="color:#ffee00;">Dispensing double shot espresso... Caffeine levels at 100%! Ready to code.</div>`);
            } else if (cmd === 'neofetch') {
                printOut(`
<div style="display:flex; gap:15px; align-items:center; color:#e1e1e6; font-size:0.8rem;">
<pre style="color:#00d2ff; font-weight:bold; margin:0;">
   /\\\\
  /  \\\\
 / /\\\\ \\\\
/ /  \\\\ \\\\
</pre>
<div>
<strong style="color:#00d2ff;">anurag@engineer-node</strong><br>
--------------------<br>
<b style="color:#6c5ce7;">OS</b>: AnuragOS v2.5 64-bit<br>
<b style="color:#6c5ce7;">Kernel</b>: Neural-Engine-ARM64<br>
<b style="color:#6c5ce7;">Shell</b>: zsh 5.9 (agentic)<br>
<b style="color:#6c5ce7;">Uptime</b>: 99.999% SLA Guaranteed<br>
<b style="color:#6c5ce7;">Memory</b>: 1337MB / 65536MB
</div>
</div>`);
            } else if (cmd === 'crypto' || cmd === 'btc') {
                printOut(`
                    <div style="color:#ffee00;">📈 LIVE ASSET TICKER FEED:</div>
                    <div style="color:#2ed573;">$BTC : $98,420.00 (+4.2%)</div>
                    <div style="color:#00d2ff;">$ETH : $4,206.90 (+6.9%)</div>
                    <div style="color:#ff007f;">$ANURAG : $1,337.00 (+420.00% MAXIMUM BULL RUN)</div>
                `);
            } else if (cmd === 'ai twin' || cmd === 'gpt') {
                printOut(`<div style="color:#00d2ff;">🤖 <b>AI Neural Twin</b>: "Hello! I am Anurag's autonomous coding sidecar. Anurag is currently architecting scalable data pipelines. Want to schedule a meeting with him? Type <b style='color:#2ed573;'>sudo hire</b>!"</div>`);
            } else if (cmd === 'sql') {
                printOut(`
                    <div style="color:#6c5ce7;">Executing: <code>SELECT role, impact, status FROM staff_engineers WHERE name = 'Anurag';</code></div>
                    <table style="width:100%; text-align:left; margin-top:4px; border-collapse:collapse; font-size:0.8rem; color:#e1e1e6;">
                        <tr style="border-bottom:1px solid rgba(255,255,255,0.1); color:#00d2ff;"><th>role</th><th>impact</th><th>status</th></tr>
                        <tr><td>Data Analyst</td><td>MAXIMUM (10x)</td><td style="color:#2ed573;">AVAILABLE</td></tr>
                    </table>
                `);
            } else if (cmd === 'arcade' || cmd === 'snake') {
                printOut(`<strong style="color:#ff007f;">🎮 Launching Arcade Engine... [CHEAT CODE ENABLED: GOD MODE]</strong>`);
                if (window.CyberSound) window.CyberSound.playSuccess();
            } else if (cmd === 'fortune') {
                const quotes = [
                    "Talk is cheap. Show me the data. - Linus Torvalds",
                    "Without big data, you are blind and deaf in the middle of a freeway. - Geoffrey Moore",
                    "In God we trust. All others must bring data. - W. Edwards Deming",
                    "Clean code always looks like it was written by someone who cares. - Robert C. Martin"
                ];
                const q = quotes[Math.floor(Math.random()*quotes.length)];
                printOut(`<div style="color:#2ed573;">💡 <i>"${q}"</i></div>`);
            } else if (cmd === 'whoami') {
                printOut(`<strong style="color:#00d2ff;">anurag_pareek : Staff Data Analyst & AI Architect [Superuser Privilege]</strong>`);
            } else if (cmd === 'uname -a') {
                printOut(`Darwin Anurag-MacBook-Pro.local 24.0.0 Darwin Kernel Version 24.0.0: root:agentic-cpu arm64`);
            } else if (cmd === 'uptime') {
                printOut(`up 1337 days, 4 autonomous agents active, load average: 0.01, 0.05, 0.09`);
            } else if (cmd === 'top') {
                printOut(`
                    <div style="color:#ff5f56;">PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND</div>
                    <div style="color:#e1e1e6;">  1 anurag    20   0  65536M 32768M  1337M R  99.9  50.0 1337:00 neural_engine</div>
                    <div style="color:#e1e1e6;"> 42 postgres  20   0  16384M  8192M   512M S  12.4  12.5  420:12 sql_optimizer</div>
                `);
            } else if (cmd === 'rickroll') {
                printOut(`<div style="color:#ff007f;">🕺 <i>Never gonna give you up, never gonna let you down, never gonna run around and desert you!</i></div>`);
                if (window.CyberSound) window.CyberSound.playSuccess();
            } else if (cmd === 'party' || cmd === 'disco') {
                printOut(`<strong style="color:#ff007f;">🎉 DISCO STROBE ENGAGED!</strong>`);
                if (window.confetti) window.confetti({particleCount:150, spread:100, origin:{y:0.5}});
            } else if (cmd === 'zen') {
                printOut(`<div style="color:#00d2ff;"><b>The Zen of Data</b>:<br>Explicit is better than implicit.<br>Clean data beats fancy algorithms.<br>Automate everything you do twice.</div>`);
            } else if (cmd === 'date') {
                printOut(`Cyber Stardate: ${new Date().toISOString()} [UTC+5:30 IST Operational]`);
            } else if (cmd === 'history') {
                let hstr = cmdHistory.map((c, i) => `<div>  ${i+1}  ${c}</div>`).join('');
                printOut(`<div style="color:#c8d6e5;">${hstr || 'No past commands.'}</div>`);
            } else if (cmd === 'exit' || cmd === 'quit') {
                printOut(`Terminating session...`);
                setTimeout(() => termHUD.classList.remove('open'), 500);
            } else if (cmd === 'cat /etc/passwd') {
                printOut(`<div style="font-family:monospace; color:#ff5f56;">root:x:0:0:Superuser:/root:/bin/zsh<br>anurag:x:1337:1337:Anurag Pareek:/home/anurag:/bin/zsh</div>`);
            } else if (cmd === 'chmod 777 career') {
                printOut(`<strong style="color:#2ed573;">Permissions updated: [rwxrwxrwx]. Unlocked boundless growth and infinite impact.</strong>`);
            } else if (cmd === 'curl weather') {
                printOut(`☀️ Silicon Valley / Bengaluru: +24°C, Wind: 10km/h, Coding Conditions: OPTIMAL (100% Productivity)`);
            } else if (cmd === 'rm -rf /') {
                printOut(`<strong style="color:#ff5f56;">[CRITICAL WARNING]: Permission Denied. Nice try! Portfolio protected by Quantum Fault Shields.</strong>`);
            } else if (cmd !== '') {
                printOut(`<span style="color: #ff5f56;">bash: command not found: ${escapeHTML(raw)}. Type <b style="color:#00d2ff;">help</b> for 32 commands.</span>`);
            }
        }
    });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initQuakeTerm); else initQuakeTerm();
