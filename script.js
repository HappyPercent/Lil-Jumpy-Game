document.querySelector('.start').addEventListener('click', (ev) => {
    ev.preventDefault();
    document.querySelector('.start').classList.add('hidden');
    document.querySelector('.crash').classList.add('hidden');
    startGame();
});
document.querySelector('.try-again').addEventListener('click', (ev) => {
    ev.preventDefault();
    document.querySelector('.start').classList.add('hidden');
    document.querySelector('.crash').classList.add('hidden');
    // debugger
    startGame();
});

const gameSpeed = 10; //ms one tick
const jumpAnimationSpeed = 500; //ms
const jumpHeight = 300; //px
const jumpDuration = 500; //ms
const obstacleMovingDistance = 6; //px per tick
const minDistanceBetweenObstacles = 350; //px
const distanceOfNewObstacleCreation = 600; //px
let jumpAvaliable = true;
let stopGame = false;

function startGame() {
    stopGame = false;
    document.querySelector('.score').innerHTML = 0;

    document.querySelectorAll('.obstacle').forEach(elem => {elem.parentNode.removeChild(elem)});
    let newObstacle = document.createElement('div');
    newObstacle.className = 'obstacle';
    document.querySelector('.container').append(newObstacle);

    document.addEventListener('keydown', jumpListener);
    let gameInProgress = setTimeout(function run() {
        gameTick();
        if(stopGame === true) {
            clearTimeout(gameInProgress);
        } else {
            setTimeout (run, gameSpeed);
        }
    }, gameSpeed)

}

function jumpListener(ev) {
    ev.preventDefault();
    if(ev.code == 'Space' && jumpAvaliable == true) {
        jumpAvaliable = false;
        document.querySelector('.player').style.transition = jumpAnimationSpeed/1000 + 's';
        document.querySelector('.player').style.bottom = jumpHeight + 'px';
        setTimeout(() => {
            document.querySelector('.player').style.bottom = '0px';
            setTimeout(() => {
                jumpAvaliable = true;
            }, jumpAnimationSpeed / 2);
        }, jumpDuration);
    }
}

function gameTick() {
    moveAllObstacles();
    createNewObstacles();
    checkForCrash();
}

function moveAllObstacles() {

    const currentScore = +document.querySelector('.score').innerHTML;
    const playerElem = document.querySelector('.player');
    const playerLeftX = playerElem.getBoundingClientRect().x;

    document.querySelectorAll('.obstacle').forEach((obstacle) => {
        const currentCoordinate = +String(obstacle.style.right).replace('px',"");
        const finalCoordonate = obstacleMovingDistance + currentCoordinate;
        const obstacleWidth = obstacle.offsetWidth;
        const windowWidth = document.querySelector('.container').offsetWidth;
        const obstacleCurrentRightX = obstacle.getBoundingClientRect().x + obstacleWidth;
        const obstacleFinalRightX = obstacleCurrentRightX - obstacleMovingDistance;

        obstacle.style.right = finalCoordonate + 'px';
        if(finalCoordonate > windowWidth + obstacleWidth) {
            obstacle.parentNode.removeChild(obstacle);
        }

        if(obstacleCurrentRightX > playerLeftX && obstacleFinalRightX <= playerLeftX) {
            document.querySelector('.score').innerHTML = currentScore + 1;
        }

    });
}

function createNewObstacles() {
    let lastObstacle;
    let minRight = +Infinity;

    document.querySelectorAll('.obstacle').forEach(elem => {
        let currentRight = +String(elem.style.right).replace('px',"");
        if(currentRight < minRight) {
            minRight = currentRight;
            lastObstacle = elem;
        }
    });

    if(minRight > minDistanceBetweenObstacles) {
        const newObstacle = document.createElement('div');
        newObstacle.className = 'obstacle';
        const newCoordinate = -Math.random() * distanceOfNewObstacleCreation;

        newObstacle.style.right = newCoordinate + 'px';

        document.querySelector('.container').append(newObstacle);
    }
}

function checkForCrash() {
    const playerElem = document.querySelector('.player');
    const playerRightX = playerElem.getBoundingClientRect().x + playerElem.getBoundingClientRect().width;
    const playerBottomY = playerElem.getBoundingClientRect().y + playerElem.getBoundingClientRect().height;
    const playerLeftX = playerElem.getBoundingClientRect().x;

    document.querySelectorAll('.obstacle').forEach(elem => {
        const obstacleRightX = elem.getBoundingClientRect().x + elem.getBoundingClientRect().width;
        const obstacleTopY = elem.getBoundingClientRect().y;
        const obstacleLeftX = elem.getBoundingClientRect().x;

        if(playerBottomY > obstacleTopY && ((playerRightX > obstacleLeftX && playerRightX < obstacleRightX) || (playerLeftX > obstacleLeftX && playerLeftX < obstacleRightX))) {
            document.removeEventListener('keydown', jumpListener);
            stopGame = true;
            document.querySelector('.crash').classList.remove('hidden');
        }
    })
}