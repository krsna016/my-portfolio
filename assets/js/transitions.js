// Simple Page Transition Manager
document.addEventListener("DOMContentLoaded", () => {
    // 1. Create the transition overlay
    const overlay = document.createElement("div");
    overlay.id = "page-transition-overlay";
    document.body.appendChild(overlay);

    // 2. Add styles dynamically
    const style = document.createElement("style");
    style.innerHTML = `
        #page-transition-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #0f0c29; /* Matches the site theme */
            z-index: 99999;
            pointer-events: none;
            transition: opacity 0.5s cubic-bezier(0.87, 0, 0.13, 1), transform 0.5s cubic-bezier(0.87, 0, 0.13, 1);
            opacity: 1;
            transform: translateY(0);
        }
        
        /* State when page has finished loading (overlay fades/slides away) */
        body.page-loaded #page-transition-overlay {
            opacity: 0;
            transform: translateY(-100%);
        }

        /* State when leaving page (overlay comes back) */
        body.page-leaving #page-transition-overlay {
            opacity: 1;
            transform: translateY(0);
            pointer-events: all;
        }
    `;
    document.head.appendChild(style);

    // 3. Trigger the "Reveal" animation shortly after load
    requestAnimationFrame(() => {
        setTimeout(() => {
            document.body.classList.add("page-loaded");
        }, 50); // slight delay to ensure smooth rendering
    });

    // 4. Intercept clicks on internal links
    const links = document.querySelectorAll('a[href]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetUrl = link.getAttribute('href');
            const target = link.getAttribute('target');

            // Ignore external links, anchor links (#), or links meant to open in a new tab
            if (
                target === '_blank' || 
                targetUrl.startsWith('#') || 
                targetUrl.startsWith('http') || 
                targetUrl.startsWith('mailto') ||
                targetUrl.includes('#') && targetUrl.startsWith('/') // Like /#about
            ) {
                return;
            }

            e.preventDefault();

            // Check if it's the exact same page
            if (targetUrl === window.location.pathname || targetUrl === '/' + window.location.pathname.split('/').pop()) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            // Trigger "Leave" animation
            document.body.classList.remove("page-loaded");
            document.body.classList.add("page-leaving");

            // Wait for animation to finish before actually navigating
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 450); // Slightly less than the CSS transition duration
        });
    });
});

// Intercept browser back/forward buttons to instantly show page without glitch
window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        document.body.classList.remove("page-leaving");
        document.body.classList.add("page-loaded");
    }
});
