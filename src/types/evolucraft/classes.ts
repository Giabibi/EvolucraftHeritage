import classesData from "../../../data/classes.json";

enum EClass {
    Archer = "Archer",
    Barde = "Barde",
    Guerrier = "Guerrier",
    Mage = "Mage",
    Illusionniste = "Illusionniste",
    Assassin = "Assassin",
    Paladin = "Paladin",
    Élémentaliste = "Élémentaliste",
    ChevalierDesGlaces = "Chevalier des glaces",
    Chaman = "Chaman",
    Invocateur = "Invocateur",
    Moine = "Moine",
    Faucheur = "Faucheur",
    Archimage = "Archimage",
    GuerrierDragon = "Guerrier Dragon",
    Clerc = "Clerc",
    ArtisteMartial = "Artiste Martial",
    Artificier = "Artificier",
    Samouraï = "Samouraï",
    ChevalierDeLaMort = "Chevalier de la mort",
}
enum EClassType {
    DPS = "DPS",
    Tank = "Tank",
    Heal = "Heal",
}
enum EClassRarity {
    Commun = "Commun",
    Rare = "Rare",
    Épique = "Épique",
    Légendaire = "Légendaire",
    Mythique = "Mythique",
}

interface Class {
    name: EClass;
    type: EClassType;
    rarity: EClassRarity;
    emoji: string;
}

const isEClass = (value: string): value is EClass => {
    return Object.values(EClass).includes(value as EClass);
};
const getClassByEClass = (classe: EClass): Class => {
    const entry = classesData.find((c) => c.name === classe);

    if (!entry) {
        throw new Error(`Classe non trouvée pour ${classe}`);
    }

    return {
        name: classe,
        type: EClassType[entry.type as keyof typeof EClassType],
        rarity: EClassRarity[entry.rarity as keyof typeof EClassRarity],
        emoji: entry.emoji,
    };
};

export { Class, EClass, EClassType, EClassRarity, isEClass, getClassByEClass };
