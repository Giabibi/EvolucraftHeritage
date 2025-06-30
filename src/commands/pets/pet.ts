import Discord, { MessageFlags } from "discord.js";
import { ClientWithCommands } from "../../types/discord";
import { Pet, EPet, getPetByEPet, isEPet } from "../../types/evolucraft/pets";
import { displayPetEffect } from "../../types/evolucraft/prettyDisplay";

const handlePetOption = async (
    bot: ClientWithCommands,
    interaction:
        | Discord.ChatInputCommandInteraction<Discord.CacheType>
        | Discord.MessageContextMenuCommandInteraction<Discord.CacheType>
        | Discord.UserContextMenuCommandInteraction<Discord.CacheType>
        | Discord.PrimaryEntryPointCommandInteraction<Discord.CacheType>,
    selectedPet: string
) => {
    // Check if the class exist
    if (!isEPet(selectedPet)) {
        interaction.reply({
            content: "⚠️ Le pet n'est pas valide.",
            flags: MessageFlags.Ephemeral,
        });
        return;
    }
    const pet: Pet = getPetByEPet(selectedPet as EPet);
    const embed = new Discord.EmbedBuilder()
        .setColor(bot.color)
        .setTitle(`Donjon ${pet.name}`)
        .setThumbnail(bot.user?.displayAvatarURL()!)
        .setDescription(
            `
                Nom : \`${pet.name}\`
                Rareté : \`${pet.rarity}\`
            `
        )
        .setTimestamp()
        .setFooter({ text: "Donjons de Évolucraft" });

    pet.effects.forEach((effect) => {
        embed.addFields({
            name: `➣ ` + ` Niveau ${effect.level}`,
            value: `\`${displayPetEffect(
                effect.type,
                effect.name,
                effect.amount
            )}\``,
        });
    });
    await interaction.reply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral,
    });
};

export default handlePetOption;
