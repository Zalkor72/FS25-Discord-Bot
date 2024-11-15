# Farming Simulator 25 - Discord Bot
## Create a Discord bot

1. Open the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click on `New Application`
3. Name your application
4. Click on `Bot` in the left menu
6. Click on `Copy` to copy the bot token
7. Click on `Installation` in the left menu
8. Add the Permission 'Administrator' to the bot guild installation (bottom of the page)
9. Click on `Copy` to copy the URL to install the bot to a guild
10. Your installation link url should look like this: `https://discord.com/oauth2/authorize?client_id=CLIENT_ID`

## Install the bot

1. Clone the repository
2. Move the `config.example.json` to `config.json`
   1. serverPassword: The password to the server
   2. serverStatsUrl: The feed URL to the server stats (from the web interface from the server)
   3. serverMapUrl: The feed URL to the server map (from the web interface from the server)
   4. guildId: The guild id where the bot should be installed
   5. channelId: The channel id where the bot should post the server stats
   6. botToken: The bot token from the Discord Developer Portal
3. Add the bot token to the `config.json`
4. Add the prefix to the `config.json`
4. Run `npm install`
5. Run `npm start`
