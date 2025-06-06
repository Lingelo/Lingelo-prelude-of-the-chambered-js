import { Game } from './Game';
import { Screen } from './gui/Screen';
import { InputHandler } from './InputHandler';

export class EscapeGame {
    private static readonly WIDTH = 160;
    private static readonly HEIGHT = 120;
    private static readonly SCALE = 4;

    private running = false;
    private game: Game;
    private screen: Screen;
    private ctx: CanvasRenderingContext2D;
    private imageData: ImageData;
    private inputHandler: InputHandler;
    private canvas: HTMLCanvasElement;
    private hadFocus = false;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvas.width = EscapeGame.WIDTH * EscapeGame.SCALE;
        this.canvas.height = EscapeGame.HEIGHT * EscapeGame.SCALE;
        this.canvas.tabIndex = 0; // Make canvas focusable

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Could not get 2D context from canvas');
        }
        this.ctx = ctx;
        this.ctx.imageSmoothingEnabled = false;

        this.game = new Game();
        this.screen = new Screen(EscapeGame.WIDTH, EscapeGame.HEIGHT);
        this.imageData = this.ctx.createImageData(EscapeGame.WIDTH, EscapeGame.HEIGHT);
        this.inputHandler = new InputHandler(canvas);

        this.canvas.style.cursor = 'none';
    }

    public start(): void {
        if (this.running) return;
        this.running = true;
        this.canvas.focus();
        this.gameLoop();
    }

    public stop(): void {
        this.running = false;
    }

    private gameLoop(): void {
        let frames = 0;
        let unprocessedSeconds = 0;
        let lastTime = performance.now();
        const secondsPerTick = 1 / 60.0;
        let tickCount = 0;

        const loop = (currentTime: number) => {
            if (!this.running) return;

            const passedTime = Math.min((currentTime - lastTime) / 1000, 0.1);
            lastTime = currentTime;
            unprocessedSeconds += passedTime;

            let ticked = false;
            while (unprocessedSeconds > secondsPerTick) {
                this.tick();
                unprocessedSeconds -= secondsPerTick;
                ticked = true;

                tickCount++;
                if (tickCount % 60 === 0) {
                    console.log(`${frames} fps`);
                    frames = 0;
                }
            }

            if (ticked) {
                this.render();
                frames++;
            }

            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }

    private tick(): void {
        if (document.hasFocus() && this.canvas === document.activeElement) {
            this.game.tick(this.inputHandler.keys);
        }
    }

    private render(): void {
        const hasFocus = document.hasFocus() && this.canvas === document.activeElement;
        
        if (this.hadFocus !== hasFocus) {
            this.hadFocus = hasFocus;
            this.canvas.style.cursor = hasFocus ? 'none' : 'default';
        }

        this.screen.render(this.game, hasFocus);

        // Copy screen pixels to ImageData
        const pixels = this.screen.pixels;
        const data = this.imageData.data;
        
        for (let i = 0; i < pixels.length; i++) {
            const color = pixels[i];
            const index = i * 4;
            data[index] = (color >> 16) & 0xFF;     // Red
            data[index + 1] = (color >> 8) & 0xFF;  // Green
            data[index + 2] = color & 0xFF;         // Blue
            data[index + 3] = 255;                  // Alpha
        }

        // Create a temporary canvas for scaling
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = EscapeGame.WIDTH;
        tempCanvas.height = EscapeGame.HEIGHT;
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCtx.putImageData(this.imageData, 0, 0);

        // Clear and draw scaled image
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(tempCanvas, 0, 0, EscapeGame.WIDTH * EscapeGame.SCALE, EscapeGame.HEIGHT * EscapeGame.SCALE);
    }
}