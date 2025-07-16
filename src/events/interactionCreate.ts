import Discord, { MessageFlags } from "discord.js";
import path from "path";
import { ClientWithCommands, Command } from "../types/discord";
import { convertDateToString } from "../utils/convert";

const authorizedGuildsIds: string[] = ["707715843018195035"];

export default async (
    bot: ClientWithCommands,
    interaction: Discord.Interaction
) => {
    if (
        interaction.type != Discord.InteractionType.ApplicationCommand &&
        interaction.type !=
            Discord.InteractionType.ApplicationCommandAutocomplete
    )
        return;

    const commandsPath = path.join(__dirname, "../commands");

    if (interaction.type === Discord.InteractionType.ApplicationCommand) {
        const commandModule = await import(
            path.join(commandsPath, interaction.commandName)
        );
        const command: Command = commandModule.default;
        if (
            command.category === "Héritage" &&
            interaction.context === Discord.InteractionContextType.Guild &&
            interaction.guildId &&
            !authorizedGuildsIds.includes(interaction.guildId)
        ) {
            await interaction.reply({
                content: `⛔ Vous ne pouvez pas interagir avec des commandes de cette catégorie sans être dans le serveur adéquate.`,
                flags: MessageFlags.Ephemeral,
            });
            return;
        }
        try {
            command.run(bot, interaction, command.options);
        } catch (e) {
            console.error(
                `[${command.name}][${convertDateToString(
                    new Date(Date.now()),
                    "yyyy-MM-dd hh:mm"
                )}] Error:\n`,
                e
            );
        }
    }
    if (
        interaction.type ===
        Discord.InteractionType.ApplicationCommandAutocomplete
    ) {
        const commandModule = await import(
            path.join(commandsPath, interaction.commandName)
        );
        const command: Command = commandModule.default;
        if (command.autocomplete !== undefined) {
            command.autocomplete(bot, interaction, command.options);
        }
    }
};
