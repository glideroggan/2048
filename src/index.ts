import boiler from './services/boilService'
import { Box } from './box'
import  * as manager from './manager'

window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed')
    console.log(boiler())
    startGame()
})

window.addEventListener('keyup', (event) => {
    manager.handleKey(event)
})

function startGame() {
    manager.createBoard()
    let arr = new Array()
    let box = manager.createBrick(0, 0)
    arr.push(box)
}


