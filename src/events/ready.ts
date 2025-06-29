import loadRegularsMessages from "../handlers/loadRegularsMessages";
import loadCommands from "../handlers/loadCommands";
import { ClientWithCommands } from "../types/discord";
import Discord from "discord.js";

export default async (bot: ClientWithCommands) => {
    await loadCommands(bot);
    // await loadRegularsMessages(bot);

    bot.user?.setStatus(Discord.PresenceUpdateStatus.DoNotDisturb);
    const currentActivity: Discord.ActivityOptions = {
        name: "Evolucraft",
        url: "https://evolucraft.fr/",
        type: Discord.ActivityType.Playing,
    };
    bot.user?.setActivity(currentActivity);

    setTimeout(() => console.log(`\nLogged in as ${bot.user?.tag}!\n`), 1000);
};
