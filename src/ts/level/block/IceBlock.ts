import { Block } from './Block';
import { Player } from '../../entities/Player';

export class IceBlock extends Block {
    public getFriction(_player: Player): number {
        return 1.0;
    }
}