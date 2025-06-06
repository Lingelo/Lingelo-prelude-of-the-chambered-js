import { Block } from './Block';

export class SolidBlock extends Block {
    constructor() {
        super();
        this.blocksMotion = true;
        this.solidRender = true;
    }
}