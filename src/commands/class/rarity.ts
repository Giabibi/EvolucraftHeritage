import Discord, { MessageFlags } from "discord.js";
import { ClientWithCommands } from "../../types/discord";
import { classTypes } from "../../types/evolucraft/prettyDisplay";
import {
    Class,
    EClass,
    EClassType,
    EClassRarity,
    getClasses,
} from "../../types/evolucraft/classes";
import rawClasses from "../../../data/classes.json";
import { ERarityColor } from "../../types/evolucraft/rarity";

const handleRarityOption = async (
    bot: ClientWithCommands,
    interaction:
        | Discord.ChatInputCommandInteraction<Discord.CacheType>
        | Discord.MessageContextMenuCommandInteraction<Discord.CacheType>
        | Discord.UserContextMenuCommandInteraction<Discord.CacheType>
        | Discord.PrimaryEntryPointCommandInteraction<Discord.CacheType>,
    rarityFilter: string
) => {
    // Valide et cast vers EClassRarity
    if (!Object.values(EClassRarity).includes(rarityFilter as EClassRarity)) {
        return interaction.reply({
            content: "⚠️ La rareté renseignée est invalide.",
            flags: MessageFlags.Ephemeral,
        });
    }

    const targetRarity = rarityFilter as EClassRarity;

    // Filtrage par rareté
    const filteredClasses = getClasses().filter(
        (cls) => cls.rarity === targetRarity
    );

    if (filteredClasses.length === 0) {
        return interaction.reply({
            content: `⚠️ Aucune classe trouvée avec la rareté \`${rarityFilter}\`.`,
            flags: MessageFlags.Ephemeral,
        });
    }

    // Embed
    const embed = new Discord.EmbedBuilder()
        .setColor(ERarityColor[targetRarity])
        .setTitle(`Classes de rareté ${rarityFilter}`)
        .setDescription(
            `Voici toutes les classes de rareté \`${rarityFilter}\`.`
        )
        .setTimestamp()
        .setFooter({ text: "Classes de Évolucraft" });

    for (const cls of filteredClasses) {
        embed.addFields({
            name: `${cls.emoji} ${cls.name}`,
            value: `Type : \`${classTypes[cls.type]}\``,
            inline: true,
        });
    }

    await interaction.reply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral,
    });
};

export default handleRarityOption;
