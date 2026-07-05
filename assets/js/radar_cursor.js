/* ==========================================================================
   PREMIUM RADAR CURSOR
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Disable on touch devices
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
    if (isTouchDevice) return;

    // Inject CSS to hide native cursor
    const style = document.createElement('style');
    style.innerHTML = `
        .custom-cursor-enabled, .custom-cursor-enabled * {
            cursor: none !important;
        }
        ${window.location.pathname.includes('snake') ? `
            .radar-spotlight { background: radial-gradient(circle, rgba(0, 255, 65, 0.08) 0%, transparent 70%) !important; }
            .radar-caret { box-shadow: 0 0 6px rgba(0, 255, 65, 0.6) !important; }
            .radar-svg { filter: drop-shadow(0 0 4px rgba(0, 255, 65, 0.3)) !important; }
            .radar-hover .radar-ring { stroke: #00FF41 !important; }
            .radar-hover .radar-dot { fill: #00FF41 !important; filter: drop-shadow(0 0 4px #00FF41) !important; }
            .radar-hover .radar-sweep path:first-child { stroke: #00FF41 !important; }
            .radar-hover .radar-sweep path:last-child { fill: rgba(0, 255, 65, 0.25) !important; }
            .radar-click-pulse { border-color: #00FF41 !important; }
        ` : ''}
    `;
    document.head.appendChild(style);
    document.body.classList.add('custom-cursor-enabled');

    // Create wrapper
    
    const isSnake = window.location.pathname.includes('snake');
    const dotColor = isSnake ? '#00FF41' : '#F5F5F5';
    const lineColor = isSnake ? '#00FF41' : '#F5F5F5';
    const sweepColor = isSnake ? '#00FF41' : '#7C3AED';
    const fillGlow = isSnake ? 'rgba(0, 255, 65, 0.25)' : 'rgba(34, 211, 238, 0.25)';
    
    const wrapper = document.createElement('div');

    wrapper.id = 'radar-cursor-container';
    wrapper.innerHTML = `
        <div class="radar-spotlight"></div>
        <div class="radar-main" id="radar-cursor-main">
            <div class="radar-caret"></div>
            <svg class="radar-svg" viewBox="0 0 32 32" width="32" height="32">
                <circle cx="16" cy="16" r="1.5" class="radar-dot" fill="" />
                <path d="M16 4 L16 8 M16 24 L16 28 M4 16 L8 16 M24 16 L28 16" stroke="" stroke-width="1.2" stroke-linecap="round" opacity="0.8"/>
                <circle cx="16" cy="16" r="7" stroke="" stroke-width="1" fill="none" opacity="0.4" class="radar-ring" />
                <g class="radar-sweep">
                    <path d="M16 16 L16 9" stroke="" stroke-width="1" opacity="0.9"/>
                    <path d="M16 16 L16 9 A 7 7 0 0 1 20.9 11.0 Z" fill="" />
                </g>
            </svg>
        </div>
    `;
    document.documentElement.appendChild(wrapper);

    const cursorMain = document.getElementById('radar-cursor-main');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let renderX = mouseX;
    let renderY = mouseY;
    let isHovering = false;
    let isTextHover = false;
    let magneticTargetX = 0;
    let magneticTargetY = 0;

    const interactiveSelectors = 'a, button, .card, .glass, .project-card, .certificate-card, .game-card, .article-card, .timeline-content, .ide-tab, [onclick], .social-link, .dsa-container';
    const textSelectors = 'input, textarea, [contenteditable], p, h1, h2, h3, h4, h5, h6, span, li, td, th';

    // Track Mouse
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (isHovering && !isTextHover && e.target) {
            const target = e.target.closest(interactiveSelectors);
            if (target) {
                const rect = target.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const dx = centerX - mouseX;
                const dy = centerY - mouseY;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                // Subtle magnetic pull (max 3px)
                if (dist > 0 && dist < 80) {
                    const pullFactor = Math.min(3, dist * 0.05);
                    magneticTargetX = (dx / dist) * pullFactor;
                    magneticTargetY = (dy / dist) * pullFactor;
                } else {
                    magneticTargetX = 0;
                    magneticTargetY = 0;
                }
            }
        } else {
            magneticTargetX = 0;
            magneticTargetY = 0;
        }
    }, { passive: true });

    // Handle Hover States
    document.addEventListener('mouseover', (e) => {
        const target = e.target;
        
        if (target.closest(interactiveSelectors)) {
            isHovering = true;
            cursorMain.classList.add('radar-hover');
            
            // Disabled elements
            if (target.disabled || target.closest('[disabled]') || target.classList.contains('disabled')) {
                cursorMain.classList.add('radar-disabled');
            }
        }
        
        if (target.matches(textSelectors) || target.closest(textSelectors)) {
            const style = window.getComputedStyle(target);
            // Verify if it's actually selectable text or inherently a text-cursor element
            if (style.cursor === 'text' || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                isTextHover = true;
                cursorMain.classList.add('radar-text-mode');
            }
        }
    });

    document.addEventListener('mouseout', (e) => {
        cursorMain.classList.remove('radar-hover');
        cursorMain.classList.remove('radar-disabled');
        cursorMain.classList.remove('radar-text-mode');
        isHovering = false;
        isTextHover = false;
        magneticTargetX = 0;
        magneticTargetY = 0;
    });

    // Handle Click Pulse
    document.addEventListener('mousedown', () => {
        const pulse = document.createElement('div');
        pulse.className = 'radar-click-pulse';
        cursorMain.appendChild(pulse);
        cursorMain.style.transform = 'translate(-50%, -50%) scale(0.9)';
        
        setTimeout(() => pulse.remove(), 400);
    });

    document.addEventListener('mouseup', () => {
        cursorMain.style.transform = 'translate(-50%, -50%) scale(1)';
    });
    
    // Optional Faint Radar Pulse every 2.5s
    setInterval(() => {
        if (!isTextHover && !isHovering) {
            const pulse = document.createElement('div');
            pulse.className = 'radar-click-pulse';
            pulse.style.opacity = '0.3'; // Fainter than click
            cursorMain.appendChild(pulse);
            setTimeout(() => pulse.remove(), 400);
        }
    }, 2500);

    // RAF Loop (Zero Lag)
    function update() {
        // Only apply magnetic offset, raw position is perfectly locked to mouseX/Y
        renderX = mouseX + magneticTargetX;
        renderY = mouseY + magneticTargetY;
        
        wrapper.style.transform = `translate3d(${renderX}px, ${renderY}px, 0)`;
        
        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
});
