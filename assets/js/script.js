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
            item.className = 'timeline-item scroll-reveal';
            item.innerHTML = `
                <div class="timeline-content glass" data-year="${exp.year}">
                    <span class="date">${exp.role}</span>
                    <h3>${exp.company}</h3>
                    <p>${exp.desc}</p>
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

// Loader Logic
const loader = document.querySelector(".loader-container");

window.addEventListener("load", () => {
    if (loader) {
        loader.classList.add("loader-hidden");
        loader.addEventListener("transitionend", () => {
            // Optional: remove it from DOM if you want, or just keep hidden
            // loader.remove(); 
        });
    }
});
