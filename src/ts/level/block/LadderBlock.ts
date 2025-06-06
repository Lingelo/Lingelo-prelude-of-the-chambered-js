import { Block } from './Block';

export class LadderBlock extends Block {
    public wait: boolean = false;

    constructor(_isDown: boolean) {
        super();
    }
}