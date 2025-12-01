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
const GAME_SPEED = 150; // ms (Slower)

// Game State
let score = 0;
let snake = [];
let food = { x: 0, y: 0 };
let dx = 0;
let dy = 0;
let gameInterval;
let isGameRunning = false;

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

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, GAME_SPEED);

    gameOverModal.classList.remove('visible');
    startBtn.style.display = 'none';
}

// Game Loop
function gameLoop() {
    if (!isGameRunning) return;

    moveSnake();
    if (checkCollision()) {
        gameOver();
        return;
    }
    drawGame();
}

// Move Snake
function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    snake.unshift(head);

    // Check if ate food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        spawnFood();
    } else {
        snake.pop();
    }
}

// Check Collision
function checkCollision() {
    const head = snake[0];

    // Wall Collision
    if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
        return true;
    }

    // Self Collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

// Spawn Food
function spawnFood() {
    food.x = Math.floor(Math.random() * TILE_COUNT);
    food.y = Math.floor(Math.random() * TILE_COUNT);

    // Ensure food doesn't spawn on snake
    for (let part of snake) {
        if (part.x === food.x && part.y === food.y) {
            spawnFood();
            break;
        }
    }
}

// Draw Game
function drawGame() {
    // Clear Canvas
    gameCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Draw Snake
    gameCtx.fillStyle = '#6c63ff'; // Primary color
    for (let part of snake) {
        gameCtx.fillRect(part.x * GRID_SIZE, part.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
    }

    // Draw Head distinctively
    gameCtx.fillStyle = '#8a84ff';
    gameCtx.fillRect(snake[0].x * GRID_SIZE, snake[0].y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);

    // Draw Food
    gameCtx.fillStyle = '#ff4757'; // Red
    gameCtx.beginPath();
    gameCtx.arc(
        food.x * GRID_SIZE + GRID_SIZE / 2,
        food.y * GRID_SIZE + GRID_SIZE / 2,
        GRID_SIZE / 2 - 2,
        0,
        Math.PI * 2
    );
    gameCtx.fill();
}

// Game Over
function gameOver() {
    isGameRunning = false;
    clearInterval(gameInterval);
    finalScoreElement.textContent = score;
    gameOverModal.classList.add('visible');
    startBtn.style.display = 'block';
    startBtn.textContent = 'Restart Game';
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
    }
});

// Event Listeners
startBtn.addEventListener('click', initGame);
restartBtn.addEventListener('click', initGame);

// Initial Draw
gameCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
gameCtx.fillStyle = '#fff';
gameCtx.font = '20px Outfit';
gameCtx.textAlign = 'center';
gameCtx.fillText('Press Start to Play', gameCanvas.width / 2, gameCanvas.height / 2);
