import boiler from './services/boilService'
import  * as manager from './manager'

window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed')
    console.log(boiler())
    startGame()
})

window.addEventListener('keyup', (event) => {
    manager.handleKey(event)
    manager.render()
})

function startGame() {
    manager.createBoard()
    manager.startGame()
    manager.render()
}


