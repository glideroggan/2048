
/* BUG:
    - you can make more than one merge per turn
        This shouldn't be possible
        haven't been able to reproduce it
TODO:
    - Configure the static website (azure) to handle more than one?
    - need to not use flexbox, as the grid is set, we should always have 4x4
    - We need a way to know that it is game over
    - could be nicer if the new box fades in a bit after the rest, so it is more visible that this is 
        a new piece
*/

import { Board } from "./Board"

var board: Board
var alreadyMoving = false
export enum Direction {
    Up = 1,
    Down,
    Left,
    Right
}

export class Grid {
    public value: string
    // TODO: change to free and update usages
    public filled: boolean
    constructor(val?: string) {
        this.value = val
    }
    addBox(val: string) {
        this.filled = true
        this.value = val
    }
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
    }, 250)

    let direction = getDirection(key)
    if (direction == null) return;
    board.tilt(direction)
    spawnBlock(direction)
}

function assert(condition: unknown, message: string): asserts condition {
    if (!condition) throw new Error(message)
}

// TODO: refactor
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

            assert(freeSpaces.length > 0, "no free space")
            index = Math.floor(Math.random() * freeSpaces.length)
            board.createBrick(freeSpaces[index], board.maxY - 1)
            break
        case Direction.Down:
            for (let x = 0; x < board.maxX; x++) {
                if (!board.haveBlock(x, 0)) {
                    freeSpaces.push(x)
                }
            }

            assert(freeSpaces.length > 0, "no free space")
            index = Math.floor(Math.random() * freeSpaces.length)
            board.createBrick(freeSpaces[index], 0)
            break
        case Direction.Left:
            for (let y = 0; y < board.maxY; y++) {
                if (!board.haveBlock(board.maxX - 1, y)) {
                    freeSpaces.push(y)
                }
            }

            assert(freeSpaces.length > 0, "no free space")
            index = Math.floor(Math.random() * freeSpaces.length)
            board.createBrick(board.maxX - 1, freeSpaces[index])
            break
        case Direction.Right:
            for (let y = 0; y < board.maxY; y++) {
                if (!board.haveBlock(0, y)) {
                    freeSpaces.push(y)
                }
            }

            assert(freeSpaces.length > 0, "no free space")
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
    // TODO: reset merges?
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
    /* TODO: look into the board and put the blocks where
    they should be according to it 
    Should we re-create elements or just move them?
    re-create
        then we could just clear the area everytime and 
        create the elements in their correct spots
    move
        now we would need to know an id of the element that is
        connected with the actual box in the board and move that 
        one to the correct place, not that much work*/

    // re-create
    // clear
    let counter = 0
    for (let y = 0; y < board.maxY; y++) {
        for (let x = 0; x < board.maxX; x++) {
            const grid = document.getElementById(`grid${counter}`)
            while (grid.firstChild) {
                grid.removeChild(grid.firstChild)
            }
            counter++
        }
    }

    // add actual
    counter = 0
    for (let y = 0; y < board.maxY; y++) {
        for (let x = 0; x < board.maxX; x++) {
            const grid = document.getElementById(`grid${counter}`)
            assert(grid !== null, "couldn't find grid")
            const box = board.getBlock(x, y)
            if (box.filled) {
                let el = document.createElement('div')
                el.innerHTML = box.value
                const color = `val${box.value}`
                el.className = `block ${color}`
                grid.appendChild(el)
            }
            counter++
        }
    }
}

function getRandomDir(): Direction {
    const ar = [Direction.Up, Direction.Right, Direction.Down, Direction.Left]
    const i = Math.floor(Math.random() * 3)
    return ar[i]
}



