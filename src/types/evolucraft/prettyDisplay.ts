import { EPetEffectName, EPetEffectType } from "./pets";

const classTypes: Record<string, string> = {
    DPS: "⚔️ DPS",
    Tank: "🛡️ Tank",
    Heal: "🩹 Heal",
};

const rarityColors: Record<string, string> = {
    Commun: "🟢 Commun",
    Rare: "🟡 Rare",
    Épique: "🔵 Épique",
    Légendaire: "🟣 Légendaire",
    Mythique: "🔴 Mythique",
};

const displayPetEffect = (
    type: EPetEffectType,
    name: EPetEffectName,
    amount: number
): string => {
    switch (type) {
        case EPetEffectType.MinecraftEffect:
            return `${name} ${amount > 0 ? amount : ""}`;
        case EPetEffectType.ArgentStockage:
            return `+${amount}${name}`;
        case EPetEffectType.BuffSpecial:
            return `+${amount}% ${name}`;
        case EPetEffectType.Résistance:
            return `${name}`;
        case EPetEffectType.Stockage:
            return `${name}`;
        case EPetEffectType.Monture:
            return `Monture (${name})`;
        case EPetEffectType.Argent:
            return `+${amount}${name}`;
        case EPetEffectType.Vente:
            return `+${amount}% sur la vente ${name}`;
        case EPetEffectType.Stat:
            return `${name} +${amount}`;
        case EPetEffectType.Exp:
            return `+${amount}% d'EXP ${name}`;
        default:
            return "--- Unknown ---";
    }
};

export { classTypes, rarityColors, displayPetEffect };
