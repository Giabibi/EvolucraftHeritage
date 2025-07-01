import Discord, {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    EmbedBuilder,
    MessageFlags,
} from "discord.js";
import { ClientWithCommands, Command } from "../types/discord";
import heritagePetsData from "../../data/heritage/pets.json";
import { EPet } from "../types/evolucraft/pets";
import { HERITAGE_ROLE_ID, saveHeritagePets } from "../types/heritage/pets";

export default {
    name: "hpets",
    description: "Gère les pets Héritage",
    contexts: [Discord.InteractionContextType.Guild],
    permission: null,
    category: "Héritage",
    options: [
        {
            type: Discord.ApplicationCommandOptionType.Subcommand,
            name: "list",
            description: "Affiche les pets heritage",
        },
        {
            type: Discord.ApplicationCommandOptionType.Subcommand,
            name: "add",
            description: "Ajoute un pet heritage",
            options: [
                {
                    type: Discord.ApplicationCommandOptionType.String,
                    name: "name",
                    description: "Nom du pet",
                    required: true,
                    autocomplete: true,
                },
                {
                    type: Discord.ApplicationCommandOptionType.Integer,
                    name: "level",
                    description: "Niveau du pet",
                    required: true,
                    minValue: 1,
                    maxValue: 20,
                },
            ],
        },
        {
            type: Discord.ApplicationCommandOptionType.Subcommand,
            name: "remove",
            description: "Supprime un pet heritage",
            options: [
                {
                    type: Discord.ApplicationCommandOptionType.String,
                    name: "name",
                    description: "Nom du pet",
                    required: true,
                    autocomplete: true,
                },
                {
                    type: Discord.ApplicationCommandOptionType.Integer,
                    name: "level",
                    description: "Niveau du pet à supprimer",
                    required: true,
                    minValue: 1,
                    maxValue: 20,
                },
            ],
        },
    ],

    async autocomplete(
        bot: ClientWithCommands,
        interaction: Discord.Interaction,
        options: any[]
    ): Promise<void> {
        if (
            interaction.type !==
            Discord.InteractionType.ApplicationCommandAutocomplete
        )
            return;

        const focused = interaction.options.getFocused(true);
        const value = focused.value.toLowerCase();

        if (focused.name === "name") {
            const filtered = Object.values(EPet).filter((pet) =>
                pet.toLowerCase().includes(value)
            );

            await interaction.respond(
                filtered
                    .sort()
                    .slice(0, 25)
                    .map((name) => ({ name, value: name }))
            );
        }
    },

    async run(
        bot: ClientWithCommands,
        interaction: Discord.Interaction,
        options: any[]
    ): Promise<void> {
        if (interaction.type !== Discord.InteractionType.ApplicationCommand)
            return;

        const commandInteraction =
            interaction as Discord.ChatInputCommandInteraction;
        const subcommand = commandInteraction.options.getSubcommand();

        const member = interaction.member as Discord.GuildMember;

        const isAuthorized =
            member.roles.cache.has(HERITAGE_ROLE_ID) ||
            member.permissions.has(Discord.PermissionFlagsBits.Administrator);

        if (["add", "remove"].includes(subcommand) && !isAuthorized) {
            await interaction.reply({
                content:
                    "⛔ Tu n'as pas la permission d'utiliser cette commande.",
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        if (subcommand === "list") {
            const embed = new EmbedBuilder()
                .setColor(bot.color)
                .setTitle("Pets héritage")
                .setDescription(
                    heritagePetsData.length > 0
                        ? heritagePetsData
                              .sort()
                              .map(
                                  (pet) =>
                                      `• **${pet.name}** (Niveau ${pet.level})`
                              )
                              .join("\n")
                        : "Aucun pet hérité enregistré."
                )
                .setTimestamp();

            await interaction.reply({
                embeds: [embed],
                flags: MessageFlags.Ephemeral,
            });
        }

        if (subcommand === "add") {
            const name = commandInteraction.options.getString("name", true);
            const level = commandInteraction.options.getInteger("level", true);

            heritagePetsData.push({ name, level });
            saveHeritagePets(heritagePetsData);

            await interaction.reply({
                content: `✅ Le pet **${name}** (Niveau ${level}) a été ajouté.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        if (subcommand === "remove") {
            const name = commandInteraction.options.getString("name", true);
            const level = commandInteraction.options.getInteger("level", true);

            const index = heritagePetsData.findIndex(
                (pet) => pet.name === name && pet.level === level
            );

            if (index === -1) {
                await interaction.reply({
                    content: `❌ Aucun pet nommé **${name}** au niveau ${level} n'a été trouvé.`,
                    flags: MessageFlags.Ephemeral,
                });
                return;
            }

            heritagePetsData.splice(index, 1);
            saveHeritagePets(heritagePetsData);

            await interaction.reply({
                content: `✅ Le pet **${name}** (Niveau ${level}) a été supprimé.`,
                flags: MessageFlags.Ephemeral,
            });
        }
    },
} as Command;
