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
        }

        const filtered =
            entry === ""
                ? choices
                : choices.filter((choice) =>
                      choice.name.toLowerCase().includes(entry)
                  );

        await interaction.respond(
            filtered.sort((a, b) => a.name.localeCompare(b.name)).slice(0, 25)
        );
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

        if (selectedPet) {
            handlePetOption(bot, interaction, selectedPet);
        } else {
            const PAGE_SIZE = 18;
            const pages: EmbedBuilder[] = [];
            for (let i = 0; i < petsData.length; i += PAGE_SIZE) {
                const embed = new EmbedBuilder()
                    .setColor(bot.color)
                    .setTitle(
                        `Liste des pets Évolucraft (Page ${
                            pages.length + 1
                        }/${Math.ceil(petsData.length / PAGE_SIZE)})`
                    )
                    .setTimestamp()
                    .setFooter({
                        text: `―――――――――――――――――――――\n⏳ Les boutons expirent après 60 secondes.\n―――――――――――――――――――――\n\nPage ${
                            pages.length + 1
                        }/${Math.ceil(petsData.length / PAGE_SIZE)}`,
                    });

                const petsSlice = petsData.slice(i, i + PAGE_SIZE);
                embed.addFields(
                    petsSlice.map((pet) => ({
                        name: `${pet.name}`,
                        value: `Rareté : \`${pet.rarity}\``,
                        inline: true,
                    }))
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
