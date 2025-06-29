import Discord from "discord.js";
import { ClientWithCommands, Command } from "../types/discord";
import { formatAnnonceTime } from "../utils/convert";
import {
    getAnnouncementByName,
    getAnnouncements,
} from "../database/announcements";
import { getGuildAnnounceChannelId } from "../database/guilds";

export default {
    name: "get-announces",
    description: "Récupère la liste des annonces",
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
            required: false,
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
        const guildId = interaction.guildId as string;
        const inputName = interaction.options.get("nom");

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

        // Get specific announce
        if (inputName) {
            const name = inputName.value as string;

            // Get announce by name
            const announce = await getAnnouncementByName(guildId, name);
            if (!announce) {
                interaction.reply({
                    content: `
                    ⚠️ Aucune annonce n'a le nom \`${name}\`.\
                    \nUtilisez la commande \`/create-announce\` pour la modifier.
                `,
                    ephemeral: true,
                });
                return;
            }

            // Create embed
            let embed = new Discord.EmbedBuilder()
                .setColor(bot.color)
                .setTitle(`Annonces`)
                .setTimestamp()
                .addFields({
                    name: `Nom:`,
                    value: `\`${announce.name}\``,
                    inline: true,
                })
                .addFields({
                    name: `Contenu:`,
                    value: `\`\`\`${announce.content}\`\`\``,
                    inline: false,
                })
                .addFields({
                    name: `Récurrence:`,
                    value: `\`${formatAnnonceTime(announce)}\``,
                    inline: true,
                });

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            // Get announcements
            const announces = await getAnnouncements(guildId);
            if (announces.length === 0) {
                interaction.reply({
                    content: `
                    ⚠️ Aucune annonce enregistrée dans le serveur.
                `,
                    ephemeral: true,
                });
                return;
            }

            // Create embed
            let embed = new Discord.EmbedBuilder()
                .setColor(bot.color)
                .setTitle(`Annonces`)
                .setTimestamp()
                .setDescription(
                    `${announces
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((a) => `\`${a.name}\` : ${formatAnnonceTime(a)}`)
                        .join("\n")}`
                );

            // Send embed
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
} as Command;
