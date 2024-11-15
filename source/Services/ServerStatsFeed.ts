import {ServerStats} from "../Schema/ServerStats";
import Configuration from "./Configuration";
import {XMLParser} from "fast-xml-parser";
import Logging from "./Logging";
import IPlayer from "../Interfaces/Feed/IPlayer";

export const CONNECTION_REFUSED = 'ECONNREFUSED';
export const NOT_FOUND = 'ENOTFOUND';

export default class ServerStatsFeed {
    private _serverStats: ServerStats | null = null;
    private _isOnline: boolean = false;
    private _isFetching: boolean = false;

    constructor() {
    }

    public isFetching(): boolean {
        return this._isFetching;
    }

    private getServerStats(): ServerStats | null {
        if(this._isOnline && !this._isFetching && this._serverStats) {
            return this._serverStats;
        }
        return null;
    }

    public async updateServerFeed(): Promise<ServerStats|null> {
        this._isFetching = true;
        Logging.getLogger().info(`Fetching server stats from feed url`);
        await fetch(Configuration.getConfiguration().application.serverStatsUrl)
            .then(
                r => r.text()
            ).then(
                (response) => {
                    // Set online status to true
                    this._isOnline = true;

                    // Parse the XML response
                    const parsedFeed = new XMLParser({ignoreAttributes: false, attributeNamePrefix: ''}).parse(response) as ServerStats;
                    Logging.getLogger().info(`Server stats received`);
                    this._serverStats = parsedFeed;
                }
            ).catch(
                (reason) => {
                    // Set online status to false
                    this._isOnline = false;

                    // Handle different error codes
                    switch (reason.cause.code) {
                        case CONNECTION_REFUSED:
                            Logging.getLogger().error(`Connection refused to server stats feed`);
                            break;
                        case NOT_FOUND:
                            Logging.getLogger().error(`Server stats feed not found`);
                            break;
                        default:
                            Logging.getLogger().error(`Error fetching server stats`);
                            break;
                    }
                    return null;
                })
            .finally(() => {
                // Set fetching status to false after fetching is done or failed
                this._isFetching = false;
            });
        return this._serverStats;
    }

    public isOnline(): boolean {
        return this._isOnline;
    }

    /**
     * Returns the server name
     * @returns {string} The server name
     */
    public getServerName(): string {
        return <string>this.getServerStats()?.Server.name;
    }

    /**
     * Returns the server map name
     * @returns {string} The server map name
     */
    public getServerMap(): string {
        return <string>this.getServerStats()?.Server.map;
    }

    /**
     * Returns the server time in decimal format
     * @returns {number} The server time in decimal format
     */
    public getServerTimeDecimal(): number {
        let dayTime = this.getServerStats()?.Server.dayTime;
        if (dayTime === undefined) {
            return 0;
        }
        return dayTime / (60 * 60 * 1000) + 0.0001;
    }

    /**
     * Returns the server time in the format HH:MM
     * @returns {string} The server time in the format HH:MM
     */
    public getServerTime(): string {
        let decimalTime = this.getServerTimeDecimal();
        if(decimalTime === 0) {
            return "00:00";
        }
        let hours = Math.floor(decimalTime);
        let minutes = Math.floor((decimalTime - hours) * 60);
        let hoursString = hours.toString();
        let minutesString = minutes.toString();
        if(hoursString.length === 1) {
            hoursString = `0${hoursString}`;
        }
        if(minutesString.length === 1) {
            minutesString = `0${minutesString}`;
        }
        return `${hoursString}:${minutesString}`;
    }

    /**
     * Returns the server player count
     * @returns {number} The server player count
     */
    public getPlayerCount(): number {
        return <number>this.getServerStats()?.Server.Slots.numUsed;
    }

    /**
     * Returns the server player count
     * @returns {number} The server player count
     */
    public getMaxPlayerCount(): number {
        return <number>this.getServerStats()?.Server.Slots.capacity;
    }

    /**
     * Returns the player list from the server stats feed
     * @returns {IPlayer[]} The online player list as an array of IPlayer objects
     */
    public getPlayerList(): IPlayer[] {
        let mappedPlayers: IPlayer[];
        let returnPlayers: IPlayer[] = [];
        let playerList = this.getServerStats()?.Server.Slots.Player;
        if (Array.isArray(playerList)) {
            mappedPlayers = playerList.map((player) => {
                return {
                    username: player['#text'],
                    isAdministrator: player.isAdmin === 'true',
                    sessionTime: parseInt(player.uptime),
                    isUsed: player.isUsed === 'true',
                } as IPlayer;
            });
        } else {
            mappedPlayers = [];
        }

        // Filter out player slots that are not used
        mappedPlayers.forEach((player) => {
            if(player.isUsed) {
                returnPlayers.push(player);
            }
        });

        return returnPlayers;
    }
}