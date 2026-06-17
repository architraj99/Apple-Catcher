const field = document.getElementById("field");
const bucket = document.getElementById("bucket");
const scoreEl = document.getElementById("score");

const game = {
    score:0,
    bucketX:window.innerWidth / 2,
    apples:[]
};

bucket.style.left = `${game.bucketX}px`;

function createApple(){

    const node = document.createElement("div");
    node.className = "apple";

    const apple = {
        node,
        x:Math.random() * (window.innerWidth - 40),
        y:-40,
        speed:3
    };

    node.style.left = `${apple.x}px`;
    field.appendChild(node);
    game.apples.push(apple);
}

function updateApples(){

    const bucketRect = bucket.getBoundingClientRect();

    game.apples = game.apples.filter(apple => {

        apple.y += apple.speed;
        apple.node.style.top = `${apple.y}px`;
        const rect = apple.node.getBoundingClientRect();

        const caught =
            rect.bottom > bucketRect.top &&
            rect.left < bucketRect.right &&
            rect.right > bucketRect.left;

        if(caught){

            game.score++;
            scoreEl.textContent = game.score;

            apple.node.remove();
            return false;
        }

        if(apple.y > window.innerHeight){

            apple.node.remove();
            return false;
        }
        return true;
    });
}

const keys = new Set();

window.addEventListener("keydown", e => keys.add(e.key));
window.addEventListener("keyup", e => keys.delete(e.key));

function moveBucket(){

    if(keys.has("ArrowLeft")){
        game.bucketX -= 8;
    }

    if(keys.has("ArrowRight")){
        game.bucketX += 8;
    }

    const limit = window.innerWidth - bucket.offsetWidth;
    game.bucketX = Math.max(0, Math.min(limit, game.bucketX));
    bucket.style.left = `${game.bucketX}px`;

    requestAnimationFrame(moveBucket);
}

function loop(){

    updateApples();
    requestAnimationFrame(loop);
}

setInterval(createApple, 900);

moveBucket();
loop();