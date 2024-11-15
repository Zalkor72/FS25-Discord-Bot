import IDiscordConfiguration from "./IDiscordConfiguration";
import IApplicationConfiguration from "./IApplicationConfiguration";

export default interface IConfiguration {
    discord: IDiscordConfiguration;
    application: IApplicationConfiguration;
}