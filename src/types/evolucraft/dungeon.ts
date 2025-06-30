import dungeonsData from "../../../data/dungeons.json";

enum EDungeon {
    Commun = "Commun",
    Rare = "Rare",
    Épique = "Épique",
    Légendaire = "Légendaire",
    Mythique = "Mythique",
    Draconique = "Draconique",
    Abyssal = "Abyssal",
    Halloween = "Halloween",
    GivréCommun = "Givré Commun",
    GivréÉpique = "Givré Épique",
    Amour = "Amour",
    Cupidon = "Cupidon",
    TerrierDuRoiLapin = "Terrier du Roi Lapin",
    FabriqueDeChocolat = "Fabrique de Chocolat",
}

interface Dungeon {
    name: EDungeon;
    minLevel: number;
    maxPlayers: number;
    portalColor: string;
    imgUrl: string;
}

const isEDungeon = (value: string): value is EDungeon => {
    return Object.values(EDungeon).includes(value as EDungeon);
};
const getDungeonByEDungeon = (dungeon: EDungeon): Dungeon => {
    const entry = dungeonsData.find((d) => d.name === dungeon);

    if (!entry) {
        throw new Error(`Donjon non trouvée pour ${dungeon}`);
    }

    return {
        name: dungeon,
        minLevel: entry.minLevel,
        maxPlayers: entry.maxPlayers,
        portalColor: entry.portalColor,
        imgUrl: entry.imgUrl,
    };
};
const getDungeons = (): Dungeon[] => {
    return dungeonsData.map((dungeon) => {
        return {
            name: dungeon.name,
            minLevel: dungeon.minLevel,
            maxPlayers: dungeon.maxPlayers,
            portalColor: dungeon.portalColor,
            imgUrl: dungeon.imgUrl,
        } as Dungeon;
    });
};

export { Dungeon, EDungeon, isEDungeon, getDungeonByEDungeon, getDungeons };
