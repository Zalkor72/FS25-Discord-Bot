import IDiscordConfiguration from "../Interfaces/Configuration/IDiscordConfiguration";
import IApplicationConfiguration from "../Interfaces/Configuration/IApplicationConfiguration";
import IConfiguration from "../Interfaces/Configuration/IConfiguration";
import ITranslation from "../Interfaces/Configuration/ITranslation";

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

    public static getConfiguration(): IConfiguration {
        return new Configuration();
    }
}