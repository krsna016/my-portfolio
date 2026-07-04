/**
 * Evervault-inspired Gradient Mask Hover Effect for Hero Portrait
 * 
 * Reveals an encrypted cybersecurity digital version of the portrait
 * beneath the original image using a CSS radial mask that tracks the cursor
 * with buttery-smooth linear interpolation (lerp).
 */

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('hero-profile-container');
    const maskLayer = document.getElementById('hero-evervault-mask');
    const canvas = document.getElementById('evervault-canvas');

    if (!container || !maskLayer || !canvas) return;

    const ctx = canvas.getContext('2d');
    let width = container.clientWidth || 350;
    let height = container.clientHeight || 350;

    // High DPI scaling
    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        width = container.clientWidth || 350;
        height = container.clientHeight || 350;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Tracking variables for buttery-smooth lerp
    let targetX = width / 2;
    let targetY = height / 2;
    let currentX = width / 2;
    let currentY = height / 2;
    let isHovered = false;
    let animId = null;

    // Character pool for hacker terminal stream
    const symbols = ['0', '1', 'A', 'B', 'C', 'D', 'E', 'F', '<', '>', '{', '}', '/', '#', '$', '0x', '::', '//', '&&', '||'];
    const colors = [
        'rgba(0, 240, 255, 0.8)',   // Cyan
        'rgba(59, 130, 246, 0.8)',  // Blue
        'rgba(168, 85, 247, 0.8)',  // Violet
        'rgba(0, 240, 255, 0.95)'   // Bright Cyan
    ];

    const charCount = 35;
    const chars = [];
    for (let i = 0; i < charCount; i++) {
        chars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: -(Math.random() * 0.4 + 0.15), // Drift slowly upward
            char: symbols[Math.floor(Math.random() * symbols.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.floor(Math.random() * 3) + 11, // 11px - 13px
            shuffleTimer: Math.floor(Math.random() * 40) + 20
        });
    }

    // Tiny cyan/purple data particles
    const particleCount = 40;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -(Math.random() * 0.5 + 0.2),
            radius: Math.random() * 1.5 + 0.8,
            color: Math.random() > 0.4 ? 'rgba(0, 240, 255, 0.6)' : 'rgba(168, 85, 247, 0.6)'
        });
    }

    // Mouse events
    container.addEventListener('mouseenter', (e) => {
        isHovered = true;
        const rect = container.getBoundingClientRect();
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
        // Snap immediately on enter to prevent jumping from center
        currentX = targetX;
        currentY = targetY;
        container.style.setProperty('--x', `${currentX}px`);
        container.style.setProperty('--y', `${currentY}px`);

        if (!animId) {
            animId = requestAnimationFrame(render);
        }
    });

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
    });

    container.addEventListener('mouseleave', () => {
        isHovered = false;
        // Keep rendering briefly while opacity transitions out (400ms)
        setTimeout(() => {
            if (!isHovered && animId) {
                cancelAnimationFrame(animId);
                animId = null;
            }
        }, 500);
    });

    // Render loop
    function render() {
        ctx.clearRect(0, 0, width, height);

        // 1. Smooth lerp for radial gradient mask position
        if (!prefersReducedMotion) {
            currentX += (targetX - currentX) * 0.18;
            currentY += (targetY - currentY) * 0.18;
        } else {
            currentX = targetX;
            currentY = targetY;
        }
        container.style.setProperty('--x', `${currentX}px`);
        container.style.setProperty('--y', `${currentY}px`);

        // 2. Draw terminal characters & particles if not reduced motion
        if (!prefersReducedMotion) {
            // Draw particles
            for (let i = 0; i < particleCount; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                if (p.y < 0) p.y = height;
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            }

            // Draw characters
            ctx.textBaseline = 'middle';
            for (let i = 0; i < charCount; i++) {
                const c = chars[i];
                c.x += c.vx;
                c.y += c.vy;
                if (c.y < 0) c.y = height;
                if (c.x < 0) c.x = width;
                if (c.x > width) c.x = 0;

                c.shuffleTimer--;
                if (c.shuffleTimer <= 0) {
                    c.char = symbols[Math.floor(Math.random() * symbols.length)];
                    c.shuffleTimer = Math.floor(Math.random() * 40) + 20;
                }

                ctx.font = `600 ${c.size}px Outfit, monospace`;
                ctx.fillStyle = c.color;
                ctx.fillText(c.char, c.x, c.y);
            }
        }

        if (isHovered || animId) {
            animId = requestAnimationFrame(render);
        }
    }
});
