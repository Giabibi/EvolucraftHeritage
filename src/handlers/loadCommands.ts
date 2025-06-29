import Discord from "discord.js";
import fs from "fs";
import path from "path";
import { ClientWithCommands, Command } from "../types/discord";
import { convertOptionToSlashCommandOption } from "../utils/convert";

export default async (bot: ClientWithCommands) => {
    console.log(`Loading commands...`);
    const commands: Discord.RESTPostAPIChatInputApplicationCommandsJSONBody[] =
        [];
    const commandsPath = path.join(__dirname, "../commands");
    const commandsFiles = fs
        .readdirSync(commandsPath)
        .filter((f) => f.endsWith(".ts"));
    for (const [index, file] of commandsFiles.entries()) {
        const commandModule = await import(path.join(commandsPath, file));
        const command: Command = commandModule.default;
        const slashCommand = new Discord.SlashCommandBuilder()
            .setName(command.name)
            .setDescription(command.description)
            .setContexts(command.contexts)
            .setDefaultMemberPermissions(command.permission);

        if (command.options) {
            command.options.forEach((option) => {
                const optionType =
                    Discord.ApplicationCommandOptionType[option.type];
                (slashCommand as any)[`add${optionType.capitalize()}Option`](
                    convertOptionToSlashCommandOption(option)
                );
            });
        }

        bot.commands.set(command.name, command);
        commands.push(slashCommand.toJSON());
        console.log(`--> Slash command added: ${command.name}`);

        if (index === commandsFiles.length - 1) {
            const rest = new Discord.REST({ version: "10" }).setToken(
                bot.token!
            );
            try {
                await rest.put(
                    Discord.Routes.applicationCommands(bot.user?.id!),
                    { body: commands }
                );
            } catch (err) {
                console.error(`Error adding slash commands: ${err}`);
            }
        }
    }
};
