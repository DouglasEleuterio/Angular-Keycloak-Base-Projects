import { LogLevel, LogService } from '../../../log/log.service';
import { PermissionComponent } from '../permission/permission.component';

export abstract class LogComponent extends PermissionComponent {
  protected constructor(protected logService: LogService) {
    super();
  }

  debug(msg: string, ...optionalParams: unknown[]): void {
    this.logService.debug(this.constructor.name, msg, optionalParams);
  }

  info(msg: string, ...optionalParams: unknown[]): void {
    this.logService.info(this.constructor.name, msg, optionalParams);
  }

  warn(msg: string, ...optionalParams: unknown[]): void {
    this.logService.warn(this.constructor.name, msg, LogLevel.Warn, optionalParams);
  }

  error(msg: string, ...optionalParams: unknown[]): void {
    this.logService.error(this.constructor.name, msg, LogLevel.Error, optionalParams);
  }

  fatal(msg: string, ...optionalParams: unknown[]): void {
    this.logService.fatal(this.constructor.name, msg, LogLevel.Fatal, optionalParams);
  }

  log(msg: string, ...optionalParams: unknown[]): void {
    this.logService.log(this.constructor.name, msg, LogLevel.All, optionalParams);
  }
}
