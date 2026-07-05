/* ==========================================================================
   PREMIUM CYBER GRID MAGNET (CAD-STYLE)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Check for reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Create the magnet wrapper and node
    const magnetWrapper = document.createElement('div');
    magnetWrapper.className = 'grid-magnet-wrapper';
    
    const magnetNode = document.createElement('div');
    magnetNode.className = 'grid-magnet-node';
    magnetWrapper.appendChild(magnetNode);
    
    // Create faint ripple lines
    const lineX = document.createElement('div');
    lineX.className = 'grid-magnet-line-x';
    
    const lineY = document.createElement('div');
    lineY.className = 'grid-magnet-line-y';

    document.body.appendChild(lineX);
    document.body.appendChild(lineY);
    document.body.appendChild(magnetWrapper);

    const GRID_SIZE = 100;
    
    // State
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let targetX = mouseX;
    let targetY = mouseY;
    let isHoveringInteractive = false;
    let isActive = false;
    
    // Track previous snapped position to trigger pulse
    let lastSnappedX = null;
    let lastSnappedY = null;

    // Mouse tracking
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isActive) {
            isActive = true;
            magnetWrapper.style.opacity = '1';
            lineX.style.opacity = '1';
            lineY.style.opacity = '1';
        }
    }, { passive: true });

    // Interactive elements detection (pause magnet when hovering buttons/cards)
    const interactiveSelectors = 'a, button, input, textarea, select, .card, .glass, .ide-tab, [onclick], .social-link, .contact-container, .dsa-container';
    
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveSelectors)) {
            isHoveringInteractive = true;
            magnetWrapper.classList.add('hidden');
            lineX.classList.add('hidden');
            lineY.classList.add('hidden');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactiveSelectors)) {
            isHoveringInteractive = false;
            magnetWrapper.classList.remove('hidden');
            lineX.classList.remove('hidden');
            lineY.classList.remove('hidden');
        }
    });

    // Animation Loop
    function update() {
        if (isActive && !isHoveringInteractive) {
            // Calculate grid offsets (background is fixed and centered)
            const offsetX = (window.innerWidth / 2) % GRID_SIZE - (GRID_SIZE / 2);
            const offsetY = (window.innerHeight / 2) % GRID_SIZE - (GRID_SIZE / 2);

            // Calculate nearest intersection
            targetX = Math.round((mouseX - offsetX) / GRID_SIZE) * GRID_SIZE + offsetX;
            targetY = Math.round((mouseY - offsetY) / GRID_SIZE) * GRID_SIZE + offsetY;

            // Trigger pulse if target changed
            if (targetX !== lastSnappedX || targetY !== lastSnappedY) {
                // Reset animation
                magnetNode.classList.remove('pulse');
                void magnetNode.offsetWidth; // trigger reflow
                magnetNode.classList.add('pulse');
                
                lastSnappedX = targetX;
                lastSnappedY = targetY;
            }

            // Lerp current position to target for smooth magnetic spring feel
            // 0.15 gives a highly premium, slightly lagging magnetic spring
            currentX += (targetX - currentX) * 0.15;
            currentY += (targetY - currentY) * 0.15;

            // Update DOM (GPU accelerated)
            magnetWrapper.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
            lineX.style.transform = `translate3d(0, ${currentY}px, 0)`;
            lineY.style.transform = `translate3d(${currentX}px, 0, 0)`;
        }

        requestAnimationFrame(update);
    }

    // Start loop
    requestAnimationFrame(update);
});
