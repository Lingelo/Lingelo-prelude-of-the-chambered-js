import { Block } from './Block';

export class DoorBlock extends Block {
    public openness: number = 0;

    constructor() {
        super();
        this.solidRender = true;
    }
}