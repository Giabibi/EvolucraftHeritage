import Discord, {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    EmbedBuilder,
    MessageFlags,
} from "discord.js";
import { ClientWithCommands, Command } from "../types/discord";
import petsData from "../../data/pets.json";
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
            options: [
                {
                    type: Discord.ApplicationCommandOptionType.String,
                    name: "job",
                    description: "Filtrer les pets par EXP de métier",
                    required: false,
                    autocomplete: true,
                },
            ],
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
        {
            type: Discord.ApplicationCommandOptionType.Subcommand,
            name: "update",
            description: "Modifie le niveau d'un pet heritage",
            options: [
                {
                    type: Discord.ApplicationCommandOptionType.String,
                    name: "name",
                    description: "Nom du pet à modifier",
                    required: true,
                    autocomplete: true,
                },
                {
                    type: Discord.ApplicationCommandOptionType.Integer,
                    name: "old_level",
                    description: "Niveau actuel du pet",
                    required: true,
                    minValue: 1,
                    maxValue: 20,
                },
                {
                    type: Discord.ApplicationCommandOptionType.Integer,
                    name: "new_level",
                    description: "Nouveau niveau du pet",
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

        const subcommandName = interaction.options.getSubcommand(true);
        const focused = interaction.options.getFocused(true);
        const value = focused.value.toLowerCase();

        if (focused.name === "name") {
            let filtered: EPet[];
            if (["remove", "update"].includes(subcommandName)) {
                filtered = heritagePetsData
                    .map((pet) => pet.name as EPet)
                    .filter((pet) => pet.toLowerCase().includes(value));
            } else {
                filtered = Object.values(EPet).filter((pet) =>
                    pet.toLowerCase().includes(value)
                );
            }
            await interaction.respond(
                filtered
                    .sort()
                    .slice(0, 25)
                    .map((name) => ({ name, value: name }))
            );
        }
        if (focused.name === "job") {
            const allProfessions = petsData
                .flatMap((pet) => pet.effects)
                .filter(
                    (effect) =>
                        effect.type.toLowerCase() === "EXP".toLowerCase()
                )
                .map((effect) => effect.name);
            const uniqueProfessions = [...new Set(allProfessions)];

            const filtered = uniqueProfessions.filter((p) =>
                p.toLowerCase().includes(value)
            );

            await interaction.respond(
                filtered.map((p) => ({ name: p, value: p })).slice(0, 25)
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

        if (["add", "remove", "update"].includes(subcommand) && !isAuthorized) {
            await interaction.reply({
                content:
                    "⛔ Tu n'as pas la permission d'utiliser cette commande.",
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        if (subcommand === "list") {
            const job = commandInteraction.options.getString("job");

            const filteredPets = job
                ? heritagePetsData.filter((pet) =>
                      pet.effects?.some(
                          (effect) =>
                              effect.type.toLowerCase() ===
                                  "EXP".toLowerCase() &&
                              effect.name
                                  .toLowerCase()
                                  .includes(job.toLowerCase())
                      )
                  )
                : heritagePetsData;

            const PAGE_SIZE = 18;
            const pages: EmbedBuilder[] = [];

            for (let i = 0; i < filteredPets.length; i += PAGE_SIZE) {
                const petsSlice = filteredPets.sort((a, b) =>
                    a.name.localeCompare(b.name)
                ).slice(i, i + PAGE_SIZE);
                const embed = new EmbedBuilder()
                    .setColor(bot.color)
                    .setTitle(
                        job
                            ? `Pets héritage - EXP ${job} (Page ${
                                  pages.length + 1
                              }/${Math.ceil(filteredPets.length / PAGE_SIZE)})`
                            : `Pets héritage (Page ${
                                  pages.length + 1
                              }/${Math.ceil(filteredPets.length / PAGE_SIZE)})`
                    )
                    .setTimestamp()
                    .setFooter({
                        text: `―――――――――――――――――――――\n⏳ Les boutons expirent après 60 secondes.\n―――――――――――――――――――――\n\nPage ${
                            pages.length + 1
                        }/${Math.ceil(filteredPets.length / PAGE_SIZE)}`,
                    });

                embed.setDescription(
                    petsSlice
                        .map((pet) => {
                            const effects = pet.effects
                                ?.filter((e) => e.type.toLowerCase() === "exp")
                                .map((e) => `• ${e.name} : \`${e.amount}%\``)
                                .join("\n");
                            return `🐾 **${pet.name}** (Niveau ${pet.level})${
                                job
                                    ? effects
                                        ? "\n" + effects
                                        : "\n_Aucun effet._"
                                    : ""
                            }`;
                        })
                        .join("\n")
                );

                pages.push(embed);
            }

            let currentPage = 0;

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId("prev")
                    .setEmoji("⬅️")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId("next")
                    .setEmoji("➡️")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(pages.length <= 1)
            );

            await interaction.reply({
                embeds: [pages[currentPage]],
                components: [row],
                flags: MessageFlags.Ephemeral,
            });

            const message = await interaction.fetchReply();

            const collector = message.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 60_000,
            });

            collector.on("collect", async (btnInteraction) => {
                if (btnInteraction.user.id !== interaction.user.id) {
                    await btnInteraction.reply({
                        content: "⛔ Tu ne peux pas interagir avec ce menu.",
                        flags: MessageFlags.Ephemeral,
                    });
                    return;
                }

                if (btnInteraction.customId === "prev" && currentPage > 0) {
                    currentPage--;
                } else if (
                    btnInteraction.customId === "next" &&
                    currentPage < pages.length - 1
                ) {
                    currentPage++;
                }

                row.components[0].setDisabled(currentPage === 0);
                row.components[1].setDisabled(currentPage === pages.length - 1);

                await btnInteraction.update({
                    embeds: [pages[currentPage]],
                    components: [row],
                });
            });
        }

        if (subcommand === "add") {
            const name = commandInteraction.options.getString("name", true);
            const level = commandInteraction.options.getInteger("level", true);

            const petInfo = petsData.find((pet) => pet.name === name);
            if (!petInfo) {
                await interaction.reply({
                    content: `❌ Pet **${name}** introuvable dans la base de données.`,
                    flags: MessageFlags.Ephemeral,
                });
                return;
            }

            heritagePetsData.push({ name, level, effects: petInfo.effects });
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

        if (subcommand === "update") {
            const name = commandInteraction.options.getString("name", true);
            const oldLevel = commandInteraction.options.getInteger(
                "old_level",
                true
            );
            const newLevel = commandInteraction.options.getInteger(
                "new_level",
                true
            );

            const index = heritagePetsData.findIndex(
                (pet) => pet.name === name && pet.level === oldLevel
            );

            if (index === -1) {
                await interaction.reply({
                    content: `❌ Aucun pet nommé **${name}** au niveau ${oldLevel} n'a été trouvé.`,
                    flags: MessageFlags.Ephemeral,
                });
                return;
            }

            heritagePetsData[index].level = newLevel;
            saveHeritagePets(heritagePetsData);

            await interaction.reply({
                content: `✅ Le niveau du pet **${name}** a été mis à jour de ${oldLevel} ➜ ${newLevel}.`,
                flags: MessageFlags.Ephemeral,
            });
        }
    },
} as Command;
