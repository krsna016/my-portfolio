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
    NORMAL: { color: '#00d2ff', chance: 0.7 }, // Cyan Data Packet
    MEGA: { color: '#ff003c', chance: 0.1 },   // Red Critical Payload
    SPEED: { color: '#ffffff', chance: 0.1 },  // White Hyper Thread
    GHOST: { color: '#00FF41', chance: 0.1 }   // Matrix Green Phantom
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
            gameCanvas.style.borderColor = '#00d2ff'; // Reset visual to cyan
            gameCanvas.style.boxShadow = '0 0 20px rgba(0, 210, 255, 0.3)';
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
    // Clear Canvas to let CSS background show through (transparent black)
    gameCtx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    
    // Draw Cyber Grid
    gameCtx.strokeStyle = 'rgba(0, 210, 255, 0.05)';
    gameCtx.lineWidth = 1;
    for (let i = 0; i <= gameCanvas.width; i += GRID_SIZE) {
        gameCtx.beginPath();
        gameCtx.moveTo(i, 0);
        gameCtx.lineTo(i, gameCanvas.height);
        gameCtx.stroke();
        
        gameCtx.beginPath();
        gameCtx.moveTo(0, i);
        gameCtx.lineTo(gameCanvas.width, i);
        gameCtx.stroke();
    }

    // Draw Snake
    gameCtx.shadowBlur = 10;
    for (let i = 0; i < snake.length; i++) {
        let part = snake[i];
        
        if (i === 0) {
            // Head
            gameCtx.fillStyle = ghostMode ? 'rgba(0, 255, 65, 0.5)' : '#00FF41';
            gameCtx.shadowColor = '#00FF41';
        } else {
            // Body (fades slightly towards tail)
            let opacity = 1 - (i / snake.length) * 0.5;
            gameCtx.fillStyle = ghostMode ? `rgba(0, 255, 65, ${opacity * 0.3})` : `rgba(0, 210, 255, ${opacity})`;
            gameCtx.shadowColor = '#00d2ff';
        }
        
        // Make the snake look like connected digital blocks
        gameCtx.fillRect(part.x * GRID_SIZE + 1, part.y * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2);
    }
    gameCtx.shadowBlur = 0; // Reset shadow for next elements

    // Draw Food
    gameCtx.shadowBlur = 15;
    gameCtx.shadowColor = currentFoodType.color;
    gameCtx.fillStyle = currentFoodType.color;
    gameCtx.fillRect(
        food.x * GRID_SIZE + 2,
        food.y * GRID_SIZE + 2,
        GRID_SIZE - 4,
        GRID_SIZE - 4
    );
    
    // Draw an inner core for the food to look like a chip
    gameCtx.fillStyle = '#fff';
    gameCtx.shadowBlur = 0;
    gameCtx.fillRect(
        food.x * GRID_SIZE + GRID_SIZE/2 - 2,
        food.y * GRID_SIZE + GRID_SIZE/2 - 2,
        4,
        4
    );
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
