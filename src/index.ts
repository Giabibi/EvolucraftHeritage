import "./types/redefinitions";
import Discord from "discord.js";
import dotenv from "dotenv";
import loadEvents from "./handlers/loadEvents";
import { ClientWithCommands } from "./types/discord";
dotenv.config();
const intents = new Discord.IntentsBitField(53608447);

// Create bot client
const bot = new Discord.Client({ intents }) as ClientWithCommands;

// Config bot
bot.commands = new Discord.Collection();
bot.color = "Aqua";
bot.announcesWatchers = [];

// Login to Discord
bot.login(process.env.DISCORD_TOKEN);

// Handle all bot functionnalities
loadEvents(bot);
