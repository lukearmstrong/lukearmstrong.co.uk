var canvas = document.getElementById("breakout");
var ctx = canvas.getContext("2d");

var x = canvas.width / 2;
var y = canvas.height - 30;
var ballRadius = 10;
var ballSpeed = 3;
var dx = ballSpeed;
var dy = -ballSpeed;

var paddleWidth = 75;
var paddleHeight = 10;
var paddleX = (canvas.width - paddleWidth) / 2;
var paddleY = (canvas.height - paddleHeight);
var paddleSpeed = 7;

var leftPressed = false;
var rightPressed = false;

var score = 0;
var lives = 3;

var isRunning = true;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricks = [];

for (col = 0; col < brickColumnCount; col++) {
	bricks[col] = [];

	for (row = 0; row < brickRowCount; row++) {
		bricks[col][row] = {
			x: (col * (brickWidth + brickPadding)) + brickOffsetLeft,
			y: (row * (brickHeight + brickPadding)) + brickOffsetTop,
			status: 1
		};
	}
}

function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

function drawBricks() {
	for (col = 0; col < brickColumnCount; col++) {
		for (row = 0; row < brickRowCount; row++) {
			if (bricks[col][row].status) {
				ctx.beginPath();
				ctx.rect(bricks[col][row].x, bricks[col][row].y, brickWidth, brickHeight);
				ctx.fillStyle = "#0095DD";
				ctx.fill();
				ctx.closePath;
			}
		}
	}
}

function collisionDetection() {
	for (col = 0; col < brickColumnCount; col++) {
		for (row = 0; row < brickRowCount; row++) {
			var brick = bricks[col][row];

			if (brick.status) {
				if (
					   x + ballRadius > brick.x               // The x position of the ball is greater than the x position of the brick.
					&& x - ballRadius < brick.x + brickWidth  // The x position of the ball is less than the x position of the brick plus its width.
					&& y + ballRadius > brick.y               // The y position of the ball is greater than the y position of the brick.
					&& y - ballRadius < brick.y + brickHeight // The y position of the ball is less than the y position of the brick plus its height.
				) {
					// Reverse vertical direction of ball.
					dy = -dy;

					// Mark brick as destroyed
					brick.status = 0;
					score++;
				}
			}
		}
	}
}

function drawScore() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawMessage(text) {
	ctx.font = "24px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.textAlign = "center";
	ctx.fillText(text, (canvas.width / 2), (canvas.height / 2));
}

function redraw() {
	// Clear on each frame
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	drawBall();
	drawPaddle();
	collisionDetection();
	drawBricks();
	drawScore();
	drawLives();
}


function run() {
	redraw();

	// Check if all bricks are destroyed
	if (score == brickRowCount * brickColumnCount) {
		drawMessage("YOU WIN, CONGRATULATIONS!");
		isRunning = false;
	}

	// Ball: Collision detection for left and right edges of canvas.
	if ((x + dx - ballRadius < 0) || (x + dx + ballRadius > canvas.width)) {
		// Reverse horizontal direction of ball.
		dx = -dx;
	}

	// Ball: Collision detection
	if (y + dy - ballRadius < 0) {
		// Top of canvas.
		dy = -dy;
	} else if (
		   y + dy + ballRadius + paddleHeight > canvas.height
		&& x > paddleX
		&& x < paddleX + paddleWidth
	) {
		// Paddle.
		dy = -dy;
	} else if (y + dy + ballRadius > canvas.height) {
		// Bottom of canvas.
		lives--;

		if (lives <= 0) {
			redraw();
			drawMessage("GAME OVER");
			isRunning = false;
		} else {
			x = canvas.width / 2;
			y = canvas.height - 30;
			dx = ballSpeed;
			dy = -ballSpeed;
			paddleX = (canvas.width - paddleWidth) / 2;
		}
	}

	// Paddle: Movement
	if (leftPressed && (paddleX > 0)) {
		// Move left until hitting left edge of canvas.
		paddleX -= paddleSpeed;
	} else if (rightPressed && (paddleX + paddleWidth < canvas.width)) {
		// Move right until hitting right edge of canvas.
		paddleX += paddleSpeed;
	}

	// Update Ball Position
	x += dx;
	y += dy;

	// Recursively Call Self
	if (isRunning) {
		requestAnimationFrame(run);
	}
}

// Bind Keyboard Controls
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
	if (e.keyCode == 37 || e.keyCode == 65) {
		// Left Arrow or A
		leftPressed = true;
	} else if (e.keyCode == 39 || e.keyCode == 68) {
		// Right Arrow or D
		rightPressed = true;
	}
}

function keyUpHandler(e) {
	if (e.keyCode == 37 || e.keyCode == 65) {
		// Left Arrow or A
		leftPressed = false;
	} else if (e.keyCode == 39 || e.keyCode == 68) {
		// Right Arrow or D
		rightPressed = false;
	}
}

// Bind Mouse Controls
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
	var relativeX = e.clientX - canvas.offsetLeft;

	if (relativeX > (paddleWidth / 2) && relativeX < (canvas.width - paddleWidth / 2)) {
		paddleX = relativeX - (paddleWidth / 2);
	}

	// Bug: When mouse gets thrown off the left side quickly, the paddle gets stuck.
	// Fix: Ensure paddle is moved to left hand side.
	if (relativeX <= 0) {
		paddleX = 0;
	}

	// Bug: When mouse gets thrown off the right side quickly, the paddle gets stuck.
	// Fix: Ensure paddle is moved to right hand side.
	if (relativeX >= canvas.width) {
		paddleX = canvas.width - paddleWidth;
	}
}

// Start
requestAnimationFrame(run);
