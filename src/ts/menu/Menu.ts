import { Game } from '../Game';
import { Screen } from '../gui/Screen';

export abstract class Menu {
    public abstract tick(game: Game, up: boolean, down: boolean, left: boolean, right: boolean, use: boolean): void;
    public abstract render(screen: Screen): void;
}