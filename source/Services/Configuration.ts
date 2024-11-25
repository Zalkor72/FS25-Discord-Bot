import IDiscordConfiguration from "../Interfaces/Configuration/IDiscordConfiguration";
import IApplicationConfiguration from "../Interfaces/Configuration/IApplicationConfiguration";
import IConfiguration from "../Interfaces/Configuration/IConfiguration";
import ITranslation from "../Interfaces/Configuration/ITranslation";
import Logging from "./Logging";

export default class Configuration implements IConfiguration{
    public readonly discord: IDiscordConfiguration;
    public readonly application: IApplicationConfiguration;
    public readonly translation: ITranslation;

    constructor() {
        let config = require('../../config.json');
        this.discord = config.discord;
        this.application = config.application;
        this.translation = config.translation;
    }

    /**
     * Returns true if the value is empty or undefined
     * @param value
     * @private
     */
    private isValueEmptyOrUndefined(value: any): boolean {
        return value == null || value == "" || value == undefined;
    }

    /**
     * Returns true if the value is undefined
     * @param value
     * @private
     */
    private isValueUndefined(value: any): boolean {
        return value == undefined;
    }

    /**
     * Validates the discord configuration and returns true if the configuration is valid
     * @private
     */
    private validateDiscordConfiguration(): boolean {
        return !(this.isValueEmptyOrUndefined(this.discord.botToken) || this.isValueEmptyOrUndefined(this.discord.channelId));
    }

    /**
     * Validates the application configuration and returns true if the configuration is valid
     * @private
     */
    private validateApplicationConfiguration(): boolean {
        return !(
            this.isValueUndefined(this.application.serverPassword)
            || this.isValueEmptyOrUndefined(this.application.serverStatsUrl)
            || this.isValueEmptyOrUndefined(this.application.serverMapUrl)
            || this.isValueEmptyOrUndefined(this.application.updateIntervalSeconds)
        );
    }

    /**
     * Validates the translation configuration and returns true if the configuration is valid
     * @private
     */
    private validateTranslationConfiguration(): boolean {
        return !(
            this.isValueEmptyOrUndefined(this.translation.discordEmbed.title)
            || this.isValueEmptyOrUndefined(this.translation.discordEmbed.descriptionOnline)
            || this.isValueEmptyOrUndefined(this.translation.discordEmbed.descriptionOffline)
            || this.isValueEmptyOrUndefined(this.translation.discordEmbed.descriptionUnknown)
            || this.isValueEmptyOrUndefined(this.translation.discordEmbed.titleServerName)
            || this.isValueEmptyOrUndefined(this.translation.discordEmbed.titleServerPassword)
            || this.isValueEmptyOrUndefined(this.translation.discordEmbed.titleServerTime)
            || this.isValueEmptyOrUndefined(this.translation.discordEmbed.titlePlayerCount)
            || this.isValueEmptyOrUndefined(this.translation.discordEmbed.noPlayersOnline)
        );
    }

    /**
     * Validates the configuration file and returns true if the configuration is valid
     * @returns boolean True if the configuration is valid
     */
    public isConfigurationValid(): boolean {
        const logger = Logging.getLogger();
        if(!this.validateDiscordConfiguration()) {
            logger.info("Discord configuration is not valid. Please check your configuration file.");
            return false;
        } else {
            logger.info("Discord configuration is valid.");
        }
        if(!this.validateApplicationConfiguration()) {
            logger.info("Application configuration is not valid. Please check your configuration file.");
            return false;
        } else {
            logger.info("Application configuration is valid.");
        }
        if(!this.validateTranslationConfiguration()) {
            logger.info("Translation configuration is not valid. Please check your configuration file.");
            return false;
        } else {
            logger.info("Translation configuration is valid.");
        }
        return true;
    }

    /**
     * Returns the configuration object
     */
    public static getConfiguration(): IConfiguration {
        return new Configuration();
    }
}