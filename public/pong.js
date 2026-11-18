const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const playerScoreDisplay = document.getElementById("playerScore");
const computerScoreDisplay = document.getElementById("computerScore");
const restartButton = document.getElementById("restartButton");

const paddleWidth = 15;
const paddleHeight = 100;

/* CHANGED: Controls how much the ball speeds up after each paddle hit */
const ballHitSpeedIncrease = 0.25;

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

/* CHANGED: Tracks whether the game screen is active */
let gameRunning = false;

document.addEventListener("keydown", function(event) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
    }
});

document.addEventListener("keydown", function(event) {
    keys[event.key.toLowerCase()] = true;
});

document.addEventListener("keyup", function(event) {
    keys[event.key.toLowerCase()] = false;
});

/* CHANGED: Added navigation for menu buttons */
document.querySelectorAll("[data-screen]").forEach(function(button) {
    button.addEventListener("click", function() {
        showScreen(button.dataset.screen);
    });
});

/* CHANGED: Added restart button functionality */
restartButton.addEventListener("click", resetGame);

/* CHANGED: Shows the selected menu or game screen */
function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach(function(screen) {
        screen.classList.toggle("active", screen.id === screenId);
    });

    gameRunning = screenId === "gameScreen";

    if (gameRunning) {
        resetGame();
    }
}

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
    if (keys["w"] || keys["arrowup"]) {
        player.y -= player.speed;
    }

    if (keys["s"] || keys["arrowdown"]) {
        player.y += player.speed;
    }

    player.y = Math.max(
        0,
        Math.min(canvas.height - player.height, player.y)
    );
}

function moveComputer() {
    const computerCenter = computer.y + computer.height / 2;

    if (computerCenter < ball.y - 10) {
        computer.y += computer.speed;
    }

    if (computerCenter > ball.y + 10) {
        computer.y -= computer.speed;
    }

    computer.y = Math.max(
        0,
        Math.min(canvas.height - computer.height, computer.y)
    );
}

/* CHANGED: Increases the ball's horizontal speed */
function increaseBallSpeed() {
    const horizontalDirection = Math.sign(ball.speedX);

    ball.speedX =
        horizontalDirection *
        (Math.abs(ball.speedX) + ballHitSpeedIncrease);
}

function moveBall() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    if (
        ball.y - ball.radius <= 0 ||
        ball.y + ball.radius >= canvas.height
    ) {
        ball.speedY *= -1;
    }

    /* CHANGED: Player collision only triggers when ball is moving left */
    const hitPlayer =
        ball.speedX < 0 &&
        ball.x - ball.radius <= player.x + player.width &&
        ball.x > player.x &&
        ball.y >= player.y &&
        ball.y <= player.y + player.height;

    if (hitPlayer) {
        ball.x = player.x + player.width + ball.radius;
        ball.speedX = Math.abs(ball.speedX);

        /* CHANGED: Increase speed after player hits ball */
        increaseBallSpeed();
    }

    /* CHANGED: Computer collision only triggers when ball is moving right */
    const hitComputer =
        ball.speedX > 0 &&
        ball.x + ball.radius >= computer.x &&
        ball.x < computer.x + computer.width &&
        ball.y >= computer.y &&
        ball.y <= computer.y + computer.height;

    if (hitComputer) {
        ball.x = computer.x - ball.radius;
        ball.speedX = -Math.abs(ball.speedX);

        /* CHANGED: Increase speed after computer hits ball */
        increaseBallSpeed();
    }

    if (ball.x < 0) {
        computer.score++;
        updateScore();
        resetBall();
    }

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

    /* CHANGED: Resets horizontal speed to a normal starting speed */
    ball.speedX = ball.speedX > 0 ? -5 : 5;

    ball.speedY = Math.random() > 0.5 ? 4 : -4;
}

/* CHANGED: Resets the entire game */
function resetGame() {
    player.score = 0;
    computer.score = 0;

    player.y = canvas.height / 2 - player.height / 2;
    computer.y = canvas.height / 2 - computer.height / 2;

    ball.speedX = 5;
    ball.speedY = 4;

    updateScore();
    resetBall();
}

function update() {
    /* CHANGED: Game only updates after pressing START */
    if (!gameRunning) {
        return;
    }

    movePlayer();
    moveComputer();
    moveBall();
}

function draw() {
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

/* CHANGED: Initializes the starting scoreboard and animation */
updateScore();
gameLoop();