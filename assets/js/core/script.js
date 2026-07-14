function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
            
            // Auto-reload when a new ServiceWorker is installed and waiting
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('New ServiceWorker version found. Activating...');
                            if (registration.waiting) {
                                registration.waiting.postMessage({ action: 'skipWaiting' });
                            }
                        }
                    });
                }
            });
        }, err => {
            console.log('ServiceWorker registration failed: ', err);
        });

        // Refresh the page once the new ServiceWorker has taken over
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                refreshing = true;
                console.log('ServiceWorker controller changed. Reloading page...');
                window.location.reload();
            }
        });
    });
}


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
    document.querySelectorAll('a[href^="#"]:not([download]):not([href="#"])').forEach(anchor => {
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

        // Reader-mode navbar hide/show on scroll
        const postReader = document.getElementById('post-reader');
        let lastReaderScrollY = 0;
        if (postReader) {
            postReader.addEventListener('scroll', () => {
                const currentScrollY = postReader.scrollTop;
                if (currentScrollY > lastReaderScrollY && currentScrollY > 0) {
                    if (!navbar.classList.contains('hidden')) {
                        navbar.classList.add('hidden');
                    }
                } else {
                    if (navbar.classList.contains('hidden')) {
                        navbar.classList.remove('hidden');
                    }
                }
                lastReaderScrollY = currentScrollY;
            });
        }
    } else {
        console.error('Navbar not found!');
    }

    // Idea Bubbles Click Logic (HUD Audio)
    const bubbles = document.querySelectorAll('.idea-bubble');
    bubbles.forEach((bubble, index) => {
        bubble.style.cursor = 'pointer'; // Change from grab to pointer
        
        const playSound = (e) => {
            if (window.CyberSound && window.CyberSound.isEnabled()) {
                window.CyberSound.playSymbolSound(index);
            }
            
            // Add a quick pulse effect for visual feedback on the icon
            const icon = bubble.querySelector('i');
            if (icon) {
                const currentTransform = icon.style.transform;
                icon.style.transition = 'transform 0.1s';
                icon.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    icon.style.transform = currentTransform || '';
                }, 100);
            }
        };

        bubble.addEventListener('mousedown', playSound);
        bubble.addEventListener('touchstart', (e) => {
            // Prevent default to avoid double-firing with mousedown on touch devices
            // But only if we actually handled it
            if (e.cancelable) e.preventDefault();
            playSound();
        }, { passive: false });
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
                    <div class="neon-trace"></div>
                    <div class="exec-card-header">
                        <div class="exec-role-group">
                            <div class="exec-icon"><i class="${exp.icon || 'fa-solid fa-briefcase'}"></i></div>
                            <div>
                                <span class="exec-badge">${escapeHTML(exp.role)}</span>
                                <h3 class="exec-company">${escapeHTML(exp.company)}</h3>
                            </div>
                        </div>
                        <span class="exec-year"><i class="fa-regular fa-calendar"></i> ${escapeHTML(exp.year)}</span>
                    </div>
                    <p class="exec-desc">${escapeHTML(exp.desc)}</p>
                    <div class="exec-tags">
                        ${(exp.tags || []).map(t => `<span class="exec-tag">#${escapeHTML(t)}</span>`).join('')}
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
                <h3>${escapeHTML(project.title)}</h3>
                <p>${escapeHTML(project.desc)}</p>
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
    
    function unlockEmail(link) {
        if (link.getAttribute('href') === '#') {
            const decoded = atob(link.getAttribute('data-contact'));
            link.setAttribute('href', 'mailto:' + decoded);
            return decoded;
        }
        return null;
    }

    secureLinks.forEach(link => {
        // Pre-decode on hover for desktop
        link.addEventListener('mouseenter', function() {
            unlockEmail(this);
        });
        
        // Decode and trigger on click (fixes mobile and fast clicks)
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault(); // Stop smooth scroll script
                const decoded = unlockEmail(this);
                if (decoded) {
                    window.location.href = 'mailto:' + decoded;
                }
            }
        });
    });
});

// Immediate theme verification (runs synchronously when script loads to prevent flashing)
(function() {
    const savedTheme = localStorage.getItem('theme-preference') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // Create button container
    const themeBtn = document.createElement('button');
    themeBtn.id = 'theme-toggle-btn';
    themeBtn.className = 'theme-toggle-btn';
    themeBtn.setAttribute('aria-label', 'Toggle light/dark theme');
    
    const savedTheme = localStorage.getItem('theme-preference') || 'dark';
    
    // High-fidelity custom SVG structure that morphs from crescent moon to eclipse to sun
    themeBtn.innerHTML = `
        <svg class="theme-toggle-svg" viewBox="-6 -6 36 36" width="32" height="32">
            <circle class="sun-corona" cx="12" cy="12" r="5" />
            <mask id="moon-mask-icon">
                <rect x="0" y="0" width="24" height="24" fill="white" />
                <circle class="moon-cutter" cx="17" cy="7" r="6" fill="black" />
            </mask>
            <g class="sun-rays">
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </g>
            <circle class="sun-body" cx="12" cy="12" r="6" mask="url(#moon-mask-icon)" />
        </svg>
    `;
    document.body.appendChild(themeBtn);

    // Apply active class state for initial light load
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }

    const updateHeroImages = (isLight) => {
        const heroNormalImg = document.getElementById('hero-normal-img');
        const evervaultImg = document.querySelector('.evervault-img');
        if (heroNormalImg) heroNormalImg.src = isLight ? 'assets/images/profile-light.png' : 'assets/images/profile.webp';
        if (evervaultImg) evervaultImg.src = isLight ? 'assets/images/profile-light.png' : 'assets/images/profile.webp';
    };
    
    // Initial hero image setup
    updateHeroImages(savedTheme === 'light');

    themeBtn.addEventListener('click', (e) => {
        // 1. Trigger Eclipse Rotation State on Button
        themeBtn.classList.add('animating');
        
        // Calculate coords and radius for circular wave reveal
        const rect = themeBtn.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );
        document.documentElement.style.setProperty('--click-x', `${x}px`);
        document.documentElement.style.setProperty('--click-y', `${y}px`);
        document.documentElement.style.setProperty('--click-radius', `${endRadius}px`);

        // 2. Perform Eclipse Morph & Reveal Sequence
        setTimeout(() => {
            const performThemeSwap = () => {
                const isLight = document.body.classList.toggle('light-mode');
                localStorage.setItem('theme-preference', isLight ? 'light' : 'dark');
                
                updateHeroImages(isLight);
                
                if (window.updateGridTheme) {
                    window.updateGridTheme();
                }
            };

            // Support circular view transitions on supported browsers (Chrome, Edge, Safari 18+)
            if (document.startViewTransition) {
                document.startViewTransition(performThemeSwap);
            } else {
                performThemeSwap();
            }

            // 3. Complete Morph, add Golden Spark particles, reset classes
            setTimeout(() => {
                themeBtn.classList.remove('animating');
                createShimmerParticles(themeBtn);
            }, 100);
        }, 150);
    });

    function createShimmerParticles(parent) {
        const rect = parent.getBoundingClientRect();
        const center = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
        
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'theme-shimmer-particle';
            const angle = (i / 10) * Math.PI * 2 + (Math.random() * 0.4);
            const speed = 25 + Math.random() * 25;
            const tx = Math.cos(angle) * speed;
            const ty = Math.sin(angle) * speed;
            
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            particle.style.left = `${center.x}px`;
            particle.style.top = `${center.y}px`;
            
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 800);
        }
    }
});


