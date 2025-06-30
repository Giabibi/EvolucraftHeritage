import Discord, { MessageFlags } from "discord.js";
import { ClientWithCommands, Command } from "../types/discord";
import { EClass, EClassRarity, EClassType } from "../types/evolucraft/classes";
import { classTypes, rarityColors } from "../types/evolucraft/prettyDisplay";
import classesData from "../../data/classes.json";
import handleClassOption from "./class/classe";
import handleTypeOption from "./class/type";
import handleRarityOption from "./class/rarity";

export default {
    name: "class",
    description: "Affiche les détails d'une classe Évolucraft",
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
            name: "classe",
            description: "Nom de la classe à afficher",
            required: false,
            autocomplete: true,
            choices: Object.values(EClass)
                .filter((classe) => typeof classe === "string")
                .map((classe) => ({
                    name: classe as string,
                    value: classe as string,
                })),
        } as Discord.ApplicationCommandAutocompleteStringOptionData,
        {
            type: Discord.ApplicationCommandOptionType.String,
            name: "type",
            description: "Filtrer par type",
            required: false,
            autocomplete: true,
            choices: Object.values(EClassType)
                .filter((type) => typeof type === "string")
                .map((type) => ({
                    name: type as string,
                    value: type as string,
                })),
        } as Discord.ApplicationCommandAutocompleteStringOptionData,
        {
            type: Discord.ApplicationCommandOptionType.String,
            name: "rarity",
            description: "Filtrer par rareté",
            required: false,
            autocomplete: true,
            choices: Object.values(EClassRarity)
                .filter((rarity) => typeof rarity === "string")
                .map((rarity) => ({
                    name: rarity as string,
                    value: rarity as string,
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
        if (focusedOption.name === "classe") {
            choices =
                options.find((opt) => opt.name === "classe")?.choices ?? [];
        } else if (focusedOption.name === "type") {
            choices = options.find((opt) => opt.name === "type")?.choices ?? [];
        } else if (focusedOption.name === "rarity") {
            choices =
                options.find((opt) => opt.name === "rarity")?.choices ?? [];
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
        const selectedClass = commandInteraction.options.getString("classe");
        const typeFilter = commandInteraction.options.getString("type");
        const rarityFilter = commandInteraction.options.getString("rarity");

        // Vérifier qu’il n’y a pas de mélange
        const selectedFilters = [
            selectedClass,
            typeFilter,
            rarityFilter,
        ].filter(Boolean);
        if (selectedFilters.length > 1) {
            interaction.reply({
                content:
                    "⚠️ Vous ne pouvez utiliser qu'un seul filtre à la fois (classe, type ou rareté).",
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        if (selectedClass) {
            handleClassOption(bot, interaction, selectedClass);
        } else if (typeFilter) {
            handleTypeOption(bot, interaction, typeFilter);
        } else if (rarityFilter) {
            handleRarityOption(bot, interaction, rarityFilter);
        } else {
            const embed = new Discord.EmbedBuilder()
                .setColor(bot.color)
                .setTitle(`Liste des classes Evolucraft`)
                .setThumbnail(bot.user?.displayAvatarURL()!)
                .setDescription(
                    `Voici toutes les classes disponibles dans Évolucraft.`
                )
                .setTimestamp()
                .setFooter({ text: "Classes de Évolucraft" });

            for (const cls of classesData) {
                embed.addFields({
                    name: `${cls.emoji} ${cls.name}`, // ou ajoute un emoji selon le type
                    value: `Type : \`${classTypes[cls.type]}\`\nRareté : \`${
                        rarityColors[cls.rarity]
                    }\``,
                    inline: true,
                });
            }

            await interaction.reply({
                embeds: [embed],
                flags: MessageFlags.Ephemeral,
            });
        }
    },
} as Command;
