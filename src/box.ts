import { IUpdate } from './update'

export class Box implements IUpdate {
    private ele
    constructor(box:HTMLDivElement) {
        this.ele = box;
    }
    public Update(deltaTime:number):void {
        
    }
}

