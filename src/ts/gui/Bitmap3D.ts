import { Bitmap } from './Bitmap';
import { Game } from '../Game';
import { Art } from '../Art';
import { Level } from '../level/Level';
import { DoorBlock } from '../level/block/DoorBlock';

export class Bitmap3D extends Bitmap {
    private zBuffer: number[];
    private zBufferWall: number[];
    private xCam: number = 0;
    private yCam: number = 0;
    private zCam: number = 0;
    private rCos: number = 0;
    private rSin: number = 0;
    private fov: number = 0;
    private xCenter: number = 0;
    private yCenter: number = 0;
    private rot: number = 0;

    constructor(width: number, height: number) {
        super(width, height);
        this.zBuffer = new Array(width * height);
        this.zBufferWall = new Array(width);
    }

    public render(game: Game): void {
        if (!game.level || !game.player) return;

        for (let x = 0; x < this.width; x++) {
            this.zBufferWall[x] = 0;
        }
        for (let i = 0; i < this.width * this.height; i++) {
            this.zBuffer[i] = 10000;
        }

        this.rot = game.player.rot;
        this.xCam = game.player.x - Math.sin(this.rot) * 0.3;
        this.yCam = game.player.z - Math.cos(this.rot) * 0.3;
        this.zCam = -0.2 + Math.sin(game.player.bobPhase * 0.4) * 0.01 * game.player.bob - game.player.y;

        this.xCenter = this.width / 2.0;
        this.yCenter = this.height / 3.0;

        this.rCos = Math.cos(this.rot);
        this.rSin = Math.sin(this.rot);

        this.fov = this.height;

        const level = game.level;
        const r = 6;

        const xCenter = Math.floor(this.xCam);
        const zCenter = Math.floor(this.yCam);

        // Render walls
        for (let zb = zCenter - r; zb <= zCenter + r; zb++) {
            for (let xb = xCenter - r; xb <= xCenter + r; xb++) {
                const c = level.getBlock(xb, zb);
                const e = level.getBlock(xb + 1, zb);
                const s = level.getBlock(xb, zb + 1);

                if (c instanceof DoorBlock) {
                    const rr = 1 / 8.0;
                    const openness = 1 - (c.openness * 7 / 8);
                    if (e.solidRender) {
                        this.renderWall(xb + openness, zb + 0.5 - rr, xb, zb + 0.5 - rr, c.tex, (c.col & 0xfefefe) >> 1, 0, openness);
                        this.renderWall(xb, zb + 0.5 + rr, xb + openness, zb + 0.5 + rr, c.tex, (c.col & 0xfefefe) >> 1, openness, 0);
                        this.renderWall(xb + openness, zb + 0.5 + rr, xb + openness, zb + 0.5 - rr, c.tex, c.col, 0.5 - rr, 0.5 + rr);
                    } else {
                        this.renderWall(xb + 0.5 - rr, zb, xb + 0.5 - rr, zb + openness, c.tex, c.col, openness, 0);
                        this.renderWall(xb + 0.5 + rr, zb + openness, xb + 0.5 + rr, zb, c.tex, c.col, 0, openness);
                        this.renderWall(xb + 0.5 - rr, zb + openness, xb + 0.5 + rr, zb + openness, c.tex, (c.col & 0xfefefe) >> 1, 0.5 - rr, 0.5 + rr);
                    }
                }

                if (c.solidRender) {
                    if (!e.solidRender) {
                        this.renderWall(xb + 1, zb + 1, xb + 1, zb, c.tex, c.col);
                    }
                    if (!s.solidRender) {
                        this.renderWall(xb, zb + 1, xb + 1, zb + 1, c.tex, (c.col & 0xfefefe) >> 1);
                    }
                } else {
                    if (e.solidRender) {
                        this.renderWall(xb + 1, zb, xb + 1, zb + 1, e.tex, e.col);
                    }
                    if (s.solidRender) {
                        this.renderWall(xb + 1, zb + 1, xb, zb + 1, s.tex, (s.col & 0xfefefe) >> 1);
                    }
                }
            }
        }

        // Render sprites
        for (let zb = zCenter - r; zb <= zCenter + r; zb++) {
            for (let xb = xCenter - r; xb <= xCenter + r; xb++) {
                const c = level.getBlock(xb, zb);

                for (let j = 0; j < c.entities.length; j++) {
                    const entity = c.entities[j];
                    for (let i = 0; i < entity.sprites.length; i++) {
                        const sprite = entity.sprites[i];
                        this.renderSprite(entity.x + sprite.x, 0 - sprite.y, entity.z + sprite.z, sprite.tex, sprite.col);
                    }
                }

                for (let i = 0; i < c.sprites.length; i++) {
                    const sprite = c.sprites[i];
                    this.renderSprite(xb + sprite.x, 0 - sprite.y, zb + sprite.z, sprite.tex, sprite.col);
                }
            }
        }

        this.renderFloor(level);
    }

    private renderFloor(level: Level): void {
        for (let y = 0; y < this.height; y++) {
            const yd = ((y + 0.5) - this.yCenter) / this.fov;

            let floor = true;
            let zd = (4 - this.zCam * 8) / yd;
            if (yd < 0) {
                floor = false;
                zd = (4 + this.zCam * 8) / -yd;
            }

            for (let x = 0; x < this.width; x++) {
                if (this.zBuffer[x + y * this.width] <= zd) continue;

                let xd = (this.xCenter - x) / this.fov;
                xd *= zd;

                const xx = xd * this.rCos + zd * this.rSin + (this.xCam + 0.5) * 8;
                const yy = zd * this.rCos - xd * this.rSin + (this.yCam + 0.5) * 8;

                const xPix = Math.floor(xx * 2);
                const yPix = Math.floor(yy * 2);
                const xTile = xPix >> 4;
                const yTile = yPix >> 4;

                const block = level.getBlock(xTile, yTile);
                let col = block.floorCol;
                let tex = block.floorTex;
                if (!floor) {
                    col = block.ceilCol;
                    tex = block.ceilTex;
                }

                if (tex < 0) {
                    this.zBuffer[x + y * this.width] = -1;
                } else {
                    this.zBuffer[x + y * this.width] = zd;
                    this.pixels[x + y * this.width] = Art.floors.pixels[((xPix & 15) + (tex % 8) * 16) + ((yPix & 15) + Math.floor(tex / 8) * 16) * 128] * col;
                }
            }
        }
    }

    private renderSprite(x: number, y: number, z: number, tex: number, color: number): void {
        const xc = (x - this.xCam) * 2 - this.rSin * 0.2;
        const yc = (y - this.zCam) * 2;
        const zc = (z - this.yCam) * 2 - this.rCos * 0.2;

        const xx = xc * this.rCos - zc * this.rSin;
        const yy = yc;
        let zz = zc * this.rCos + xc * this.rSin;

        if (zz < 0.1) return;

        const xPixel = this.xCenter - (xx / zz * this.fov);
        const yPixel = (yy / zz * this.fov + this.yCenter);

        const xPixel0 = xPixel - this.height / zz;
        const xPixel1 = xPixel + this.height / zz;

        const yPixel0 = yPixel - this.height / zz;
        const yPixel1 = yPixel + this.height / zz;

        let xp0 = Math.ceil(xPixel0);
        let xp1 = Math.ceil(xPixel1);
        let yp0 = Math.ceil(yPixel0);
        let yp1 = Math.ceil(yPixel1);

        if (xp0 < 0) xp0 = 0;
        if (xp1 > this.width) xp1 = this.width;
        if (yp0 < 0) yp0 = 0;
        if (yp1 > this.height) yp1 = this.height;
        zz *= 4;

        for (let yp = yp0; yp < yp1; yp++) {
            const ypr = (yp - yPixel0) / (yPixel1 - yPixel0);
            const yt = Math.floor(ypr * 16);
            for (let xp = xp0; xp < xp1; xp++) {
                const xpr = (xp - xPixel0) / (xPixel1 - xPixel0);
                const xt = Math.floor(xpr * 16);
                if (this.zBuffer[xp + yp * this.width] > zz) {
                    const col = Art.sprites.pixels[(xt + tex % 8 * 16) + (yt + Math.floor(tex / 8) * 16) * 128];
                    if (col >= 0) {
                        this.pixels[xp + yp * this.width] = col * color;
                        this.zBuffer[xp + yp * this.width] = zz;
                    }
                }
            }
        }
    }

    private renderWall(x0: number, y0: number, x1: number, y1: number, tex: number, color: number, xt0: number = 0, xt1: number = 1): void {
        const xc0 = ((x0 - 0.5) - this.xCam) * 2;
        const yc0 = ((y0 - 0.5) - this.yCam) * 2;

        let xx0 = xc0 * this.rCos - yc0 * this.rSin;
        const u0 = ((-0.5) - this.zCam) * 2;
        const l0 = ((+0.5) - this.zCam) * 2;
        let zz0 = yc0 * this.rCos + xc0 * this.rSin;

        const xc1 = ((x1 - 0.5) - this.xCam) * 2;
        const yc1 = ((y1 - 0.5) - this.yCam) * 2;

        let xx1 = xc1 * this.rCos - yc1 * this.rSin;
        const u1 = ((-0.5) - this.zCam) * 2;
        const l1 = ((+0.5) - this.zCam) * 2;
        let zz1 = yc1 * this.rCos + xc1 * this.rSin;

        xt0 *= 16;
        xt1 *= 16;

        const zClip = 0.2;

        if (zz0 < zClip && zz1 < zClip) return;

        if (zz0 < zClip) {
            const p = (zClip - zz0) / (zz1 - zz0);
            zz0 = zz0 + (zz1 - zz0) * p;
            xx0 = xx0 + (xx1 - xx0) * p;
            xt0 = xt0 + (xt1 - xt0) * p;
        }

        if (zz1 < zClip) {
            const p = (zClip - zz0) / (zz1 - zz0);
            zz1 = zz0 + (zz1 - zz0) * p;
            xx1 = xx0 + (xx1 - xx0) * p;
            xt1 = xt0 + (xt1 - xt0) * p;
        }

        const xPixel0 = this.xCenter - (xx0 / zz0 * this.fov);
        const xPixel1 = this.xCenter - (xx1 / zz1 * this.fov);

        if (xPixel0 >= xPixel1) return;
        let xp0 = Math.ceil(xPixel0);
        let xp1 = Math.ceil(xPixel1);
        if (xp0 < 0) xp0 = 0;
        if (xp1 > this.width) xp1 = this.width;

        const yPixel00 = (u0 / zz0 * this.fov + this.yCenter);
        const yPixel01 = (l0 / zz0 * this.fov + this.yCenter);
        const yPixel10 = (u1 / zz1 * this.fov + this.yCenter);
        const yPixel11 = (l1 / zz1 * this.fov + this.yCenter);

        const iz0 = 1 / zz0;
        const iz1 = 1 / zz1;

        const iza = iz1 - iz0;

        const ixt0 = xt0 * iz0;
        const ixta = xt1 * iz1 - ixt0;
        const iw = 1 / (xPixel1 - xPixel0);

        for (let x = xp0; x < xp1; x++) {
            const pr = (x - xPixel0) * iw;
            const iz = iz0 + iza * pr;

            if (this.zBufferWall[x] > iz) continue;
            this.zBufferWall[x] = iz;
            const xTex = Math.floor((ixt0 + ixta * pr) / iz);

            const yPixel0 = yPixel00 + (yPixel10 - yPixel00) * pr - 0.5;
            const yPixel1 = yPixel01 + (yPixel11 - yPixel01) * pr;

            let yp0 = Math.ceil(yPixel0);
            let yp1 = Math.ceil(yPixel1);
            if (yp0 < 0) yp0 = 0;
            if (yp1 > this.height) yp1 = this.height;

            const ih = 1 / (yPixel1 - yPixel0);
            for (let y = yp0; y < yp1; y++) {
                const pry = (y - yPixel0) * ih;
                const yTex = Math.floor(16 * pry);
                this.pixels[x + y * this.width] = Art.walls.pixels[((xTex) + (tex % 8) * 16) + (yTex + Math.floor(tex / 8) * 16) * 128] * color;
                this.zBuffer[x + y * this.width] = 1 / iz * 4;
            }
        }
    }

    public postProcess(_level: Level): void {
        for (let i = 0; i < this.width * this.height; i++) {
            const zl = this.zBuffer[i];
            if (zl < 0) {
                const xx = (Math.floor((i % this.width) - this.rot * 512 / (Math.PI * 2))) & 511;
                const yy = Math.floor(i / this.width);
                this.pixels[i] = Art.sky.pixels[xx + yy * 512] * 0x444455;
            } else {
                const xp = (i % this.width);
                const yp = Math.floor(i / this.width) * 14;

                const xx = ((i % this.width - this.width / 2.0) / this.width);
                const col = this.pixels[i];
                let brightness = Math.floor(300 - zl * 6 * (xx * xx * 2 + 1));
                brightness = (brightness + ((xp + yp) & 3) * 4) >> 4 << 4;
                if (brightness < 0) brightness = 0;
                if (brightness > 255) brightness = 255;

                let r = (col >> 16) & 0xff;
                let g = (col >> 8) & 0xff;
                let b = (col) & 0xff;

                r = r * brightness / 255;
                g = g * brightness / 255;
                b = b * brightness / 255;

                this.pixels[i] = r << 16 | g << 8 | b;
            }
        }
    }
}