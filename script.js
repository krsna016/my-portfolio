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

    // Star Cursor Trail
    document.addEventListener('mousemove', (e) => {
        const star = document.createElement('div');
        star.classList.add('star-trail');
        star.style.left = `${e.clientX}px`;
        star.style.top = `${e.clientY}px`;

        // Randomize size slightly
        const size = Math.random() * 5 + 5; // 5px to 10px
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        document.body.appendChild(star);

        // Remove after animation
        setTimeout(() => {
            star.remove();
        }, 800);
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    const heroSection = document.querySelector('.hero');

    window.addEventListener('scroll', () => {
        if (window.scrollY > window.innerHeight - 100) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
    });
});
