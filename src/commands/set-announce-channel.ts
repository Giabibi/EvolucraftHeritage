import Discord from "discord.js";
import { ClientWithCommands, Command } from "../types/discord";
import {
    getGuildByGuildId,
    setGuildAnnounceChannelId,
} from "../database/guilds";
import { loadRegularsMessagesByGuild } from "../handlers/loadRegularsMessages";
import { clearWatchersByGuild } from "../utils/watchers";

export default {
    name: "set-announce-channel",
    description: "Enregistre l'id du salon textuel lié aux annonces du server.",
    contexts: [
        Discord.InteractionContextType.Guild,
        Discord.InteractionContextType.PrivateChannel,
    ],
    permission: Discord.PermissionFlagsBits.Administrator,
    category: "Configuration",
    options: [
        {
            type: Discord.ApplicationCommandOptionType.Channel,
            name: "salon",
            description: "Le salon textuel lié aux annonces du server",
            required: true,
        },
    ],

    async run(
        bot: ClientWithCommands,
        interaction: Discord.Interaction,
        options: any[]
    ): Promise<void> {
        if (interaction.type != Discord.InteractionType.ApplicationCommand)
            return;

        // Get inputs variables
        const inputChannel = interaction.options.get("salon");
        if (
            !inputChannel ||
            !(inputChannel.channel instanceof Discord.TextChannel)
        ) {
            interaction.reply({
                content: "⚠️ Merci de fournir un salon textuel valide.",
                ephemeral: true,
            });
            return;
        }
        const channelId = inputChannel.value as string;
        const guildId = interaction.guildId as string;

        // Set the announcement channel
        await setGuildAnnounceChannelId(guildId, channelId);

        // Resetting up regular messages for this guild
        const guild = await getGuildByGuildId(guildId);
        if (guild) {
            clearWatchersByGuild(bot, guild.id);
            await loadRegularsMessagesByGuild(bot, guild);
        }

        // Success message
        interaction.reply({
            content: `
            ✅ Le salon d'annonce a été enregistré ! (Nouveau salon : <#${channelId}>)
        `,
            ephemeral: true,
        });
    },
} as Command;
