import petsData from "../../../data/pets.json";

enum EPetRarity {
    Commun = "Commun",
    Rare = "Rare",
    Épique = "Épique",
    Légendaire = "Légendaire",
    Mythique = "Mythique",
}
enum EPet {
    Meow = "Meow",
    Duck = "Duck",
    Lapinou = "Lapinou",
    Nugget = "Nugget",
    Pike = "Pike",
    Surt = "Surt",
    Patate = "Patate",
    Coka = "Coka",
    TheReaper = "The reaper",
    Olaf = "Olaf",
    Chimère = "Chimère",
    CotCot = "Cot-Cot",
    Chaudroth = "Chaudroth",
    Goat = "Goat",
    Hedwig = "Hedwig",
    Mayline = "Mayline",
    Shira = "Shira",
    Viserion = "Viserion",
    Albi = "Albi",
    Crusty = "Crusty",
    Rio = "Rio",
    Rudolphe = "Rudolphe",
    Nanook = "Nanook",
    SerpentCristallin = "Serpent Cristallin",
    BilbonSacquet = "Bilbon Sacquet",
    Clocher = "Clocher",
    Rodeer = "Rodeer",
    Anubis = "Anubis",
    Biggoron = "Biggoron",
    Bolg = "Bolg",
    BufoBufo = "Bufo Bufo",
    Denvheur = "Denvheur",
    Lillith = "Lillith",
    Dracon = "Dracon",
    Nayru = "Nayru",
    Pohaku = "Pohaku",
    Pow = "Pow",
    Skog = "Skog",
    Yukio = "Yukio",
    Drogon = "Drogon",
    Gribouille = "Gribouille",
    Merlock = "Merlock",
    Ça = "Ça",
    IceQueen = "Ice Queen",
    Groot = "Groot",
    Arhi = "Arhi",
    Clochette = "Clochette",
    Dovregubben = "Dovregubben",
    Bruce = "Bruce",
    Doggo = "Doggo",
    Knity = "Knity",
    Navet = "Navet",
    RainbowDash = "Rainbow Dash",
    Raksha = "Raksha",
    René = "René",
    Woody = "Woody",
    Saphira = "Saphira",
    Phoenix = "Phoenix",
    Dracula = "Dracula",
    Cupidon = "Cupidon",
    Chocovor = "Chocovor",
    RatDeBilly = "Rat de Billy",
    Jack = "Jack",
    PetitBiscuit = "Petit Biscuit",
    Leprechaun = "Leprechaun",
}
enum EPetEffectType {
    MinecraftEffect = "MinecraftEffect",
    ArgentStockage = "ArgentStockage",
    BuffSpecial = "BuffSpecial",
    Résistance = "Résistance",
    Stockage = "Stockage",
    Monture = "Monture",
    Argent = "Argent",
    Vente = "Vente",
    Stat = "Stat",
    Exp = "Exp",
}
enum EPetEffectName {
    ArgentParHeure = "$/h",
    RegenerationMana = "Régénération de mana",
    ChanceCritique = "Chance de Critique",
    DégâtsCritiques = "Dégâts Critiques",
    RegenerationVie = "Régénération",
    Statistiques = "Statistiques",
    Dextérité = "Dextérité",
    Vitesse = "Vitesse",
    Défense = "Défense",
    Force = "Force",
    Mana = "Mana",
    Vie = "Vie",
    VisionNocturne = "Vision Nocturne",
    GrâceDauphin = "Grâce du Dauphin",
    Respiration = "Respiration",
    Célérité = "Célérité",
    Épines = "Épines",
    ExpMinecraft = "Minecraft",
    ExpForgemage = "Forgemage",
    ExpBûcheron = "Bûcheron",
    ExpChasseur = "Chasseur",
    ExpFermier = "Fermier",
    ExpPêcheur = "Pêcheur",
    ExpMétiers = "Métiers",
    ExpMineur = "Mineur",
    VenteChezJimmy = "chez Jimmy",
    VenteBetteravesChezJimmy = "de Betterave chez Jimmy",
    VenteCarottesChezJimmy = "de Carotte chez Jimmy",
    VenteFicelleChezJimmy = "de Ficelle chez Jimmy",
    VentePatatesChezJimmy = "de Patate chez Jimmy",
    VenteQuartzChezJimmy = "de Quartz chez Jimmy",
    VentePatatesEmpoisonnées = "de Patates empoisonnées",
    VenteÉclatsDePrismarine = "d'éclats de Prismarine",
    VenteButinsDeMonstres = "de butins de monstres",
    VenteChairsPutréfiées = "de Chairs putréfiées",
    VenteVerruesDuNether = "de Verrues du Nether",
    VenteBûchesMangrove = "de Bûches de mangrove",
    VentePattesDeLapin = "de Pattes de lapin",
    VenteBoulesDeSlime = "de Boules de Slime",
    VenteBûchesAcacia = "de Bûches d'acacia",
    VenteBûchesChêne = "de Bûches de chêne",
    VenteBûchesSapin = "de Bûches de sapin",
    VenteLingotsDeFer = "de Lingots de fer",
    VentePoissonsCrus = "de poissons crus",
    VentePeauDeLapin = "de Peau de lapin",
    VenteCanneSucre = "de Canne à Sucre",
    VenteCitrouilles = "de Citrouille",
    VenteLingotsOr = "de Lingots d'or",
    VentePouletCru = "de Poulet cru",
    VentePastèques = "de Pastèque",
    VenteMinerais = "de minerais",
    VenteCultures = "de cultures",
    VenteInsectes = "d'insectes",
    VenteDiamants = "de Diamants",
    VenteCarottes = "de Carotte",
    VenteDiorites = "de Diorite",
    VentePierres = "de Pierres",
    VenteBûches = "de bûches",
    VenteGâteau = "de Gâteau",
    VenteCactus = "de Cactus",
    VenteCuivre = "de Cuivre",
    VenteRoches = "de Roches",
    VenteSteaks = "de Steak",
    VenteAlgues = "d'Algues",
    VenteGlace = "de Glace",
    VenteMorue = "de Morue",
    VenteBaies = "de Baies",
    VenteBlé = "de Blé",
    VenteOs = "d'Os",
    EnflammerEnnemis = "de chance d'enflammer les ennemis",
    DégâtsMonstres = "de dégâts aux monstres Vanilla",
    DégâtsAbyssaux = "de dégâts aux monstres Abyssaux",
    VolDeVie = "de Vol de vie",
    RésistanceChute = "-100% de dégâts de chute",
    RésistanceFaim = "-100% de faim",
    RésistanceFeu = "Résistance au feu",
    MontureTerrestre = "Terrestre",
    MontureAérienne = "Aérienne",
    ArgentStockageSimple = "$/h + Stockage coffre simple",
    ArgentStockageDouble = "$/h + Stockage double coffre",
    StockageSimple = "Stockage coffre simple",
    StockageDouble = "Stockage double coffre",
}

interface PetEffect {
    level: number;
    type: EPetEffectType;
    name: EPetEffectName;
    amount: number;
}

interface Pet {
    name: EPet;
    rarity: EPetRarity;
    effects: PetEffect[];
}

const isEPet = (value: string): value is EPet => {
    return Object.values(EPet).includes(value as EPet);
};
const getPetByEPet = (pet: EPet): Pet => {
    const entry = petsData.find((p) => p.name === pet);

    if (!entry) {
        throw new Error(`Pet non trouvée pour ${pet}`);
    }

    return {
        name: pet,
        rarity: EPetRarity[entry.rarity as keyof typeof EPetRarity],
        effects: entry.effects.map((effect) => effect as PetEffect),
    };
};
const getPets = (): Pet[] => {
    return petsData.map((pet) => {
        return {
            name: pet.name,
            rarity: EPetRarity[pet.rarity as keyof typeof EPetRarity],
            effects: pet.effects.map((effect) => effect as PetEffect),
        } as Pet;
    });
};

export {
    Pet,
    EPet,
    EPetEffectType,
    EPetEffectName,
    isEPet,
    getPetByEPet,
    getPets,
};
