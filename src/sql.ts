import { wshcmx } from ".";
import { wshcmx as wshcmxnet } from "@wshcmx/net";

type PaginationProcedureOptions = {
  page?: number;
  size?: number;
  select?: string;
  orderby?: string;
};

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

function convertParameters(parameters: Record<string, unknown> = {}) {
  const keys = wshcmx.object.keys(parameters);
  const result: Record<string, unknown> = {};
  let parameter;
  let value;

  for (let i = 0; i < keys.length; i++) {
    parameter = parameters.GetOptProperty(keys[i]);

    if (wshcmx.type.isNumber(parameter)) {
      value = number(parameter);
    } else if (wshcmx.type.isArray(parameter)) {
      value = parameter.length === 0 ? null : parameter.join(", ");
    } else if (wshcmx.type.isBoolean(parameter)) {
      value = tools_web.is_true(parameter) ? 1 : 0;
    } else if (wshcmx.type.isDate(parameter)) {
      value = StrLeftCharRange(StrXmlDate(parameter), 19);
    } else if (wshcmx.type.isString(parameter)) {
      value = parameter;
    } else {
      value = null;
    }

    result.SetProperty(keys[i], value === "NULL" ? null : value);
  }

  return result;
}