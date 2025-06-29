import Discord from "discord.js";
import { ClientWithCommands, Command } from "../types/discord";
import {
    deleteAnnouncement,
    getAnnouncementByName,
    getAnnouncements,
} from "../database/announcements";
import { deleteWatcher } from "../utils/watchers";

export default {
    name: "delete-announce",
    description: "Supprime une annonce",
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
        const announces = await getAnnouncements(interaction.guildId as string);
        const optionsChoices = announces.map((announce) => ({
            name: announce.name,
            value: announce.name,
        }));
        const choices = optionsChoices.filter((option) =>
            option.name.toLowerCase().includes(entry.toLowerCase())
        );

        await interaction.respond(
            (entry === "" ? optionsChoices : choices).sort((a, b) =>
                a.name.localeCompare(b.name)
            )
        );
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
        if (!inputName) {
            interaction.reply({
                content: "⚠️ Merci de fournir le nom de l'annonce.",
                ephemeral: true,
            });
            return;
        }
        const guildId = interaction.guildId as string;
        const name = inputName.value as string;

        // Check if the name don't exist
        const annonce = await getAnnouncementByName(guildId, name);
        if (!annonce) {
            interaction.reply({
                content: `
                ⚠️ L'annonce avec le nom \`${name}\` n'existe pas.\
                \nUtilisez la commande \`/create-annonce\` pour la créer.
            `,
                ephemeral: true,
            });
            return;
        }

        // Delete the announce
        const announce = await deleteAnnouncement(guildId, name);
        if (announce === 0) {
            interaction.reply({
                content: `
                ⚠️ Aucune annonce n'a été supprimé pour une raison inconnue.
            `,
                ephemeral: true,
            });
            return;
        }

        // Delete watcher
        deleteWatcher(bot, name);

        // Success message
        interaction.reply({
            content: `
            ✅ L'annonce \`${name}\` a été supprimé !
        `,
            ephemeral: true,
        });
    },
} as Command;
