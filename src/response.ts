import { wshcmx } from ".";

/**
 * Отправляет ответ в формате JSON с указанным статусом и сообщением.
 * @param {Response} res - Объект ответа
 * @param {T} payload - Данные для отправки в ответ
 * @param {number} [status=200] - HTTP статус ответа, по умолчанию 200
 * @param {string} [message=""] - Сообщение для статуса, по умолчанию пустая строка
 */
function json<T>(
  res: Response,
  payload: T,
  status: number = 200,
  message: string = ""
) {
  res.ContentType = "application/json; charset=utf-8;";

  if (status !== 200) {
    res.SetRespStatus(status, message);
  }

  res.Write((wshcmx.type.isPrimitive(payload) ? payload : tools.object_to_text(payload, "json")) as string);
}

/**
 * Отправляет ответ с ошибкой в формате JSON и устанавливает HTTP статус.
 * @param {Response} res - Объект ответа
 * @param {Error | string} message - Сообщение об ошибке или объект ошибки
 * @param {number} [status=500] - HTTP статус ответа, по умолчанию 500
 */
export function abort(res: Response, message: Error | string, status: number = 500) {
  message = (wshcmx.type.isError(message) ? message.message : RValue(message));
  json(res, { error: message }, status, message);
}

/**
 * Отправляет успешный ответ в формате JSON с указанными данными и статусом.
 * @param {Response} res - Объект ответа
 * @param {T} data - Данные для отправки в ответ
 * @param {number} [status=200] - HTTP статус ответа, по умолчанию 200
 */
export function ok<T>(res: Response, data: T, status: number = 200) {
  json(res, data, status);
}

/**
 * Отправляет ответ с кодом 304 Not Modified.
 * @param {Response} res - Объект ответа
 */
export function notModified(res: Response) {
  ok(res, null, 304);
}

/**
 * Отправляет ответ с кодом 400 Bad Request и сообщением об ошибке.
 * @param {Response} res - Объект ответа
 * @param {string} message - Сообщение об ошибке
 */
export function badRequest(res: Response, message: string) {
  abort(res, message, 400);
}

/**
 * Отправляет ответ с кодом 401 Unauthorized и сообщением об ошибке.
 * @param {Response} res - Объект ответа
 * @param {string} [message="Необходима авторизация"] - Сообщение об ошибке
 */
export function unauthorized(res: Response, message: string = "Необходима авторизация") {
  abort(res, message, 401);
}

/**
 * Отправляет ответ с кодом 403 Forbidden и сообщением об ошибке.
 * @param {Response} res - Объект ответа
 * @param {string} [message="Доступ запрещён"] - Сообщение об ошибке
 */
export function forbidden(res: Response, message: string = "Доступ запрещён") {
  abort(res, message, 403);
}

/**
 * Отправляет ответ с кодом 404 Not Found и сообщением об ошибке.
  * @param {Response} res - Объект ответа
  * @param {string} message - Сообщение об ошибке
 */
export function notFound(res: Response, message: string) {
  abort(res, message, 404);
}

/**
 * Отправляет ответ с кодом 405 Method Not Allowed и сообщением об ошибке.
 * @param {Response} res - Объект ответа
 * @param {string} [message="Метод не разрешен"] - Сообщение об ошибке
 */
export function methodNotAllowed(res: Response, message: string = "Метод не разрешен") {
  abort(res, message, 405);
}

/**
 * Отправляет ответ с кодом 406 Not Acceptable и сообщением об ошибке.
 * @param {Response} res - Объект ответа
 * @param {string} [message="Запрошенный ресурс не может быть представлен в запрошенном формате"] - Сообщение об ошибке
 */
export function unsupportedMediaType(res: Response, message: string = "Запрошенный ресурс не может быть представлен в запрошенном формате") {
  abort(res, message, 415);
}

/**
 * Отправляет ответ с кодом 422 Unprocessable Entity и сообщением об ошибке.
 * @param res - Объект ответа
 * @param message - Сообщение об ошибке
 */
export function unprocessableContent(res: Response, message: string) {
  abort(res, message, 422);
}

/**
 * Отправляет бинарный файл в ответе.
 * @param res - Объект ответа
 * @param {ResourceDocument} file - Документ ресурса, содержащий файл
 */
export function binary(res: Response, file: ResourceDocument) {
  if (file.TopElem.file_source.Value === null) {
    throw new Error("Файловый источник не указан");
  }

  if (file.TopElem.file_url.Value === null) {
    throw new Error("URL файла не указан");
  }

  const binary = new Binary();
  const url = tools.file_source_get_file_to_save_url(
    file.TopElem.file_source.Value,
    file.DocID,
    file.TopElem.file_url.Value
  );
  binary.LoadFromUrl(url);
  res.ContentType = tools_web.url_std_content_type(url);
  res.AddHeader("Content-Disposition", `attachment; filename=${UrlEncode(file.TopElem.name.Value)}`);
  res.Stream.WriteBinary(binary);
}