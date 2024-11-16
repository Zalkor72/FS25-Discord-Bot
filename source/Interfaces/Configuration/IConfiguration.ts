import IDiscordConfiguration from "./IDiscordConfiguration";
import IApplicationConfiguration from "./IApplicationConfiguration";
import ITranslation from "./ITranslation";

export default interface IConfiguration {
    discord: IDiscordConfiguration;
    application: IApplicationConfiguration;
    translation: ITranslation;
}