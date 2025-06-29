import Discord from "discord.js";
import { getAnnouncements } from "../database/announcements";
import { getGuilds, unsetGuildAnnounceChannelId } from "../database/guilds";
import { ClientWithCommands } from "../types/discord";
import { formatAnnonceContent } from "../utils/convert";
import { clearWatchersByGuild, createWatcher } from "../utils/watchers";
import { Announcement, Guild } from "../types/database";

const getAnnouncementChannel = async (
    bot: ClientWithCommands,
    guildId: number,
    channelId: string
): Promise<Discord.TextChannel | null> => {
    try {
        const channelFound = (await bot.channels.fetch(
            channelId
        )) as Discord.TextChannel | null;
        if (!channelFound) {
            throw new Error("Couldn't find announcement channel in discord");
        }
        return channelFound;
    } catch {
        const guild = await unsetGuildAnnounceChannelId(guildId);
        clearWatchersByGuild(bot, guildId);
        await loadRegularsMessagesByGuild(bot, guild);
        return null;
    }
};

const doAnnounce = async (
    bot: ClientWithCommands,
    annonce: Announcement,
    channelId: string
): Promise<void> => {
    const announcementChannel = await getAnnouncementChannel(
        bot,
        annonce.guildId,
        channelId
    );
    if (announcementChannel) {
        announcementChannel.send({
            content: `${formatAnnonceContent(annonce.content)}`,
        });
    }
};

const loadRegularsMessagesByGuild = async (
    bot: ClientWithCommands,
    guild: Guild
): Promise<void> => {
    if (guild.channelId) {
        const announcementChannel = await getAnnouncementChannel(
            bot,
            guild.id,
            guild.channelId
        );
        if (announcementChannel) {
            console.log(`--> Loading guild [${guild.guildId}]...`);
            // Get all announcements
            const announces = await getAnnouncements(guild.guildId);
            announces.forEach((announce) => {
                // Check if we need to create watcher for regular announcement
                if (announce.date) {
                    // Create watcher
                    createWatcher(
                        bot,
                        announce.name,
                        announce.guildId,
                        announce.date,
                        announce.timeInterval,
                        () => {
                            // Send announcement message in the channel
                            console.log(
                                `===> Watcher proc : [${announce.name}]`
                            );
                            doAnnounce(bot, announce, guild.channelId!);
                        }
                    );
                    console.log(
                        `  --> Annonce [${announce.name}] has a new watcher`
                    );
                } else {
                    console.log(
                        `  --> Nothing to do with announce [${announce.name}]`
                    );
                }
            });
            return;
        }
    }
    console.log(`--> Nothing to load in guild [${guild.guildId}]`);
};

const loadRegularsMessages = async (bot: ClientWithCommands): Promise<void> => {
    console.log(`Loading regulars messages...`);
    // Get all guilds
    const guilds = await getGuilds();
    for (const guild of guilds) {
        await loadRegularsMessagesByGuild(bot, guild);
    }
};

export { doAnnounce, loadRegularsMessagesByGuild };
export default loadRegularsMessages;
