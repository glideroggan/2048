
/* TODO:
    - need to not use flexbox, as the grid is set, we should always have 4x4
    - We need a way to know that it is game over
    - could be nicer if the new box fades in a bit after the rest, so it is more visible that this is 
        a new piece
*/

var board: Board
var alreadyMoving = false
enum Direction {
    Up = 1,
    Down,
    Left,
    Right
}

class Board {
    public maxX: number
    public maxY: number
    private lanes: Grid[][] = []
    constructor(maxX: number, maxY: number) {
        this.maxX = maxX
        this.maxY = maxY

        for (let y = 0; y < this.maxY; y++) {
            this.lanes[y] = []
            for (let x = 0; x < this.maxX; x++) {
                this.lanes[y][x] = new Grid()
            }
        }
    }
    public haveBlock(x: number, y: number): boolean {
        return this.lanes[y][x].filled
    }
    public getBlock(x: number, y: number): Grid {
        return this.lanes[y][x]
    }
    public createBrick(x: number, y: number): void {
        this.lanes[y][x].addBox("1")
    }
    getFreeSpaceAndAddBox(x: number, y: number, direction: Direction) {
        if (this.lanes[y][x].filled) {
            const myVal = parseInt(this.lanes[y][x].value)
            const res = this.getFreeSpaceOrSameValueBox(direction, x, y, myVal)
            if (res.free) {
                res.grid.addBox(this.lanes[y][x].value)
                this.lanes[y][x].filled = false
            }
            if (!res.free && res.grid !== null && parseInt(res.grid.value) === myVal) {
                // merge
                res.grid.addBox(`${myVal*2}`)
                this.lanes[y][x].filled = false
            }
        }
    }
    getFreeSpaceOrSameValueBox(direction: Direction, x: number, y: number, val:number): {free:boolean, grid:Grid} {
        let res: {free:boolean, grid:Grid} = {free:false, grid:null}
        switch (direction) {
            case Direction.Right:
                for (let x2 = x+1; x2 < this.maxX; x2++) {
                    const grid = this.getBlock(x2, y)
                    if (grid.filled && parseInt(grid.value) === val) {
                        // same value, merge
                        return {free:false, grid}
                    }
                    if (!grid.filled) {
                        res = { free:true, grid }
                        continue
                    }
                    break
                }
                break
            case Direction.Left:
                for (let x2 = x-1; x2 >= 0; x2--) {
                    const grid = this.getBlock(x2, y)
                    if (grid.filled && parseInt(grid.value) === val) {
                        // same value, merge
                        return {free:false, grid}
                    }
                    if (!grid.filled) {
                        res = { free:true, grid }
                        continue
                    }
                    break
                }
                break
            case Direction.Up:
                for (let y2 = y-1; y2 >= 0; y2--) {
                    const grid = this.getBlock(x, y2)
                    if (grid.filled && parseInt(grid.value) === val) {
                        // same value, merge
                        return {free:false, grid}
                    }
                    if (!grid.filled) {
                        res = { free:true, grid }
                        continue
                    }
                    break
                }
                break
            case Direction.Down:
                for (let y2 = y+1; y2 < this.maxY; y2++) {
                    const grid = this.getBlock(x, y2)
                    if (grid.filled && parseInt(grid.value) === val) {
                        // same value, merge
                        return {free:false, grid}
                    }
                    if (!grid.filled) {
                        res = { free:true, grid }
                        continue
                    }
                    break
                }
                break
        }
        return res
    }
    public tilt(direction: Direction) {
        switch (direction) {
            case Direction.Right:
                for (let y = this.maxY - 1; y >= 0; y--) {
                    for (let x = this.maxX - 2; x >= 0; x--) {
                        this.getFreeSpaceAndAddBox(x, y, direction)
                    }
                }
                break
            case Direction.Left:
                for (let y = this.maxY - 1; y >= 0; y--) {
                    for (let x = 1; x < this.maxX; x++) {
                        this.getFreeSpaceAndAddBox(x, y, direction)
                    }
                }
                break
            case Direction.Up:
                for (let x = this.maxX - 1; x >= 0; x--) {
                    for (let y = 1; y < this.maxY; y++) {
                        this.getFreeSpaceAndAddBox(x, y, direction)
                    }
                }
                break
            case Direction.Down:
                for (let x = this.maxX - 1; x >= 0; x--) {
                    for (let y = this.maxY - 2; y >= 0; y--) {
                        this.getFreeSpaceAndAddBox(x, y, direction)
                    }
                }
                break
        }


    }
    getFreeSpace(direction: Direction, x: number, y: number): { x: number, y: number } | null {
        switch (direction) {
            case Direction.Right:
                for (let x2 = this.maxX - 1; x2 >= x; x2--) {
                    if (!this.haveBlock(x2, y)) return { x: x2, y }
                }
                break
            case Direction.Left:
                for (let x2 = 0; x2 < this.maxX; x2++) {
                    if (!this.haveBlock(x2, y)) return { x: x2, y }
                }
                break
            case Direction.Up:
                for (let y2 = 0; y2 < this.maxY; y2++) {
                    if (!this.haveBlock(x, y2)) return { x: x, y:y2 }
                }
                break
            case Direction.Down:
                for (let y2 = this.maxY-1; y2 >= 0; y2--) {
                    if (!this.haveBlock(x, y2)) return { x: x, y:y2 }
                }
                break
        }
        return null
    }
}

class Grid {
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

// function searchLeft(fn: (x: number, y: number) => void) {

// }

// function searchDown(fn: (x: number, y: number) => void) {

// }

// function searchUp(fn: (x: number, y: number) => void) {
//     for (let x = maxX - 1; x >= 0; x--) {
//         for (let y = 1; y < maxY; y++) {
//             if (lanes[y][x].children.length > 0) {
//                 fn(x, y)
//             }
//         }
//     }
// }

// function moveBlock(x: number, y: number, dir: Direction) {
//     /* take block in x, y and move it over to next cell in the direction
//     */
//     let el = lanes[y][x].firstChild as HTMLDivElement
//     let destGrid: HTMLDivElement
//     const ti = 900;
//     let boundingRect: DOMRect
//     switch (dir) {
//         // TODO: add merging of blocks
//         case Direction.Right:
//             for (let x2 = maxX - 1; x2 >= x; x2--) {
//                 let d = lanes[y][x2] as HTMLDivElement
//                 if (d.children.length > 0) {
//                     continue
//                 }
//                 destGrid = d
//                 break
//             }
//             if (destGrid == null) return
//             if (true) {
//                 destGrid.appendChild(el)
//             } else {
//                 boundingRect = destGrid.getBoundingClientRect()
//                 el.style.left = `${boundingRect.left - 15}px`
//                 setTimeout(() => {
//                     destGrid.appendChild(el)
//                 }, ti)
//             }

//             break
//         case Direction.Down:
//             for (let y2 = maxY - 1; y2 >= y; y2--) {
//                 let d = lanes[y2][x] as HTMLDivElement
//                 if (d.children.length > 0) {
//                     continue
//                 }
//                 destGrid = d
//                 break
//             }
//             if (destGrid == null) return
//             if (true) {
//                 destGrid.appendChild(el)
//             } else {
//                 boundingRect = destGrid.getBoundingClientRect()
//                 el.style.top = `${boundingRect.top - 15}px`
//                 setTimeout(() => {
//                     destGrid.appendChild(el)
//                 }, ti)
//             }

//             break
//         case Direction.Up:
//             for (let y2 = 0; y2 <= y; y2++) {
//                 let d = lanes[y2][x] as HTMLDivElement
//                 if (d.children.length > 0) {
//                     continue
//                 }
//                 destGrid = d
//                 break
//             }
//             if (destGrid == null) return
//             if (true) {
//                 destGrid.appendChild(el)
//             } else {
//                 boundingRect = destGrid.getBoundingClientRect()
//                 el.style.top = `${boundingRect.top - 15}px`
//                 setTimeout(() => {
//                     destGrid.appendChild(el)
//                 }, ti)
//             }

//             break
//         case Direction.Left:
//             for (let x2 = 0; x2 <= x; x2++) {
//                 let d = lanes[y][x2] as HTMLDivElement
//                 if (d.children.length > 0) {
//                     continue
//                 }
//                 destGrid = d
//                 break
//             }
//             if (destGrid == null) return
//             if (true) {
//                 destGrid.appendChild(el)
//             } else {
//                 boundingRect = destGrid.getBoundingClientRect()
//                 el.style.left = `${boundingRect.left - 15}px`
//                 setTimeout(() => {
//                     destGrid.appendChild(el)
//                 }, ti)
//             }

//             break
//     }

//     // TODO: we want this to animate
// }


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



