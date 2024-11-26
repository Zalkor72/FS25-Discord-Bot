# Farming Simulator 25 - Discord Bot

This bot will post the server stats of a Farming Simulator 25 server to a Discord channel. The bot will post the server
name, server password, server time, and the player count. The bot will update the server stats every x seconds (
configurable).

![discord_embed.png](misc%2Fimages%2Fdiscord_embed.png)

The bot is written in Node.js and uses the [discord.js](https://discord.js.org/) library to interact with the Discord
API. It
uses the XML-Feed from the Farming Simulator 25 server to get the server stats (you can find the feed URL in the web
interface of the server).

![bot_terminal.png](misc%2Fimages%2Fbot_terminal.png)

# Requirements

- Node.js - if you want to run the bot without Docker
- NPM - if you want to run the bot without Docker
- Docker (optional) - if you want to run the bot in a Docker container

## Install the bot

## Create a Discord bot

1. Open the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click on `New Application`
3. Name your application
4. Click on `Bot` in the left menu
5. Click on `Copy` to copy the bot token
6. Click on `Installation` in the left menu
7. Add the Permission 'Administrator' to the bot guild installation (bottom of the page)
8. Click on `Copy` to copy the URL to install the bot to a guild
9. Your installation link url should look like this: `https://discord.com/oauth2/authorize?client_id=CLIENT_ID`

## Configure the bot

1. Clone the repository to your server
2. Move the `config.example.json` to `config.json`
3. Fill in the required fields in the `config.json` file, do not delete fields, just leave them empty for default values
4. All fields with a `(*)` are required fields for the bot to work. The other fields are optional and can be left by
   default

| **- Key -**                                  | **- Description -**                                                       |
|----------------------------------------------|---------------------------------------------------------------------------|
| (*) application.serverPassword               | The password to join the server (or leave empty)                          |
| (*) application.serverStatsUrl               | The feed URL to the server stats (from the web interface from the server) |
| (*) application.serverMapUrl                 | The feed URL to the server map (from the web interface from the server)   |
| (*) application.updateIntervalSeconds        | The interval in seconds to update the server stats                        |
| (*) discord.channelId                        | The channel id where the bot should post the server stats                 |
| (*) discord.botToken                         | The bot token from the Discord Developer Portal                           |
| translation.discordEmbed.title               | The title of the Discord embed                                            |
| translation.discordEmbed.descriptionOnline   | The description when the server is online                                 |
| translation.discordEmbed.descriptionOffline  | The description when the server is offline                                |
| translation.discordEmbed.descriptionUnknown  | The description when the server status is unknown                         |
| translation.discordEmbed.titleServerName     | The title of the server name                                              |
| translation.discordEmbed.titleServerPassword | The title of the server password                                          |
| translation.discordEmbed.titleServerTime     | The title of the server time                                              |
| translation.discordEmbed.titlePlayerCount    | The title of the player count                                             |
| translation.discordEmbed.noPlayersOnline     | The message when no players are online                                    |
| translation.discordEmbed.titleServerMap      | The title of the server map                                               |
| translation.discordEmbed.titleServerMods     | The title of the server mods                                              |
| translation.common.monthJanuary              | The month January in the language of the server                           |
| translation.common.monthFebruary             | The month February in the language of the server                          |
| translation.common.monthMarch                | The month March in the language of the server                             |
| translation.common.monthApril                | The month April in the language of the server                             |
| translation.common.monthMay                  | The month May in the language of the server                               |
| translation.common.monthJune                 | The month June in the language of the server                              |
| translation.common.monthJuly                 | The month July in the language of the server                              |
| translation.common.monthAugust               | The month August in the language of the server                            |
| translation.common.monthSeptember            | The month September in the language of the server                         |
| translation.common.monthOctober              | The month October in the language of the server                           |
| translation.common.monthNovember             | The month November in the language of the server                          |
| translation.common.monthDecember             | The month December in the language of the server                          |

## Run inside a Docker container

1. Run `docker-compose up -d --build` in the root directory of the repository
2. The bot should be running now and posting the server stats to the Discord channel

### Run without Docker (Node.js)

1. Clone the repository to your server
2. Run `npm install`
3. Run `npm start`
4. The bot should be running now and posting the server stats to the Discord channel
5. If you close the terminal, the bot will stop running
