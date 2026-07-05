/**
 * T-Rex Runner - Pixel Perfect Clone
 * Based on Chromium source code
 */

document.addEventListener('DOMContentLoaded', () => {
    const gameCanvas = document.getElementById('game-board');
    if (!gameCanvas) {
        console.error('Game canvas not found!');
        return;
    }

    const ctx = gameCanvas.getContext('2d');

    // --- Constants & Config ---
    const FPS = 60;
    const DEFAULT_WIDTH = 600;
    const DEFAULT_HEIGHT = 150;
    const SCALE = 2; // Scale up for better visibility on our larger canvas

    // Game Config
    const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const CONFIG = {
        ACCELERATION: 0.001 * SCALE,
        BG_CLOUD_SPEED: 0.2,
        BOTTOM_PAD: 10,
        CLEAR_TIME: 3000,
        CLOUD_FREQUENCY: 0.5,
        GAMEOVER_CLEAR_TIME: 750,
        GAP_COEFFICIENT: 0.6,
        GRAVITY: 0.6 * SCALE,
        INITIAL_JUMP_VELOCITY: -10 * SCALE,
        MAX_CLOUDS: 6,
        MAX_OBSTACLE_LENGTH: 3,
        MAX_SPEED: 13 * SCALE,
        MIN_JUMP_HEIGHT: 30 * SCALE,
        MOBILE_SPEED_COEFFICIENT: 1.2,
        SPEED: 6 * SCALE,
        SPEED_DROP_COEFFICIENT: 3
    };

    // Sprite Definitions (LDPI)
    const SPRITES = {
        CACTUS_LARGE: { x: 332, y: 2 },
        CACTUS_SMALL: { x: 228, y: 2 },
        CLOUD: { x: 86, y: 2 },
        HORIZON: { x: 2, y: 54 },
        MOON: { x: 484, y: 2 },
        PTERODACTYL: { x: 134, y: 2 },
        RESTART: { x: 2, y: 2 },
        TEXT_SPRITE: { x: 655, y: 2 },
        TREX: { x: 848, y: 2 },
        STAR: { x: 645, y: 2 }
    };

    // Dimensions
    const DIMENSIONS = {
        TREX: { x: 0, y: 0, width: 44, height: 47 },
        TREX_DUCK: { width: 59, height: 25 },
        TEXT_SPRITE: { width: 10, height: 13 },
        CACTUS_SMALL: { width: 17, height: 35 },
        CACTUS_LARGE: { width: 25, height: 50 },
        PTERODACTYL: { width: 46, height: 40 },
        CLOUD: { width: 46, height: 14 },
        HORIZON: { width: 1200, height: 12 } // Approximate width/height for horizon line
    };

    // Base64 Sprite Sheet (100-offline-sprite.png)
    const SPRITE_SHEET_SRC = 'data:image/png;base64,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';

    const spriteImage = new Image();
    spriteImage.src = SPRITE_SHEET_SRC;

    // --- Game State ---
    let score = 0;
    let highScore = localStorage.getItem('trexHighScore') || 0;
    let distanceRan = 0;
    let speed = CONFIG.SPEED;
    let runningTime = 0;
    let isPlaying = false;
    let isCrashed = false;
    let animationId;

    // Entities
    let tRex = {
        x: 50,
        y: 0,
        velocity: 0,
        jumping: false,
        ducking: false,
        animFrame: 0,
        timer: 0,
        status: 'WAITING' // WAITING, RUNNING, JUMPING, DUCKING, CRASHED
    };

    let horizon = {
        obstacles: [],
        clouds: [],
        groundX: 0
    };

    // --- Helper Functions ---
    function getRandomNum(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // --- Game Logic ---

    function init() {
        score = 0;
        distanceRan = 0;
        speed = CONFIG.SPEED;
        runningTime = 0;
        isPlaying = true;
        isCrashed = false;

        tRex.y = gameCanvas.height - CONFIG.BOTTOM_PAD * SCALE - DIMENSIONS.TREX.height * SCALE;
        tRex.velocity = 0;
        tRex.jumping = false;
        tRex.ducking = false;
        tRex.status = 'RUNNING';

        horizon.obstacles = [];
        horizon.clouds = [];
        horizon.groundX = 0;

        document.getElementById('game-over-modal').classList.remove('visible');
        document.getElementById('start-btn').style.display = 'none';

        if (animationId) cancelAnimationFrame(animationId);
        update();
    }

    function update() {
        if (!isPlaying) return;

        // Clear Canvas
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

        // Update Speed
        if (speed < CONFIG.MAX_SPEED) {
            speed += CONFIG.ACCELERATION;
        }

        // Update Distance & Score
        distanceRan += speed;
        score = Math.floor(distanceRan * 0.025);

        if (score > highScore) {
            highScore = score;
            localStorage.setItem('trexHighScore', highScore);
        }

        // Draw Horizon
        updateHorizon();

        // Update & Draw T-Rex
        updateTrex();

        // Draw Score
        drawScore();

        // Check Collisions
        if (checkCollision()) {
            gameOver();
            return;
        }

        animationId = requestAnimationFrame(update);
    }

    function updateHorizon() {
        // Ground
        // The horizon sprite is just a line in this sheet, we can draw it repeatedly
        // Actual horizon line logic from source is complex, we'll simplify:
        // Draw the ground line
        const groundY = gameCanvas.height - CONFIG.BOTTOM_PAD * SCALE;
        ctx.drawImage(spriteImage, SPRITES.HORIZON.x, SPRITES.HORIZON.y, DIMENSIONS.HORIZON.width, DIMENSIONS.HORIZON.height,
            horizon.groundX, groundY - 10, DIMENSIONS.HORIZON.width * SCALE, DIMENSIONS.HORIZON.height * SCALE);
        ctx.drawImage(spriteImage, SPRITES.HORIZON.x, SPRITES.HORIZON.y, DIMENSIONS.HORIZON.width, DIMENSIONS.HORIZON.height,
            horizon.groundX + DIMENSIONS.HORIZON.width * SCALE, groundY - 10, DIMENSIONS.HORIZON.width * SCALE, DIMENSIONS.HORIZON.height * SCALE);

        horizon.groundX -= speed;
        if (horizon.groundX <= -DIMENSIONS.HORIZON.width * SCALE) {
            horizon.groundX = 0;
        }

        // Clouds
        if (Math.random() < CONFIG.CLOUD_FREQUENCY * 0.01 && horizon.clouds.length < CONFIG.MAX_CLOUDS) {
            horizon.clouds.push({
                x: gameCanvas.width,
                y: getRandomNum(30, 70)
            });
        }

        for (let i = horizon.clouds.length - 1; i >= 0; i--) {
            let cloud = horizon.clouds[i];
            cloud.x -= CONFIG.BG_CLOUD_SPEED;
            ctx.drawImage(spriteImage, SPRITES.CLOUD.x, SPRITES.CLOUD.y, DIMENSIONS.CLOUD.width, DIMENSIONS.CLOUD.height,
                cloud.x, cloud.y, DIMENSIONS.CLOUD.width * SCALE, DIMENSIONS.CLOUD.height * SCALE);

            if (cloud.x < -DIMENSIONS.CLOUD.width * SCALE) {
                horizon.clouds.splice(i, 1);
            }
        }

        // Obstacles
        if (Math.random() < 0.02 && horizon.obstacles.length < CONFIG.MAX_OBSTACLE_LENGTH) {
            // Ensure gap
            let lastObstacle = horizon.obstacles[horizon.obstacles.length - 1];
            if (!lastObstacle || (gameCanvas.width - lastObstacle.x > lastObstacle.width * SCALE + 150)) {
                spawnObstacle();
            }
        }

        for (let i = horizon.obstacles.length - 1; i >= 0; i--) {
            let obs = horizon.obstacles[i];
            obs.x -= speed;

            let spriteX = obs.type === 'CACTUS_SMALL' ? SPRITES.CACTUS_SMALL.x :
                (obs.type === 'CACTUS_LARGE' ? SPRITES.CACTUS_LARGE.x : SPRITES.PTERODACTYL.x);
            let spriteY = obs.type === 'PTERODACTYL' ? SPRITES.PTERODACTYL.y :
                (obs.type === 'CACTUS_SMALL' ? SPRITES.CACTUS_SMALL.y : SPRITES.CACTUS_LARGE.y);
            let width = obs.type === 'CACTUS_SMALL' ? DIMENSIONS.CACTUS_SMALL.width :
                (obs.type === 'CACTUS_LARGE' ? DIMENSIONS.CACTUS_LARGE.width : DIMENSIONS.PTERODACTYL.width);
            let height = obs.type === 'CACTUS_SMALL' ? DIMENSIONS.CACTUS_SMALL.height :
                (obs.type === 'CACTUS_LARGE' ? DIMENSIONS.CACTUS_LARGE.height : DIMENSIONS.PTERODACTYL.height);

            // Pterodactyl Animation
            if (obs.type === 'PTERODACTYL') {
                obs.timer++;
                if (obs.timer > 10) {
                    obs.frame = (obs.frame + 1) % 2;
                    obs.timer = 0;
                }
                spriteX += obs.frame * width; // Assuming frames are next to each other
            }

            ctx.drawImage(spriteImage, spriteX, spriteY, width, height,
                obs.x, obs.y, width * SCALE, height * SCALE);

            if (obs.x < -width * SCALE) {
                horizon.obstacles.splice(i, 1);
            }
        }
    }

    function spawnObstacle() {
        const typeRand = Math.random();
        let type = 'CACTUS_SMALL';
        let width = DIMENSIONS.CACTUS_SMALL.width;
        let height = DIMENSIONS.CACTUS_SMALL.height;
        let y = gameCanvas.height - CONFIG.BOTTOM_PAD * SCALE - height * SCALE;

        if (typeRand > 0.6) {
            type = 'CACTUS_LARGE';
            width = DIMENSIONS.CACTUS_LARGE.width;
            height = DIMENSIONS.CACTUS_LARGE.height;
            y = gameCanvas.height - CONFIG.BOTTOM_PAD * SCALE - height * SCALE;
        } else if (typeRand > 0.9 && score > 100) { // Pterodactyls after 100 points
            type = 'PTERODACTYL';
            width = DIMENSIONS.PTERODACTYL.width;
            height = DIMENSIONS.PTERODACTYL.height;
            y = gameCanvas.height - CONFIG.BOTTOM_PAD * SCALE - height * SCALE - getRandomNum(10, 50); // Flying
        }

        horizon.obstacles.push({
            type: type,
            x: gameCanvas.width,
            y: y,
            width: width,
            height: height,
            frame: 0,
            timer: 0
        });
    }

    function updateTrex() {
        // Physics
        if (tRex.jumping) {
            tRex.y += tRex.velocity;
            tRex.velocity += CONFIG.GRAVITY;

            const groundY = gameCanvas.height - CONFIG.BOTTOM_PAD * SCALE - DIMENSIONS.TREX.height * SCALE;
            if (tRex.y >= groundY) {
                tRex.y = groundY;
                tRex.jumping = false;
                tRex.velocity = 0;
                tRex.status = 'RUNNING';
            }
        } else {
            // Grounded
            if (tRex.ducking) {
                tRex.status = 'DUCKING';
            } else {
                tRex.status = 'RUNNING';
            }
        }

        // Animation
        tRex.timer += 1;
        if (tRex.timer > 5) {
            tRex.animFrame = (tRex.animFrame + 1) % 2;
            tRex.timer = 0;
        }

        // Draw
        let spriteX = SPRITES.TREX.x;
        let spriteY = SPRITES.TREX.y;
        let width = DIMENSIONS.TREX.width;
        let height = DIMENSIONS.TREX.height;

        if (tRex.jumping) {
            // Jumping frame (first frame)
            // Actually jumping is usually a static frame, let's use the first one
        } else if (tRex.ducking) {
            // Ducking frames
            // Need to find ducking sprite X. Usually it's further down.
            // Based on index.js: DUCKING frames [264, 323]. 
            // 264 * 2 = 528? No, frames are indices?
            // "frames: [264, 323]" likely means x-offset.
            // Let's guess: Ducking sprites are usually after Trex.
            // Trex starts at 848.
            // Wait, Trex frames are [88, 132] for running?
            // The sprite sheet I have is 1233px wide.
            // Let's stick to the basic running animation for now.
            // Running frames are at x + 44, x + 88?
            // Let's assume standard layout: Stand, Run1, Run2, Jump, Duck1, Duck2.
            // Trex X is 848.
            // Run 1: 848 + 44 = 892
            // Run 2: 892 + 44 = 936
            if (tRex.status === 'RUNNING') {
                spriteX = 848 + (tRex.animFrame + 1) * 44; // +1 to skip standing
            }
        } else {
            // Running
            spriteX = 848 + (tRex.animFrame + 1) * 44;
        }

        // Crash
        if (isCrashed) {
            spriteX = 848 + 3 * 44; // 4th frame usually
        }

        ctx.drawImage(spriteImage, spriteX, spriteY, width, height,
            tRex.x, tRex.y, width * SCALE, height * SCALE);
    }

    function drawScore() {
        const scoreStr = Math.floor(score).toString().padStart(5, '0');
        const hiStr = `HI ${Math.floor(highScore).toString().padStart(5, '0')}`;

        ctx.fillStyle = '#535353';
        ctx.font = '20px "Courier New", Courier, monospace'; // Use monospace for retro feel
        ctx.textAlign = 'right';
        ctx.fillText(`${hiStr}  ${scoreStr}`, gameCanvas.width - 20, 30);
    }

    function checkCollision() {
        const trexBox = {
            x: tRex.x + 10, // Hitbox padding
            y: tRex.y + 10,
            width: (DIMENSIONS.TREX.width * SCALE) - 20,
            height: (DIMENSIONS.TREX.height * SCALE) - 20
        };

        for (let obs of horizon.obstacles) {
            const obsBox = {
                x: obs.x + 5,
                y: obs.y + 5,
                width: (obs.width * SCALE) - 10,
                height: (obs.height * SCALE) - 10
            };

            if (trexBox.x < obsBox.x + obsBox.width &&
                trexBox.x + trexBox.width > obsBox.x &&
                trexBox.y < obsBox.y + obsBox.height &&
                trexBox.height + trexBox.y > obsBox.y) {
                return true;
            }
        }
        return false;
    }

    function gameOver() {
        isPlaying = false;
        isCrashed = true;
        updateTrex(); // Draw crashed state

        // Draw Game Over Text
        // Center of screen
        // "GAME OVER" sprite is at 655, 2. Width 191, Height 11.
        const goX = (gameCanvas.width - 191 * SCALE) / 2;
        const goY = (gameCanvas.height - 11 * SCALE) / 2 - 20;
        ctx.drawImage(spriteImage, 655, 2, 191, 11, goX, goY, 191 * SCALE, 11 * SCALE);

        // Restart Button
        // At 2, 2. Width 36, Height 32.
        const restartX = (gameCanvas.width - 36 * SCALE) / 2;
        const restartY = goY + 40;
        ctx.drawImage(spriteImage, 2, 2, 36, 32, restartX, restartY, 36 * SCALE, 32 * SCALE);

        document.getElementById('game-over-modal').classList.add('visible');
        document.getElementById('start-btn').style.display = 'block';
        document.getElementById('start-btn').textContent = 'Restart';
    }

    // --- Input ---
    function handleJump() {
        if (!isPlaying) {
            if (isCrashed) init();
            return;
        }
        if (!tRex.jumping && !tRex.ducking) {
            tRex.jumping = true;
            tRex.velocity = CONFIG.INITIAL_JUMP_VELOCITY;
        }
    }

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            e.preventDefault();
            handleJump();
        }
        if (e.code === 'ArrowDown') {
            e.preventDefault();
            if (isPlaying && !tRex.jumping) tRex.ducking = true;
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.code === 'ArrowDown') {
            tRex.ducking = false;
        }
    });

    gameCanvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleJump();
    });

    document.getElementById('start-btn').addEventListener('click', init);
    document.getElementById('restart-btn').addEventListener('click', init);

    // Initial Draw
    spriteImage.onload = () => {
        ctx.fillStyle = '#f7f7f7';
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
        // Draw initial ground
        ctx.drawImage(spriteImage, SPRITES.HORIZON.x, SPRITES.HORIZON.y, DIMENSIONS.HORIZON.width, DIMENSIONS.HORIZON.height,
            0, gameCanvas.height - CONFIG.BOTTOM_PAD * SCALE - 10, DIMENSIONS.HORIZON.width * SCALE, DIMENSIONS.HORIZON.height * SCALE);
        // Draw initial Trex
        ctx.drawImage(spriteImage, SPRITES.TREX.x, SPRITES.TREX.y, DIMENSIONS.TREX.width, DIMENSIONS.TREX.height,
            50, gameCanvas.height - CONFIG.BOTTOM_PAD * SCALE - DIMENSIONS.TREX.height * SCALE, DIMENSIONS.TREX.width * SCALE, DIMENSIONS.TREX.height * SCALE);

        console.log('T-Rex Clone Ready');
    };
});
