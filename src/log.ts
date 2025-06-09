import { wshcmx } from ".";

/**
 * Записывает сообщение в лог с указанным уровнем и кодом.
 * @param {string} message - Сообщение для лога
 * @param {string} [logCode] - Код лога
 */
export function error(message: unknown, logCode?: string) {
  return write(message, "ERROR", logCode);
}

/**
 * Записывает информационное сообщение в лог.
 * @param {string} message - Сообщение для лога
 * @param {string} [logCode] - Код лога
 * @returns
 */
export function info(message: unknown, logCode?: string) {
  return write(message, "INFO", logCode);
}

/**
 * Записывает отладочное сообщение в лог.
 * @param {string} message - Сообщение для лога
 * @param {string} [logCode] - Код лога
 */
export function verbose(message: unknown, logCode?: string) {
  return write(message, "VERBOSE", logCode);
}

/**
 * Записывает предупреждение в лог.
 * @param {string} message - Сообщение для лога
 * @param {string} [logCode] - Код лога
 */
export function warning(message: unknown, logCode?: string) {
  return write(message, "WARNING", logCode);
}

/**
 * Записывает сообщение в лог с указанным уровнем и кодом.
 * @param message - Сообщение для лога
 * @param {string} [type=INFO] - Уровень сообщения (INFO, ERROR, WARNING, VERBOSE)
 * @param {string} [logCode=main] - Код лога, по умолчанию "main"
 */
export function write(message: unknown, type: string = "INFO", logCode: string = "main") {
  if (IsEmptyValue(message)) {
    write("Пустое сообщение лога", "WARNING");
    return;
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