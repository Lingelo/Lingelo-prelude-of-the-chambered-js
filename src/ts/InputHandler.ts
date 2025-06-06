export class InputHandler {
    public keys: boolean[] = new Array(256).fill(false);
    private canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
        window.addEventListener('blur', this.onFocusLost.bind(this));
        this.canvas.addEventListener('focus', this.onFocusGained.bind(this));
    }

    private onKeyDown(e: KeyboardEvent): void {
        const code = this.getKeyCode(e.code);
        if (code >= 0 && code < this.keys.length) {
            this.keys[code] = true;
        }
        e.preventDefault();
    }

    private onKeyUp(e: KeyboardEvent): void {
        const code = this.getKeyCode(e.code);
        if (code >= 0 && code < this.keys.length) {
            this.keys[code] = false;
        }
        e.preventDefault();
    }

    private onFocusGained(): void {
    }

    private onFocusLost(): void {
        for (let i = 0; i < this.keys.length; i++) {
            this.keys[i] = false;
        }
    }

    private getKeyCode(code: string): number {
        const keyMap: { [key: string]: number } = {
            'Escape': 27,
            'Space': 32,
            'ArrowLeft': 37,
            'ArrowUp': 38,
            'ArrowRight': 39,
            'ArrowDown': 40,
            'KeyA': 65,
            'KeyD': 68,
            'KeyE': 69,
            'KeyQ': 81,
            'KeyS': 83,
            'KeyW': 87,
            'Digit1': 49,
            'Digit2': 50,
            'Digit3': 51,
            'Digit4': 52,
            'Digit5': 53,
            'Digit6': 54,
            'Digit7': 55,
            'Digit8': 56,
            'ControlLeft': 17,
            'ControlRight': 17,
            'AltLeft': 18,
            'AltRight': 18,
            'ShiftLeft': 16,
            'ShiftRight': 16,
            'Numpad2': 98,
            'Numpad4': 100,
            'Numpad6': 102,
            'Numpad8': 104
        };

        return keyMap[code] || -1;
    }
}