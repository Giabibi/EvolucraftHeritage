import Discord from "discord.js";
import { ClientWithCommands, Command } from "../types/discord";

export default {
    name: "clear",
    description: "Supprime des messages",
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
        const inputAmount = interaction.options.get("quantité");
        if (!inputAmount) {
            interaction.reply({
                content:
                    "⚠️ Merci de fournir la quantité de message à supprimer.",
                ephemeral: true,
            });
            return;
        }
        const amount = inputAmount.value as number;

        // Check if the amount is possible
        if (amount < 0 || amount > 100) {
            interaction.reply({
                content: `⚠️ La quantité (\`${amount}\`) de message à supprimer n'est pas comprise entre \`0\` et \`100\``,
                ephemeral: true,
            });
            return;
        }

        const channel = interaction.channel as Discord.TextChannel;
        try {
            // Delete messages
            const messages = await channel.bulkDelete(amount);

            await interaction.reply({
                content: `✅ J'ai bien supprimé \`${messages.size}\` message(s) dans ce salon !`,
                ephemeral: true,
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
                    ephemeral: true,
                });
                return;
            }

            // Delete remaining messages
            await channel.bulkDelete(messages);

            // Reply with success message
            await interaction.reply({
                content: `✅ J'ai pu supprimé uniquement \`${messages.length}\` message(s) dans ce salon car les autres dataient de plus de 14 jours.`,
                ephemeral: true,
            });
        }
    },
} as Command;
