import fs from "fs";
import path from "path";
import { ClientWithCommands, EventFunction } from "../types/discord";

export default (bot: ClientWithCommands) => {
    console.log(`Loading events...`);
    const eventsPath = path.join(__dirname, "../events");
    fs.readdirSync(eventsPath)
        .filter((f) => f.endsWith(".ts"))
        .forEach(async (file) => {
            const eventName = file.replace(".ts", "");
            const eventModule = await import(path.join(eventsPath, file));
            const event: EventFunction = eventModule.default;

            bot.on(eventName, event.bind(null, bot));

            console.log(`--> Event loaded: ${file}`);
        });
};
