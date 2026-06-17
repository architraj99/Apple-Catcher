const field = document.getElementById("field");
const bucket = document.getElementById("bucket");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const bestEl = document.getElementById("best");

const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOver");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const finalScore = document.getElementById("finalScore");

const game = {
    score:0,
    lives:3,
    speed:2,
    bucketX:0,
    apples:[],
    running:false,
    paused:false
};

let best = Number(localStorage.getItem("apple-best")) || 0;
bestEl.textContent = best;

function createApple() {

    const node = document.createElement("div");

    const golden = Math.random() < 0.12;

    node.className = golden ? "apple golden" : "apple";

    const apple = {
        node,
        x: Math.random() * (window.innerWidth - 40),
        y: -40,
        speed: game.speed + Math.random() * 2,
        value: golden ? 5 : 1
    };

    node.style.left = `${apple.x}px`;

    field.appendChild(node);
    game.apples.push(apple);
}

function updateApples() {

    const bucketRect = bucket.getBoundingClientRect();

    game.apples = game.apples.filter(apple => {

        apple.y += apple.speed;
        apple.node.style.top = `${apple.y}px`;

        const rect = apple.node.getBoundingClientRect();

        const caught =
            rect.bottom > bucketRect.top &&
            rect.left < bucketRect.right &&
            rect.right > bucketRect.left;

        if (caught) {

            game.score += apple.value;
            scoreEl.textContent = game.score;
            apple.node.remove();
            return false;
        }

        if (apple.y > window.innerHeight) {

            game.lives--;
            livesEl.textContent = game.lives;
            apple.node.remove();

            if (game.lives <= 0) {
                finishGame();
            }
            return false;
        }

        return true;
    });
}

function finishGame() {

    game.running = false;
    finalScore.textContent = game.score;

    if (game.score > best) {
        best = game.score;
        localStorage.setItem("apple-best", best);
        bestEl.textContent = best;
    }

    gameOverScreen.classList.remove("hidden");
}

function loop() {

    if (game.running && !game.paused) {
        updateApples();
    }

    requestAnimationFrame(loop);
}

setInterval(() => {

    if (!game.running || game.paused) return;

    createApple();
}, 800);

setInterval(() => {

    if (game.running) {
        game.speed += 0.15;
    }

}, 6000);

const keys = new Set();

window.addEventListener("keydown", e => {

    keys.add(e.key);

    if (e.code === "Space") {
        game.paused = !game.paused;
    }
});

window.addEventListener("keyup", e => {
    keys.delete(e.key);
});

function moveBucket() {

    if (!game.running) {
        requestAnimationFrame(moveBucket);
        return;
    }

    if (keys.has("ArrowLeft")) {
        game.bucketX -= 8;
    }

    if (keys.has("ArrowRight")) {
        game.bucketX += 8;
    }

    const limit = window.innerWidth - bucket.offsetWidth;

    game.bucketX = Math.max(0, Math.min(limit, game.bucketX));
    bucket.style.left = `${game.bucketX}px`;

    requestAnimationFrame(moveBucket);
}

field.addEventListener("mousemove", e => {

    if (!game.running) return;

    game.bucketX = e.clientX - bucket.offsetWidth / 2;
});

function startGame() {

    game.score = 0;
    game.lives = 3;
    game.speed = 2;

    scoreEl.textContent = 0;
    livesEl.textContent = 3;

    game.apples.forEach(apple => apple.node.remove());
    game.apples = [];

    game.bucketX = window.innerWidth / 2 - bucket.offsetWidth / 2;
    bucket.style.left = `${game.bucketX}px`;

    game.running = true;
    game.paused = false;
    startScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");
}

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);

loop();
moveBucket();