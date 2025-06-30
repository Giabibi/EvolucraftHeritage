import Discord, { MessageFlags } from "discord.js";
import { ClientWithCommands } from "../../types/discord";
import {
    Dungeon,
    EDungeon,
    getDungeonByEDungeon,
    isEDungeon,
} from "../../types/evolucraft/dungeon";

const handleDungeonOption = async (
    bot: ClientWithCommands,
    interaction:
        | Discord.ChatInputCommandInteraction<Discord.CacheType>
        | Discord.MessageContextMenuCommandInteraction<Discord.CacheType>
        | Discord.UserContextMenuCommandInteraction<Discord.CacheType>
        | Discord.PrimaryEntryPointCommandInteraction<Discord.CacheType>,
    selectedDungeon: string
) => {
    // Check if the class exist
    if (!isEDungeon(selectedDungeon)) {
        interaction.reply({
            content: "⚠️ Le donjon n'est pas valide.",
            flags: MessageFlags.Ephemeral,
        });
        return;
    }
    const dungeon: Dungeon = getDungeonByEDungeon(selectedDungeon as EDungeon);
    const embed = new Discord.EmbedBuilder()
        .setColor(bot.color)
        .setTitle(`Donjon ${dungeon.name}`)
        .setThumbnail(bot.user?.displayAvatarURL()!)
        .setDescription(
            `
                Nom : \`${dungeon.name}\`
                Niveau Requis : \`${dungeon.minLevel}\`
                Joueurs Max : \`${dungeon.maxPlayers}\`
                Couleur du portail : \`${dungeon.portalColor}\`
            `
        )
        .setImage(dungeon.imgUrl)
        .setTimestamp()
        .setFooter({ text: "Donjons de Évolucraft" });

    await interaction.reply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral,
    });
};

export default handleDungeonOption;
