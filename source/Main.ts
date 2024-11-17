import {Client, IntentsBitField} from 'discord.js';
import Configuration from "./Services/Configuration";
import Logging from "./Services/Logging";
import DiscordService from "./Services/DiscordEmbed";

const appLogger = Logging.getLogger();
const appConfig: Configuration = new Configuration();
const discordClient = new Client({
    intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages]
});

/**
 * Start the discord client and log in
 * After that create a new DiscordService instance to start the server stats feed
 */
discordClient.login(appConfig.discord.botToken).then(() => {
    appLogger.info(`Login successful to discord with token`);
});

/**
 * Start the DiscordService and restart it if an error occurred
 */
function startDiscordService(): void {
    try {
        new DiscordService(discordClient);
    } catch (exception) {
        appLogger.error(`Restarting the discord service, an error occurred`, exception);
        startDiscordService();
    }
}

discordClient.on('ready', () => {
    appLogger.info(`Discord client ready. Logged in as ${discordClient.user?.username}!`);
    startDiscordService();
});
