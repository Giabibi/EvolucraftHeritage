import Discord, { MessageFlags } from "discord.js";
import { ClientWithCommands, Command } from "../types/discord";
import { convertPermissionToString } from "../utils/convert";

export default {
    name: "help",
    description: "Affiche des informations sur les commandes",
    contexts: [
        Discord.InteractionContextType.BotDM,
        Discord.InteractionContextType.Guild,
        Discord.InteractionContextType.PrivateChannel,
    ],
    permission: null,
    category: "Informations",
    options: [
        {
            type: Discord.ApplicationCommandOptionType.String,
            name: "commande",
            description: "La commande à afficher",
            required: false,
            autocomplete: true,
        },
    ],

    async autocomplete(
        bot: ClientWithCommands,
        interaction: Discord.Interaction,
        options: any[]
    ): Promise<void> {
        if (
            interaction.type !=
            Discord.InteractionType.ApplicationCommandAutocomplete
        )
            return;

        const entry = interaction.options.getFocused();
        const choices = bot.commands.filter((command) =>
            command.name.toLowerCase().includes(entry.toLowerCase())
        );

        await interaction.respond(
            (entry === "" ? bot.commands : choices)
                .map((command) => ({ name: command.name, value: command.name }))
                .sort((a, b) => a.name.localeCompare(b.name))
        );
    },

    async run(
        bot: ClientWithCommands,
        interaction: Discord.Interaction,
        options: any[]
    ): Promise<void> {
        if (interaction.type != Discord.InteractionType.ApplicationCommand)
            return;

        let command: Command | undefined;
        const commandInteraction =
            interaction as Discord.ChatInputCommandInteraction;
        if (commandInteraction.options.get("commande")) {
            command = bot.commands.get(
                (
                    commandInteraction.options.get("commande")?.value ?? ""
                ).toString()
            );
            if (!command) {
                interaction.reply({
                    content: "⚠️ Commande inconnue.",
                    flags: MessageFlags.Ephemeral,
                });
                return;
            }
        }
        if (!command) {
            let categories: string[] = [];
            bot.commands.forEach((command) => {
                if (!categories.includes(command.category))
                    categories.push(command.category);
            });

            let embed = new Discord.EmbedBuilder()
                .setColor(bot.color)
                .setTitle(`Commandes du bot`)
                .setThumbnail(bot.user?.displayAvatarURL()!)
                .setDescription(
                    `Commandes disponibles : \`${bot.commands.size}\`\nCatégories disponibles : \`${categories.length}\``
                )
                .setTimestamp()
                .setFooter({ text: "Commandes du bot" });

            await categories.sort().forEach(async (category) => {
                let commands = bot.commands.filter(
                    (c) => c.category === category
                );
                embed.addFields({
                    name: `${category}`,
                    value: commands
                        .map((c) => `\`${c.name}\` : ${c.description}`)
                        .join("\n"),
                });
            });

            await interaction.reply({
                embeds: [embed],
                flags: MessageFlags.Ephemeral,
            });
        } else {
            let embed = new Discord.EmbedBuilder()
                .setColor(bot.color)
                .setTitle(`Commande ${command.name}`)
                .setThumbnail(bot.user?.displayAvatarURL()!)
                .setDescription(
                    `
                Nom : \`${command.name}\`
                Description : \`${command.description}\`
                Permission requise : \`${convertPermissionToString(
                    command.permission
                )}\`
                Commande en DM : \`${
                    command.contexts.includes(
                        Discord.InteractionContextType.BotDM
                    )
                        ? "Oui"
                        : "Non"
                }\`
                Catégorie : \`${command.category}\`
            `
                )
                .setTimestamp()
                .setFooter({ text: "Commandes du bot" });

            await interaction.reply({
                embeds: [embed],
                flags: MessageFlags.Ephemeral,
            });
        }
    },
} as Command;
