import Discord, { MessageFlags } from "discord.js";
import { ClientWithCommands } from "../../types/discord";
import {
    Class,
    EClass,
    getClassByEClass,
    isEClass,
} from "../../types/evolucraft/classes";
import { ERarityColor } from "../../types/evolucraft/rarity";
import { classTypes, rarityColors } from "../../types/evolucraft/prettyDisplay";

const handleClassOption = async (
    bot: ClientWithCommands,
    interaction:
        | Discord.ChatInputCommandInteraction<Discord.CacheType>
        | Discord.MessageContextMenuCommandInteraction<Discord.CacheType>
        | Discord.UserContextMenuCommandInteraction<Discord.CacheType>
        | Discord.PrimaryEntryPointCommandInteraction<Discord.CacheType>,
    selectedClass: string
) => {
    // Check if the class exist
    if (!isEClass(selectedClass)) {
        interaction.reply({
            content: "⚠️ La classe n'est pas valide.",
            flags: MessageFlags.Ephemeral,
        });
        return;
    }
    const classe: Class = getClassByEClass(selectedClass as EClass);
    const embed = new Discord.EmbedBuilder()
        .setColor(ERarityColor[classe.rarity])
        .setTitle(`Classe ${classe.name}`)
        .setDescription(
            `
                Nom : \`${classe.name}\`
                Description : \`${classe.description}\`
                Type : \`${classTypes[classe.type]}\`
                Rarity : \`${rarityColors[classe.rarity]}\`
            `
        )
        .setTimestamp()
        .setFooter({ text: "Classes de Évolucraft" });

    await interaction.reply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral,
    });
};

export default handleClassOption;
