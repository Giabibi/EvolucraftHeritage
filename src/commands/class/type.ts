import Discord, { MessageFlags } from "discord.js";
import { ClientWithCommands } from "../../types/discord";
import { classTypes, rarityColors } from "../../types/evolucraft/prettyDisplay";
import {
    EClassType,
    Class,
    EClass,
    EClassRarity,
    getClasses,
} from "../../types/evolucraft/classes";
import rawClasses from "../../../data/classes.json";

const handleTypeOption = async (
    bot: ClientWithCommands,
    interaction:
        | Discord.ChatInputCommandInteraction<Discord.CacheType>
        | Discord.MessageContextMenuCommandInteraction<Discord.CacheType>
        | Discord.UserContextMenuCommandInteraction<Discord.CacheType>
        | Discord.PrimaryEntryPointCommandInteraction<Discord.CacheType>,
    typeFilter: string
) => {
    // Valide et cast vers EClassType
    if (!Object.values(EClassType).includes(typeFilter as EClassType)) {
        return interaction.reply({
            content: "⚠️ Le type renseigné est invalide.",
            flags: MessageFlags.Ephemeral,
        });
    }
    const targetType = typeFilter as EClassType;

    // Filtrage par rareté
    const filteredClasses = getClasses().filter(
        (cls) => cls.type === targetType
    );

    if (filteredClasses.length === 0) {
        return interaction.reply({
            content: `⚠️ Aucune classe trouvée pour le type \`${typeFilter}\`.`,
            flags: MessageFlags.Ephemeral,
        });
    }

    // Construction de l'embed
    const embed = new Discord.EmbedBuilder()
        .setColor(bot.color)
        .setTitle(`Classes de type ${classTypes[targetType]}`)
        .setDescription(
            `Voici toutes les classes du type \`${classTypes[targetType]}\`.`
        )
        .setTimestamp()
        .setFooter({ text: "Classes de Évolucraft" });

    for (const cls of filteredClasses) {
        embed.addFields({
            name: `${cls.emoji} ${cls.name}`,
            value: `Rareté : \`${rarityColors[cls.rarity]}\``,
            inline: true,
        });
    }

    await interaction.reply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral,
    });
};

export default handleTypeOption;
