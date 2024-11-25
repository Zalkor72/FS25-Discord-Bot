import ITranslationDiscordEmbed from "./ITranslationDiscordEmbed";
import ITranslationCommon from "./ITranslationCommon";

export default interface ITranslation {
    discordEmbed: ITranslationDiscordEmbed;
    common: ITranslationCommon;
}