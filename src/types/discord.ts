import Discord from "discord.js";

type EventFunction = (bot: Discord.Client, ...args: any[]) => void;
type SlashCommandOption =
    | Discord.SlashCommandAttachmentOption
    | Discord.SlashCommandBooleanOption
    | Discord.SlashCommandChannelOption
    | Discord.SlashCommandIntegerOption
    | Discord.SlashCommandMentionableOption
    | Discord.SlashCommandNumberOption
    | Discord.SlashCommandRoleOption
    | Discord.SlashCommandStringOption
    | Discord.SlashCommandUserOption
    | undefined;

interface Command {
    run: (
        bot: ClientWithCommands,
        interaction: Discord.Interaction,
        options?: any[]
    ) => Promise<void> | void;
    autocomplete?: (
        bot: ClientWithCommands,
        interaction: Discord.Interaction,
        options?: any[]
    ) => Promise<void> | void;
    name: string;
    description: string;
    contexts: Discord.InteractionContextType[];
    permission: bigint | number | null | undefined;
    category: string;
    options?: Discord.ApplicationCommandOptionData[];
}
interface Watcher extends NodeJS.Timeout {
    guildId: number;
    name: string;
    isInterval: boolean;
}
interface ClientWithCommands extends Discord.Client {
    announcesWatchers: Watcher[];
    commands: Discord.Collection<string, Command>;
    color: Discord.ColorResolvable;
}
interface UserLevel {
    user: Discord.User;
    level: number;
}

export type {
    EventFunction,
    SlashCommandOption,
    Command,
    Watcher,
    ClientWithCommands,
    UserLevel,
};
