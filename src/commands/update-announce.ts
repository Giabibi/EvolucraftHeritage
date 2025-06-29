import Discord from "discord.js";
import { ClientWithCommands, Command } from "../types/discord";
import { convertStringToDate, convertStringToInterval } from "../utils/convert";
import {
    getAnnouncementByName,
    getAnnouncements,
    updateAnnouncement,
} from "../database/announcements";
import { createWatcher, deleteWatcher } from "../utils/watchers";
import { doAnnounce } from "../handlers/loadRegularsMessages";
import { getGuildAnnounceChannelId } from "../database/guilds";
import { Interval } from "../types/utils";

export default {
    name: "update-announce",
    description: "Met à jour une annonce",
    contexts: [
        Discord.InteractionContextType.Guild,
        Discord.InteractionContextType.PrivateChannel,
    ],
    permission: Discord.PermissionFlagsBits.Administrator,
    category: "Annonce",
    options: [
        {
            type: Discord.ApplicationCommandOptionType.String,
            name: "nom",
            description: "Le nom avec lequel se référer à l'annonce",
            required: true,
            autocomplete: true,
        } as Discord.ApplicationCommandAutocompleteStringOptionData,
        {
            type: Discord.ApplicationCommandOptionType.String,
            name: "contenu",
            description: "Le nouveau contenu de l'annonce",
            required: true,
        },
        {
            type: Discord.ApplicationCommandOptionType.String,
            name: "date",
            description:
                "La nouvelle date à laquelle l'annonce va être publiée (format: YYYY/MM/DD HH-mm-ss)",
            required: false,
        },
        {
            type: Discord.ApplicationCommandOptionType.String,
            name: "interval",
            description: "Le nouveau temps d'attente entre chaque publication",
            required: false,
            autocomplete: true,
            choices: Object.values(Interval).map((interval) => ({
                name: interval as string,
                value: interval as string,
            })),
        } as Discord.ApplicationCommandAutocompleteStringOptionData,
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

        const focusedOption = interaction.options.getFocused(true);

        if (focusedOption.name === "nom") {
            const announces = await getAnnouncements(
                interaction.guildId as string
            );
            const optionsChoices = announces.map((announce) => ({
                name: announce.name,
                value: announce.name,
            }));
            const choices = optionsChoices.filter((option) =>
                option.name
                    .toLowerCase()
                    .includes(focusedOption.value.toLowerCase())
            );

            await interaction.respond(
                (focusedOption.value === "" ? optionsChoices : choices).sort(
                    (a, b) => a.name.localeCompare(b.name)
                )
            );
        } else if (focusedOption.name === "interval") {
            const optionsChoices = options.filter(
                (option) => option.name === "interval"
            )[0].choices as { name: string; value: string }[];
            const choices = optionsChoices.filter((option) =>
                option.name
                    .toLowerCase()
                    .includes(focusedOption.value.toLowerCase())
            );

            await interaction.respond(
                (focusedOption.value === "" ? optionsChoices : choices).sort(
                    (a, b) => a.name.localeCompare(b.name)
                )
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

        // Get inputs variables
        const inputName = interaction.options.get("nom");
        const inputContent = interaction.options.get("contenu");
        const inputDate = interaction.options.get("date");
        const inputInterval = interaction.options.get("interval");
        if (!inputName || !inputContent) {
            interaction.reply({
                content:
                    "⚠️ Merci de fournir la nom et le contenu de l'annonce.",
                ephemeral: true,
            });
            return;
        }
        const guildId = interaction.guildId as string;
        const name = inputName.value as string;
        const content = inputContent.value as string;
        const date = convertStringToDate(
            typeof inputDate?.value === "string"
                ? (inputDate.value as string)
                : undefined
        );
        const interval = convertStringToInterval(
            typeof inputInterval?.value === "string"
                ? (inputInterval.value as string)
                : undefined
        );

        // Check if announcement channel is setted
        const announcementChannelId = await getGuildAnnounceChannelId(guildId);
        if (!announcementChannelId) {
            interaction.reply({
                content: `
                ⚠️ Aucun salon d'annonce n'a été enregistré.\
                \nUtilisez la commande \`/set-announce-channel\` pour enregistrer un salon.
            `,
                ephemeral: true,
            });
            return;
        }
        // Check if the date exist and is not okay
        if (date === null) {
            interaction.reply({
                content: `
                ⚠️ La date fournit n'est pas valide.\
                \n(Pour rappel: le format demandé est \`YYYY/MM/DD HH-mm-ss\`)
            `,
                ephemeral: true,
            });
            return;
        }
        // Check if the interval exist and is not okay
        if (interval === null) {
            interaction.reply({
                content: `
                ⚠️ L'interval fournit n'est pas valide.\
                \n(Pour rappel: les intervals possibles sont \`Minute\` | \`Hour\` | \`Day\` | \`Week\`)
            `,
                ephemeral: true,
            });
            return;
        }
        // Check if the name don't exist
        const announceExisting = await getAnnouncementByName(guildId, name);
        if (!announceExisting) {
            interaction.reply({
                content: `
                ⚠️ L'annonce avec le nom \`${name}\` n'existe pas.\
                \nUtilisez la commande \`/create-annonce\` pour la créer.
            `,
                ephemeral: true,
            });
            return;
        }

        // Update the announce
        const announce = await updateAnnouncement(
            guildId,
            name,
            content,
            date,
            interval
        );
        if (!announce) {
            interaction.reply({
                content: `
                ⚠️ Aucune annonce n'a été modifié pour une raison inconnue.
            `,
                ephemeral: true,
            });
            return;
        }

        // Delete old watcher
        deleteWatcher(bot, name);
        // Create a new watcher if date is setted
        if (announce.date) {
            // Create watcher
            createWatcher(
                bot,
                announce.name,
                announce.guildId,
                announce.date,
                announce.timeInterval,
                () => {
                    // Send announcement message in the channel
                    doAnnounce(bot, announce, announcementChannelId);
                }
            );
        }

        // Success message
        interaction.reply({
            content: `
            ✅ L'annonce \`${name}\` a été mise à jour !
        `,
            ephemeral: true,
        });
    },
} as Command;
