import { EscapeGame } from './ts/EscapeGame';
import { Art } from './ts/Art';

// Initialize Art assets
Art.init();

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
if (!canvas) {
    throw new Error('Canvas element not found');
}

const escapeGame = new EscapeGame(canvas);
escapeGame.start();