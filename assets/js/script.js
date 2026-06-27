// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

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
    // Typing Animation
    const text = "Anurag Pareek";
    const typingElement = document.getElementById('typing-text');
    let index = 0;

    function typeWriter() {
        if (index < text.length) {
            typingElement.innerHTML = text.substring(0, index + 1) + '<span class="typing-cursor"></span>';
            index++;
            setTimeout(typeWriter, 100); // Speed: 100ms
        } else {
            // Keep cursor blinking after typing finishes
            typingElement.innerHTML = text + '<span class="typing-cursor"></span>';
        }
    }

    // Start typing after a small delay
    if (typingElement) {
        setTimeout(typeWriter, 500);
    }

    // Navigation and other scripts
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

    // Mobile Menu Toggle logic moved to end of DOMContentLoaded to ensure elements exist

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

    if (navbar) {
        console.log('Navbar found, initializing scroll effect');
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            // console.log('Scroll Y:', currentScrollY); // Commented out to reduce noise

            if (currentScrollY > lastScrollY && currentScrollY > 0) {
                // Scrolling DOWN and not at top -> Hide
                if (!navbar.classList.contains('hidden')) {
                    console.log('Hiding navbar');
                    navbar.classList.add('hidden');
                }
            } else {
                // Scrolling UP or at top -> Show
                if (navbar.classList.contains('hidden')) {
                    console.log('Showing navbar');
                    navbar.classList.remove('hidden');
                }
            }

            lastScrollY = currentScrollY;
        });
    } else {
        console.error('Navbar not found!');
    }

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
    // WhatsApp Form Redirect
    const whatsappForm = document.getElementById('whatsapp-form');
    if (whatsappForm) {
        whatsappForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Format the message
            const formattedMessage = `Hello Anurag, I would like to get in touch.%0A%0A*Name:* ${name}%0A*Email:* ${email}%0A*Message:* ${message}`;

            // WhatsApp API URL
            // REPLACE '91XXXXXXXXXX' with your actual phone number (including country code, no +)
            const phoneNumber = '916900438634';
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${formattedMessage}`;

            // Open in new tab
            window.open(whatsappURL, '_blank');
        });
    }

    // Render Skills
    const skillsContainer = document.getElementById('skills-container');
    if (skillsContainer && typeof skillsData !== 'undefined') {
        skillsContainer.innerHTML = '';
        skillsData.forEach(skill => {
            const span = document.createElement('span');
            span.className = 'skill-tag';
            span.textContent = skill.name;
            span.setAttribute('data-desc', skill.desc);
            skillsContainer.appendChild(span);
        });
    }

    // Render Experience
    const experienceContainer = document.getElementById('experience-container');
    if (experienceContainer && typeof experienceData !== 'undefined') {
        experienceContainer.innerHTML = '';
        experienceData.forEach((exp, index) => {
            const item = document.createElement('div');
            item.className = `timeline-item scroll-reveal delay-${index * 100}`;
            item.innerHTML = `
                <div class="timeline-dot-connector"></div>
                <div class="timeline-content exec-card glass">
                    <div class="exec-card-header">
                        <div class="exec-role-group">
                            <div class="exec-icon"><i class="${exp.icon || 'fa-solid fa-briefcase'}"></i></div>
                            <div>
                                <span class="exec-badge">${exp.role}</span>
                                <h3 class="exec-company">${exp.company}</h3>
                            </div>
                        </div>
                        <span class="exec-year"><i class="fa-regular fa-calendar" style="color:#00d2ff;"></i> ${exp.year}</span>
                    </div>
                    <p class="exec-desc">${exp.desc}</p>
                    <div class="exec-tags">
                        ${(exp.tags || []).map(t => `<span class="exec-tag">#${t}</span>`).join('')}
                    </div>
                </div>
            `;
            experienceContainer.appendChild(item);
        });
    }

    // Render Projects
    const projectsContainer = document.getElementById('projects-container');
    if (projectsContainer && typeof projectsData !== 'undefined') {
        projectsContainer.innerHTML = '';
        projectsData.forEach((project, index) => {
            const card = document.createElement('div');
            card.className = `about-card glass scroll-reveal delay-${(index % 3) * 100}`;
            card.innerHTML = `
                <h3>${project.title}</h3>
                <p>${project.desc}</p>
            `;
            projectsContainer.appendChild(card);
        });
    }

    // Re-trigger scroll reveal observer for new elements
    if (typeof observer !== 'undefined') {
        document.querySelectorAll('.scroll-reveal').forEach(el => {
            observer.observe(el);
        });
    }

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // 3D Parallax Effect
    const heroSection = document.querySelector('.hero');
    const profileContainer = document.querySelector('.profile-image-container');

    if (heroSection && profileContainer) {
        heroSection.addEventListener('mousemove', (e) => {
            const { offsetWidth: width, offsetHeight: height } = heroSection;
            const { clientX: x, clientY: y } = e;

            // Calculate center of the section
            const centerX = width / 2;
            const centerY = height / 2;

            // Calculate distance from center (normalized -1 to 1)
            // We want the movement to be relative to the center of the screen/section
            // But specifically around the profile image would be better, 
            // however, tilting the whole section based on mouse position in section is standard.

            // Let's use the mouse position relative to the center of the window for a more natural feel
            // or relative to the hero section.

            const xPos = (x - width / 2) / width;
            const yPos = (y - height / 2) / height;

            // Limit tilt to stronger degrees (approx 12-15 deg)
            const tiltX = yPos * 25; // Increased from 14
            const tiltY = xPos * -25; // Increased from -14

            // Apply transform
            // We use requestAnimationFrame for smoother performance if needed, 
            // but CSS transition handles the smoothing here.
            profileContainer.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });

        heroSection.addEventListener('mouseleave', () => {
            profileContainer.style.transform = `rotateX(0deg) rotateY(0deg)`;
        });
    }
});

// Progress Bar Logic
const progressBar = document.getElementById("myBar");

function updateProgressBar() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (progressBar) {
        progressBar.style.width = scrolled + "%";
    }
}

window.addEventListener('scroll', updateProgressBar);

// Programmatic Control
window.setLoadProgress = function (percent) {
    if (progressBar) {
        progressBar.style.width = percent + "%";
    }
};

// Floating Dock Navbar Active Link Detection
function assignDockActiveLink() {
    let currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPage === '' || currentPage === '/') currentPage = 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref && (linkHref === currentPage || linkHref.endsWith(currentPage))) {
            link.classList.add('active-dock-link');
        } else {
            link.classList.remove('active-dock-link');
        }
    });
}
assignDockActiveLink();
document.addEventListener('DOMContentLoaded', assignDockActiveLink);
window.addEventListener('load', assignDockActiveLink);



// ==========================================
// 🚀 THE INVISIBLE LAYER (INTENSE METADATA HACKS)
// ==========================================

// 1. The "Dev-to-Dev" Handshake (Console Easter Egg)
(function() {
    const asciiArt = `
    █████╗ ███╗   ██╗██╗   ██╗██████╗  █████╗  ██████╗
   ██╔══██╗████╗  ██║██║   ██║██╔══██╗██╔══██╗██╔════╝
   ███████║██╔██╗ ██║██║   ██║██████╔╝███████║██║  ███╗
   ██╔══██║██║╚██╗██║██║   ██║██╔══██╗██╔══██║██║   ██║
   ██║  ██║██║ ╚████║╚██████╔╝██║  ██║██║  ██║╚██████╔╝
   ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝
    `;
    console.log(`%c${asciiArt}`, "color: #00d2ff; font-weight: bold; text-shadow: 0 0 10px #00d2ff;");
    console.log("%c>>> SYSTEM BREACH DETECTED... Just kidding.", "color: #ff0055; font-size: 14px; font-weight: bold;");
    console.log("%c>>> If you are inspecting this, you should probably hire me.", "color: #2ed573; font-size: 16px; font-weight: bold;");
    console.log("%c>>> Contact: anuragpareek016@gmail.com", "color: #fff; font-size: 12px; background: #0f0c29; padding: 4px; border-radius: 4px;");
})();

// 2. Predictive Prefetching (Zero-latency Page Loads)
(function() {
    const prefetchedUrls = new Set();
    document.addEventListener('mouseover', (e) => {
        const link = e.target.closest('a');
        if (link && link.href && link.href.startsWith(window.location.origin)) {
            const url = link.href;
            if (!prefetchedUrls.has(url)) {
                // Add a tiny delay to ensure intentional hover (50ms)
                link.prefetchTimeout = setTimeout(() => {
                    const prefetchTag = document.createElement('link');
                    prefetchTag.rel = 'prefetch';
                    prefetchTag.href = url;
                    document.head.appendChild(prefetchTag);
                    prefetchedUrls.add(url);
                    // console.log('Predictively prefetched:', url);
                }, 50);
            }
        }
    });
    document.addEventListener('mouseout', (e) => {
        const link = e.target.closest('a');
        if (link && link.prefetchTimeout) {
            clearTimeout(link.prefetchTimeout);
        }
    });
})();

// 3. Reactive Theme Color (OS Meta Integration)
(function() {
    // Create theme-color meta if it doesn't exist
    let themeMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeMeta) {
        themeMeta = document.createElement('meta');
        themeMeta.name = "theme-color";
        document.head.appendChild(themeMeta);
    }
    
    const updateThemeColor = () => {
        // Change color based on scroll depth or page type
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) || 0;
        // Interpolate between a dark purple and an electric blue
        // Dark purple: #0f0c29 (15, 12, 41)
        // Electric blue: #00d2ff (0, 210, 255)
        
        // For portfolio, let's keep it mostly dark but shift slightly
        const r = Math.round(15 - (15 * scrollPercent));
        const g = Math.round(12 + (198 * scrollPercent));
        const b = Math.round(41 + (214 * scrollPercent));
        
        const hex = `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
        themeMeta.setAttribute('content', hex);
    };
    
    window.addEventListener('scroll', updateThemeColor, { passive: true });
    updateThemeColor();
})();

// 4. vCard Injection (Instant Phone Contact)
window.downloadVCard = function() {
    const vcard = `BEGIN:VCARD
VERSION:3.0
N:Pareek;Anurag;;;
FN:Anurag Pareek
TITLE:Data Analyst & Developer
EMAIL:anuragpareek016@gmail.com
URL:https://krsna016.github.io/my-portfolio
NOTE:Ready to Innovate - Python, SQL, JS
END:VCARD`;
    
    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'Anurag_Pareek.vcf';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
};

// 5. Dynamic JSON-LD Knowledge Graph (Injected on Load)
(function() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Anurag Pareek",
        "jobTitle": "Data Analyst & Developer",
        "url": window.location.origin,
        "email": "anuragpareek016@gmail.com",
        "sameAs": [
            "https://github.com/krsna016",
            "https://linkedin.com/in/anurag-pareek"
        ],
        "knowsAbout": ["Python", "SQL", "Data Analysis", "Machine Learning", "Web Development"]
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
})();


// ==========================================
// 🛡️ INTENSE SECURITY HACKS
// ==========================================

// 1. Advanced Email Cryptography (Anti-Scraping)
document.addEventListener('DOMContentLoaded', () => {
    const secureLinks = document.querySelectorAll('.secure-contact');
    secureLinks.forEach(link => {
        link.addEventListener('mouseover', function() {
            if (this.getAttribute('href') === '#') {
                const decoded = atob(this.getAttribute('data-contact'));
                this.setAttribute('href', 'https://mail.google.com/mail/?view=cm&fs=1&to=' + decoded);
                // console.log("Email unlocked securely.");
            }
        });
    });
});

// 2. Anti-Tamper DOM Mutation Observer (Self-Healing DOM)
(function() {
    // Only strictly allow known domains
    const allowedDomains = [
        window.location.origin,
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://cdnjs.cloudflare.com'
    ];

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName === 'SCRIPT' || node.tagName === 'IFRAME') {
                    const src = node.src || node.href;
                    if (src) {
                        const isAllowed = allowedDomains.some(domain => src.startsWith(domain));
                        if (!isAllowed) {
                            node.parentNode.removeChild(node);
                            console.warn("%c[SECURITY SHIELD] Blocked unauthorized DOM injection:", "color: #ff0055; font-weight: bold;", src);
                        }
                    } else if (node.tagName === 'SCRIPT' && !node.innerHTML.includes('Intense Security Hacks')) {
                        // Some inline scripts might be okay, but we watch for suspicious ones
                        if (node.innerHTML.includes('eval(') || node.innerHTML.includes('document.write')) {
                            node.parentNode.removeChild(node);
                            console.warn("%c[SECURITY SHIELD] Blocked suspicious inline script.", "color: #ff0055; font-weight: bold;");
                        }
                    }
                }
            });
        });
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();
