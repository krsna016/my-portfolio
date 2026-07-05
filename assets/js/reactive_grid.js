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
    
    // Track hovered elements
    let activeTargets = new Map();
    let pulses = [];
    
    let mouseX = -1000;
    let mouseY = -1000;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, {passive: true});
    
    // Scroll tracking
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let currentScrollIntensity = 0;
    
    const interactiveSelectors = 'a, button, .card, .glass, .project-card, .certificate-card, .game-card, .article-card, .timeline-content, .ide-tab, [onclick], .social-link, .dsa-container, .contact-container, .hero-visual';

    function spawnPulse(el) {
        if (prefersReducedMotion) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        
        const startX = Math.round(cx / GRID_MINOR) * GRID_MINOR;
        const startY = Math.round(cy / GRID_MINOR) * GRID_MINOR;
        
        // Random 1-2 pulses
        const count = 1 + Math.floor(Math.random() * 2);
        
        for (let i = 0; i < count; i++) {
            const dir = Math.floor(Math.random() * 4);
            let vx = 0, vy = 0;
            const speed = 40 + Math.random() * 20;
            
            if (dir === 0) vy = -speed;
            if (dir === 1) vx = speed;
            if (dir === 2) vy = speed;
            if (dir === 3) vx = -speed;
            
            pulses.push({
                x: startX,
                y: startY,
                vx: vx,
                vy: vy,
                life: 0,
                maxLife: 0.5 + Math.random() * 0.4,
                length: 40 + Math.random() * 30
            });
        }
    }

    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest(interactiveSelectors);
        if (target && !activeTargets.has(target)) {
            activeTargets.set(target, {
                intensity: 0,
                targetIntensity: 1
            });
            spawnPulse(target);
        }
    }, {passive: true});
    
    document.addEventListener('mouseout', (e) => {
        const target = e.target.closest(interactiveSelectors);
        if (target) {
            const data = activeTargets.get(target);
            if (data) data.targetIntensity = 0;
        }
    }, {passive: true});

    // Timeline periodic pulses
    let timelineNodes = [];
    setInterval(() => {
        if (prefersReducedMotion) return;
        
        if (timelineNodes.length === 0) {
            timelineNodes = Array.from(document.querySelectorAll('.timeline-content'));
        }
        
        if (timelineNodes.length > 0) {
            const node = timelineNodes[Math.floor(Math.random() * timelineNodes.length)];
            const rect = node.getBoundingClientRect();
            
            if (rect.top > -100 && rect.bottom < height + 100) {
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const startX = Math.round(cx / GRID_MINOR) * GRID_MINOR;
                const startY = Math.round(cy / GRID_MINOR) * GRID_MINOR;
                
                pulses.push({
                    x: startX,
                    y: startY,
                    vx: 0,
                    vy: 35 + Math.random() * 15, // Downward
                    life: 0,
                    maxLife: 1.5 + Math.random(),
                    length: 60
                });
            }
        }
    }, 4500);

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
        
        // Minor lines (Invisible by default, only shown via glows)
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(255, 255, 255, 0)`;
        ctx.stroke(minorGridPath);
        
        // Major lines
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 + currentScrollIntensity})`;
        ctx.stroke(majorGridPath);
        
        // Draw Radial Glows
        ctx.globalCompositeOperation = 'lighter';
        
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
            
            // Minor grid glow
            let grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
            grad.addColorStop(0, `rgba(34, 211, 238, ${0.08 * data.intensity})`);
            grad.addColorStop(1, 'rgba(34, 211, 238, 0)');
            
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1;
            ctx.stroke(minorGridPath);
            
            // Major grid glow
            let gradMajor = ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradMajor.addColorStop(0, `rgba(34, 211, 238, ${0.15 * data.intensity})`);
            gradMajor.addColorStop(1, 'rgba(34, 211, 238, 0)');
            
            ctx.strokeStyle = gradMajor;
            ctx.lineWidth = 1.5;
            ctx.stroke(majorGridPath);
        }
        
        // Draw Pulses
        for (let i = pulses.length - 1; i >= 0; i--) {
            const p = pulses[i];
            p.life += dt;
            if (p.life >= p.maxLife) {
                pulses.splice(i, 1);
                continue;
            }
            
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            
            let progress = p.life / p.maxLife;
            let currentAlpha = Math.sin(progress * Math.PI) * 0.8;
            
            let tailX = p.x - (p.vx === 0 ? 0 : Math.sign(p.vx) * p.length);
            let tailY = p.y - (p.vy === 0 ? 0 : Math.sign(p.vy) * p.length);
            
            let grad = ctx.createLinearGradient(tailX, tailY, p.x, p.y);
            grad.addColorStop(0, `rgba(34, 211, 238, 0)`);
            grad.addColorStop(1, `rgba(34, 211, 238, ${currentAlpha})`);
            
            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.8})`;
            ctx.fill();
        }
        
        // Draw Cursor Glow (Green)
        if (mouseX > -500 && mouseY > -500) {
            const cursorRadius = 200;
            
            // Minor grid glow for cursor
            let cursorGrad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, cursorRadius);
            cursorGrad.addColorStop(0, `rgba(0, 255, 64, 0.15)`);
            cursorGrad.addColorStop(1, 'rgba(0, 255, 64, 0)');
            
            ctx.strokeStyle = cursorGrad;
            ctx.lineWidth = 1.5;
            ctx.stroke(minorGridPath);
            
            // Major grid glow for cursor
            let cursorGradMajor = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, cursorRadius);
            cursorGradMajor.addColorStop(0, `rgba(0, 255, 64, 0.25)`);
            cursorGradMajor.addColorStop(1, 'rgba(0, 255, 64, 0)');
            
            ctx.strokeStyle = cursorGradMajor;
            ctx.lineWidth = 2;
            ctx.stroke(majorGridPath);
        }
        
        requestAnimationFrame(render);
    }
    
    requestAnimationFrame(render);
});
