/**
 * Elastic Fabric Container for Technical Skills Section
 * 
 * Replaces the static rectangular background with an adaptive, physically plausible
 * stretched fabric membrane that wraps around the technology stack.
 * 
 * Features:
 * - Generous rounded corners and smooth organic curves via Catmull-Rom/Midpoint Bezier splines over a padded Convex Hull
 * - Dark matte surface with subtle transparency, soft ambient shadow, and procedural micro-grain
 * - Subtle edge illumination without distracting neon/glow
 * - Spring physics hover deformation (2-4px lift toward hovered chip with smooth cloth propagation)
 * - 600ms growth animation when section enters viewport (runs once)
 * - 60 FPS GPU-accelerated Canvas rendering
 * - Bulletproof DOM re-attachment (immune to innerHTML clearing by other scripts)
 */

(function () {
    'use strict';

    let canvas, ctx;
    let container;
    let hullVertices = [];
    let physicalVertices = [];
    let mouseX = -1000, mouseY = -1000;
    let isHovering = false;
    let isEntering = false;
    let hasEntered = false;
    let entryStartTime = 0;
    let noisePattern = null;
    let animFrameId = null;

    // Physics constants
    const STIFFNESS = 0.16;
    const DAMPING = 0.82;
    const MAX_HOVER_LIFT = 3.5; // px
    const INFLUENCE_RADIUS = 260; // px
    const PADDING = 28; // px around chips for fabric tension margin

    function init() {
        container = document.getElementById('skills-container');
        if (!container) return;

        // Strip static glass box styling from container so only our canvas background renders
        container.classList.remove('glass');
        container.style.background = 'transparent';
        container.style.backdropFilter = 'none';
        container.style.webkitBackdropFilter = 'none';
        container.style.boxShadow = 'none';
        container.style.border = 'none';
        container.style.position = 'relative';
        container.style.zIndex = '1';

        // Create Canvas background
        canvas = document.createElement('canvas');
        canvas.id = 'elastic-fabric-canvas';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '-1';
        
        ensureCanvasAttached();
        ctx = canvas.getContext('2d');

        // Generate procedural micro-grain texture
        createNoisePattern();

        // Setup observers and listeners
        setupListeners();

        // Initial setup and loop start
        updateDimensions();
        startLoop();

        // Periodic check to guarantee canvas remains attached and hull is synchronized
        // even if another script (like script.js) clears innerHTML or fonts shift layout
        setInterval(() => {
            ensureCanvasAttached();
            calculateHull();
        }, 400);
    }

    function ensureCanvasAttached() {
        if (!canvas || !container) return;
        if (!canvas.parentNode || canvas.parentNode !== container) {
            container.insertBefore(canvas, container.firstChild);
        }
        if (getComputedStyle(container).position === 'static') {
            container.style.position = 'relative';
        }
    }

    function createNoisePattern() {
        if (!ctx) return;
        const nCanvas = document.createElement('canvas');
        nCanvas.width = 64;
        nCanvas.height = 64;
        const nCtx = nCanvas.getContext('2d');
        const imgData = nCtx.createImageData(64, 64);
        for (let i = 0; i < imgData.data.length; i += 4) {
            const val = 130 + (Math.random() - 0.5) * 55;
            imgData.data[i] = val;
            imgData.data[i + 1] = val;
            imgData.data[i + 2] = val;
            imgData.data[i + 3] = 16; // Very subtle noise opacity
        }
        nCtx.putImageData(imgData, 0, 0);
        noisePattern = ctx.createPattern(nCanvas, 'repeat');
    }

    function setupListeners() {
        window.addEventListener('resize', debounce(() => {
            ensureCanvasAttached();
            updateDimensions();
        }, 100));

        // Track mouse for spring physics deformation
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
            isHovering = true;
        });

        container.addEventListener('mouseleave', () => {
            isHovering = false;
            mouseX = -1000;
            mouseY = -1000;
        });

        // Observe when container enters viewport for growth animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasEntered) {
                    hasEntered = true;
                    isEntering = true;
                    entryStartTime = performance.now();
                }
            });
        }, { threshold: 0.15 });
        observer.observe(container);

        // Observe DOM mutations (when script.js injects .skill-tag elements)
        const mutObserver = new MutationObserver(() => {
            ensureCanvasAttached();
            updateDimensions();
        });
        mutObserver.observe(container, { childList: true, subtree: true });
    }

    function updateDimensions() {
        if (!container || !canvas) return;
        ensureCanvasAttached();
        const rect = container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const dpr = window.devicePixelRatio || 1;
        if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) {
            canvas.width = Math.round(rect.width * dpr);
            canvas.height = Math.round(rect.height * dpr);
            if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            if (!noisePattern) createNoisePattern();
        }

        calculateHull();
    }

    // Monotone Chain 2D Convex Hull
    function computeConvexHull(points) {
        if (points.length <= 3) return points;
        points.sort((a, b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]);

        const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);

        const lower = [];
        for (let i = 0; i < points.length; i++) {
            while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], points[i]) <= 0) {
                lower.pop();
            }
            lower.push(points[i]);
        }

        const upper = [];
        for (let i = points.length - 1; i >= 0; i--) {
            while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], points[i]) <= 0) {
                upper.pop();
            }
            upper.push(points[i]);
        }

        lower.pop();
        upper.pop();
        return lower.concat(upper);
    }

    function calculateHull() {
        if (!container) return;
        const chipElements = container.querySelectorAll('.skill-tag');
        if (chipElements.length === 0) return;

        const containerRect = container.getBoundingClientRect();
        if (containerRect.width === 0 || containerRect.height === 0) return;

        const points = [];

        chipElements.forEach(chip => {
            const rect = chip.getBoundingClientRect();
            const left = rect.left - containerRect.left;
            const top = rect.top - containerRect.top;
            const right = left + rect.width;
            const bottom = top + rect.height;
            const midX = left + rect.width / 2;
            const midY = top + rect.height / 2;

            // Generate padded perimeter points around each chip
            points.push([left - PADDING, top - PADDING]);
            points.push([midX, top - PADDING]);
            points.push([right + PADDING, top - PADDING]);
            points.push([right + PADDING, midY]);
            points.push([right + PADDING, bottom + PADDING]);
            points.push([midX, bottom + PADDING]);
            points.push([left - PADDING, bottom + PADDING]);
            points.push([left - PADDING, midY]);
        });

        const hull = computeConvexHull(points);
        hullVertices = hull.map(p => ({ x: p[0], y: p[1] }));

        // Initialize physical vertices if empty or size changed
        if (physicalVertices.length !== hullVertices.length) {
            physicalVertices = hullVertices.map(v => ({
                x: v.x,
                y: v.y,
                vx: 0,
                vy: 0,
                targetX: v.x,
                targetY: v.y
            }));
        } else {
            // Update targets smoothly without resetting velocities
            for (let i = 0; i < hullVertices.length; i++) {
                physicalVertices[i].targetX = hullVertices[i].x;
                physicalVertices[i].targetY = hullVertices[i].y;
            }
        }
    }

    function startLoop() {
        if (!animFrameId) {
            animFrameId = requestAnimationFrame(render);
        }
    }

    function render(timestamp) {
        animFrameId = requestAnimationFrame(render);
        if (!ctx || !canvas) return;
        
        ensureCanvasAttached();
        if (physicalVertices.length === 0) return;

        const width = canvas.width / (window.devicePixelRatio || 1);
        const height = canvas.height / (window.devicePixelRatio || 1);
        if (width <= 0 || height <= 0) return;

        const centerX = width / 2;
        const centerY = height / 2;

        ctx.clearRect(0, 0, width, height);

        // Update spring physics for each vertex
        for (let i = 0; i < physicalVertices.length; i++) {
            const v = physicalVertices[i];
            let tx = v.targetX;
            let ty = v.targetY;

            // Hover deformation: lift membrane toward hovered chip/cursor
            if (isHovering && mouseX >= 0 && mouseY >= 0) {
                const dxMouse = tx - mouseX;
                const dyMouse = ty - mouseY;
                const dist = Math.hypot(dxMouse, dyMouse);

                if (dist < INFLUENCE_RADIUS) {
                    const factor = Math.exp(-(dist * dist) / (130 * 130));
                    // Vector pointing outward from center
                    const dxCenter = tx - centerX;
                    const dyCenter = ty - centerY;
                    const distCenter = Math.hypot(dxCenter, dyCenter) || 1;
                    const ux = dxCenter / distCenter;
                    const uy = dyCenter / distCenter;

                    tx += ux * MAX_HOVER_LIFT * factor;
                    ty += uy * MAX_HOVER_LIFT * factor;
                }
            }

            // Spring Hooke's law + damping
            const ax = (tx - v.x) * STIFFNESS;
            const ay = (ty - v.y) * STIFFNESS;
            v.vx = (v.vx + ax) * DAMPING;
            v.vy = (v.vy + ay) * DAMPING;
            v.x += v.vx;
            v.y += v.vy;
        }

        // Calculate growth animation progress (0 to 1 over 650ms)
        let entryProgress = 1;
        if (isEntering) {
            const elapsed = timestamp - entryStartTime;
            const t = Math.min(1, elapsed / 650);
            entryProgress = 1 - Math.pow(1 - t, 3); // Cubic ease-out
            if (t >= 1) isEntering = false;
        }

        // Prepare render vertices (interpolating from center during growth animation)
        const renderPoints = physicalVertices.map(v => ({
            x: centerX + (v.x - centerX) * entryProgress,
            y: centerY + (v.y - centerY) * entryProgress
        }));

        const N = renderPoints.length;
        if (N < 3) return;

        // Draw organic smooth curve through midpoints (Catmull-Rom / Midpoint Bezier)
        ctx.beginPath();
        const firstMid = {
            x: (renderPoints[0].x + renderPoints[1 % N].x) / 2,
            y: (renderPoints[0].y + renderPoints[1 % N].y) / 2
        };
        ctx.moveTo(firstMid.x, firstMid.y);

        for (let i = 1; i <= N; i++) {
            const curr = renderPoints[i % N];
            const next = renderPoints[(i + 1) % N];
            const mid = {
                x: (curr.x + next.x) / 2,
                y: (curr.y + next.y) / 2
            };
            ctx.quadraticCurveTo(curr.x, curr.y, mid.x, mid.y);
        }
        ctx.closePath();

        // 1. Soft Ambient Shadow & Dark Matte Fill
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
        ctx.shadowBlur = 32;
        ctx.shadowOffsetY = 14;
        ctx.fillStyle = 'rgba(20, 20, 25, 0.88)'; // Dark matte surface with subtle transparency
        ctx.fill();
        ctx.restore();

        // 2. Procedural Micro-Grain Texture Overlay
        if (noisePattern) {
            ctx.save();
            ctx.clip();
            ctx.fillStyle = noisePattern;
            ctx.fill();
            ctx.restore();
        }

        // 3. Subtle Edge Illumination (No neon, no bright glow)
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
    }

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
