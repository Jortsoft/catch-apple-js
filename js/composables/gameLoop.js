let updateAnimTime = null
const update = () => {
    if (loseGame) return;

    objectMoveDown()
    catchApple()
    checkObjectOutside()
    updateAnimTime = window.requestAnimationFrame(update);
}