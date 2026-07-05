/* ==========================================================================
   PREMIUM ENGINEERING CROSSHAIR (CAD-STYLE)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Check for reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Create crosshair DOM
    const wrapper = document.createElement('div');
    wrapper.className = 'eng-crosshair-wrapper';
    
    const inner = document.createElement('div');
    inner.className = 'eng-crosshair-inner';
    
    // Crosshair SVG: Thin matte white lines, small cyan center dot, 4 guide ticks (square)
    const svg = `
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 0 2px rgba(245, 245, 245, 0.1));">
            <path d="M20 2 L20 14 M20 26 L20 38 M2 20 L14 20 M26 20 L38 20" stroke="#F5F5F5" stroke-width="1.2" stroke-linecap="round"/>
            <rect x="16" y="16" width="8" height="8" stroke="#F5F5F5" stroke-width="1" fill="none" opacity="0.8"/>
            <circle cx="20" cy="20" r="2" fill="#22D3EE" />
        </svg>
    `;
    
    const spotlight = document.createElement('div');
    spotlight.className = 'eng-spotlight';
    
    inner.innerHTML = svg;
    inner.appendChild(spotlight);
    wrapper.appendChild(inner);
    document.body.appendChild(wrapper);

    let activeTarget = null;
    let isTracking = false;

    // The selector for elements that trigger the crosshair
    const interactiveSelectors = 'a, button, .card, .glass, .timeline-content, .project-card, .certificate-card, .game-card, .article-card, .contact-container, .dsa-container, .social-link, .ide-tab, [onclick]';

    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest(interactiveSelectors);
        if (target) {
            activeTarget = target;
            isTracking = true;
            wrapper.classList.add('active');
            target.classList.add('eng-hover-brighten');
        }
    });

    document.addEventListener('mouseout', (e) => {
        const target = e.target.closest(interactiveSelectors);
        if (target) {
            target.classList.remove('eng-hover-brighten');
            
            // Only deactivate if we aren't moving into another interactive element
            const newTarget = e.relatedTarget ? e.relatedTarget.closest(interactiveSelectors) : null;
            if (!newTarget) {
                activeTarget = null;
                isTracking = false;
                wrapper.classList.remove('active');
            }
        }
    });

    // RAF loop to perfectly track the target's center (keeps it locked even during scrolling)
    function update() {
        if (isTracking && activeTarget) {
            const rect = activeTarget.getBoundingClientRect();
            // Calculate exact center of target
            const targetX = rect.left + rect.width / 2;
            const targetY = rect.top + rect.height / 2;
            
            // Update wrapper position (GPU accelerated)
            wrapper.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
        }
        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
});
