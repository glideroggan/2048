
export class Grid {
    private static IdCounter: number = 0;
    private id:number
    get Id():number { return this.id }
    public value: string;
    // TODO: change to free and update usages
    public filled: boolean;
    constructor(val?: string) {
        this.value = val;
    }
    addBox(val: string): number {
        this.filled = true;
        this.value = val;
        this.id = Grid.IdCounter;
        Grid.IdCounter++;
        return this.id;
    }
}
