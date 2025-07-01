import Discord, { MessageFlags } from "discord.js";
import { ClientWithCommands, Command } from "../types/discord";

export default {
    name: "clear",
    description: "Supprime un nombre de messages dans le salon",
    contexts: [
        Discord.InteractionContextType.Guild,
        Discord.InteractionContextType.PrivateChannel,
    ],
    permission: Discord.PermissionFlagsBits.ManageMessages,
    category: "Modération",
    options: [
        {
            type: Discord.ApplicationCommandOptionType.Integer,
            name: "quantité",
            description: "Le nombre de message à supprimer",
            required: true,
            minValue: 1,
            maxValue: 100,
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
        const commandInteraction =
            interaction as Discord.ChatInputCommandInteraction;
        const inputAmount = commandInteraction.options.get("quantité", true);
        const amount = inputAmount.value as number;
        const channel = interaction.channel as Discord.TextChannel;
        try {
            // Delete messages
            const messages = await channel.bulkDelete(amount);

            await interaction.reply({
                content: `✅ J'ai bien supprimé \`${messages.size}\` message(s) dans ce salon !`,
                flags: MessageFlags.Ephemeral,
            });
        } catch (err) {
            // Get messages created before (14 days)
            const messages = [
                ...(await channel.messages.fetch())
                    .filter(
                        (msg) =>
                            !msg.interaction &&
                            Date.now() - msg.createdAt.getTime() <= 1209600000
                    )
                    .values(),
            ];

            // Handle no messages created 14 days ago
            if (messages.length <= 0) {
                interaction.reply({
                    content: `✅ Aucun message à supprimer car ils datent tous de plus de 14 jours.`,
                    flags: MessageFlags.Ephemeral,
                });
                return;
            }

            // Delete remaining messages
            try {
                await channel.bulkDelete(messages);

                // Reply with success message
                await interaction.reply({
                    content: `✅ J'ai pu supprimé uniquement \`${messages.length}\` message(s) dans ce salon car les autres dataient de plus de 14 jours.`,
                    flags: MessageFlags.Ephemeral,
                });
            } catch (_) {
                // Reply with error message
                await interaction.reply({
                    content: `⚠️ Je n'ai pas la permission d'effacer des messages.`,
                    flags: MessageFlags.Ephemeral,
                });
            }
        }
    },
} as Command;
