/* ==========================================================================
   "GRILL MY AI TWIN" RECRUITER BOT
   Floating cyberpunk chat widget programmed with Anurag's resume knowledge
   ========================================================================== */

function initAITwin() {
    if (document.getElementById('ai-twin-sidecar')) return;

    const sidecar = document.createElement('div');
    sidecar.id = 'ai-twin-sidecar';
    sidecar.className = 'ai-twin-sidecar';
    sidecar.innerHTML = `
        <div class="ai-twin-window" id="ai-twin-win">
            <div class="ai-win-header">
                <span><i class="fa-solid fa-robot"></i> Anurag's AI Twin [Online]</span>
                <i class="fa-solid fa-xmark" style="cursor:pointer;" id="ai-close-btn"></i>
            </div>
            <div class="ai-win-body" id="ai-twin-body">
                <div class="ai-msg bot">👋 Hi! I'm Anurag's resume-trained AI twin. Grill me on his SQL, Python, Power BI skills, or experience!</div>
            </div>
            <div class="ai-win-input">
                <input type="text" id="ai-input" class="ai-input-field" placeholder="Ask anything..." autocomplete="off">
                <button id="ai-send-btn" style="background:none;border:none;color:#00d2ff;cursor:pointer;"><i class="fa-solid fa-paper-plane"></i></button>
            </div>
        </div>
        <div class="ai-twin-fab" id="ai-twin-fab" title="Ask Anurag's AI Twin">
            💬
        </div>
    `;
    document.body.appendChild(sidecar);

    const fab = document.getElementById('ai-twin-fab');
    const win = document.getElementById('ai-twin-win');
    const close = document.getElementById('ai-close-btn');
    const input = document.getElementById('ai-input');
    const send = document.getElementById('ai-send-btn');
    const body = document.getElementById('ai-twin-body');

    function toggleChat() {
        win.classList.toggle('open');
        if (win.classList.contains('open')) {
            setTimeout(() => input.focus(), 100);
            if (window.CyberSound) window.CyberSound.playBlip();
        }
    }

    fab.onclick = toggleChat;
    close.onclick = toggleChat;

    function addMsg(txt, type='bot') {
        const d = document.createElement('div');
        d.className = `ai-msg ${type}`;
        d.innerHTML = txt;
        body.appendChild(d);
        body.scrollTop = body.scrollHeight;
        if (window.CyberSound && type === 'bot') window.CyberSound.playHover();
    }

    const kb = [
        { q: ["sql", "database", "query", "mysql"], a: "Anurag is very strong in SQL. He regularly performs complex JOINs, CTEs, subqueries, and data optimization pipelines." },
        { q: ["python", "pandas", "numpy", "script"], a: "Python is Anurag's core automation language. He holds the Harvard CS50 Python certification and uses Pandas/NumPy for deep data manipulation." },
        { q: ["power bi", "dashboard", "tableau", "visual"], a: "Anurag builds interactive business dashboards in Power BI and Excel, translating raw data into clear, actionable executive metrics." },
        { q: ["education", "college", "gla", "degree"], a: "Anurag is pursuing his B.Tech at GLA University with a strong academic focus on Data Science and Algorithms." },
        { q: ["hire", "contact", "email", "job", "intern"], a: "Anurag is currently looking for Data Analyst and Developer roles! Reach him at anurag020416@gmail.com or via the Contact tab." }
    ];

    function handleSend() {
        const val = input.value.trim();
        if (!val) return;
        input.value = '';

        addMsg(val, 'user');

        setTimeout(() => {
            const lower = val.toLowerCase();
            let matched = "I know Anurag is a great problem solver and passionate Data Analyst. Check his Resume tab for exact project repos!";
            
            for (let item of kb) {
                if (item.q.some(k => lower.includes(k))) {
                    matched = item.a;
                    break;
                }
            }
            addMsg(matched, 'bot');
        }, 400);
    }

    send.onclick = handleSend;
    input.onkeydown = (e) => { if (e.key === 'Enter') handleSend(); };
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAITwin); else initAITwin();
