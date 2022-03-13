import { Direction } from "./manager";
import { Grid } from "./Grid";

export class Board {
    public maxX: number
    public maxY: number
    public deleteIds: Array<{id:number, x:number, y:number}> = new Array<{id:number, x:number, y:number}>()
    private ids: Array<number> = new Array<number>()
    private lanes: Grid[][] = [];
    constructor(maxX: number, maxY: number) {
        this.maxX = maxX;
        this.maxY = maxY;

        for (let y = 0; y < this.maxY; y++) {
            this.lanes[y] = [];
            for (let x = 0; x < this.maxX; x++) {
                this.lanes[y][x] = new Grid();
            }
        }
    }
    public noMovesLeft(): boolean {
        const dir = [Direction.Left, Direction.Up, Direction.Right, Direction.Down]
        for (let y = 0; y < this.maxY; y++) {
            for (let x = 0; x < this.maxX; x++) {
                for (let d of dir) {
                    const box = this.getBlock(x, y)
                    if (!box.filled) return false
                    const res = this.getFreeSpaceOrSameValueBox(d, x, y, parseInt(box.value))
                    if (res.free || res.grid != null) return false
                }
            }
        }
        return true
    }
    public haveBlock(x: number, y: number): boolean {
        return this.lanes[y][x].filled;
    }
    public getBlock(x: number, y: number): Grid {
        return this.lanes[y][x];
    }
    public createBrick(x: number, y: number): void {
        // create new brick, keep track of id, so that we can track it in the renderer
        const id = this.lanes[y][x].addBox("1");
        this.ids.push(id)
    }
    getFreeSpaceAndAddBox(x: number, y: number, direction: Direction) {
        if (this.lanes[y][x].filled) {
            const myVal = parseInt(this.lanes[y][x].value);
            const res = this.getFreeSpaceOrSameValueBox(direction, x, y, myVal);
            if (res.free) {
                res.grid.addBox(this.lanes[y][x].value, this.lanes[y][x].Id);
                this.lanes[y][x].filled = false;
            }
            if (!res.free && res.grid !== null && parseInt(res.grid.value) === myVal) {
                // merge
                res.grid.addBox(`${myVal * 2}`, res.grid.Id);

                this.deleteIds.push({id:this.lanes[y][x].Id, x, y})
                this.lanes[y][x].filled = false;
            }
        }
    }
    getFreeSpaceOrSameValueBox
        (direction: Direction, x: number, y: number, val: number): { free: boolean; grid: Grid; } {
        let res: { free: boolean; grid: Grid; } = { free: false, grid: null };
        switch (direction) {
            // TODO: we could refactor these by setting the changing values between them
            case Direction.Right:
                for (let x2 = x + 1; x2 < this.maxX; x2++) {
                    const grid = this.getBlock(x2, y);
                    if (grid.filled && parseInt(grid.value) === val) {
                        // same value, merge
                        return { free: false, grid };
                    }
                    if (grid.filled) break;
                    res = { free: true, grid };
                }
                break;
            case Direction.Left:
                for (let x2 = x - 1; x2 >= 0; x2--) {
                    const grid = this.getBlock(x2, y);
                    if (grid.filled && parseInt(grid.value) === val) {
                        // same value, merge
                        return { free: false, grid };
                    }
                    if (grid.filled) break;
                    res = { free: true, grid };
                }
                break;
            case Direction.Up:
                for (let y2 = y - 1; y2 >= 0; y2--) {
                    const grid = this.getBlock(x, y2);
                    if (grid.filled && parseInt(grid.value) === val) {
                        // same value, merge
                        return { free: false, grid };
                    }
                    if (grid.filled) break;
                    res = { free: true, grid };
                }
                break;
            case Direction.Down:
                for (let y2 = y + 1; y2 < this.maxY; y2++) {
                    const grid = this.getBlock(x, y2);
                    if (grid.filled && parseInt(grid.value) === val) {
                        // same value, merge
                        return { free: false, grid };
                    }
                    if (grid.filled) break;
                    res = { free: true, grid };
                }
                break;
        }
        return res;
    }
    public tilt(direction: Direction) {
        switch (direction) {
            case Direction.Right:
                for (let y = this.maxY - 1; y >= 0; y--) {
                    for (let x = this.maxX - 2; x >= 0; x--) {
                        this.getFreeSpaceAndAddBox(x, y, direction);
                    }
                }
                break;
            case Direction.Left:
                for (let y = this.maxY - 1; y >= 0; y--) {
                    for (let x = 1; x < this.maxX; x++) {
                        this.getFreeSpaceAndAddBox(x, y, direction);
                    }
                }
                break;
            case Direction.Up:
                for (let x = this.maxX - 1; x >= 0; x--) {
                    for (let y = 1; y < this.maxY; y++) {
                        this.getFreeSpaceAndAddBox(x, y, direction);
                    }
                }
                break;
            case Direction.Down:
                for (let x = this.maxX - 1; x >= 0; x--) {
                    for (let y = this.maxY - 2; y >= 0; y--) {
                        this.getFreeSpaceAndAddBox(x, y, direction);
                    }
                }
                break;
        }


    }
    getFreeSpace(direction: Direction, x: number, y: number): { x: number; y: number; } | null {
        switch (direction) {
            case Direction.Right:
                for (let x2 = this.maxX - 1; x2 >= x; x2--) {
                    if (!this.haveBlock(x2, y))
                        return { x: x2, y };
                }
                break;
            case Direction.Left:
                for (let x2 = 0; x2 < this.maxX; x2++) {
                    if (!this.haveBlock(x2, y))
                        return { x: x2, y };
                }
                break;
            case Direction.Up:
                for (let y2 = 0; y2 < this.maxY; y2++) {
                    if (!this.haveBlock(x, y2))
                        return { x: x, y: y2 };
                }
                break;
            case Direction.Down:
                for (let y2 = this.maxY - 1; y2 >= 0; y2--) {
                    if (!this.haveBlock(x, y2))
                        return { x: x, y: y2 };
                }
                break;
        }
        return null;
    }
}


