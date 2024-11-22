/// @template namespace

export namespace wshcmx {
  // Библиотеки
  export let log: typeof import("./log");
  export let object: typeof import("./object");
  export let response: typeof import("./response");
  export let string: typeof import("./string");
  export let sql: typeof import("./sql");
  export let type: typeof import("./type");

  // Конфиг
  export let ADD_COLOR_TO_LOG = true;
  export let DUPLICATE_TO_XHTTP_LOG = false;
  export const LOG_COLORS: { [key: string]: string } = {
    "RESET": "0",
    "ERROR": "31",
    "VERBOSE": "34",
    "WARNING": "33",
  };

  export function init() {
    log = OpenCodeLib("./log.js");
    object = OpenCodeLib("./object.js");
    response = OpenCodeLib("./response.js");
    string = OpenCodeLib("./string.js");
    sql = OpenCodeLib("./sql.js");
    type = OpenCodeLib("./type.js");
  }
}
