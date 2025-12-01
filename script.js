// Disable right-click
document.addEventListener('contextmenu', (e) => e.preventDefault());

// Disable copy
document.addEventListener('copy', (e) => {
    e.preventDefault();
    return false;
});

// Disable selection (extra layer)
document.addEventListener('selectstart', (e) => {
    // Allow selection in inputs/textareas
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return true;
    }
    e.preventDefault();
});

document.addEventListener('DOMContentLoaded', () => {
    // Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });

    // Mobile Menu Toggle (Simple implementation)
    // Note: For a full production site, would add a proper slide-out menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            // Toggle logic would go here for mobile menu
            // For now, just a simple alert or console log as placeholder
            // or a simple toggle class if we added styles for it
            console.log('Mobile menu clicked');
        });
    }

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });



    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Show navbar only when near the top (e.g., within 50px)
        if (currentScrollY > 50) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
    });

    // Draggable Icons Logic
    const bubbles = document.querySelectorAll('.idea-bubble');
    const heroVisual = document.querySelector('.hero-visual');

    bubbles.forEach(bubble => {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        const startDrag = (e) => {
            isDragging = true;
            bubble.classList.add('dragging');

            // Get initial mouse/touch position
            const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

            startX = clientX;
            startY = clientY;

            // Get current computed position
            const style = window.getComputedStyle(bubble);
            const matrix = new WebKitCSSMatrix(style.transform);

            // We need to work with top/left, so we convert current position to explicit top/left
            // relative to the offsetParent (profile-image-container)
            const rect = bubble.getBoundingClientRect();
            const parentRect = bubble.offsetParent.getBoundingClientRect();

            initialLeft = rect.left - parentRect.left;
            initialTop = rect.top - parentRect.top;

            // Set explicit top/left and clear others to prevent fighting
            bubble.style.right = 'auto';
            bubble.style.bottom = 'auto';
            bubble.style.left = `${initialLeft}px`;
            bubble.style.top = `${initialTop}px`;

            // Prevent default drag behavior (like image dragging)
            if (e.type === 'mousedown') e.preventDefault();
        };

        const onDrag = (e) => {
            if (!isDragging) return;

            const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

            const deltaX = clientX - startX;
            const deltaY = clientY - startY;

            let newLeft = initialLeft + deltaX;
            let newTop = initialTop + deltaY;

            // Optional: Constrain to hero visual area (simple bounding box)
            // For now, we allow free movement around the photo as requested

            bubble.style.left = `${newLeft}px`;
            bubble.style.top = `${newTop}px`;
        };

        const stopDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            bubble.classList.remove('dragging');
        };

        // Mouse Events
        bubble.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);

        // Touch Events
        bubble.addEventListener('touchstart', startDrag, { passive: false });
        document.addEventListener('touchmove', onDrag, { passive: false });
        document.addEventListener('touchend', stopDrag);
    });
});
