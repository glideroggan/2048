
/* BUG:
    - you can make more than one merge per turn
        This shouldn't be possible
        haven't been able to reproduce it
TODO:
    - Configure the static website (azure) to handle more than one?
    - need to not use flexbox, as the grid is set, we should always have 4x4
    - responsive
*/

import { Board } from "./Board"

var board: Board
var alreadyMoving: boolean = false
export var isGameOver: boolean = false
export enum Direction {
    Up = 1,
    Down,
    Left,
    Right
}

export function createBoard(): void {
    board = new Board(4, 4)
}

export function handleKey(event: any) {
    let key = event.keyCode
    if (alreadyMoving) return
    alreadyMoving = true

    setTimeout(() => {
        alreadyMoving = false
    }, 500)

    let direction = getDirection(key)
    if (direction == null) return;
    board.tilt(direction)
    spawnBlock(direction)
    if (board.noMovesLeft()) isGameOver = true
}

function assert(condition: unknown, message: string): asserts condition {
    if (!condition) throw new Error(message)
}

function spawnBlock(dir: Direction): void {
    let freeSpaces = new Array()
    let index: number;
    switch (dir) {
        case Direction.Up:
            for (let x = 0; x < board.maxX; x++) {
                if (!board.haveBlock(x, board.maxY - 1)) {
                    freeSpaces.push(x)
                }
            }

            if (freeSpaces.length == 0) {
                console.log('no moves Up')
                return
            }
            index = Math.floor(Math.random() * freeSpaces.length)
            board.createBrick(freeSpaces[index], board.maxY - 1)
            break
        case Direction.Down:
            for (let x = 0; x < board.maxX; x++) {
                if (!board.haveBlock(x, 0)) {
                    freeSpaces.push(x)
                }
            }

            if (freeSpaces.length == 0) {
                console.log('no moves Down')
                return
            }
            index = Math.floor(Math.random() * freeSpaces.length)
            board.createBrick(freeSpaces[index], 0)
            break
        case Direction.Left:
            for (let y = 0; y < board.maxY; y++) {
                if (!board.haveBlock(board.maxX - 1, y)) {
                    freeSpaces.push(y)
                }
            }

            if (freeSpaces.length == 0) {
                console.log('no moves Left')
                return
            }
            index = Math.floor(Math.random() * freeSpaces.length)
            board.createBrick(board.maxX - 1, freeSpaces[index])
            break
        case Direction.Right:
            for (let y = 0; y < board.maxY; y++) {
                if (!board.haveBlock(0, y)) {
                    freeSpaces.push(y)
                }
            }

            if (freeSpaces.length == 0) {
                console.log('no moves Right')
                return
            }
            index = Math.floor(Math.random() * freeSpaces.length)
            board.createBrick(0, freeSpaces[index])
            break
    }
}

function getDirection(keyNum: number): Direction {
    switch (keyNum) {
        case 37: return Direction.Left
        case 38: return Direction.Up
        case 39: return Direction.Right
        case 40: return Direction.Down
    }
    return null
}

export function startGame() {
    let dir = getRandomDir()
    spawnBlock(dir)
}

export function render() {
    let c = document.getElementById('grid0')
    const container = document.getElementById('container')
    if (c === null) {
        // create html
        let counter = 0
        for (let y = 0; y < board.maxY; y++) {
            for (let x = 0; x < board.maxX; x++) {
                let el = document.createElement('div')
                el.className = 'item'
                el.id = `grid${counter}`
                container.appendChild(el)
                counter++
            }
        }
    }

    /* Add all boxes on the same place <body>
    they will have position absolute, and will instead <transform> to the correct place */
    for (let y = 0; y < board.maxY; y++) {
        for (let x = 0; x < board.maxX; x++) {
            const grid = board.getBlock(x, y)
            if (!grid.filled) continue
            // ok, we got a box, lets find it in the html
            const box = document.getElementById(`box${grid.Id}`)
            const i = y * board.maxX + x
            let htmlGrid = document.getElementById(`grid${i}`)
            if (box === null) continue

            box.style.left = `${htmlGrid.offsetLeft}px`
            box.style.top = `${htmlGrid.offsetTop}px`
            box.innerHTML = grid.value
            box.className = `block val${parseInt(grid.value)}`
        }
    }

    // remove box that have been deleted in game
    for (const deleteItem of board.deleteIds) {
        const deleteBox = document.getElementById(`box${deleteItem.id}`)
        const parent = deleteBox.parentNode as HTMLElement
        parent.removeChild(deleteBox)
    }
    board.deleteIds.length = 0

    // here we should add all new boxes
    setTimeout(() => {
        for (let y = 0; y < board.maxY; y++) {
            for (let x = 0; x < board.maxX; x++) {
                const grid = board.getBlock(x, y)
                if (!grid.filled) continue
                const box = document.getElementById(`box${grid.Id}`)
                const i = y * board.maxX + x
                let htmlGrid = document.getElementById(`grid${i}`)
                if (box === null) {
                    // if not found, lets create it with this id
                    const el = document.createElement('div')
                    el.id = `box${grid.Id}`
                    el.innerHTML = grid.value
                    el.className = `block val${parseInt(grid.value)}`
                    el.style.left = `${htmlGrid.offsetLeft}px`
                    el.style.top = `${htmlGrid.offsetTop}px`
    
                    document.body.insertBefore(el, container)
                }
            }
        }    
    }, 500);
}

function getRandomDir(): Direction {
    const ar = [Direction.Up, Direction.Right, Direction.Down, Direction.Left]
    const i = Math.floor(Math.random() * 3)
    return ar[i]
}



