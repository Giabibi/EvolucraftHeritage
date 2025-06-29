import { ClientWithCommands, Watcher } from "../types/discord";

const addWatcher = (bot: ClientWithCommands, watcher: Watcher): void => {
    bot.announcesWatchers.push(watcher);
};

const createWatcher = (
    bot: ClientWithCommands,
    name: string,
    guildId: number,
    date: Date,
    interval: bigint | undefined,
    callback: () => void
): void => {
    const now = new Date();
    let firstExecutionDelay = date.getTime() - now.getTime();

    if (firstExecutionDelay < 0 && interval) {
        const intervalsPassed = Math.ceil(
            Math.abs(firstExecutionDelay) / Number(interval)
        );
        date = new Date(date.getTime() + intervalsPassed * Number(interval));
        firstExecutionDelay = date.getTime() - now.getTime();
    } else if (firstExecutionDelay < 0) return;

    setTimeout(() => {
        callback();
        if (interval) {
            const watcher = {
                ...setInterval(callback, Number(interval)),
                isInterval: true,
                name,
                guildId,
            } as Watcher;
            addWatcher(bot, watcher);
        }
    }, firstExecutionDelay);
};

const deleteWatcher = (bot: ClientWithCommands, name: string): void => {
    const watcher = bot.announcesWatchers.find((w) => w.name === name);
    if (watcher) {
        watcher.isInterval ? clearInterval(watcher) : clearTimeout(watcher);
        bot.announcesWatchers = bot.announcesWatchers.filter(
            (w) => w.name !== watcher.name
        );
    }
};

const clearWatchers = (bot: ClientWithCommands): void => {
    bot.announcesWatchers.forEach((watcher) =>
        watcher.isInterval ? clearInterval(watcher) : clearTimeout(watcher)
    );
    bot.announcesWatchers = [];
};

const clearWatchersByGuild = (
    bot: ClientWithCommands,
    guildId: number
): void => {
    bot.announcesWatchers.forEach((watcher) =>
        watcher.guildId === guildId
            ? watcher.isInterval
                ? clearInterval(watcher)
                : clearTimeout(watcher)
            : null
    );
    bot.announcesWatchers = bot.announcesWatchers.filter(
        (watcher) => watcher.guildId != guildId
    );
};

export { createWatcher, deleteWatcher, clearWatchers, clearWatchersByGuild };
