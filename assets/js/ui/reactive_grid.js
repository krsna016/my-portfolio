/* ==========================================================================
   PREMIUM REACTIVE GRID ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup Canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'reactive-grid-canvas';
    Object.assign(canvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        zIndex: '-1',
        pointerEvents: 'none'
    });
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d', { alpha: true });
    let width, height;
    
    // Grid specs
    // Grid specs
    const isSnake = window.location.pathname.includes('snake');
    let themeColor = isSnake ? '0, 255, 65' : (document.body.classList.contains('light-mode') ? '108, 99, 255' : '34, 211, 238');
    let gridStrokeBase = document.body.classList.contains('light-mode') ? '0, 0, 0' : '255, 255, 255';
    let compositeOperation = document.body.classList.contains('light-mode') ? 'source-over' : 'lighter';

    window.updateGridTheme = function() {
        const isLight = document.body.classList.contains('light-mode');
        themeColor = isSnake ? '0, 255, 65' : (isLight ? '108, 99, 255' : '34, 211, 238');
        gridStrokeBase = isLight ? '0, 0, 0' : '255, 255, 255';
        compositeOperation = isLight ? 'source-over' : 'lighter';
    };

    const GRID_MINOR = 20;
    const GRID_MAJOR = 100;
    let minorGridPath, majorGridPath;
    
    function buildGridPaths() {
        minorGridPath = new Path2D();
        majorGridPath = new Path2D();
        
        for(let x = 0; x <= width; x += GRID_MINOR) {
            if (x % GRID_MAJOR === 0) {
                majorGridPath.moveTo(x, 0); majorGridPath.lineTo(x, height);
            } else {
                minorGridPath.moveTo(x, 0); minorGridPath.lineTo(x, height);
            }
        }
        for(let y = 0; y <= height; y += GRID_MINOR) {
            if (y % GRID_MAJOR === 0) {
                majorGridPath.moveTo(0, y); majorGridPath.lineTo(width, y);
            } else {
                minorGridPath.moveTo(0, y); minorGridPath.lineTo(width, y);
            }
        }
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        buildGridPaths();
    }
    
    window.addEventListener('resize', resize);
    resize();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Track hovered elements
    let activeTargets = new Map();
    
    let mouseX = -1000;
    let mouseY = -1000;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, {passive: true});
    
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let currentScrollIntensity = 0;
    
    const interactiveSelectors = 'a, button, .card, .glass, .project-card, .certificate-card, .game-card, .article-card, .timeline-content, .ide-tab, [onclick], .social-link, .dsa-container, .contact-container, .hero-visual';

    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest(interactiveSelectors);
        if (target && !activeTargets.has(target)) {
            activeTargets.set(target, {
                intensity: 0,
                targetIntensity: 1
            });
        }
    }, {passive: true});
    
    document.addEventListener('mouseout', (e) => {
        const target = e.target.closest(interactiveSelectors);
        if (target) {
            const data = activeTargets.get(target);
            if (data) data.targetIntensity = 0;
        }
    }, {passive: true});

    let lastTime = performance.now();
    
    function render(time) {
        const dt = (time - lastTime) / 1000;
        lastTime = time;
        
        // Prevent huge jumps
        if (dt > 0.1) return requestAnimationFrame(render);
        
        ctx.clearRect(0, 0, width, height);
        
        // Scroll Logic
        let currentScroll = window.scrollY;
        scrollVelocity = currentScroll - lastScrollY;
        lastScrollY = currentScroll;
        
        let targetScrollIntensity = Math.min(Math.abs(scrollVelocity) * 0.002, 0.05);
        currentScrollIntensity += (targetScrollIntensity - currentScrollIntensity) * 0.1;
        
        // Draw Base Grid
        ctx.globalCompositeOperation = 'source-over';
        
        // Minor lines (small grids) - subtle visibility
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(${gridStrokeBase}, ${0.07 + currentScrollIntensity})`;
        ctx.stroke(minorGridPath);
        
        // Major lines (big grids) - subtle visibility
        ctx.strokeStyle = `rgba(${gridStrokeBase}, ${0.14 + currentScrollIntensity})`;
        ctx.stroke(majorGridPath);
        
        // Draw Radial Glows
        ctx.globalCompositeOperation = compositeOperation;
        
        for (let [el, data] of activeTargets.entries()) {
            data.intensity += (data.targetIntensity - data.intensity) * 0.08;
            
            if (data.intensity < 0.01 && data.targetIntensity === 0) {
                activeTargets.delete(el);
                continue;
            }
            
            const rect = el.getBoundingClientRect();
            // Offset coordinates to account for current viewport relative position
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            
            // Culling offscreen elements
            if (x < -300 || x > width + 300 || y < -300 || y > height + 300) continue;
            
            const radius = Math.max(250, rect.width * 0.6);
            
            // Minor grid glow - subtle
            let grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
            grad.addColorStop(0, `rgba(${themeColor}, ${0.10 * data.intensity})`);
            grad.addColorStop(1, `rgba(${themeColor}, 0)`);
            
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1;
            ctx.stroke(minorGridPath);
            
            // Major grid glow - subtle
            let gradMajor = ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradMajor.addColorStop(0, `rgba(${themeColor}, ${0.20 * data.intensity})`);
            gradMajor.addColorStop(1, `rgba(${themeColor}, 0)`);
            
            ctx.strokeStyle = gradMajor;
            ctx.lineWidth = 1.5;
            ctx.stroke(majorGridPath);
        }
        
        // Draw Cursor Glow (Black in Light Mode, Green in Dark Mode)
        if (mouseX > -500 && mouseY > -500) {
            const cursorRadius = 250;
            const isLight = document.body.classList.contains('light-mode');
            const glowColor = isLight ? '0, 0, 0' : '0, 255, 64';
            
            // Minor grid glow for cursor
            let cursorGrad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, cursorRadius);
            cursorGrad.addColorStop(0, `rgba(${glowColor}, 0.22)`);
            cursorGrad.addColorStop(1, `rgba(${glowColor}, 0)`);
            
            ctx.strokeStyle = cursorGrad;
            ctx.lineWidth = 1.5;
            ctx.stroke(minorGridPath);
            
            // Major grid glow for cursor
            let cursorGradMajor = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, cursorRadius);
            cursorGradMajor.addColorStop(0, `rgba(${glowColor}, 0.45)`);
            cursorGradMajor.addColorStop(1, `rgba(${glowColor}, 0)`);
            
            ctx.strokeStyle = cursorGradMajor;
            ctx.lineWidth = 2;
            ctx.stroke(majorGridPath);
        }
        
        requestAnimationFrame(render);
    }
    
    requestAnimationFrame(render);
});
