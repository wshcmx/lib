/// @template namespace

export namespace wshcmx {
  export let IS_DOCKER: boolean = false;
  export let connectionString: string = "";

  // Библиотеки
  export let exception: typeof import("./exception");
  export let log: typeof import("./log");
  export let object: typeof import("./object");
  export let response: typeof import("./response");
  export let string: typeof import("./string");
  export let sql: typeof import("./sql");
  export let type: typeof import("./type");
  export let net: ReturnType<typeof DotNetCoreHost.prototype.Object.GetAssembly> | undefined;

  // Конфиг
  export let ADD_COLOR_TO_LOG = true;
  export let DUPLICATE_TO_XHTTP_LOG = false;
  export const LOG_COLORS: { [key: string]: string } = {
    "RESET": "0",
    "ERROR": "31",
    "VERBOSE": "34",
    "WARNING": "33",
  };

  export function Init() {
    initEnvironment();
    initLibraries();
    initWshcmxNet();
  }

  function initEnvironment() {
    connectionString = tools.spxml_unibridge.Object.provider.GetProviderConfigValue("NoMarsConnectionString");

    if (tools_web.is_true(AppConfig.GetOptProperty("TRUST_SQL_SERVER_CERTIFICATE"))) {
      connectionString += ";TrustServerCertificate=True;";
    }

    IS_DOCKER = tools_web.is_true(AppConfig.GetOptProperty("IS_DOCKER"));
  }

  function initLibraries() {
    exception = OpenCodeLib("./exception.js");
    log = OpenCodeLib("./log.js");
    object = OpenCodeLib("./object.js");
    response = OpenCodeLib("./response.js");
    string = OpenCodeLib("./string.js");
    sql = OpenCodeLib("./sql.js");
    type = OpenCodeLib("./type.js");
  }

  function initWshcmxNet() {
    try {
      net = tools.dotnet_host?.Object.GetAssembly("wshcmx.dll");
    } catch (error) {
      log.error(`Failed to load wshcmx.dll:\n${error}`);
    }
  }
}
