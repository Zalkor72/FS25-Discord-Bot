import IDiscordConfiguration from "../Interfaces/Configuration/IDiscordConfiguration";
import IApplicationConfiguration from "../Interfaces/Configuration/IApplicationConfiguration";
import IConfiguration from "../Interfaces/Configuration/IConfiguration";

export default class Configuration implements IConfiguration{
    public readonly discord: IDiscordConfiguration;
    public readonly application: IApplicationConfiguration;

    constructor() {
        let config = require('../../config.json');
        this.discord = config.discord;
        this.application = config.application;
    }

    public static getConfiguration(): IConfiguration {
        return new Configuration();
    }
}