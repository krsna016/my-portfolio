/* ==========================================================================
   LIVE GIT COMMIT TICKER HUD
   Live scrolling tape under navbar showing Anurag's daily code activity
   ========================================================================== */

document.addEventListener('DOMContentLoaded', async () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar || document.getElementById('git-ticker-hud')) return;

    const ticker = document.createElement('div');
    ticker.id = 'git-ticker-hud';
    ticker.className = 'git-ticker-hud';
    
    // Default fallback commits in case GitHub API rate limits
    let items = [
        `🚀 <span class="git-badge">master</span> commit: "refactor: optimize database querying performance"`,
        `📦 <span class="git-badge">portfolio</span> push: "feat: add interactive VS Code hero sandbox"`,
        `⚡ <span class="git-badge">analytics</span> commit: "feat: implement data cleaning automation pipeline"`,
        `🛠️ <span class="git-badge">dsa</span> solve: "LeetCode 146. LRU Cache (Python 98% percentile)"`
    ];

    try {
        const res = await fetch('https://api.github.com/users/krsna016/events/public?per_page=5');
        if (res.ok) {
            const data = await res.json();
            const pushEvents = data.filter(e => e.type === 'PushEvent');
            if (pushEvents.length > 0) {
                items = pushEvents.map(ev => {
                    const repoName = ev.repo?.name ? ev.repo.name.split('/')[1] : "repo";
                    const msg = ev.payload?.commits?.[0]?.message || "update code";
                    return `🚀 <span class="git-badge">${repoName}</span> commit: "${msg.slice(0, 50)}"`;
                });
            }
        }
    } catch(e) {}

    const fullHTML = items.map(t => `<span class="git-ticker-item">${t}</span>`).join('');
    
    ticker.innerHTML = `
        <div class="git-ticker-content">
            ${fullHTML}
            ${fullHTML} <!-- Duplicated for seamless infinite loop animation -->
        </div>
    `;

    navbar.parentNode.insertBefore(ticker, navbar.nextSibling);
});
