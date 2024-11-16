import {Client, EmbedBuilder, Snowflake, TextChannel} from "discord.js";
import Configuration from "./Configuration";
import ServerStatusFeed from "./ServerStatusFeed";
import {Logger} from "winston";
import Logging from "./Logging";

export default class DiscordEmbed {
    private appLogger: Logger;
    private discordAppClient: Client;
    private appConfiguration: Configuration;
    private serverStatsFeed: ServerStatusFeed;
    private firstMessageId: Snowflake | null = null;

    public constructor(discordAppClient: Client) {
        this.appLogger = Logging.getLogger();
        this.discordAppClient = discordAppClient;
        this.appConfiguration = new Configuration();
        this.serverStatsFeed = new ServerStatusFeed();

        (async () => {
            // Delete all messages in the channel
            await this.deleteAllMessages();
            // Start the update loop, which updates the discord embed every x seconds itself
            await this.updateDiscordEmbed();
        })();
    }

    /**
     * Update the discord embed with the server status, player list and server time
     * This method is called every x seconds to update the discord embed.
     * @private
     */
    private async updateDiscordEmbed(): Promise<void> {
        try {
            await this.serverStatsFeed.updateServerFeed();
            if(this.serverStatsFeed.isFetching()) {
                this.appLogger.info('Server status feed is still fetching, try again...');
                setTimeout(() => {
                    this.updateDiscordEmbed();
                }, 1000);
                return;
            }
            this.discordAppClient.channels.fetch(this.appConfiguration.discord.channelId as Snowflake).then(async channel => {
                this.generateEmbedFromStatusFeed(this.serverStatsFeed).then(embedMessage => {
                    if (this.firstMessageId !== null) {
                        (channel as TextChannel).messages.fetch(this.firstMessageId).then(message => {
                            message.edit({embeds: [embedMessage]});
                        });
                    } else {
                        (channel as TextChannel).send({embeds: [embedMessage]}).then(message => {
                            this.firstMessageId = message.id;
                        })
                    }
                });
            });
        } catch (exception) {
            this.appLogger.error(exception);
        }

        setTimeout(() => {
            this.updateDiscordEmbed();
        }, this.appConfiguration.application.updateIntervalSeconds * 1000);
    }

    /**
     * Delete all messages in a text channel to clear the channel
     * @private
     */
    private async deleteAllMessages(): Promise<boolean> {
        let textChannel = this.discordAppClient.channels.cache.get(this.appConfiguration.discord.channelId as Snowflake) as TextChannel;
        this.appLogger.info(`Deleting all messages in discord text channel ${textChannel.id}`);
        textChannel.messages.fetch().then(messages => {
            messages.forEach(message => {
                message.delete();
            });
        });
        return true;
    }

    /**
     * Send server stats embed in a channel
     * @param serverStats
     */
    private async generateEmbedFromStatusFeed(serverStats: ServerStatusFeed): Promise<EmbedBuilder> {
        let embed = new EmbedBuilder();
        embed.setTitle('Server Status');
        if (!serverStats.isOnline()) {
            embed.setDescription('Der Server ist aktuell offline.');
        } else if (serverStats.isFetching()) {
            embed.setDescription('Der Serverstatus wird aktuell abgefragt...');
        } else {
            embed.setDescription(`Der Server ist aktuell ${serverStats.isOnline() ? 'online' : 'offline'}`);
            embed.setTimestamp();
            embed.setThumbnail(this.appConfiguration.application.serverMapUrl);

            let playerListString: string = '';
            if(serverStats.getPlayerList().length === 0) {
                playerListString = 'Keine Spieler online';
            } else {
                playerListString = serverStats.getPlayerList().map(p => p.username).join(', ');
            }

            // @ts-ignore
            embed.addFields(
                {name: 'Name:', value: serverStats.getServerName()},
                {name: 'Passwort:', value: this.appConfiguration.application.serverPassword},
                {name: 'Uhrzeit im Spiel:', value: serverStats.getServerTime()},
                {
                    name: `Spieler online (${serverStats.getPlayerCount()}/${serverStats.getMaxPlayerCount()}):`,
                    value: playerListString
                },
            );
        }
        this.appLogger.debug(embed);
        return embed;
    }
}