import { wshcmx } from ".";
import { wshcmx as wshcmxnet } from "@wshcmx/net";

type PaginationProcedureOptions = {
  page?: number;
  size?: number;
  select?: string;
  orderby?: string;
};

export function boolean(v: unknown) {
  return tools_web.is_true(v) ? 1 : 0;
}

export function date(v: unknown) {
  return SqlLiteral(OptDate(v, "NULL"));
}

export function executeNonQuery(query: string) {
  wshcmx.exception.throwIfUndefined(wshcmx.net, "wshcmx.net");
  const sqlInstance = wshcmx.net.CreateClassObject<wshcmxnet.Net.Sql>("wshcmx.Net.Sql");

  wshcmx.exception.throwIfNull(sqlInstance, "sqlInstance");
  sqlInstance.Init(wshcmx.connectionString);

  sqlInstance.ExecuteNonQuery(query);
}

export function executePaginationProcedure<T>(query: string, options: PaginationProcedureOptions = {}, parameters: Record<string, unknown> = {}) {
  wshcmx.exception.throwIfUndefined(wshcmx.net, "wshcmx.net");
  const sqlInstance = wshcmx.net.CreateClassObject<wshcmxnet.Net.Sql>("wshcmx.Net.Sql");

  wshcmx.exception.throwIfNull(sqlInstance, "sqlInstance");
  sqlInstance.Init(wshcmx.connectionString);

  const queryResult = sqlInstance.ExecutePaginationProcedure(query, EncodeJson(options), EncodeJson(convertParameters(parameters))) as [number, wshcmxnet.Net.KeyValuePair<string, unknown>[][]];

  let pairs;
  let i;
  let j;
  const result: T[] = [];
  let obj;

  for (i = 0; i < queryResult[1].length; i++) {
    pairs = queryResult[1][i];
    obj = {};

    for (j = 0; j < pairs.length; j++) {
      obj.SetProperty(pairs[j].Key, pairs[j].Value);
    }

    result.push(obj as T);
  }

  return {
    total: queryResult[0],
    items: result
  };
}

export function executeProcedure<T>(query: string, parameters: Record<string, unknown> = {}) {
  wshcmx.exception.throwIfUndefined(wshcmx.net, "wshcmx.net");
  const sqlInstance = wshcmx.net.CreateClassObject<wshcmxnet.Net.Sql>("wshcmx.Net.Sql");

  wshcmx.exception.throwIfNull(sqlInstance, "sqlInstance");
  sqlInstance.Init(wshcmx.connectionString);

  const queryResult = sqlInstance.ExecuteProcedure(query, EncodeJson(convertParameters(parameters))) as wshcmxnet.Net.KeyValuePair<string, unknown>[][];

  let pairs;
  let i;
  let j;
  const result: T[] = [];
  let obj;

  for (i = 0; i < queryResult.length; i++) {
    pairs = queryResult[i];
    obj = {};

    for (j = 0; j < pairs.length; j++) {
      obj.SetProperty(pairs[j].Key, pairs[j].Value);
    }

    result.push(obj as T);
  }

  return result;
}

export function executeQuery<T>(query: string) {
  wshcmx.exception.throwIfUndefined(wshcmx.net, "wshcmx.net");
  const sqlInstance = wshcmx.net.CreateClassObject<wshcmxnet.Net.Sql>("wshcmx.Net.Sql");

  wshcmx.exception.throwIfNull(sqlInstance, "sqlInstance");
  sqlInstance.Init(wshcmx.connectionString, wshcmx.DATABASE_TYPE);

  const queryResult = sqlInstance.ExecuteQuery(query);

  let pairs;
  let i;
  let j;
  const result: T[] = [];
  let obj;

  for (i = 0; i < queryResult.length; i++) {
    pairs = queryResult[i];
    obj = {};

    for (j = 0; j < pairs.length; j++) {
      obj.SetProperty(pairs[j].Key, pairs[j].Value);
    }

    result.push(obj as T);
  }

  return result;
}

export function number(v: unknown) {
  const real = OptReal(v, "NULL");
  const int = OptInt(v, "NULL");

  if (real !== int) {
    return real;
  }

  return int;
}

export function string(v: unknown) {
  return SqlLiteral(tools_web.convert_xss(String(v)));
}

function convertParameters(parameters: Record<string, unknown> = {}) {
  const keys = wshcmx.object.keys(parameters);
  let parameter;

  for (let i = 0; i < keys.length; i++) {
    parameter = parameters.GetOptProperty(keys[i]);

    if (wshcmx.type.isString(parameter) && parameter == "NULL") {
      parameters.SetProperty(keys[i], "NULL");
    } else if (wshcmx.type.isNumber(parameter)) {
      parameters.SetProperty(keys[i], number(parameter));
    } else if (wshcmx.type.isArray(parameter)) {
      if (parameter.length === 0) {
        parameters.SetProperty(keys[i], "NULL");
      } else {
        parameters.SetProperty(keys[i], SqlLiteral(parameter.join(", ")))
      }
    } else {
      parameters.SetProperty(keys[i], SqlLiteral(parameter as string | number | Date | null));
    }
  }

  return parameters;
}