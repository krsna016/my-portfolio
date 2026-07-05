/**
 * Matrix Rain Animation Script
 * Fully transparent implementation to preserve background CSS grids.
 */

const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let width, height;
const fontSize = 16;
let columns = 0;
let drops = [];

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ";
const charArray = characters.split('');

class MatrixDrop {
    constructor(x) {
        this.x = x;
        this.reset();
        this.y = Math.random() * -height * 2; // Initial random spawn above screen
    }

    reset() {
        this.y = Math.random() * -100;
        this.speed = Math.random() * 2 + 3; // Speed between 3 and 5
        this.maxLength = Math.floor(Math.random() * 20 + 10);
        this.chars = [];
    }

    update() {
        this.y += this.speed;

        // Add new character to the head if it has moved far enough
        if (this.chars.length === 0 || this.y - this.chars[this.chars.length - 1].y > fontSize) {
            this.chars.push({
                char: charArray[Math.floor(Math.random() * charArray.length)],
                y: this.y,
                alpha: 1
            });
        }

        // Limit the tail length
        if (this.chars.length > this.maxLength) {
            this.chars.shift();
        }

        // Reset if the entire tail is off screen
        if (this.chars.length > 0 && this.chars[0].y > height + fontSize) {
            this.reset();
        }
    }

    draw(ctx) {
        for (let i = 0; i < this.chars.length; i++) {
            const c = this.chars[i];
            
            // Calculate alpha fade (head is 1, tail fades to 0)
            const fadeStep = 1 / this.maxLength;
            c.alpha = Math.max(0, (i + 1) * fadeStep);
            
            // Occasional character glitch
            if (Math.random() > 0.98) {
                c.char = charArray[Math.floor(Math.random() * charArray.length)];
            }

            ctx.font = `${fontSize}px "IBM Plex Mono", monospace`;
            
            if (i === this.chars.length - 1) {
                // The Head (Bright white with intense green glow)
                ctx.fillStyle = `rgba(255, 255, 255, ${c.alpha})`;
                ctx.shadowBlur = 15;
                ctx.shadowColor = "#00FF66";
            } else {
                // The Tail (Hacker green, fading)
                ctx.fillStyle = `rgba(0, 255, 102, ${c.alpha * 0.8})`;
                ctx.shadowBlur = 0;
            }
            
            ctx.fillText(c.char, this.x, c.y);
        }
    }
}

function init() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    
    columns = Math.floor(width / fontSize);
    drops = [];
    
    for (let i = 0; i < columns; i++) {
        // Space them out slightly to prevent clustering
        if (Math.random() > 0.3) {
            drops.push(new MatrixDrop(i * fontSize));
        }
    }
}

function animate() {
    // Clear canvas entirely to preserve background CSS visibility!
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < drops.length; i++) {
        drops[i].update();
        drops[i].draw(ctx);
    }

    requestAnimationFrame(animate);
}

// Ensure resize is handled properly
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        init();
    }, 200);
});

// Start Matrix
init();
animate();
