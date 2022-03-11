import { Box } from './box'

const maxX = 4, maxY = 4
var board = new Array()
var alreadyMoving = false
var lanes: HTMLDivElement[][] = []
enum Direction {
    Up = 1,
    Down,
    Left,
    Right
}

export function createBrick(x: number, y: number): Box {
    let i = y * maxX + x
    let container = document.getElementById(`grid${i}`)
    let boxEle = document.createElement('div')
    boxEle.className = 'block'
    boxEle.classList.add('move')
    boxEle.innerHTML = '1'
    boxEle.style.left = "0px"
    boxEle.style.top = "0px"
    container.appendChild(boxEle)
    let boundingRect = boxEle.getBoundingClientRect()
    // boxEle.style.left = `${boundingRect.left-15}px`
    // boxEle.style.top = `${boundingRect.top-15}px`
    let box = new Box(boxEle)
    return box
}

export function createBoard(): void {
    let container = document.getElementById('container')
    let counter = 0;

    for (let y = 0; y < maxY; y++) {
        lanes[y] = []
        for (let x = 0; x < maxX; x++) {
            let ele = document.createElement('div')
            ele.className = 'item'
            ele.id = `grid${counter}`
            board.push(ele)
            container.appendChild(ele)
            counter++
            lanes[y][x] = ele;
        }
    }
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
    switch (direction) {
        case Direction.Right:
            searchRight((x, y) => moveBlock(x, y, Direction.Right))
            spawnBlock(Direction.Right)
            break
        case Direction.Down:
            searchDown((x, y) => moveBlock(x, y, Direction.Down))
            spawnBlock(Direction.Down)
            break
        case Direction.Left:
            searchLeft((x, y) => moveBlock(x, y, Direction.Left))
            spawnBlock(Direction.Left)
            break
        case Direction.Up:
            searchUp((x, y) => moveBlock(x, y, Direction.Up))
            spawnBlock(Direction.Up)
            break
    }
}

function spawnBlock(dir: Direction): void {
    let freeSpaces = new Array()
    let index: number;
    switch (dir) {
        case Direction.Up:
            for (let x = 0; x < maxX; x++) {
                if (lanes[maxY - 1][x].children.length === 0) {
                    freeSpaces.push(x)
                }
            }

            index = Math.floor(Math.random() * freeSpaces.length)
            createBrick(freeSpaces[index], maxY - 1)
            break
        case Direction.Down:
            for (let x = 0; x < maxX; x++) {
                if (lanes[0][x].children.length === 0) {
                    freeSpaces.push(x)
                }
            }

            index = Math.floor(Math.random() * freeSpaces.length)
            createBrick(freeSpaces[index], 0)
            break
        case Direction.Left:
            for (let y = 0; y < maxY; y++) {
                if (lanes[y][maxX - 1].children.length === 0) {
                    freeSpaces.push(y)
                }
            }

            index = Math.floor(Math.random() * freeSpaces.length)
            createBrick(maxX - 1, freeSpaces[index])
            break
        case Direction.Right:
            for (let y = 0; y < maxY; y++) {
                if (lanes[y][0].children.length === 0) {
                    freeSpaces.push(y)
                }
            }

            index = Math.floor(Math.random() * freeSpaces.length)
            createBrick(0, freeSpaces[index])
            break
    }


}

function searchRight(fn: (x: number, y: number) => void) {
    for (let y = maxY - 1; y >= 0; y--) {
        for (let x = maxX - 2; x >= 0; x--) {
            if (lanes[y][x].children.length > 0) {
                fn(x, y)
            }
        }
    }
}

function searchLeft(fn: (x: number, y: number) => void) {
    for (let y = maxY - 1; y >= 0; y--) {
        for (let x = 1; x < maxX; x++) {
            if (lanes[y][x].children.length > 0) {
                fn(x, y)
            }
        }
    }
}

function searchDown(fn: (x: number, y: number) => void) {
    for (let x = maxX - 1; x >= 0; x--) {
        for (let y = maxY - 2; y >= 0; y--) {
            if (lanes[y][x].children.length > 0) {
                fn(x, y)
            }
        }
    }
}

function searchUp(fn: (x: number, y: number) => void) {
    for (let x = maxX - 1; x >= 0; x--) {
        for (let y = 1; y < maxY; y++) {
            if (lanes[y][x].children.length > 0) {
                fn(x, y)
            }
        }
    }
}

function moveBlock(x: number, y: number, dir: Direction) {
    /* take block in x, y and move it over to next cell in the direction
    */
    let el = lanes[y][x].firstChild as HTMLDivElement
    let destGrid: HTMLDivElement
    const ti = 900;
    let boundingRect: DOMRect
    switch (dir) {
        case Direction.Right:
            for (let x2 = maxX - 1; x2 >= x; x2--) {
                let d = lanes[y][x2] as HTMLDivElement
                if (d.children.length > 0) {
                    continue
                }
                destGrid = d
                break
            }
            if (destGrid == null) return
            if (true) {
                destGrid.appendChild(el)
            } else {
                boundingRect = destGrid.getBoundingClientRect()
                el.style.left = `${boundingRect.left - 15}px`
                setTimeout(() => {
                    destGrid.appendChild(el)
                }, ti)
            }

            break
        case Direction.Down:
            for (let y2 = maxY - 1; y2 >= y; y2--) {
                let d = lanes[y2][x] as HTMLDivElement
                if (d.children.length > 0) {
                    continue
                }
                destGrid = d
                break
            }
            if (destGrid == null) return
            if (true) {
                destGrid.appendChild(el)
            } else {
                boundingRect = destGrid.getBoundingClientRect()
                el.style.top = `${boundingRect.top - 15}px`
                setTimeout(() => {
                    destGrid.appendChild(el)
                }, ti)
            }

            break
        case Direction.Up:
            for (let y2 = 0; y2 <= y; y2++) {
                let d = lanes[y2][x] as HTMLDivElement
                if (d.children.length > 0) {
                    continue
                }
                destGrid = d
                break
            }
            if (destGrid == null) return
            if (true) {
                destGrid.appendChild(el)
            } else {
                boundingRect = destGrid.getBoundingClientRect()
                el.style.top = `${boundingRect.top - 15}px`
                setTimeout(() => {
                    destGrid.appendChild(el)
                }, ti)
            }

            break
        case Direction.Left:
            for (let x2 = 0; x2 <= x; x2++) {
                let d = lanes[y][x2] as HTMLDivElement
                if (d.children.length > 0) {
                    continue
                }
                destGrid = d
                break
            }
            if (destGrid == null) return
            if (true) {
                destGrid.appendChild(el)
            } else {
                boundingRect = destGrid.getBoundingClientRect()
                el.style.left = `${boundingRect.left - 15}px`
                setTimeout(() => {
                    destGrid.appendChild(el)
                }, ti)
            }

            break
    }

    // TODO: we want this to animate
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