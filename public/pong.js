const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const playerScoreDisplay = document.getElementById("playerScore");
const computerScoreDisplay = document.getElementById("computerScore");

const paddleWidth = 15;
const paddleHeight = 100;

const player = {
    x: 20,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    speed: 7,
    score: 0
};

const computer = {
    x: canvas.width - 20 - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    speed: 4,
    score: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speedX: 5,
    speedY: 4
};

const keys = {};

document.addEventListener("keydown", function(event) {
    keys[event.key.toLowerCase()] = true;
});

document.addEventListener("keyup", function(event) {
    keys[event.key.toLowerCase()] = false;
});

function drawRectangle(x, y, width, height) {
    ctx.fillStyle = "white";
    ctx.fillRect(x, y, width, height);
}

function drawBall() {
    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.arc(
        ball.x,
        ball.y,
        ball.radius,
        0,
        Math.PI * 2
    );

    ctx.fill();
}

function drawCenterLine() {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 15]);

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    ctx.setLineDash([]);
}

function movePlayer() {
    if (keys["w"]) {
        player.y -= player.speed;
    }

    if (keys["s"]) {
        player.y += player.speed;
    }

    // Keep paddle inside canvas
    if (player.y < 0) {
        player.y = 0;
    }

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }
}

function moveComputer() {

    const computerCenter = computer.y + computer.height / 2;

    if (computerCenter < ball.y - 10) {
        computer.y += computer.speed;
    }

    if (computerCenter > ball.y + 10) {
        computer.y -= computer.speed;
    }

    // Keep computer inside canvas
    if (computer.y < 0) {
        computer.y = 0;
    }

    if (computer.y + computer.height > canvas.height) {
        computer.y = canvas.height - computer.height;
    }
}

function moveBall() {

    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Top and bottom collision
    if (
        ball.y - ball.radius <= 0 ||
        ball.y + ball.radius >= canvas.height
    ) {
        ball.speedY *= -1;
    }

    // Player paddle collision
    if (
        ball.x - ball.radius <= player.x + player.width &&
        ball.x > player.x &&
        ball.y >= player.y &&
        ball.y <= player.y + player.height
    ) {
        ball.speedX = Math.abs(ball.speedX);
    }

    // Computer paddle collision
    if (
        ball.x + ball.radius >= computer.x &&
        ball.x < computer.x + computer.width &&
        ball.y >= computer.y &&
        ball.y <= computer.y + computer.height
    ) {
        ball.speedX = -Math.abs(ball.speedX);
    }

    // Computer scores
    if (ball.x < 0) {
        computer.score++;
        updateScore();
        resetBall();
    }

    // Player scores
    if (ball.x > canvas.width) {
        player.score++;
        updateScore();
        resetBall();
    }
}

function updateScore() {
    playerScoreDisplay.textContent = player.score;
    computerScoreDisplay.textContent = computer.score;
}

function resetBall() {

    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    ball.speedX *= -1;

    // Give the ball a random vertical direction
    ball.speedY = Math.random() > 0.5 ? 4 : -4;
}

function update() {
    movePlayer();
    moveComputer();
    moveBall();
}

function draw() {

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawCenterLine();

    drawRectangle(
        player.x,
        player.y,
        player.width,
        player.height
    );

    drawRectangle(
        computer.x,
        computer.y,
        computer.width,
        computer.height
    );

    drawBall();
}

function gameLoop() {
    update();
    draw();

    requestAnimationFrame(gameLoop);
}

gameLoop();