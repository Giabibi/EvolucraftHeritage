import Discord from "discord.js";
import { ClientWithCommands, Command } from "../types/discord";
import {
    getAnnouncementByName,
    getAnnouncements,
} from "../database/announcements";
import { getGuildAnnounceChannelId } from "../database/guilds";
import { doAnnounce } from "../handlers/loadRegularsMessages";

export default {
    name: "announce",
    description: "Fais une annonce instantanément",
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
                content:
                    "⚠️ Merci de fournir la quantité de message à supprimer.",
                ephemeral: true,
            });
            return;
        }
        const guildId = interaction.guildId as string;
        const name = inputName.value as string;

        // Check if the announce exist
        const announce = await getAnnouncementByName(guildId, name);
        if (!announce) {
            interaction.reply({
                content: `
                ⚠️ Aucune annonce trouvée avec le nom fournit.\
                \nUtilisez la commande \`/get-annonces\` pour voir la liste des annonces.
            `,
                ephemeral: true,
            });
            return;
        }

        // Get announce channel id and check validity
        const annonceChannelId = await getGuildAnnounceChannelId(guildId);
        if (!annonceChannelId) {
            interaction.reply({
                content: `
                ⚠️ Aucun salon d'annonce n'a été enregistré.\
                \nUtilisez la commande \`/set-announce-channel\` pour enregistrer un salon.
            `,
                ephemeral: true,
            });
            return;
        }

        // Execute the announce
        await doAnnounce(bot, announce, annonceChannelId);

        // Success message
        interaction.reply({
            content: `
            ✅ L'annonce a été publié !
        `,
            ephemeral: true,
        });
    },
} as Command;
