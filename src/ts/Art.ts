import { Bitmap } from './gui/Bitmap';

export class Art {
    public static font: Bitmap;
    public static items: Bitmap;
    public static panel: Bitmap;
    public static floors: Bitmap;
    public static sprites: Bitmap;
    public static walls: Bitmap;
    public static sky: Bitmap;

    public static init(): void {
        Art.font = new Bitmap(252, 64);
        Art.items = new Bitmap(128, 128);
        Art.panel = new Bitmap(160, 29);
        Art.floors = new Bitmap(128, 128);
        Art.sprites = new Bitmap(128, 128);
        Art.walls = new Bitmap(128, 128);
        Art.sky = new Bitmap(512, 120);

        // TODO: Load actual textures from image files
        Art.font.fill(0, 0, Art.font.width, Art.font.height, 0xffffff);
        Art.items.fill(0, 0, Art.items.width, Art.items.height, 0x808080);
        Art.panel.fill(0, 0, Art.panel.width, Art.panel.height, 0x404040);
        Art.floors.fill(0, 0, Art.floors.width, Art.floors.height, 0x606060);
        Art.sprites.fill(0, 0, Art.sprites.width, Art.sprites.height, 0x808080);
        Art.walls.fill(0, 0, Art.walls.width, Art.walls.height, 0x808080);
        Art.sky.fill(0, 0, Art.sky.width, Art.sky.height, 0x4477aa);
    }

    public static getCol(color: number): number {
        return color;
    }
}