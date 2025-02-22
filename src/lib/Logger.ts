import { Logger, pino } from "pino";

export function LoggerFactory() {
  return pino();
}

export function ModuleLoggerFactory(): Logger {
  return pino();
}
