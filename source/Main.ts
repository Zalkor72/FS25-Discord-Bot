import {Client, IntentsBitField} from 'discord.js';
import Configuration from "./Services/Configuration";
import Logging from "./Services/Logging";
import DiscordService from "./Services/DiscordEmbed";

// Create a new logger instance and configuration instance
const appLogger = Logging.getLogger();
const appConfig: Configuration = new Configuration();

// Log the application start and version
const packageJson = require('../package.json');
appLogger.info(`Starting | App: ${packageJson.name} | Version: ${packageJson.version}`);
appLogger.info(`----------------------------------------------------`);

/**
 * Check if the configuration is valid and exit the application if it is not
 */
if(!appConfig.isConfigurationValid()) {
    appLogger.error("Configuration is not valid. Exiting application.");
    process.exit(1);
}

/**
 * Create a new discord client instance
 */
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
