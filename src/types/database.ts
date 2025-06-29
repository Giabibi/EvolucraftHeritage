interface Announcement {
    id: number;
    guildId: number;
    name: string;
    content: string;
    date: Date | undefined;
    timeInterval: bigint | undefined;
}

interface Guild {
    id: number;
    guildId: string;
    channelId: string | undefined;
}

export type { Announcement, Guild };
