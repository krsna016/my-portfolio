/**
 * Particle Animation Script
 * Creates a subtle, Google-style blue dotted particle field background.
 * Now with mouse interaction!
 */

const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particlesArray;
let animationId;

// Mouse State
let mouse = {
    x: null,
    y: null,
    radius: 150 // Interaction radius
};

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('click', (event) => {
    const x = event.x;
    const y = event.y;
    // Account for parallax in initial position
    // drawY = (this.y - scrollY * 0.1) % height
    // so this.y should be roughly y + scrollY * 0.1
    const scrollY = window.scrollY;
    const particleY = y + scrollY * 0.1;

    for (let i = 0; i < 8; i++) {
        particlesArray.push(new Particle(x, particleY));
    }
});

// Handle resizing
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', () => {
    resizeCanvas();
    init();
});

// Particle Class
class Particle {
    constructor(x, y) {
        this.x = x || Math.random() * canvas.width;
        this.y = y || Math.random() * canvas.height;
        this.baseSize = Math.random() * 2 + 0.5; // Store base size
        this.size = this.baseSize;
        this.speedX = (Math.random() * 0.4 - 0.2); // Slow drift
        this.speedY = (Math.random() * 0.4 - 0.2);

        // If created by click, give a bit more random velocity
        if (x && y) {
            this.speedX = (Math.random() * 2 - 1);
            this.speedY = (Math.random() * 2 - 1);
        }

        // Colors: Blue, Cyan, Violet (matching theme)
        const colors = [
            'rgba(108, 99, 255, 0.6)', // Primary Blue
            'rgba(0, 212, 255, 0.6)',  // Secondary Cyan
            'rgba(140, 82, 255, 0.6)'  // Violet accent
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];

        // Opacity for fading
        this.opacity = Math.random() * 0.5 + 0.1;
        this.fadeSpeed = Math.random() * 0.002 + 0.001;
        this.fadingIn = Math.random() < 0.5;

        // Interaction
        this.density = (Math.random() * 30) + 1;
    }

    update(scrollY) {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // Subtle opacity animation
        if (this.fadingIn) {
            this.opacity += this.fadeSpeed;
            if (this.opacity >= 0.8) this.fadingIn = false;
        } else {
            this.opacity -= this.fadeSpeed;
            if (this.opacity <= 0.1) this.fadingIn = true;
        }

        // Mouse Interaction (Skip on mobile to optimize CPU performance)
        if (mouse.x != null && window.innerWidth >= 768) {
            // Calculate apparent Y position for interaction
            let apparentY = (this.y - scrollY * 0.1) % canvas.height;
            if (apparentY < 0) apparentY += canvas.height;

            let dx = mouse.x - this.x;
            let dy = mouse.y - apparentY;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                // Gentle repulsion
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const maxDistance = mouse.radius;
                const force = (maxDistance - distance) / maxDistance;
                const directionX = forceDirectionX * force * this.density;
                const directionY = forceDirectionY * force * this.density;

                this.x -= directionX;
                this.y -= directionY;

                // Slight size increase
                if (this.size < this.baseSize * 2) {
                    this.size += 0.2;
                }
            } else {
                // Return to original size
                if (this.size > this.baseSize) {
                    this.size -= 0.1;
                }
            }
        }
    }

    draw(scrollY) {
        ctx.fillStyle = this.color.replace('0.6)', `${this.opacity})`);
        ctx.beginPath();

        // Calculate apparent Y position with parallax and wrapping
        let drawY = (this.y - scrollY * 0.1) % canvas.height;
        if (drawY < 0) drawY += canvas.height;

        ctx.arc(this.x, drawY, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    particlesArray = [];

    // Check for saved state
    const savedParticles = sessionStorage.getItem('particlesData');
    if (savedParticles) {
        const parsedParticles = JSON.parse(savedParticles);
        parsedParticles.forEach(p => {
            const particle = new Particle(p.x, p.y);
            // Restore properties
            particle.size = p.size;
            particle.baseSize = p.baseSize;
            particle.speedX = p.speedX;
            particle.speedY = p.speedY;
            particle.color = p.color;
            particle.opacity = p.opacity;
            particle.fadingIn = p.fadingIn;
            particlesArray.push(particle);
        });
    } else {
        // Density: 1 particle per 4000 pixels on desktop, 1 per 12000 pixels on mobile to maintain 60fps
        const isMobile = window.innerWidth < 768;
        const divisor = isMobile ? 12000 : 4000;
        let numberOfParticles = (canvas.width * canvas.height) / divisor;
        
        // Enforce safe limits to avoid CPU bottlenecks on high-DPI screens
        numberOfParticles = Math.min(isMobile ? 35 : 180, numberOfParticles);

        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
}

// Save state before unload
window.addEventListener('beforeunload', () => {
    const particlesData = particlesArray.map(p => ({
        x: p.x,
        y: p.y,
        size: p.size,
        baseSize: p.baseSize,
        speedX: p.speedX,
        speedY: p.speedY,
        color: p.color,
        opacity: p.opacity,
        fadingIn: p.fadingIn
    }));
    sessionStorage.setItem('particlesData', JSON.stringify(particlesData));
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Parallax effect based on scroll
    const scrollY = window.scrollY;

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update(scrollY);
        particlesArray[i].draw(scrollY);
    }

    animationId = requestAnimationFrame(animate);
}

// Start
resizeCanvas();
init();
animate();
