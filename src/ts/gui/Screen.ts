import { Bitmap } from './Bitmap';
import { Bitmap3D } from './Bitmap3D';
import { Game } from '../Game';
import { Art } from '../Art';
import { Item } from '../entities/Item';

export class Screen extends Bitmap {
    private static readonly PANEL_HEIGHT = 29;

    private testBitmap: Bitmap;
    private viewport: Bitmap3D;

    constructor(width: number, height: number) {
        super(width, height);

        this.viewport = new Bitmap3D(width, height - Screen.PANEL_HEIGHT);

        const random = Math.random;
        this.testBitmap = new Bitmap(64, 64);
        for (let i = 0; i < 64 * 64; i++) {
            this.testBitmap.pixels[i] = Math.floor(random() * 0xffffff) * (Math.floor(random() * 5) / 4);
        }
    }

    public render(game: Game, hasFocus: boolean): void {
        if (game.level === null || game.player === null) {
            this.fill(0, 0, this.width, this.height, 0);
        } else {
            const itemUsed = game.player.itemUseTime > 0;
            const item = game.player.items[game.player.selectedSlot];

            if (game.pauseTime > 0) {
                this.fill(0, 0, this.width, this.height, 0);
                const messages = [`Entering ${game.level.name}`];
                for (let y = 0; y < messages.length; y++) {
                    this.drawText(messages[y], Math.floor((this.width - messages[y].length * 6) / 2), Math.floor((this.viewport.height - messages.length * 8) / 2 + y * 8 + 1), 0x111111);
                    this.drawText(messages[y], Math.floor((this.width - messages[y].length * 6) / 2), Math.floor((this.viewport.height - messages.length * 8) / 2 + y * 8), 0x555544);
                }
            } else {
                this.viewport.render(game);
                this.viewport.postProcess(game.level);

                const block = game.level.getBlock(Math.floor(game.player.x + 0.5), Math.floor(game.player.z + 0.5));
                if (block.messages !== null && hasFocus) {
                    for (let y = 0; y < block.messages.length; y++) {
                        this.viewport.drawText(block.messages[y], Math.floor((this.width - block.messages[y].length * 6) / 2), Math.floor((this.viewport.height - block.messages.length * 8) / 2 + y * 8 + 1), 0x111111);
                        this.viewport.drawText(block.messages[y], Math.floor((this.width - block.messages[y].length * 6) / 2), Math.floor((this.viewport.height - block.messages.length * 8) / 2 + y * 8), 0x555544);
                    }
                }

                this.draw(this.viewport, 0, 0);
                let xx = Math.floor(game.player.turnBob * 32);
                let yy = Math.floor(Math.sin(game.player.bobPhase * 0.4) * 1 * game.player.bob + game.player.bob * 2);

                if (itemUsed) xx = yy = 0;
                xx += Math.floor(this.width / 2);
                yy += this.height - Screen.PANEL_HEIGHT - 15 * 3;
                if (item !== Item.none) {
                    this.scaleDraw(Art.items, 3, xx, yy, 16 * item.icon + 1, 16 + 1 + (itemUsed ? 16 : 0), 15, 15, Art.getCol(item.color));
                }

                if (game.player.hurtTime > 0 || game.player.dead) {
                    let offs = 1.5 - game.player.hurtTime / 30.0;
                    const random = () => Math.random(); // Simple random function
                    if (game.player.dead) offs = 0.5;
                    for (let i = 0; i < this.pixels.length; i++) {
                        const xp = ((i % this.width) - this.viewport.width / 2.0) / this.width * 2;
                        const yp = ((Math.floor(i / this.width)) - this.viewport.height / 2.0) / this.viewport.height * 2;

                        if (random() + offs < Math.sqrt(xp * xp + yp * yp)) {
                            this.pixels[i] = (Math.floor(random() * 5) / 4) * 0x550000;
                        }
                    }
                }
            }

            this.drawWithColor(Art.panel, 0, this.height - Screen.PANEL_HEIGHT, 0, 0, this.width, Screen.PANEL_HEIGHT, Art.getCol(0x707070));

            this.drawText("å", 3, this.height - 26 + 0, 0x00ffff);
            this.drawText(`${game.player.keys}/4`, 10, this.height - 26 + 0, 0xffffff);
            this.drawText("Ä", 3, this.height - 26 + 8, 0xffff00);
            this.drawText(`${game.player.loot}`, 10, this.height - 26 + 8, 0xffffff);
            this.drawText("Å", 3, this.height - 26 + 16, 0xff0000);
            this.drawText(`${game.player.health}`, 10, this.height - 26 + 16, 0xffffff);

            for (let i = 0; i < 8; i++) {
                const slotItem = game.player.items[i];
                if (slotItem !== Item.none) {
                    this.drawWithColor(Art.items, 30 + i * 16, this.height - Screen.PANEL_HEIGHT + 2, slotItem.icon * 16, 0, 16, 16, Art.getCol(slotItem.color));
                    if (slotItem === Item.pistol) {
                        const str = `${game.player.ammo}`;
                        this.drawText(str, 30 + i * 16 + 17 - str.length * 6, this.height - Screen.PANEL_HEIGHT + 1 + 10, 0x555555);
                    }
                    if (slotItem === Item.potion) {
                        const str = `${game.player.potions}`;
                        this.drawText(str, 30 + i * 16 + 17 - str.length * 6, this.height - Screen.PANEL_HEIGHT + 1 + 10, 0x555555);
                    }
                }
            }

            this.drawWithColor(Art.items, 30 + game.player.selectedSlot * 16, this.height - Screen.PANEL_HEIGHT + 2, 0, 48, 17, 17, Art.getCol(0xffffff));

            this.drawText(item.name, 26 + Math.floor((8 * 16 - item.name.length * 4) / 2), this.height - 9, 0xffffff);
        }

        if (game.menu !== null) {
            for (let i = 0; i < this.pixels.length; i++) {
                this.pixels[i] = (this.pixels[i] & 0xfcfcfc) >> 2;
            }
            game.menu.render(this);
        }

        if (!hasFocus) {
            for (let i = 0; i < this.pixels.length; i++) {
                this.pixels[i] = (this.pixels[i] & 0xfcfcfc) >> 2;
            }
            if (Math.floor(Date.now() / 450) % 2 !== 0) {
                const msg = "Click to focus!";
                this.drawText(msg, Math.floor((this.width - msg.length * 6) / 2), Math.floor(this.height / 3) + 4, 0xffffff);
            }
        }
    }
}