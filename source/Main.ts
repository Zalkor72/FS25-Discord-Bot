import {Client, EmbedBuilder, IntentsBitField, Snowflake, TextChannel} from 'discord.js';
import Configuration from "./Services/Configuration";
import Logging from "./Services/Logging";
import ServerStatsFeed from "./Services/ServerStatsFeed";

const appLogger = Logging.getLogger();
const appConfig: Configuration = new Configuration();
const appClient = new Client({
    intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages]
});
appClient.login(appConfig.discord.botToken);

/**
 * Delete all messages in a text channel
 * @param textChannel
 */
function deleteAllMessages(textChannel: TextChannel) {
    appLogger.info(`Deleting all messages in channel ${textChannel.id}`);
    textChannel.messages.fetch().then(messages => {
        messages.forEach(message => {
            message.delete();
        });
    });
}

/**
 * Send server stats embed in a channel
 * @param serverStats
 */
async function generateEmbedFromStatusFeed(serverStats: ServerStatsFeed): Promise<EmbedBuilder> {
    let embed = new EmbedBuilder();
    embed.setTitle('Server Status');
    if (!serverStats.isOnline()) {
        embed.setDescription('Der Server ist aktuell offline.');
    } else if (serverStats.isFetching()) {
        embed.setDescription('Der Serverstatus wird aktuell abgefragt...');
    } else {
        embed.setDescription(`Der Server ist aktuell ${serverStats.isOnline() ? 'online' : 'offline'}`);
        embed.setTimestamp();
        embed.setThumbnail(Configuration.getConfiguration().application.serverMapUrl);

        let playerListString: string = '';
        if(serverStats.getPlayerList().length === 0) {
            playerListString = 'Keine Spieler online';
        } else {
            playerListString = serverStats.getPlayerList().map(p => p.username).join(', ');
        }

        // @ts-ignore
        embed.addFields(
            {name: 'Name:', value: serverStats.getServerName()},
            {name: 'Passwort:', value: appConfig.application.serverPassword},
            {name: 'Uhrzeit im Spiel:', value: serverStats.getServerTime()},
            {
                name: `Spieler online (${serverStats.getPlayerCount()}/${serverStats.getMaxPlayerCount()}):`,
                value: playerListString
            },
        );
    }
    return embed;
}

appClient.on('ready', () => {
    appLogger.info(`Discord client ready. Logged in as ${appClient.user?.username}!`);
    const serverStats = new ServerStatsFeed();

    // Fetch channel and delete all messages
    appClient.channels.fetch(appConfig.discord.channelId as Snowflake).then(channel => {
        let textChannel = channel as TextChannel;
        deleteAllMessages(textChannel);
    });

    // Start fetching server stats
    (async () => {
        await serverStats.updateServerFeed();
        let firstMessageId: any = null;
        setInterval(async () => {
            await serverStats.updateServerFeed();
            appClient.channels.fetch(appConfig.discord.channelId as Snowflake).then(async channel => {
                generateEmbedFromStatusFeed(serverStats).then(embedMessage => {
                    console.log(embedMessage);
                    if (firstMessageId !== null) {
                        (channel as TextChannel).messages.fetch(firstMessageId).then(message => {
                            message.edit({embeds: [embedMessage]});
                        });
                    } else {
                        (channel as TextChannel).send({embeds: [embedMessage]}).then(message => {
                            firstMessageId = message.id;
                        })
                    }
                });
            })
        }, appConfig.application.updateIntervalSeconds * 1000);
    })();
});
