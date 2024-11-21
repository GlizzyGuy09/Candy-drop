const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.querySelector('.score');
const gameOverDisplay = document.querySelector('.gameOver');
const startButton = document.querySelector('.startButton');
let score = 0;
let gameActive = false;
let candies = [];
let fallingSpeed = 2;
let bucket = { x: canvas.width / 2 - 50, y: canvas.height - 60, width: 100, height: 50, color: "#f39c12" };
let isDragging = false;
let offsetX = 0;

// Start game
function startGame() {
    score = 0;
    gameActive = true;
    fallingSpeed = 2;
    candies = [];
    startButton.style.display = 'none';
    gameOverDisplay.style.display = 'none';
    scoreDisplay.textContent = "Score: " + score;
    gameLoop();
}

// Game loop
function gameLoop() {
    if (!gameActive) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the bucket
    ctx.fillStyle = bucket.color;
    ctx.fillRect(bucket.x, bucket.y, bucket.width, bucket.height);
    ctx.fillStyle = "#fff";
    ctx.font = "16px Arial";
    ctx.fillText("Candy Bucket", bucket.x + 10, bucket.y + 30); // Add text inside the bucket

    // Handle falling candies
    for (let i = 0; i < candies.length; i++) {
        let candy = candies[i];
        candy.y += candy.speed;

        // If the candy touches the bottom, remove it from the screen
        if (candy.y + candy.size >= canvas.height) {
            gameOver();
            return;
        }

        // Draw the candy
        ctx.fillStyle = candy.color;
        ctx.beginPath();
        ctx.arc(candy.x, candy.y, candy.size, 0, Math.PI * 2);
        ctx.fill();
    }

    // Create new candies if there's space
    if (candies.length < 2) {
        createCandy();
    }

    // Check if the bucket catches any candies
    for (let i = 0; i < candies.length; i++) {
        let candy = candies[i];
        if (candy.y + candy.size >= bucket.y && candy.x >= bucket.x && candy.x <= bucket.x + bucket.width) {
            score += 10; // Increase score when candy is caught
            candies.splice(i, 1); // Remove the caught candy
            scoreDisplay.textContent = "Score: " + score;
            break;
        }
    }

    // Increase falling speed over time
    fallingSpeed += 0.01;

    requestAnimationFrame(gameLoop); // Continue the game loop
}

// Create new falling candy
function createCandy() {
    let x = Math.random() * (canvas.width - 30);
    let size = 20;
    let color = randomColor();
    let speed = fallingSpeed;

    candies.push({ x: x, y: 0, size: size, speed: speed, color: color });
}

// End the game
function gameOver() {
    gameActive = false;
    gameOverDisplay.textContent = `Game Over! Your Score: ${score}`;
    gameOverDisplay.style.display = 'block';
    startButton.style.display = 'block';  // Show start button
}

// Generate random color for candy
function randomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Handle mouse and touch events for dragging the bucket
canvas.addEventListener('mousedown', function(event) {
    if (event.clientY > canvas.height - 120) { // Lower the dragger
        isDragging = true;
        offsetX = event.clientX - bucket.x;
    }
});

canvas.addEventListener('mousemove', function(event) {
    if (isDragging) {
        bucket.x = event.clientX - offsetX;
        // Keep bucket within canvas bounds
        bucket.x = Math.max(0, Math.min(bucket.x, canvas.width - bucket.width));
    }
});

canvas.addEventListener('mouseup', function() {
    isDragging = false;
});

// For touch events (mobile)
canvas.addEventListener('touchstart', function(event) {
    if (event.touches[0].clientY > canvas.height - 120) {
        isDragging = true;
        offsetX = event.touches[0].clientX - bucket.x;
    }
});

canvas.addEventListener('touchmove', function(event) {
    if (isDragging) {
        bucket.x = event.touches[0].clientX - offsetX;
        // Keep bucket within canvas bounds
        bucket.x = Math.max(0, Math.min(bucket.x, canvas.width - bucket.width));
    }
});

canvas.addEventListener('touchend', function() {
    isDragging = false;
});

// Start the game button
startButton.style.display = 'block'; // Show start button when the page loads
