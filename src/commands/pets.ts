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
import handlePetOption from "./pets/pet";
import { EPet } from "../types/evolucraft/pets";
import { rarityColors } from "../types/evolucraft/prettyDisplay";

export default {
    name: "pets",
    description: "Affiche les pets de la guilde",
    contexts: [
        Discord.InteractionContextType.BotDM,
        Discord.InteractionContextType.Guild,
        Discord.InteractionContextType.PrivateChannel,
    ],
    permission: null,
    category: "Evolucraft",
    options: [
        {
            type: Discord.ApplicationCommandOptionType.String,
            name: "pet",
            description: "Nom du pet à afficher",
            required: false,
            autocomplete: true,
            choices: Object.values(EPet)
                .filter((classe) => typeof classe === "string")
                .map((classe) => ({
                    name: classe as string,
                    value: classe as string,
                })),
        } as Discord.ApplicationCommandAutocompleteStringOptionData,
        {
            type: Discord.ApplicationCommandOptionType.String,
            name: "job",
            description: "Filtrer les pets par métier (type EXP)",
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

        const focusedOption = interaction.options.getFocused(true);
        const entry = focusedOption.value.toLowerCase();

        let choices: { name: string; value: string }[] = [];
        if (focusedOption.name === "pet") {
            choices = options.find((opt) => opt.name === "pet")?.choices ?? [];
            const filtered =
                entry === ""
                    ? choices
                    : choices.filter((choice) =>
                          choice.name.toLowerCase().includes(entry)
                      );

            await interaction.respond(
                filtered
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .slice(0, 25)
            );
        } else if (focusedOption.name === "job") {
            const allJobs = new Set<string>();
            for (const pet of petsData) {
                pet.effects?.forEach((effect) => {
                    if (effect.type.toLowerCase() === "EXP".toLowerCase()) {
                        allJobs.add(effect.name);
                    }
                });
            }
            const filtered = Array.from(allJobs).filter((job) =>
                job.toLowerCase().includes(entry)
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
        if (interaction.type != Discord.InteractionType.ApplicationCommand)
            return;

        const commandInteraction =
            interaction as Discord.ChatInputCommandInteraction;
        const selectedPet = commandInteraction.options.getString("pet");
        const selectedJob = commandInteraction.options.getString("job");

        if (selectedPet && selectedJob) {
            interaction.reply({
                content:
                    "⛔ Tu ne peux pas utiliser `pet` et `job` en même temps.",
                flags: MessageFlags.Ephemeral,
            });
            return;
        }
        if (selectedPet) {
            handlePetOption(bot, interaction, selectedPet);
        } else {
            const PAGE_SIZE = 18;
            const filteredPets = selectedJob
                ? petsData.filter((pet) =>
                      pet.effects?.some(
                          (effect) =>
                              effect.type.toLowerCase() ===
                                  "EXP".toLowerCase() &&
                              effect.name
                                  .toLowerCase()
                                  .includes(selectedJob.toLowerCase())
                      )
                  )
                : petsData;

            const pages: EmbedBuilder[] = [];
            for (let i = 0; i < filteredPets.length; i += PAGE_SIZE) {
                const embed = new EmbedBuilder()
                    .setColor(bot.color)
                    .setTitle(
                        selectedJob
                            ? `Pets EXP : ${selectedJob} (Page ${
                                  pages.length + 1
                              }/${Math.ceil(filteredPets.length / PAGE_SIZE)})`
                            : `Liste des pets Évolucraft (Page ${
                                  pages.length + 1
                              }/${Math.ceil(filteredPets.length / PAGE_SIZE)})`
                    )
                    .setTimestamp()
                    .setFooter({
                        text: `―――――――――――――――――――――\n⏳ Les boutons expirent après 60 secondes.\n―――――――――――――――――――――\n\nPage ${
                            pages.length + 1
                        }/${Math.ceil(filteredPets.length / PAGE_SIZE)}`,
                    });

                const petsSlice = filteredPets.slice(i, i + PAGE_SIZE);
                embed.addFields(
                    petsSlice.map((pet) => {
                        const expEffect = selectedJob
                            ? pet.effects?.find(
                                  (e) =>
                                      e.type.toLowerCase() ===
                                          "EXP".toLowerCase() &&
                                      e.name
                                          .toLowerCase()
                                          .includes(selectedJob.toLowerCase())
                              )
                            : null;

                        return {
                            name: `🐾 **${pet.name}**`,
                            value:
                                selectedJob && expEffect
                                    ? `Rareté : \`${
                                          rarityColors[pet.rarity]
                                      }\`\nEXP : \`+${expEffect.amount}%\``
                                    : `Rareté : \`${
                                          rarityColors[pet.rarity]
                                      }\``,
                            inline: true,
                        };
                    })
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
                time: 30_000,
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
    },
} as Command;
