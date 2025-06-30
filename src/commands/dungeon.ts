import Discord, { MessageFlags } from "discord.js";
import { ClientWithCommands, Command } from "../types/discord";
import dungeonsData from "../../data/dungeons.json";
import handleDungeonOption from "./dungeon/dungeon";
import { EDungeon } from "../types/evolucraft/dungeon";

export default {
    name: "dungeon",
    description: "Affiche les détails d'un donjon Évolucraft",
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
            name: "donjon",
            description: "Nom du donjon à afficher",
            required: false,
            autocomplete: true,
            choices: Object.values(EDungeon)
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
        if (focusedOption.name === "donjon") {
            choices =
                options.find((opt) => opt.name === "donjon")?.choices ?? [];
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
        const selectedDungeon = commandInteraction.options.getString("donjon");

        if (selectedDungeon) {
            handleDungeonOption(bot, interaction, selectedDungeon);
        } else {
            const embed = new Discord.EmbedBuilder()
                .setColor(bot.color)
                .setTitle(`Liste des donjons Evolucraft`)
                .setThumbnail(bot.user?.displayAvatarURL()!)
                .setDescription(
                    `Voici tous les donjons disponibles dans Évolucraft.`
                )
                .setTimestamp()
                .setFooter({ text: "Donjons de Évolucraft" });

            for (const dgs of dungeonsData) {
                embed.addFields({
                    name: `${dgs.name}`, // ou ajoute un emoji selon le type
                    value: `Niveau Requis : \`${dgs.minLevel}\`\nJoueurs Max : \`${dgs.maxPlayers}\``,
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
