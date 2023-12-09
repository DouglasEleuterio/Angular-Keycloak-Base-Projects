import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';

export enum LogLevel {
  All = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  Fatal = 5,
  Off = 6
}

@Injectable({
  providedIn: 'root'
})
export class LogService {
  level: LogLevel = environment.logLevel ?? LogLevel.All;
  logWithDate = true;

  debug(logClass: string, msg: string, ...optionalParams: unknown[]): void {
    this.writeToLog(logClass, msg, LogLevel.Debug, optionalParams);
  }

  info(logClass: string, msg: string, ...optionalParams: unknown[]): void {
    this.writeToLog(logClass, msg, LogLevel.Info, optionalParams);
  }

  warn(logClass: string, msg: string, ...optionalParams: unknown[]): void {
    this.writeToLog(logClass, msg, LogLevel.Warn, optionalParams);
  }

  error(logClass: string, msg: string, ...optionalParams: unknown[]): void {
    this.writeToLog(logClass, msg, LogLevel.Error, optionalParams);
  }

  fatal(logClass: string, msg: string, ...optionalParams: unknown[]): void {
    this.writeToLog(logClass, msg, LogLevel.Fatal, optionalParams);
  }

  log(logClass: string, msg: string, ...optionalParams: unknown[]): void {
    this.writeToLog(logClass, msg, LogLevel.All, optionalParams);
  }

  private writeToLog(logClass: string, msg: string, level: LogLevel, params: unknown[]): void {
    if (this.shouldLog(level)) {
      let value = `[${logClass}] `;
      if (this.logWithDate) {
        value += new Date().toLocaleDateString() + ' - ';
      }
      value += 'Level: ' + LogLevel[this.level];
      value += ' - ' + msg;
      if (params != null && params.length > 0) {
        // eslint-disable-next-line no-console
        console.log(value, params);
      } else {
        // eslint-disable-next-line no-console
        console.log(value);
      }
    }
  }

  private shouldLog(level: LogLevel): boolean {
    let ret = false;
    if ((level >= this.level && level !== LogLevel.Off) || this.level === LogLevel.All) {
      ret = true;
    }
    return ret;
  }
}
