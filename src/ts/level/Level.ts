import { Block } from './block/Block';
import { SolidBlock } from './block/SolidBlock';
import { WaterBlock } from './block/WaterBlock';
import { IceBlock } from './block/IceBlock';
import { LadderBlock } from './block/LadderBlock';
import { DoorBlock } from './block/DoorBlock';
import { Entity } from '../entities/Entity';
import { Player } from '../entities/Player';
import { Item } from '../entities/Item';
import { Game } from '../Game';
import { Art } from '../Art';
import { Bullet } from '../entities/Bullet';

export abstract class Level {
    public blocks: Block[] = [];
    public width: number = 0;
    public height: number = 0;
    private solidWall: Block = new SolidBlock();

    public xSpawn: number = 0;
    public ySpawn: number = 0;

    protected wallCol: number = 0xB3CEE2;
    protected floorCol: number = 0x9CA09B;
    protected ceilCol: number = 0x9CA09B;

    protected wallTex: number = 0;
    protected floorTex: number = 0;
    protected ceilTex: number = 0;

    public entities: Entity[] = [];
    protected game!: Game;
    public name: string = "";

    public player!: Player;

    private static loaded: Map<string, Level> = new Map();

    public init(game: Game, name: string, w: number, h: number, pixels: number[]): void {
        this.game = game;
        this.name = name;
        this.player = game.player!;

        this.solidWall.col = Art.getCol(this.wallCol);
        this.solidWall.tex = Art.getCol(this.wallTex);
        this.width = w;
        this.height = h;
        this.blocks = new Array(this.width * this.height);

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const col = pixels[x + y * w] & 0xffffff;
                const id = 255 - ((pixels[x + y * w] >> 24) & 0xff);

                const block = this.getBlockForColor(x, y, col);
                block.id = id;

                if (block.tex === -1) block.tex = this.wallTex;
                if (block.floorTex === -1) block.floorTex = this.floorTex;
                if (block.ceilTex === -1) block.ceilTex = this.ceilTex;
                if (block.col === -1) block.col = Art.getCol(this.wallCol);
                if (block.floorCol === -1) block.floorCol = Art.getCol(this.floorCol);
                if (block.ceilCol === -1) block.ceilCol = Art.getCol(this.ceilCol);

                this.blocks[x + y * w] = block;
                block.level = this;
                block.x = x;
                block.y = y;
            }
        }

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const col = pixels[x + y * w] & 0xffffff;
                this.decorateBlock(x, y, this.blocks[x + y * w], col);
            }
        }
    }

    public addEntity(e: Entity): void {
        this.entities.push(e);
        e.level = this;
        e.updatePos();
    }

    public removeEntityImmediately(player: Player): void {
        const index = this.entities.indexOf(player);
        if (index > -1) {
            this.entities.splice(index, 1);
        }
        this.getBlock(player.xTileO, player.zTileO).removeEntity(player);
    }

    protected decorateBlock(x: number, y: number, block: Block, col: number): void {
        block.decorate(this, x, y);
        if (col === 0xFFFF00) {
            this.xSpawn = x;
            this.ySpawn = y;
        }
        // TODO: Add entity spawning based on color
        if (col === 0x1A2108 || col === 0xff0007) {
            block.floorTex = 7;
            block.ceilTex = 7;
        }

        if (col === 0xC6C6C6) block.col = Art.getCol(0xa0a0a0);
        if (col === 0xC6C697) block.col = Art.getCol(0xa0a0a0);
        if (col === 0x653A00) {
            block.floorCol = Art.getCol(0xB56600);
            block.floorTex = 3 * 8 + 1;
        }

        if (col === 0x93FF9B) {
            block.col = Art.getCol(0x2AAF33);
            block.tex = 8;
        }
    }

    protected getBlockForColor(_x: number, _y: number, col: number): Block {
        if (col === 0x93FF9B) return new SolidBlock();
        if (col === 0xFFFFFF) return new SolidBlock();
        if (col === 0x0000FF) return new WaterBlock();
        if (col === 0xFF66FF) return new LadderBlock(false);
        if (col === 0x9E009E) return new LadderBlock(true);
        if (col === 0xC6C6C6) return new DoorBlock();
        if (col === 0xff0005) return new IceBlock();
        if (col === 0x3F3F60) return new IceBlock();
        if (col === 0xC6C697) return new DoorBlock(); // LockedDoorBlock
        if (col === 0x1A2108) return new Block();

        return new Block();
    }

    public getBlock(x: number, y: number): Block {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
            return this.solidWall;
        }
        return this.blocks[x + y * this.width];
    }

    public static clear(): void {
        Level.loaded.clear();
    }

    public static loadLevel(game: Game, name: string): Level {
        if (Level.loaded.has(name)) {
            return Level.loaded.get(name)!;
        }

        // For now, create a simple test level with mock data
        const level = Level.byName(name);
        const w = 20;
        const h = 20;
        const pixels = new Array(w * h).fill(0x000000); // Black background
        
        // Create a simple room with spawn point
        for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
                pixels[x + y * w] = 0x000000; // Empty space
            }
        }
        
        // Add walls
        for (let x = 0; x < w; x++) {
            pixels[x] = 0xFFFFFF; // Top wall
            pixels[x + (h - 1) * w] = 0xFFFFFF; // Bottom wall
        }
        for (let y = 0; y < h; y++) {
            pixels[y * w] = 0xFFFFFF; // Left wall
            pixels[(w - 1) + y * w] = 0xFFFFFF; // Right wall
        }
        
        // Add spawn point
        pixels[10 + 10 * w] = 0xFFFF00; // Yellow spawn point

        level.init(game, name, w, h, pixels);
        Level.loaded.set(name, level);

        return level;
    }

    private static byName(name: string): Level {
        // Pour l'instant, créons une implémentation simple qui évite la dépendance circulaire
        return new (class extends Level {
            constructor() {
                super();
                this.name = name.charAt(0).toUpperCase() + name.slice(1);
            }
        })();
    }

    public containsBlockingEntity(x0: number, y0: number, x1: number, y1: number): boolean {
        const xc = Math.floor((x1 + x0) / 2);
        const zc = Math.floor((y1 + y0) / 2);
        const rr = 2;
        for (let z = zc - rr; z <= zc + rr; z++) {
            for (let x = xc - rr; x <= xc + rr; x++) {
                const es = this.getBlock(x, z).entities;
                for (let i = 0; i < es.length; i++) {
                    const e = es[i];
                    if (e.isInside(x0, y0, x1, y1)) return true;
                }
            }
        }
        return false;
    }

    public containsBlockingNonFlyingEntity(x0: number, y0: number, x1: number, y1: number): boolean {
        const xc = Math.floor((x1 + x0) / 2);
        const zc = Math.floor((y1 + y0) / 2);
        const rr = 2;
        for (let z = zc - rr; z <= zc + rr; z++) {
            for (let x = xc - rr; x <= xc + rr; x++) {
                const es = this.getBlock(x, z).entities;
                for (let i = 0; i < es.length; i++) {
                    const e = es[i];
                    if (!e.flying && e.isInside(x0, y0, x1, y1)) return true;
                }
            }
        }
        return false;
    }

    public tick(): void {
        for (let i = 0; i < this.entities.length; i++) {
            const e = this.entities[i];
            e.tick();
            e.updatePos();
            if (e.isRemoved()) {
                this.entities.splice(i--, 1);
            }
        }

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.blocks[x + y * this.width].tick();
            }
        }
    }

    public trigger(id: number, pressed: boolean): void {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const b = this.blocks[x + y * this.width];
                if (b.id === id) {
                    b.trigger(pressed);
                }
            }
        }
    }

    public switchLevel(_id: number): void {
    }

    public findSpawn(id: number): void {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const b = this.blocks[x + y * this.width];
                if (b.id === id && b instanceof LadderBlock) {
                    this.xSpawn = x;
                    this.ySpawn = y;
                }
            }
        }
    }

    public getLoot(id: number): void {
        if (id === 20) this.game.getLoot(Item.pistol);
        if (id === 21) this.game.getLoot(Item.potion);
    }

    public win(): void {
        this.game.win(this.player);
    }

    public lose(): void {
        this.game.lose(this.player);
    }

    public showLootScreen(item: Item): void {
        // TODO: Implement GotLootMenu
        console.log(`Got loot: ${item.name}`);
    }

    public createBullet(owner: Entity, x: number, z: number, rot: number, pow: number, sprite: number, col: number): void {
        this.addEntity(new Bullet(owner, x, z, rot, pow, sprite, col));
    }
}