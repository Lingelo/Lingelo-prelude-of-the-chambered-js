export class Item {
    public static readonly none = new Item(-1, 0xFFC363, "", "");
    public static readonly powerGlove = new Item(0, 0xFFC363, "Power Glove", "Smaaaash!!");
    public static readonly pistol = new Item(1, 0xEAEAEA, "Pistol", "Pew, pew, pew!");
    public static readonly flippers = new Item(2, 0x7CBBFF, "Flippers", "Splish splash!");
    public static readonly cutters = new Item(3, 0xCCCCCC, "Cutters", "Snip, snip!");
    public static readonly skates = new Item(4, 0xAE70FF, "Skates", "Sharp!");
    public static readonly key = new Item(5, 0xFF4040, "Key", "How did you get this?");
    public static readonly potion = new Item(6, 0x4AFF47, "Potion", "Healthy!");

    public readonly icon: number;
    public readonly color: number;
    public readonly name: string;
    public readonly description: string;

    private constructor(icon: number, color: number, name: string, description: string) {
        this.icon = icon;
        this.color = color;
        this.name = name;
        this.description = description;
    }
}