import boiler from './services/boilService'
import  * as manager from './manager'

window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed')
    console.log(boiler())
    startGame()
})

window.addEventListener('keyup', (event) => {
    if (!manager.isGameOver) {
        manager.handleKey(event)
        manager.render()
    } else {
        // TODO: only handle the restart key
        const container = document.body
        let el = document.createElement('div')
        el.innerHTML = 'Game Over'
        el.className = 'gameover'
        container.appendChild(el)
        console.log('gameOver')
    }
})

function startGame() {
    manager.createBoard()
    manager.startGame()
    manager.render()
}


