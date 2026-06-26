/* ==========================================================================
   DROPDOWN QUAKE HACKER TERMINAL HUD
   Triggered by pressing `~` (backtick) or clicking footer trigger
   ========================================================================== */

function initQuakeTerm() {
    if (document.getElementById('quake-terminal')) return;

    const termHUD = document.createElement('div');
    termHUD.id = 'quake-terminal';
    termHUD.className = 'quake-terminal-hud';
    termHUD.innerHTML = `
        <div class="term-header">
            <div class="term-header-left">
                <div class="term-traffic-lights">
                    <span class="term-dot red"></span>
                    <span class="term-dot yellow"></span>
                    <span class="term-dot green"></span>
                </div>
                <strong style="margin-left: 10px; color: #00d2ff;"><i class="fa-solid fa-terminal"></i> root@anuragpareek016:~</strong>
            </div>
            <span>Press <kbd style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;">~</kbd> or <kbd style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;">ESC</kbd> to close</span>
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
    document.body.appendChild(termHUD);

    const input = document.getElementById('term-input');
    const body = document.getElementById('term-body');

    function toggleTerm() {
        termHUD.classList.toggle('open');
        if (termHUD.classList.contains('open')) {
            setTimeout(() => input.focus(), 100);
            if (window.CyberSound) window.CyberSound.playBlip();
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

    // Add trigger link to footer
    const footer = document.querySelector('footer .footer-socials');
    if (footer) {
        const trig = document.createElement('a');
        trig.href = 'javascript:void(0)';
        trig.title = 'Launch Hacker CLI (Press ~)';
        trig.innerHTML = `<i class="fa-solid fa-terminal"></i>`;
        trig.onclick = toggleTerm;
        footer.appendChild(trig);
    }

    function printOut(html) {
        const out = document.createElement('div');
        out.className = 'term-output';
        out.innerHTML = html;
        body.insertBefore(out, input.parentNode);
        body.scrollTop = body.scrollHeight;
    }

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value.trim().toLowerCase();
            const raw = input.value;
            input.value = '';

            printOut(`<span style="color: #6c5ce7;">anurag@engineer:~$</span> ${raw}`);

            if (cmd === 'help') {
                printOut(`
                    <div style="display: grid; grid-template-columns: 140px 1fr; gap: 8px; margin-top: 5px;">
                        <span style="color: #00d2ff;">cat resume</span> <span>Print Anurag's summary and education</span>
                        <span style="color: #00d2ff;">skills</span> <span>List technical data & development stack</span>
                        <span style="color: #00d2ff;">projects</span> <span>Show key featured software projects</span>
                        <span style="color: #00d2ff;">ping anurag</span> <span>Check live response latency</span>
                        <span style="color: #2ed573;">sudo hire</span> <span>Celebrate & redirect to contact page</span>
                        <span style="color: #ff5f56;">clear</span> <span>Clear terminal console output</span>
                    </div>
                `);
            } else if (cmd === 'cat resume' || cmd === 'resume') {
                printOut(`
                    <div style="color: #e1e1e6; border-left: 2px solid #00d2ff; padding-left: 10px;">
                        <strong>ANURAG PAREEK</strong> - Data Analyst & Software Developer<br>
                        🎓 Education: B.Tech at GLA University<br>
                        📜 Certs: Harvard CS50P, Postman API Fundamentals<br>
                        💡 Focus: Interactive Dashboards, Python Automation, Distributed Web Systems
                    </div>
                `);
            } else if (cmd === 'skills') {
                printOut(`
                    <div style="color: #00ff66;">
                        [Python] [SQL / MySQL / Postgres] [Power BI] [Advanced Excel]<br>
                        [JavaScript / HTML5 / CSS3] [Git / GitHub] [APIs / JSON]
                    </div>
                `);
            } else if (cmd === 'projects') {
                printOut(`
                    <div style="color: #c8d6e5;">
                        1. 📊 Interactive Portfolio & Blog Platform<br>
                        2. 🦖 Chrome T-Rex & Retro Arcade Engine<br>
                        3. 📈 Financial Data Analytics Dashboard
                    </div>
                `);
            } else if (cmd.startsWith('ping')) {
                printOut(`PING anuragpareek016.engineer (127.0.0.1): 56 data bytes...`);
                setTimeout(() => printOut(`64 bytes from anurag: icmp_seq=0 ttl=64 time=0.42 ms <strong style="color:#2ed573;">[ONLINE & READY TO BUILD]</strong>`), 400);
            } else if (cmd === 'sudo hire' || cmd === 'hire') {
                printOut(`<strong style="color: #2ed573;">🎉 ROOT ACCESS GRANTED: Redirecting to contact scheduler...</strong>`);
                if (window.CyberSound) window.CyberSound.playSuccess();
                setTimeout(() => { window.location.href = 'contact.html'; }, 1200);
            } else if (cmd === 'clear') {
                body.querySelectorAll('.term-output').forEach(el => el.remove());
            } else if (cmd !== '') {
                printOut(`<span style="color: #ff5f56;">bash: command not found: ${raw}. Type <b style="color:#00d2ff;">help</b> for commands.</span>`);
            }
        }
    });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initQuakeTerm); else initQuakeTerm();
