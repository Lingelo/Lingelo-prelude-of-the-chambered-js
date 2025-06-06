import { Menu } from './Menu';
import { Game } from '../Game';
import { Screen } from '../gui/Screen';
import { Player } from '../entities/Player';

export class LoseMenu extends Menu {
    constructor(_player: Player) {
        super();
    }

    public tick(game: Game, _up: boolean, _down: boolean, _left: boolean, _right: boolean, use: boolean): void {
        if (use) {
            game.setMenu(null);
            game.newGame();
        }
    }

    public render(screen: Screen): void {
        const title = "GAME OVER";
        const subtitle = "Press SPACE to try again";
        
        screen.drawText(title, Math.floor((screen.width - title.length * 6) / 2), 40, 0xff0000);
        screen.drawText(subtitle, Math.floor((screen.width - subtitle.length * 6) / 2), 60, 0xaaaaaa);
    }
}