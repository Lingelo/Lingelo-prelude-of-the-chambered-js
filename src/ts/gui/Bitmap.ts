import { Art } from '../Art';

export class Bitmap {
    public readonly width: number;
    public readonly height: number;
    public readonly pixels: number[];
    
    private static readonly chars = "" +
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ.,!?\"'/\\<>()[]{}" +
        "abcdefghijklmnopqrstuvwxyz_               " +
        "0123456789+-=*:;ÖÅÄå                      " +
        "";

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.pixels = new Array(width * height).fill(0);
    }

    public draw(bitmap: Bitmap, xOffs: number, yOffs: number): void {
        for (let y = 0; y < bitmap.height; y++) {
            const yPix = y + yOffs;
            if (yPix < 0 || yPix >= this.height) continue;

            for (let x = 0; x < bitmap.width; x++) {
                const xPix = x + xOffs;
                if (xPix < 0 || xPix >= this.width) continue;

                const src = bitmap.pixels[x + y * bitmap.width];
                this.pixels[xPix + yPix * this.width] = src;
            }
        }
    }

    public flipDraw(bitmap: Bitmap, xOffs: number, yOffs: number): void {
        for (let y = 0; y < bitmap.height; y++) {
            const yPix = y + yOffs;
            if (yPix < 0 || yPix >= this.height) continue;

            for (let x = 0; x < bitmap.width; x++) {
                const xPix = xOffs + bitmap.width - x - 1;
                if (xPix < 0 || xPix >= this.width) continue;

                const src = bitmap.pixels[x + y * bitmap.width];
                this.pixels[xPix + yPix * this.width] = src;
            }
        }
    }

    public drawWithColor(bitmap: Bitmap, xOffs: number, yOffs: number, xo: number, yo: number, w: number, h: number, col: number): void {
        for (let y = 0; y < h; y++) {
            const yPix = y + yOffs;
            if (yPix < 0 || yPix >= this.height) continue;

            for (let x = 0; x < w; x++) {
                const xPix = x + xOffs;
                if (xPix < 0 || xPix >= this.width) continue;

                const src = bitmap.pixels[(x + xo) + (y + yo) * bitmap.width];
                if (src >= 0) {
                    this.pixels[xPix + yPix * this.width] = src * col;
                }
            }
        }
    }

    public scaleDraw(bitmap: Bitmap, scale: number, xOffs: number, yOffs: number, xo: number, yo: number, w: number, h: number, col: number): void {
        for (let y = 0; y < h * scale; y++) {
            const yPix = y + yOffs;
            if (yPix < 0 || yPix >= this.height) continue;

            for (let x = 0; x < w * scale; x++) {
                const xPix = x + xOffs;
                if (xPix < 0 || xPix >= this.width) continue;

                const src = bitmap.pixels[Math.floor(x / scale + xo) + Math.floor(y / scale + yo) * bitmap.width];
                if (src >= 0) {
                    this.pixels[xPix + yPix * this.width] = src * col;
                }
            }
        }
    }

    public drawText(string: string, x: number, y: number, col: number): void {
        for (let i = 0; i < string.length; i++) {
            const ch = Bitmap.chars.indexOf(string.charAt(i));
            if (ch < 0) continue;

            const xx = ch % 42;
            const yy = Math.floor(ch / 42);
            this.drawWithColor(Art.font, x + i * 6, y, xx * 6, yy * 8, 5, 8, col);
        }
    }

    public fill(x0: number, y0: number, x1: number, y1: number, color: number): void {
        for (let y = y0; y < y1; y++) {
            for (let x = x0; x < x1; x++) {
                this.pixels[x + y * this.width] = color;
            }
        }
    }
}