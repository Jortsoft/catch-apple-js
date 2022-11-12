// Define DOM elements
const domElems = {
    GameScene: document.querySelector('.game'),
    Basket: document.querySelector('.basket'),
    healthCont: document.querySelector('.hearth-cont'),
    Score: document.querySelector('.score'),
    loseText: document.querySelector('.lose-text'),
    scoreAudio: document.querySelector('.score-up'),
    missAudio: document.querySelector('.miss'),
    enableAudio: document.querySelector('.enable-audio'),
    gameOverAudio: document.querySelector('.game-over'),
    bgMusic: document.querySelector('.bg-music')
}

// Define global variables
const styleRoot = document.querySelector(':root')
const gameWidth = domElems.GameScene.getBoundingClientRect().width
const gameHeight = domElems.GameScene.getBoundingClientRect().height
let maxHealth = 3
let objectIntervalVal = null
let updateAnimTime = null
let moveObjects = []
let objectGenerateInterval = 1000
let generatedObjectCounter = 0
let score = 0
let globalSpeed = 2
let loseGame = false

// Control css variables
const setStyleProperty = (variable, value) => {
    styleRoot.style.setProperty(variable, value)
}
const getStyleProperty = (variable) => {
    return parseFloat(getComputedStyle(styleRoot).getPropertyValue(variable))

}

// Create function runs once
const defData = () => {
    goAudio(domElems.bgMusic)
    generateHealth()
    moseMove()
}

// Game Loop
const update = () => {
    if (loseGame) return;

    objectMoveDown()
    catchApple()
    checkObjectOutside()
    updateAnimTime = window.requestAnimationFrame(update);
}

// Custom functions
const moseMove = () => {
    // All mouse events here
    domElems.GameScene.addEventListener('mousemove', (e) => {
        if (loseGame) return;
        const OffsetX = e.offsetX - (domElems.Basket.getBoundingClientRect().width / 2)
        setStyleProperty('--basketLeft', `${OffsetX}px`)
    })
}
const generateHealth = () => {
    // Generate health system
    for (let i = 0; i < maxHealth; i++) {
        const elem = document.createElement('img')
        elem.setAttribute('src', './assets/images/hearth.png')
        domElems.healthCont.appendChild(elem)
    }
}
const generateApple = (id) => {
    // Generate apples
    const elem = document.createElement('img')
    elem.setAttribute('src', './assets/images/apple.png')
    elem.classList.add('apple')
    elem.classList.add(`_${id}`)
    elem.style.left = `${Math.floor(Math.random() * (gameWidth - (moveObjects[0]?.elem?.getBoundingClientRect().width + 100)))}px`
    domElems.GameScene.appendChild(elem)
    const elemObj = {
        y: -90,
        speed: globalSpeed,
        elem: elem,
        id: id
    }
    moveObjects.push(elemObj)
}
const objectMoveDown = () => {
    // Move apples
    moveObjects?.forEach((item) => {
        item.y += item.speed
        if (document.querySelector(`.apple.${item.elem.classList[1]}`)) document.querySelector(`.apple.${item.elem.classList[1]}`).style.top = `${item.y}px`
    })
}
const addObject = () => {
    // Show objects randomly
    clearInterval(objectIntervalVal)
    objectIntervalVal = window.setInterval(() => {
        if (loseGame) return
        generatedObjectCounter++
        generateApple(generatedObjectCounter)
        console.log(objectGenerateInterval)
    }, objectGenerateInterval)
}
const checkObjectOutside = () => {
    // Delete object when it outside
    moveObjects?.forEach((item) => {
        if (item.y > gameHeight) {
            deleteObject(item)
        }
    })
}
const catchApple = () => {
    // Catch appl events here
    moveObjects?.forEach((item) => {
        if (collision(item.elem.getBoundingClientRect(), domElems.Basket.getBoundingClientRect())) {
            item.elem?.remove()
            moveObjects = moveObjects?.filter((apple) => apple.id !== item.id)
            addScore()
        }
    })
}
const deleteObject = (item) => {
    // Delete DOM element
    item.elem?.remove()
    moveObjects = moveObjects?.filter((apple) => apple.id !== item.id)
    minusHealth()
}
const collision = (rect1, rect2) => {
    if (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y) {
        return true
    } else {
        return false
    }
}
const addScore = () => {
    if (score % 10 === 0) {
        addDifficult()
    }
    score++
    goAudio(domElems.scoreAudio)
    domElems.Score.textContent = `Score ${score}`
}
const minusHealth = () => {
    maxHealth--
    goAudio(domElems.missAudio)
    document.querySelectorAll('.hearth-cont img')[maxHealth]?.remove()
    if (maxHealth <= 0) {
        gameOver()
        return;
    }
}
const addDifficult = () => {
    if (objectGenerateInterval <= 100) objectGenerateInterval = 1000
    objectGenerateInterval -= 100
    globalSpeed += 1
    addObject()
}
const gameOver = () => {
    window.cancelAnimationFrame(updateAnimTime)
    window.clearInterval(objectIntervalVal)
    loseGame = true
    domElems.loseText.classList.add('show')
    goAudio(domElems.gameOverAudio)
    domElems.bgMusic.pause()
}
const goAudio = (audio) => {
    audio.currentTime = 0;
    audio.play()
}
domElems.enableAudio.addEventListener('click', () => {
    // Audio controller
    goAudio(domElems.bgMusic)
    domElems.enableAudio.style.display = 'none'
})

defData()
window.requestAnimationFrame(update);
addObject()

