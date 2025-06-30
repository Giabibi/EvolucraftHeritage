import Discord, { MessageFlags } from "discord.js";
import { ClientWithCommands, Command } from "../types/discord";
import { convertPermissionToString } from "../utils/convert";

export default {
    name: "help",
    description: "Liste toutes les commandes disponibles",
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
        try {
            const member = interaction.member as Discord.GuildMember;
            const choices = bot.commands.filter(
                (command) =>
                    command.name.toLowerCase().includes(entry.toLowerCase()) &&
                    (command.permission
                        ? member.permissions.has(
                              command.permission as Discord.PermissionResolvable
                          )
                        : true)
            );

            await interaction.respond(
                choices
                    .map((command) => ({
                        name: command.name,
                        value: command.name,
                    }))
                    .sort((a, b) => a.name.localeCompare(b.name))
            );
        } catch (_) {
            await interaction.respond(
                bot.commands
                    .map((command) => ({
                        name: command.name,
                        value: command.name,
                    }))
                    .sort((a, b) => a.name.localeCompare(b.name))
            );
        }
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

            try {
                if (!(interaction.member instanceof Discord.GuildMember))
                    throw Error(
                        "This is not a guild message, so no user permission."
                    );
                const member = interaction.member as Discord.GuildMember;

                let commandsAmount = 0;
                let categoriesAmount = 0;

                categories.sort().forEach((category) => {
                    let commands = bot.commands.filter(
                        (c) =>
                            c.category === category &&
                            (c.permission
                                ? member.permissions.has(
                                      c.permission as Discord.PermissionResolvable
                                  )
                                : true)
                    );
                    if (commands.size > 0) {
                        commandsAmount += commands.size;
                        categoriesAmount += 1;
                        embed.addFields({
                            name: `${category}`,
                            value: commands
                                .map((c) => `\`${c.name}\` : ${c.description}`)
                                .join("\n"),
                        });
                    }
                });

                embed.setDescription(
                    `Commandes disponibles : \`${commandsAmount}\`\nCatégories disponibles : \`${categoriesAmount}\``
                );

                await interaction.reply({
                    embeds: [embed],
                    flags: MessageFlags.Ephemeral,
                });
            } catch (_) {
                categories.sort().forEach((category) => {
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
            }
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
