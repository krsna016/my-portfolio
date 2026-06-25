// Premium Fade and Blur Transition
document.addEventListener("DOMContentLoaded", () => {
    // Remove old overlay if it exists (from previous version)
    const oldOverlay = document.getElementById("page-transition-overlay");
    if (oldOverlay) oldOverlay.remove();

    // 1. Add styles dynamically
    const style = document.createElement("style");
    style.innerHTML = `
        body {
            transition: opacity 0.4s ease-out, filter 0.4s ease-out, transform 0.4s ease-out !important;
            opacity: 1;
            filter: blur(0px);
            transform: scale(1);
        }

        /* State when page is just starting to load (comes in slightly zoomed and blurred) */
        body.page-loading {
            opacity: 0;
            filter: blur(15px);
            transform: scale(1.02);
        }

        /* State when leaving page (zooms out slightly and blurs) */
        body.page-leaving {
            opacity: 0;
            filter: blur(15px);
            transform: scale(0.98);
        }
    `;
    document.head.appendChild(style);

    // 2. Set initial loading state and trigger reveal
    document.body.classList.add("page-loading");
    requestAnimationFrame(() => {
        setTimeout(() => {
            document.body.classList.remove("page-loading");
        }, 50);
    });

    // 3. Intercept clicks on internal links
    const links = document.querySelectorAll('a[href]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetUrl = link.getAttribute('href');
            const target = link.getAttribute('target');

            // Ignore external links, anchor links (#), or new tabs
            if (
                !targetUrl ||
                target === '_blank' || 
                targetUrl.startsWith('#') || 
                targetUrl.startsWith('http') || 
                targetUrl.startsWith('mailto') ||
                (targetUrl.includes('#') && targetUrl.startsWith('/')) 
            ) {
                return;
            }

            e.preventDefault();

            // If it's the exact same page, just scroll to top
            if (targetUrl === window.location.pathname || targetUrl === '/' + window.location.pathname.split('/').pop()) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            // Trigger "Leave" animation
            document.body.classList.add("page-leaving");

            // Wait for animation to finish before actually navigating
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 350); 
        });
    });
});

// Intercept browser back/forward buttons to instantly show page
window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        document.body.classList.remove("page-leaving");
        document.body.classList.remove("page-loading");
    }
});
