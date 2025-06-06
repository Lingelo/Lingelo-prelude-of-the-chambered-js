import { Menu } from './Menu';
import { Game } from '../Game';
import { Screen } from '../gui/Screen';

export class TitleMenu extends Menu {
    public tick(game: Game, _up: boolean, _down: boolean, _left: boolean, _right: boolean, use: boolean): void {
        if (use) {
            game.newGame();
            game.setMenu(null);
        }
    }

    public render(screen: Screen): void {
        const title = "Prelude of the Chambered";
        const subtitle = "Press SPACE to start";
        
        screen.drawText(title, Math.floor((screen.width - title.length * 6) / 2), 40, 0xffffff);
        screen.drawText(subtitle, Math.floor((screen.width - subtitle.length * 6) / 2), 60, 0xaaaaaa);
    }
}