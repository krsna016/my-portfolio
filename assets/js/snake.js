/**
 * Snake Game Logic
 */

const gameCanvas = document.getElementById('game-board');
const gameCtx = gameCanvas.getContext('2d');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const gameOverModal = document.getElementById('game-over-modal');

// Game Constants
const GRID_SIZE = 20;
const TILE_COUNT = gameCanvas.width / GRID_SIZE;
const GAME_SPEED = 100; // ms (Faster)

// Game State
let score = 0;
let snake = [];
let food = { x: 0, y: 0 };
let dx = 0;
let dy = 0;
let gameInterval;
let isGameRunning = false;
let isPaused = false;

const pauseBtn = document.getElementById('pause-btn');

// Initialize Game
function initGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    score = 0;
    dx = 1;
    dy = 0;
    scoreElement.textContent = score;
    spawnFood();
    isGameRunning = true;
    isPaused = false;
    pauseBtn.textContent = 'Pause';
    pauseBtn.style.display = 'inline-block';

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, GAME_SPEED);

    gameOverModal.classList.remove('visible');
    startBtn.style.display = 'none';
}

// Toggle Pause
function togglePause() {
    if (!isGameRunning) return;

    if (isPaused) {
        // Resume
        isPaused = false;
        pauseBtn.textContent = 'Pause';
        gameInterval = setInterval(gameLoop, GAME_SPEED);
    } else {
        // Pause
        isPaused = true;
        pauseBtn.textContent = 'Resume';
        clearInterval(gameInterval);
    }
}

// Game Loop
function gameLoop() {
    if (!isGameRunning || isPaused) return;

    moveSnake();
    if (checkCollision()) {
        gameOver();
        return;
    }
    drawGame();
}

// Food Types
const FOOD_TYPES = {
    NORMAL: { color: '#ff4757', chance: 0.7 },
    MEGA: { color: '#ffd700', chance: 0.1 },   // Gold
    SPEED: { color: '#00d2d3', chance: 0.1 },  // Cyan
    GHOST: { color: '#a55eea', chance: 0.1 }   // Purple
};

let currentFoodType = FOOD_TYPES.NORMAL;
let ghostMode = false;
let ghostTimer;

// ...

// Spawn Food
function spawnFood() {
    food.x = Math.floor(Math.random() * TILE_COUNT);
    food.y = Math.floor(Math.random() * TILE_COUNT);

    // Determine Food Type
    const rand = Math.random();
    if (rand < FOOD_TYPES.NORMAL.chance) {
        currentFoodType = FOOD_TYPES.NORMAL;
    } else if (rand < FOOD_TYPES.NORMAL.chance + FOOD_TYPES.MEGA.chance) {
        currentFoodType = FOOD_TYPES.MEGA;
    } else if (rand < FOOD_TYPES.NORMAL.chance + FOOD_TYPES.MEGA.chance + FOOD_TYPES.SPEED.chance) {
        currentFoodType = FOOD_TYPES.SPEED;
    } else {
        currentFoodType = FOOD_TYPES.GHOST;
    }

    // Ensure food doesn't spawn on snake
    for (let part of snake) {
        if (part.x === food.x && part.y === food.y) {
            spawnFood();
            break;
        }
    }
}

// Move Snake
function moveSnake() {
    let head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Ghost Mode Wrapping
    if (ghostMode) {
        if (head.x < 0) head.x = TILE_COUNT - 1;
        if (head.x >= TILE_COUNT) head.x = 0;
        if (head.y < 0) head.y = TILE_COUNT - 1;
        if (head.y >= TILE_COUNT) head.y = 0;
    }

    snake.unshift(head);

    // Check if ate food
    if (head.x === food.x && head.y === food.y) {
        applyFoodEffect();
        spawnFood();
    } else {
        snake.pop();
    }
}

// Apply Food Effects
function applyFoodEffect() {
    score += 10;

    if (currentFoodType === FOOD_TYPES.MEGA) {
        score += 40; // Bonus score
        // Grow 5 times (already grew 1 from unshift, so add 4 more tails)
        for (let i = 0; i < 4; i++) {
            snake.push({ ...snake[snake.length - 1] });
        }
    } else if (currentFoodType === FOOD_TYPES.SPEED) {
        // Random Speed Change
        clearInterval(gameInterval);
        const newSpeed = Math.random() > 0.5 ? 50 : 150; // Fast or Slow
        gameInterval = setInterval(gameLoop, newSpeed);
        // Reset speed after 5 seconds
        setTimeout(() => {
            if (isGameRunning && !isPaused) {
                clearInterval(gameInterval);
                gameInterval = setInterval(gameLoop, GAME_SPEED);
            }
        }, 5000);
    } else if (currentFoodType === FOOD_TYPES.GHOST) {
        ghostMode = true;
        gameCanvas.style.borderColor = FOOD_TYPES.GHOST.color; // Visual cue
        gameCanvas.style.boxShadow = `0 0 30px ${FOOD_TYPES.GHOST.color}`;

        if (ghostTimer) clearTimeout(ghostTimer);
        ghostTimer = setTimeout(() => {
            ghostMode = false;
            gameCanvas.style.borderColor = 'var(--primary-color)'; // Reset visual
            gameCanvas.style.boxShadow = '0 0 20px rgba(108, 99, 255, 0.3)';
        }, 5000);
    }

    scoreElement.textContent = score;
}

// Check Collision
function checkCollision() {
    const head = snake[0];

    // Wall Collision (only if not in ghost mode)
    if (!ghostMode) {
        if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
            return true;
        }
    }

    // Self Collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

// Draw Game
function drawGame() {
    // Clear Canvas to let CSS background show through
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Draw Snake
    gameCtx.fillStyle = ghostMode ? 'rgba(165, 94, 234, 0.7)' : '#6c63ff'; // Ghost color or Primary
    for (let part of snake) {
        gameCtx.fillRect(part.x * GRID_SIZE, part.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
    }

    // Draw Head distinctively
    gameCtx.fillStyle = ghostMode ? '#fff' : '#8a84ff';
    gameCtx.fillRect(snake[0].x * GRID_SIZE, snake[0].y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);

    // Draw Food
    gameCtx.fillStyle = currentFoodType.color;
    gameCtx.beginPath();
    gameCtx.arc(
        food.x * GRID_SIZE + GRID_SIZE / 2,
        food.y * GRID_SIZE + GRID_SIZE / 2,
        GRID_SIZE / 2 - 2,
        0,
        Math.PI * 2
    );
    gameCtx.fill();

    // Draw Food Glow
    gameCtx.shadowBlur = 15;
    gameCtx.shadowColor = currentFoodType.color;
    gameCtx.fill();
    gameCtx.shadowBlur = 0; // Reset shadow
}

// Game Over
function gameOver() {
    isGameRunning = false;
    clearInterval(gameInterval);
    finalScoreElement.textContent = score;
    gameOverModal.classList.add('visible');
    startBtn.style.display = 'block';
    startBtn.textContent = 'Restart Game';
    pauseBtn.style.display = 'none';
}

// Input Handling
document.addEventListener('keydown', (e) => {
    // Prevent default scrolling for arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
    }

    if (!isGameRunning) return;

    switch (e.key) {
        case 'ArrowUp':
            if (dy !== 1) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
            if (dy !== -1) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
            if (dx !== 1) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx !== -1) { dx = 1; dy = 0; }
            break;
        case ' ':
            togglePause();
            break;
    }
});

// Event Listeners
startBtn.addEventListener('click', initGame);
restartBtn.addEventListener('click', initGame);
pauseBtn.addEventListener('click', togglePause);

// Initial Draw
gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
gameCtx.fillStyle = '#fff';
gameCtx.font = '20px Outfit';
gameCtx.textAlign = 'center';
gameCtx.fillText('Press Start to Play', gameCanvas.width / 2, gameCanvas.height / 2);
