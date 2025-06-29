import Discord, { MessageFlags } from "discord.js";
import { ClientWithCommands, Command } from "../types/discord";

export default {
    name: "ping",
    description: "Montre le ping du bot discord",
    contexts: [
        Discord.InteractionContextType.BotDM,
        Discord.InteractionContextType.Guild,
        Discord.InteractionContextType.PrivateChannel,
    ],
    permission: null,
    category: "Informations",

    async run(
        bot: ClientWithCommands,
        interaction: Discord.Interaction
    ): Promise<void> {
        if (interaction.type === Discord.InteractionType.ApplicationCommand) {
            await interaction.reply({
                content: `Ping : \`${bot.ws.ping}\``,
                flags: MessageFlags.Ephemeral,
            });
        }
    },
} as Command;
