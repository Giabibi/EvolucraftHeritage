import { Guild } from "../types/database";
import { prisma } from "./.config";

const getGuilds = async (): Promise<Guild[]> => {
    const results = await prisma.guilds.findMany();
    const guilds: Guild[] = results.map((result) => {
        return {
            id: result.id,
            guildId: result.guildId,
            channelId: result.annonceChannelId ?? undefined,
        } as Guild;
    });
    return guilds;
};

const getGuildByGuildId = async (guildId: string): Promise<Guild | null> => {
    const result = await prisma.guilds.findFirst();
    if (!result) return null;
    const guild: Guild = {
        id: result.id,
        guildId: result.guildId,
        channelId: result.annonceChannelId ?? undefined,
    } as Guild;
    return guild;
};

const getGuildIdOrCreate = async (guildId: string): Promise<number> => {
    const resultFind = await prisma.guilds.findFirst({
        where: { guildId },
    });
    let newGuildId;
    if (!resultFind) {
        const resultCreate = await prisma.guilds.create({
            data: { guildId },
        });
        newGuildId = resultCreate.id;
    } else {
        newGuildId = resultFind.id;
    }
    return newGuildId;
};

const getGuildAnnounceChannelId = async (
    guildId: string
): Promise<string | null> => {
    const resultFind = await prisma.guilds.findFirst({
        where: { guildId },
    });
    if (resultFind) {
        return resultFind.annonceChannelId;
    }
    return null;
};

const setGuildAnnounceChannelId = async (
    guildId: string,
    annonceChannelId: string
): Promise<void> => {
    const id = await getGuildIdOrCreate(guildId);
    await prisma.guilds.update({
        where: { id },
        data: { annonceChannelId },
    });
};

const unsetGuildAnnounceChannelId = async (id: number): Promise<Guild> => {
    const result = await prisma.guilds.update({
        where: { id },
        data: { annonceChannelId: null },
    });
    return {
        id: result.id,
        guildId: result.guildId,
        channelId: result.annonceChannelId ?? undefined,
    } as Guild;
};

export {
    getGuilds,
    getGuildByGuildId,
    getGuildIdOrCreate,
    getGuildAnnounceChannelId,
    setGuildAnnounceChannelId,
    unsetGuildAnnounceChannelId,
};
