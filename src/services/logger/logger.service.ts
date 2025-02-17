import winston from "winston";

class LoggerService {
  public static instance: LoggerService;

  public static getInstance() {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  private formatMessage() {
    return winston.format.printf(({ level, message, timestamp }) => {
      const convertedTimeStamp = new Date(
        timestamp as string | number
      ).toLocaleString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      });
      console.log(`[${convertedTimeStamp} ${level.toUpperCase()}: ${message}]`);
      return `[${convertedTimeStamp} ${level.toUpperCase()}: ${message}]`;
    });
  }

  // private method, temp public
  public generateLogger(level: string) {
    const logger = winston.createLogger({
      level: level,
      format: winston.format.combine(
        winston.format.timestamp(),
        this.formatMessage()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: `${level}.log`,
          level: level,
        }),
        new winston.transports.File({
          filename: "error.log",
          level: "error",
        }),
      ],
    });

    return logger;
  }
}

export const loger = LoggerService.getInstance();

export const infoLogger = loger.generateLogger("info");
