import { Announcement } from "../types/database";
import { prisma } from "./.config";
import { getGuildIdOrCreate } from "./guilds";

const createAnnouncement = async (
    guild: string,
    name: string,
    content: string,
    date: Date | undefined,
    timeInterval: number | undefined
): Promise<Announcement> => {
    const guildId = await getGuildIdOrCreate(guild);
    const result = await prisma.announcements.create({
        data: { guildId, name, content, date, timeInterval },
    });
    const announcement: Announcement = {
        id: result.id,
        guildId: result.guildId,
        name: result.name,
        content: result.content,
        date: result.date ?? undefined,
        timeInterval: result.timeInterval ?? undefined,
    };
    return announcement;
};
const updateAnnouncement = async (
    guild: string,
    name: string,
    content: string,
    date: Date | undefined,
    timeInterval: number | undefined
): Promise<Announcement | undefined> => {
    const announceFound = await getAnnouncementByName(guild, name);
    if (!announceFound) return;
    const result = await prisma.announcements.update({
        where: { id: announceFound.id },
        data: { content, date, timeInterval },
    });
    const announcement: Announcement = {
        id: result.id,
        guildId: result.guildId,
        name: result.name,
        content: result.content,
        date: result.date ?? undefined,
        timeInterval: result.timeInterval ?? undefined,
    };
    return announcement;
};
const getAnnouncements = async (guild: string): Promise<Announcement[]> => {
    const guildId = await getGuildIdOrCreate(guild);
    const results = await prisma.announcements.findMany({
        where: { guildId },
    });
    const announcements: Announcement[] = results.map((result) => {
        return {
            id: result.id,
            guildId: result.guildId,
            name: result.name,
            content: result.content,
            date: result.date ?? undefined,
            timeInterval: result.timeInterval ?? undefined,
        } as Announcement;
    });
    return announcements;
};
const getAnnouncementByName = async (
    guild: string,
    name: string
): Promise<Announcement | undefined> => {
    const guildId = await getGuildIdOrCreate(guild);
    const result = await prisma.announcements.findFirst({
        where: { guildId, name },
    });
    if (!result) return;
    const announcement: Announcement = {
        id: result.id,
        guildId: result.guildId,
        name: result.name,
        content: result.content,
        date: result.date ?? undefined,
        timeInterval: result.timeInterval ?? undefined,
    };
    return announcement;
};
const deleteAnnouncement = async (
    guild: string,
    name: string
): Promise<number> => {
    const guildId = await getGuildIdOrCreate(guild);
    const result = await prisma.announcements.deleteMany({
        where: { guildId, name },
    });
    return result.count;
};

export {
    createAnnouncement,
    updateAnnouncement,
    getAnnouncements,
    getAnnouncementByName,
    deleteAnnouncement,
};
