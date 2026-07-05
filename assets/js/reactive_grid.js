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
    let signals = [];
    
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

    function spawnSignal(startX, startY, type = 'standard') {
        if (prefersReducedMotion) return;
        
        // Snap to grid
        const sx = Math.round(startX / 20) * 20;
        const sy = Math.round(startY / 20) * 20;
        
        let vx = 0;
        let vy = 0;
        let maxLife = 0.6 + Math.random() * 0.3; // 600-900ms
        let speed = (window.innerWidth / 2) + Math.random() * 200; 
        
        if (type === 'nav') {
            vy = speed;
        } else if (type === 'contact') {
            speed *= 0.5;
            const dir = Math.floor(Math.random() * 4);
            if (dir === 0) vy = -speed;
            if (dir === 1) vx = speed;
            if (dir === 2) vy = speed;
            if (dir === 3) vx = -speed;
        } else if (type === 'scroll') {
            vx = Math.random() > 0.5 ? speed : -speed;
            maxLife = 1.0 + Math.random() * 0.5;
        } else {
            const dir = Math.floor(Math.random() * 4);
            if (dir === 0) vy = -speed;
            if (dir === 1) vx = speed;
            if (dir === 2) vy = speed;
            if (dir === 3) vx = -speed;
        }
        
        signals.push({
            x: sx,
            y: sy,
            vx: vx,
            vy: vy,
            life: 0,
            maxLife: maxLife,
            length: 40 + Math.random() * 40
        });
    }

    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest(interactiveSelectors);
        if (target && !activeTargets.has(target)) {
            activeTargets.set(target, {
                intensity: 0,
                targetIntensity: 1
            });
            
            const rect = target.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            
            let type = 'standard';
            if (target.tagName === 'A' || target.closest('nav')) type = 'nav';
            else if (target.closest('.contact-container') || target.closest('form')) type = 'contact';
            
            const count = (type === 'contact') ? 3 : (1 + Math.floor(Math.random() * 2));
            for(let i=0; i<count; i++) {
                spawnSignal(cx, cy, type);
            }
        }
    }, {passive: true});
    
    document.addEventListener('mouseout', (e) => {
        const target = e.target.closest(interactiveSelectors);
        if (target) {
            const data = activeTargets.get(target);
            if (data) data.targetIntensity = 0;
        }
    }, {passive: true});

    // Scroll Observer for Section Initialization
    const sectionObserver = new IntersectionObserver((entries) => {
        if (prefersReducedMotion) return;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const rect = entry.target.getBoundingClientRect();
                const cy = rect.top + rect.height / 2;
                const cx = window.innerWidth / 2;
                spawnSignal(cx, cy, 'scroll');
                spawnSignal(cx, cy, 'scroll');
            }
        });
    }, { threshold: 0.1 });
    
    // Defer observing to ensure DOM is ready
    setTimeout(() => {
        document.querySelectorAll('section, .glass, .contact-container').forEach(el => {
            sectionObserver.observe(el);
        });
    }, 1000);

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
        
        // Major lines (Invisible by default, only shown via glows)
        ctx.strokeStyle = `rgba(255, 255, 255, 0)`;
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
        
        // Draw Signals
        for (let i = signals.length - 1; i >= 0; i--) {
            const sig = signals[i];
            sig.life += dt;
            if (sig.life >= sig.maxLife) {
                signals.splice(i, 1);
                continue;
            }
            
            sig.x += sig.vx * dt;
            sig.y += sig.vy * dt;
            
            let progress = sig.life / sig.maxLife;
            // Eases in quickly, fades out slowly
            let alpha = progress < 0.2 ? (progress / 0.2) : (1 - (progress - 0.2) / 0.8);
            
            let tailX = sig.x - (sig.vx === 0 ? 0 : Math.sign(sig.vx) * sig.length);
            let tailY = sig.y - (sig.vy === 0 ? 0 : Math.sign(sig.vy) * sig.length);
            
            // 1-2px cyan-white energy pulse
            let grad = ctx.createLinearGradient(tailX, tailY, sig.x, sig.y);
            grad.addColorStop(0, `rgba(34, 211, 238, 0)`);
            grad.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.9})`);
            
            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(sig.x, sig.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            
            // Intersection Glow (smooth decay ambient light)
            let glowGrad = ctx.createRadialGradient(sig.x, sig.y, 0, sig.x, sig.y, 45);
            glowGrad.addColorStop(0, `rgba(34, 211, 238, ${alpha * 0.3})`);
            glowGrad.addColorStop(1, `rgba(34, 211, 238, 0)`);
            ctx.beginPath();
            ctx.arc(sig.x, sig.y, 45, 0, Math.PI*2);
            ctx.fillStyle = glowGrad;
            ctx.fill();
            
            // Intense traveling node
            ctx.beginPath();
            ctx.arc(sig.x, sig.y, 1.5, 0, Math.PI*2);
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
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
