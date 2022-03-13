
export class Grid {
    public static IdCounter: number = 0;
    private id:number
    get Id():number { return this.id }
    public value: string;
    public filled: boolean;
    constructor(val?: string) {
        this.value = val;
    }
    addBox(val: string, id?:number): number {
        this.filled = true
        this.value = val
        if (id == null) {
            this.id = Grid.IdCounter
            Grid.IdCounter++
        } else {
            this.id = id
        }
        
        return this.id
    }
    clone(): Grid {
        let r = new Grid()
        r.id = this.id
        r.value = this.value
        r.filled = this.filled
        // r.clone = this.clone
        // r.addBox = this.addBox
        return r
    }
}
