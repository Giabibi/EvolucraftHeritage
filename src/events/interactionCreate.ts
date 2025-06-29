import Discord from "discord.js";
import path from "path";
import { ClientWithCommands, Command } from "../types/discord";

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
        command.run(bot, interaction, command.options);
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
