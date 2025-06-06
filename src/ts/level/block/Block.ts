import { Entity } from '../../entities/Entity';
import { Player } from '../../entities/Player';
import { Item } from '../../entities/Item';
import { Sprite } from '../../gui/Sprite';
import { Level } from '../Level';

export class Block {
    protected static readonly random = Math.random;

    public blocksMotion: boolean = false;
    public solidRender: boolean = false;

    public messages: string[] | null = null;

    public sprites: Sprite[] = [];
    public entities: Entity[] = [];

    public tex: number = -1;
    public col: number = -1;

    public floorCol: number = -1;
    public ceilCol: number = -1;

    public floorTex: number = -1;
    public ceilTex: number = -1;

    public level!: Level;
    public x: number = 0;
    public y: number = 0;

    public id: number = 0;

    public addSprite(sprite: Sprite): void {
        this.sprites.push(sprite);
    }

    public use(_level: Level, _item: Item): boolean {
        return false;
    }

    public tick(): void {
        for (let i = 0; i < this.sprites.length; i++) {
            const sprite = this.sprites[i];
            sprite.tick();
            if (sprite.removed) {
                this.sprites.splice(i--, 1);
            }
        }
    }

    public removeEntity(entity: Entity): void {
        const index = this.entities.indexOf(entity);
        if (index > -1) {
            this.entities.splice(index, 1);
        }
    }

    public addEntity(entity: Entity): void {
        this.entities.push(entity);
    }

    public blocks(_entity: Entity): boolean {
        return this.blocksMotion;
    }

    public decorate(_level: Level, _x: number, _y: number): void {
    }

    public getFloorHeight(_e: Entity): number {
        return 0;
    }

    public getWalkSpeed(_player: Player): number {
        return 1;
    }

    public getFriction(_player: Player): number {
        return 0.6;
    }

    public trigger(_pressed: boolean): void {
    }
}