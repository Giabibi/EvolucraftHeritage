import Discord, { SlashCommandSubcommandBuilder } from "discord.js";
import { SlashCommandOption } from "../types/discord";
import { Interval } from "../types/utils";
import { TimeEach } from "../types/macros";
import { Announcement } from "../types/database";

const convertOptionToSlashCommandOption = (
    option: Discord.ApplicationCommandOptionData
): SlashCommandOption => {
    switch (option.type) {
        case Discord.ApplicationCommandOptionType.Attachment:
            let commandAttachmentOption =
                new Discord.SlashCommandAttachmentOption();
            commandAttachmentOption
                .setName(option.name)
                .setDescription(option.description)
                .setRequired(option.required ?? false);
            return commandAttachmentOption;
        case Discord.ApplicationCommandOptionType.Boolean:
            let commandBooleanOption = new Discord.SlashCommandBooleanOption();
            commandBooleanOption
                .setName(option.name)
                .setDescription(option.description)
                .setRequired(option.required ?? false);
            return commandBooleanOption;
        case Discord.ApplicationCommandOptionType.Channel:
            let commandChannelOption = new Discord.SlashCommandChannelOption();
            commandChannelOption
                .setName(option.name)
                .setDescription(option.description)
                .setRequired(option.required ?? false);
            return commandChannelOption;
        case Discord.ApplicationCommandOptionType.Integer:
            let commandIntegerOption = new Discord.SlashCommandIntegerOption();
            commandIntegerOption
                .setName(option.name)
                .setDescription(option.description)
                .setRequired(option.required ?? false)
                .setAutocomplete(option.autocomplete ?? false);
            if (option.minValue !== undefined)
                commandIntegerOption.setMinValue(option.minValue);
            if (option.maxValue !== undefined)
                commandIntegerOption.setMaxValue(option.maxValue);
            return commandIntegerOption;
        case Discord.ApplicationCommandOptionType.Mentionable:
            let commandMentionableOption =
                new Discord.SlashCommandMentionableOption();
            commandMentionableOption
                .setName(option.name)
                .setDescription(option.description)
                .setRequired(option.required ?? false);
            return commandMentionableOption;
        case Discord.ApplicationCommandOptionType.Number:
            let commandNumberOption = new Discord.SlashCommandNumberOption();
            commandNumberOption
                .setName(option.name)
                .setDescription(option.description)
                .setRequired(option.required ?? false)
                .setAutocomplete(option.autocomplete ?? false);
            if (option.minValue !== undefined)
                commandNumberOption.setMinValue(option.minValue);
            if (option.maxValue !== undefined)
                commandNumberOption.setMaxValue(option.maxValue);
            return commandNumberOption;
        case Discord.ApplicationCommandOptionType.Role:
            let commandRoleOption = new Discord.SlashCommandRoleOption();
            commandRoleOption
                .setName(option.name)
                .setDescription(option.description)
                .setRequired(option.required ?? false);
            return commandRoleOption;
        case Discord.ApplicationCommandOptionType.String:
            let commandStringOption = new Discord.SlashCommandStringOption();
            commandStringOption
                .setName(option.name)
                .setDescription(option.description)
                .setRequired(option.required ?? false)
                .setAutocomplete(option.autocomplete ?? false);
            return commandStringOption;
        case Discord.ApplicationCommandOptionType.User:
            let commandUserOption = new Discord.SlashCommandUserOption();
            commandUserOption
                .setName(option.name)
                .setDescription(option.description)
                .setRequired(option.required ?? false);
            return commandUserOption;
        default:
            return undefined;
    }
};
const convertOptionToSlashCommandSubcommandBuilder = (
    option: Discord.ApplicationCommandOptionData
): SlashCommandSubcommandBuilder | undefined => {
    switch (option.type) {
        case Discord.ApplicationCommandOptionType.Subcommand:
            const subCommandOption = new Discord.SlashCommandSubcommandBuilder()
                .setName(option.name)
                .setDescription(option.description);

            if ("options" in option && Array.isArray(option.options)) {
                for (const subOpt of option.options) {
                    const optionType =
                        Discord.ApplicationCommandOptionType[
                            subOpt.type
                        ].capitalize();
                    (subCommandOption as any)[`add${optionType}Option`](
                        convertOptionToSlashCommandOption(subOpt)
                    );
                }
            }
            return subCommandOption;
        default:
            return undefined;
    }
};
const convertPermissionToString = (
    permission: bigint | number | null | undefined
): string => {
    switch (typeof permission) {
        case "bigint":
        case "number":
            return new Discord.PermissionsBitField(permission as bigint)
                .toArray()
                .join(", ");
        case "undefined":
            return "Aucune";
        case "object":
            if (!permission) return "Aucune";
            break;
    }
    return "Inconnue";
};
const convertStringToClassString = (classe: string): string => {
    let newClass = classe.capitalize();
    return newClass;
};
const convertStringToDate = (
    dateString: string | undefined
): Date | null | undefined => {
    // YYYY/MM/DD HH-mm-ss
    if (!dateString) return undefined;
    try {
        const [date, time] = dateString.split(" ");

        const dateParts = date.split("/");
        if (
            dateParts.length !== 3 ||
            !/^\d{4}$/.test(dateParts[0]) ||
            !/^\d{2}$/.test(dateParts[1]) ||
            !/^\d{2}$/.test(dateParts[2])
        ) {
            throw new Error(`Invalid date format: ${dateString}`);
        }
        const [year, month, day] = dateParts.map((item) => parseInt(item));

        const timeParts = time.split("-");
        if (
            timeParts.length !== 3 ||
            !/^\d{2}$/.test(timeParts[0]) ||
            !/^\d{2}$/.test(timeParts[1]) ||
            !/^\d{2}$/.test(timeParts[2])
        ) {
            throw new Error(`Invalid time format: ${dateString}`);
        }
        const [hour, minute, second] = timeParts.map((item) => parseInt(item));

        if (
            [year, month, day, hour, minute, second].some((val) =>
                Number.isNaN(val)
            )
        ) {
            throw new Error(
                `Invalid date or time components in: ${dateString}`
            );
        }

        return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
    } catch (error) {
        return null;
    }
};
const convertStringToInterval = (
    interval: string | undefined
): number | null | undefined => {
    // Minute | Hour | Day | Week
    if (!interval) return undefined;
    try {
        if (
            Object.values(Interval).includes(interval.capitalize() as Interval)
        ) {
            return TimeEach[
                interval.capitalize() as keyof typeof TimeEach
            ] as number;
        }
        return null;
    } catch {
        console.error(
            `Error parsing interval string: ${interval.capitalize()}`
        );
        return null;
    }
};
const formatAnnonceContent = (content: string): string => {
    return content.replace(/\\n/g, "\n");
};
const convertDateToString = (date: Date, format: string): string => {
    const searchedAndReplacedParts = [
        {
            searched: "YYYY",
            replaced: date.getUTCFullYear(),
        },
        {
            searched: "MM",
            replaced: date.getUTCMonth(),
        },
        {
            searched: "DD",
            replaced: date.getUTCDate(),
        },
        {
            searched: "HH",
            replaced: date.getUTCHours(),
        },
        {
            searched: "mm",
            replaced: date.getUTCMinutes(),
        },
        {
            searched: "ss",
            replaced: date.getUTCSeconds(),
        },
    ];
    let formattedDate = format;
    searchedAndReplacedParts.forEach((item) => {
        formattedDate = formattedDate.replace(
            item.searched,
            item.replaced.toString().padStart(item.searched.length, "0")
        );
    });
    return formattedDate;
};
const convertIntervalToString = (
    interval: number | bigint
): Interval | undefined => {
    return Object.keys(TimeEach).find(
        (key) => TimeEach[key as keyof typeof TimeEach] === Number(interval)
    ) as Interval;
};
const convertNumberToFRDay = (day: number): string => {
    switch (day) {
        case 0:
            return "Lundi";
        case 1:
            return "Mardi";
        case 2:
            return "Mercredi";
        case 3:
            return "Jeudi";
        case 4:
            return "Vendredi";
        case 5:
            return "Samedi";
        case 6:
            return "Dimanche";
        default:
            return "Inconnu";
    }
};
const formatAnnonceTime = (annonce: Announcement): string => {
    if (annonce.timeInterval) {
        const interval = convertIntervalToString(annonce.timeInterval);
        let format = "";
        switch (interval) {
            case Interval.Minute:
                format = "Chaque minute à {seconds}s";
                break;
            case Interval.Hour:
                format = "Chaque heure à {minutes}min et {seconds}s";
                break;
            case Interval.Day:
                format = "Chaque jour à {time}";
                break;
            case Interval.Week:
                format = "Chaque semaine, le {dayOfWeek} à {time}";
                break;
            default:
                return "Error: Unknown interval";
        }
        return format
            .replace(
                "{seconds}",
                annonce.date?.getUTCSeconds().toString().padStart(2, "0")!
            )
            .replace(
                "{minutes}",
                annonce.date?.getUTCMinutes().toString().padStart(2, "0")!
            )
            .replace(
                "{dayOfWeek}",
                convertNumberToFRDay(annonce.date?.getUTCDay()!)
            )
            .replace("{time}", convertDateToString(annonce.date!, "HH:mm:ss"));
    } else if (annonce.date) {
        const dateString = convertDateToString(
            annonce.date,
            "DD/MM/YYYY à HH:mm:ss"
        );
        return `Publication unique le ${dateString}`;
    }
    return "Aucune publication prévue";
};

export {
    convertOptionToSlashCommandOption,
    convertOptionToSlashCommandSubcommandBuilder,
    convertPermissionToString,
    convertStringToClassString,
    convertStringToDate,
    convertStringToInterval,
    formatAnnonceContent,
    convertDateToString,
    convertIntervalToString,
    formatAnnonceTime,
};
