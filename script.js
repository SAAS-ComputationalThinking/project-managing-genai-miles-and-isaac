<script>
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const bird = {
        x: 50,
        y: canvas.height / 2,
        radius: 20,
        velocityY: 0,
        gravity: 0.5
    };

    const gravity = 0.3;
    const jumpStrength = -8;
    const pipeGap = 150;
    const pipeWidth = 50;
    const pipeSpeed = 2;
    let score = 0;

    let pipes = [];

    function drawBird() {
        ctx.beginPath();
        ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.closePath();
    }

    function drawPipe(pipeX, pipeY, topPipeHeight) {
        ctx.fillStyle = "green";
        ctx.fillRect(pipeX, pipeY, pipeWidth, topPipeHeight);
        ctx.fillRect(pipeX, pipeY + topPipeHeight + pipeGap, pipeWidth, canvas.height - topPipeHeight - pipeGap);
    }

    function drawScore() {
        ctx.font = "24px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("Score: " + score, 10, 30);
    }

    function collisionDetection(pipe) {
        if (
            bird.x + bird.radius > pipe.x &&
            bird.x - bird.radius < pipe.x + pipeWidth &&
            (bird.y - bird.radius < pipe.topPipeHeight ||
                bird.y + bird.radius > pipe.topPipeHeight + pipeGap)
        ) {
            return true;
        }
        return false;
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        bird.velocityY += bird.gravity;
        bird.y += bird.velocityY;

        if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0) {
            gameOver();
        }

        if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
            createPipe();
        }

        for (let i = 0; i < pipes.length; i++) {
            const pipe = pipes[i];
            pipe.x -= pipeSpeed;

            drawPipe(pipe.x, 0, pipe.topPipeHeight);
            drawPipe(pipe.x, pipe.topPipeHeight + pipeGap, canvas.height - pipe.topPipeHeight - pipeGap);

            if (collisionDetection(pipe)) {
                gameOver();
            }

            if (pipe.x + pipeWidth < bird.x && !pipe.passed) {
                pipe.passed = true;
                score++;
            }

            if (pipe.x + pipeWidth < 0) {
                pipes.splice(i, 1);
                i--;
            }
        }

        drawBird();
        drawScore();

        requestAnimationFrame(update);
    }

    function createPipe() {
        const topPipeHeight = Math.random() * (canvas.height - pipeGap - 100) + 50;
        pipes.push({ x: canvas.width, topPipeHeight: topPipeHeight, passed: false });
    }

    function jump() {
        bird.velocityY = jumpStrength;
    }

    function gameOver() {
        alert("Game Over! Your score: " + score);
        pipes = [];
        score = 0;
        bird.y = canvas.height / 2;
        bird.velocityY = 0;
    }

    document.addEventListener("keydown", function (event) {
        if (event.code === "Space") {
            jump();
        }
    });

    update();
</script>
</body>
</html>