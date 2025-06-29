import Discord from "discord.js";
import { ClientWithCommands, Command } from "../types/discord";
import { getGuildAnnounceChannelId } from "../database/guilds";

export default {
    name: "get-announce-channel",
    description: "Récupère l'id du salon textuel lié aux annonces du server.",
    contexts: [
        Discord.InteractionContextType.Guild,
        Discord.InteractionContextType.PrivateChannel,
    ],
    permission: Discord.PermissionFlagsBits.Administrator,
    category: "Configuration",

    async run(
        bot: ClientWithCommands,
        interaction: Discord.Interaction,
        options: any[]
    ): Promise<void> {
        if (interaction.type != Discord.InteractionType.ApplicationCommand)
            return;

        // Get inputs variables
        const guildId = interaction.guildId as string;

        // Set the announcement channel
        const channelId = await getGuildAnnounceChannelId(guildId);

        if (channelId) {
            // Success message
            interaction.reply({
                content: `
                ✅ Le salon d'annonce actuel : <#${channelId}>
            `,
                ephemeral: true,
            });
        } else {
            // Error message
            interaction.reply({
                content: `
                ⚠️ Aucun salon d'annonce n'a été enregistré.\
                \nUtilisez la commande \`/set-announce-channel\` pour enregistrer un salon.
            `,
                ephemeral: true,
            });
        }
    },
} as Command;
