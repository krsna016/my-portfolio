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
        zIndex: '0',
        pointerEvents: 'none'
    });
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d', { alpha: true });
    let width, height;
    
    // Grid specs
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
    
    let mouseX = -1000;
    let mouseY = -1000;
    
    // Track if we are hovering readable content so we can dim the grid glow
    let isHoveringContent = false;
    let targetGlowAlpha = 1;
    let currentGlowAlpha = 1;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, {passive: true});
    
    // Scroll tracking
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let currentScrollIntensity = 0;
    
    const interactiveSelectors = 'a, button, .card, .glass, .project-card, .certificate-card, .game-card, .article-card, .timeline-content, .ide-tab, [onclick], .social-link, .dsa-container, .contact-container, .hero-visual';

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveSelectors)) {
            isHoveringContent = true;
            targetGlowAlpha = 0.1; // Dim glow significantly over cards
        }
    }, {passive: true});
    
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactiveSelectors)) {
            isHoveringContent = false;
            targetGlowAlpha = 1; // Restore glow
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
        
        // Glow alpha smoothing
        currentGlowAlpha += (targetGlowAlpha - currentGlowAlpha) * 0.1;
        
        // Draw Base Grid
        ctx.globalCompositeOperation = 'source-over';
        
        // Minor lines
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 + currentScrollIntensity})`;
        ctx.stroke(minorGridPath);
        
        // Major lines
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 + currentScrollIntensity})`;
        ctx.stroke(majorGridPath);
        
        // Draw Cursor Glow (Green)
        if (mouseX > -500 && mouseY > -500 && currentGlowAlpha > 0.01) {
            const cursorRadius = 200;
            ctx.globalCompositeOperation = 'lighter';
            
            // Minor grid glow for cursor
            let cursorGrad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, cursorRadius);
            cursorGrad.addColorStop(0, `rgba(0, 255, 64, ${0.15 * currentGlowAlpha})`);
            cursorGrad.addColorStop(1, 'rgba(0, 255, 64, 0)');
            
            ctx.strokeStyle = cursorGrad;
            ctx.lineWidth = 1.5;
            ctx.stroke(minorGridPath);
            
            // Major grid glow for cursor
            let cursorGradMajor = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, cursorRadius);
            cursorGradMajor.addColorStop(0, `rgba(0, 255, 64, ${0.25 * currentGlowAlpha})`);
            cursorGradMajor.addColorStop(1, 'rgba(0, 255, 64, 0)');
            
            ctx.strokeStyle = cursorGradMajor;
            ctx.lineWidth = 2;
            ctx.stroke(majorGridPath);
        }
        
        requestAnimationFrame(render);
    }
    
    requestAnimationFrame(render);
});
