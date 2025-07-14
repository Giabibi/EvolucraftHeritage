import Discord from "discord.js";
import path from "path";
import { ClientWithCommands, Command } from "../types/discord";
import { convertDateToString } from "../utils/convert";

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
        try {
            command.run(bot, interaction, command.options);
        } catch (e) {
            console.error(`[${command.name}][${convertDateToString(new Date(Date.now()), "yyyy-MM-dd hh:mm")}] Error:\n`, e)
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
