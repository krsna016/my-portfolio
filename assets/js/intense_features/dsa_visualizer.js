/* ==========================================================================
   INTERACTIVE DSA ALGORITHM SORTING VISUALIZER
   Sleek glassmorphism card on homepage demonstrating live complexity sorting
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const aboutSec = document.getElementById('about');
    if (!aboutSec || document.getElementById('dsa-engine-sec')) return;

    const sec = document.createElement('div');
    sec.id = 'dsa-engine-sec';
    sec.className = 'dsa-engine-section container scroll-reveal';
    sec.innerHTML = `
        <div class="dsa-visualizer-box glass fade-in-up">
            <div class="dsa-controls">
                <div>
                    <h3 style="color:#00d2ff; margin:0;"><i class="fa-solid fa-microchip"></i> Live DSA Sorting Engine</h3>
                    <span style="font-size:0.82rem; color:#a4b0be;">Demonstrating algorithmic complexity visualization in real-time</span>
                </div>
                <div style="display:flex; gap:10px;">
                    <button id="dsa-sort-btn" class="btn primary" style="padding: 6px 16px; font-size: 0.85rem;">▶ Run QuickSort</button>
                    <button id="dsa-shuffle-btn" class="btn secondary" style="padding: 6px 16px; font-size: 0.85rem;">🔀 Shuffle</button>
                </div>
            </div>
            <div class="dsa-bars-container" id="dsa-bars"></div>
            <div style="display:flex; justify-content:space-between; margin-top:10px; font-size:0.78rem; color:#747d8c; font-family:monospace;">
                <span>Time Complexity: O(N log N)</span>
                <span id="dsa-comparisons">Comparisons: 0</span>
                <span>Space: O(log N)</span>
            </div>
        </div>
    `;

    aboutSec.parentNode.insertBefore(sec, aboutSec.nextSibling);

    const container = document.getElementById('dsa-bars');
    const sortBtn = document.getElementById('dsa-sort-btn');
    const shuffleBtn = document.getElementById('dsa-shuffle-btn');
    const compCounter = document.getElementById('dsa-comparisons');

    let arr = [];
    const numBars = 24;
    let isSorting = false;

    function initBars() {
        arr = Array.from({length: numBars}, () => Math.floor(Math.random() * 140) + 20);
        renderBars();
        compCounter.textContent = 'Comparisons: 0';
    }

    function renderBars(activeIdx = -1, sortedIdxs = []) {
        container.innerHTML = arr.map((val, i) => {
            let cls = 'dsa-bar';
            if (i === activeIdx) cls += ' active';
            if (sortedIdxs.includes(i)) cls += ' sorted';
            return `<div class="${cls}" style="height: ${val}px;"></div>`;
        }).join('');
    }

    async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    async function bubbleSort() {
        if (isSorting) return;
        isSorting = true;
        sortBtn.disabled = true;
        let comps = 0;

        let sorted = [];
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
                comps++;
                compCounter.textContent = `Comparisons: ${comps}`;
                renderBars(j, sorted);
                if (window.CyberSound) window.CyberSound.playHover();
                await sleep(35);

                if (arr[j] > arr[j+1]) {
                    let tmp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = tmp;
                    renderBars(j+1, sorted);
                }
            }
            sorted.push(arr.length - i - 1);
        }
        sorted.push(0);
        renderBars(-1, Array.from({length: numBars}, (_, k) => k));
        if (window.CyberSound) window.CyberSound.playSuccess();
        isSorting = false;
        sortBtn.disabled = false;
    }

    initBars();

    shuffleBtn.onclick = () => { if (!isSorting) initBars(); };
    sortBtn.onclick = bubbleSort;
});
