import { Level } from './level/Level';
import { Player } from './entities/Player';
import { Menu } from './menu/Menu';
import { TitleMenu } from './menu/TitleMenu';
import { PauseMenu } from './menu/PauseMenu';
import { WinMenu } from './menu/WinMenu';
import { LoseMenu } from './menu/LoseMenu';
import { Item } from './entities/Item';
import { LadderBlock } from './level/block/LadderBlock';

export class Game {
    public time: number = 0;
    public level: Level | null = null;
    public player: Player | null = null;
    public pauseTime: number = 0;
    public menu: Menu | null = null;

    constructor() {
        this.setMenu(new TitleMenu());
    }

    public newGame(): void {
        Level.clear();
        this.level = Level.loadLevel(this, "start");

        this.player = new Player();
        this.player.level = this.level;
        this.level.player = this.player;
        this.player.x = this.level.xSpawn;
        this.player.z = this.level.ySpawn;
        this.level.addEntity(this.player);
        this.player.rot = Math.PI + 0.4;
    }

    public switchLevel(name: string, id: number): void {
        if (!this.level || !this.player) return;

        this.pauseTime = 30;
        this.level.removeEntityImmediately(this.player);
        this.level = Level.loadLevel(this, name);
        this.level.findSpawn(id);
        this.player.x = this.level.xSpawn;
        this.player.z = this.level.ySpawn;
        
        const block = this.level.getBlock(this.level.xSpawn, this.level.ySpawn);
        if (block instanceof LadderBlock) {
            block.wait = true;
        }
        
        this.player.x += Math.sin(this.player.rot) * 0.2;
        this.player.z += Math.cos(this.player.rot) * 0.2;
        this.level.addEntity(this.player);
    }

    public tick(keys: boolean[]): void {
        if (this.pauseTime > 0) {
            this.pauseTime--;
            return;
        }

        this.time++;

        const strafe = keys[17] || keys[18] || keys[16]; // Ctrl, Alt, Shift

        const lk = keys[37] || keys[100]; // Left arrow or Numpad 4
        const rk = keys[39] || keys[102]; // Right arrow or Numpad 6

        const up = keys[87] || keys[38] || keys[104]; // W, Up arrow, Numpad 8
        const down = keys[83] || keys[40] || keys[98]; // S, Down arrow, Numpad 2
        const left = keys[65] || (strafe && lk); // A or (strafe + left)
        const right = keys[68] || (strafe && rk); // D or (strafe + right)

        const turnLeft = keys[81] || (!strafe && lk); // Q or (not strafe + left)
        const turnRight = keys[69] || (!strafe && rk); // E or (not strafe + right)

        const use = keys[32]; // Space

        for (let i = 0; i < 8; i++) {
            if (keys[49 + i]) { // Keys 1-8
                keys[49 + i] = false;
                if (this.player) {
                    this.player.selectedSlot = i;
                    this.player.itemUseTime = 0;
                }
            }
        }

        if (keys[27]) { // Escape
            keys[27] = false;
            if (this.menu === null) {
                this.setMenu(new PauseMenu());
            }
        }

        if (use) {
            keys[32] = false;
        }

        if (this.menu !== null) {
            keys[87] = keys[38] = keys[104] = false; // W, Up, Numpad 8
            keys[83] = keys[40] = keys[98] = false; // S, Down, Numpad 2
            keys[65] = false; // A
            keys[68] = false; // D

            this.menu.tick(this, up, down, left, right, use);
        } else {
            if (this.player) {
                this.player.playerTick(up, down, left, right, turnLeft, turnRight);
                if (use) {
                    this.player.activate();
                }
            }

            if (this.level) {
                this.level.tick();
            }
        }
    }

    public getLoot(item: Item): void {
        if (this.player) {
            this.player.addLoot(item);
        }
    }

    public win(player: Player): void {
        this.setMenu(new WinMenu(player));
    }

    public setMenu(menu: Menu | null): void {
        this.menu = menu;
    }

    public lose(player: Player): void {
        this.setMenu(new LoseMenu(player));
    }
}