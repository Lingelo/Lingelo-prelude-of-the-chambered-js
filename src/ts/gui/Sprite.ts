export class Sprite {
    public x: number;
    public y: number;
    public z: number;
    public tex: number;
    public col: number = 0x202020;
    public removed: boolean = false;

    constructor(x: number, y: number, z: number, tex: number, color: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.tex = tex;
        this.col = color;
    }

    public tick(): void {
    }
}