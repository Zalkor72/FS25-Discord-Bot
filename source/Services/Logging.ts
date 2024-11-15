import winston, {Logger} from "winston";

export default class Logging {
    public static getLogger(): Logger {
        return winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
            ),
            transports: [
                new winston.transports.Console(),
            ]
        });
    }
}