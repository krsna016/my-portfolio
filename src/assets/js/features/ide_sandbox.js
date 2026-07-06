/* ==========================================================================
   LIVE VS CODE HERO SANDBOX
   Visitors can edit Anurag's profile object and execute to update hero UI
   ========================================================================== */

function initIDESandbox() {
    const heroContent = document.querySelector('.hero-content');
    const ctaBtns = document.querySelector('.hero-content .cta-buttons');
    if (!heroContent || document.getElementById('ide-hero-sandbox')) return;

    const ideCard = document.createElement('div');
    ideCard.id = 'ide-hero-sandbox';
    ideCard.className = 'ide-hero-card fade-in-up delay-300';
    ideCard.style.margin = "20px 0 25px 0";
    ideCard.style.maxWidth = "540px";
    ideCard.innerHTML = `
        <div class="ide-topbar">
            <div class="ide-tabs">
                <span class="ide-tab"><i class="fa-brands fa-js" style="color: #f1c40f;"></i> profile.js</span>
            </div>
            <button id="ide-run-btn" class="ide-run-btn" title="Execute script to update homepage DOM">
                <i class="fa-solid fa-play"></i> Run Code
            </button>
        </div>
        <div class="ide-code-area">
            <div style="color: #6c5ce7; margin-bottom: 6px;">// Edit properties below & click Run Code!</div>
            <textarea id="ide-code-editor" class="ide-textarea" spellcheck="false">const Anurag = {
    role: "Data Analyst",
    techFocus: "Python & SQL",
    status: "Ready to Innovate"
};</textarea>
            <div id="ide-status-msg" style="font-size: 0.78rem; color: #8c7ae6; margin-top: 6px; min-height: 16px;">▶ Console ready. Try changing role to "AI Engineer"</div>
        </div>
    `;

    if (ctaBtns) {
        heroContent.insertBefore(ideCard, ctaBtns);
    } else {
        heroContent.appendChild(ideCard);
    }

    const runBtn = document.getElementById('ide-run-btn');
    const editor = document.getElementById('ide-code-editor');
    const statusMsg = document.getElementById('ide-status-msg');
    const subtitle = document.querySelector('.hero-content .subtitle');

    runBtn.onclick = () => {
        const code = editor.value;
        try {
            // Extract role and focus using regex for safety (avoiding raw eval if possible)
            const roleMatch = code.match(/role:\s*["']([^"']+)["']/);
            const techMatch = code.match(/techFocus:\s*["']([^"']+)["']/);

            const newRole = roleMatch ? roleMatch[1] : "Data Analyst";
            const newTech = techMatch ? techMatch[1] : "Data Science";

            if (subtitle) {
                subtitle.innerHTML = `Aspiring <span class="highlight" style="color:#00ff66;">${newRole}</span> (${newTech})`;
            }

            statusMsg.innerHTML = `<span style="color:#2ed573;">✓ Successfully executed! DOM updated.</span>`;
            if (window.CyberSound) window.CyberSound.playSuccess();
        } catch(e) {
            statusMsg.innerHTML = `<span style="color:#e74c3c;">SyntaxError: check string quotes</span>`;
        }
    };
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initIDESandbox); else initIDESandbox();
