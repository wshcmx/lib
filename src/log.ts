import { wshcmx } from ".";

export function error(message: unknown, logCode?: string) {
  return write(message, "ERROR", logCode);
}

export function info(message: unknown, logCode?: string) {
  return write(message, "INFO", logCode);
}

export function verbose(message: unknown, logCode?: string) {
  return write(message, "VERBOSE", logCode);
}

export function warning(message: unknown, logCode?: string) {
  return write(message, "WARNING", logCode);
}

export function write(message: unknown, type = "INFO", logCode = "main") {
  if (IsEmptyValue(message)) {
    write("Пустое сообщение лога", "WARNING");
    return false;
  }

  logCode = `wshcmx_${logCode}`;
  EnableLog(logCode, true);

  if (!wshcmx.type.isString(message)) {
    message = tools.object_to_text(message, "json");
  }
  
  message = `[${StrUpperCase(type)}] ${message}`;

  const colorIndex = wshcmx.LOG_COLORS.GetOptProperty(type);

  if (wshcmx.ADD_COLOR_TO_LOG && colorIndex !== undefined) {
    message = `\u001B[${colorIndex}m${message}\u001B[${wshcmx.LOG_COLORS.RESET}m`;
  }

  LogEvent(logCode, message as string);

  if (wshcmx.DUPLICATE_TO_XHTTP_LOG) {
    alert(message);
  }
}