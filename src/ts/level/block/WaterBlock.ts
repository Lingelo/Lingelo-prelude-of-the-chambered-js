import { Block } from './Block';
import { Player } from '../../entities/Player';
import { Item } from '../../entities/Item';

export class WaterBlock extends Block {
    public getWalkSpeed(player: Player): number {
        if (player.getSelectedItem() === Item.flippers) {
            return 0.8;
        }
        return 0.3;
    }
}