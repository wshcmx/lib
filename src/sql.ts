import { wshcmx } from ".";

type KeyValuePair<K, V> = { Key: K; Value: V };

export interface Sql {
  Init(connectionString: string): void;
  ExecuteQuery(commandText: string): { Key: string; Value: unknown }[][];
  ExecuteNonQuery(commandText: string): void;
  ExecutePaginationProcedure(procedureName: string, serializedOptions: string, serializedParameters: string): [number, KeyValuePair<string, unknown>[][]];
  ExecuteProcedure(procedureName: string, serializedParameters: string): [KeyValuePair<string, unknown>[]];
}

type PaginationProcedureOptions = {
  page?: number;
  size?: number;
  select?: string;
  orderby?: string;
};

export function number(v: unknown) {
  const real = OptReal(v, "NULL");
  const int = OptInt(v, "NULL");

  if (real !== int) {
    return real;
  }

  return int;
}

export function date(v: unknown) {
  return SqlLiteral(OptDate(v, "NULL"));
}

export function boolean(v: unknown) {
  return tools_web.is_true(v) ? 1 : 0;
}

export function string(v: unknown) {
  return SqlLiteral(tools_web.convert_xss(String(v)));
}

export function executeNonQuery<T>(query: string) {
  wshcmx.exception.throwIfNull(wshcmx.net, "wshcmx.net");
  const sqlInstance = wshcmx.net.CreateClassObject<Sql>("wshcmx.Sql");

  wshcmx.exception.throwIfNull(sqlInstance, "sqlInstance");
  sqlInstance.Init(wshcmx.connectionString);

  sqlInstance.ExecuteNonQuery(query);
}

export function executePaginationProcedure<T>(query: string, options: PaginationProcedureOptions = {}, parameters: Record<string, unknown> = {}) {
  wshcmx.exception.throwIfNull(wshcmx.net, "wshcmx.net");
  const sqlInstance = wshcmx.net.CreateClassObject<Sql>("wshcmx.Sql");

  wshcmx.exception.throwIfNull(sqlInstance, "sqlInstance");
  sqlInstance.Init(wshcmx.connectionString);

  const queryResult = sqlInstance.ExecutePaginationProcedure(query, EncodeJson(options), EncodeJson(parameters));

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
  wshcmx.exception.throwIfNull(wshcmx.net, "wshcmx.net");
  const sqlInstance = wshcmx.net.CreateClassObject<Sql>("wshcmx.Sql");

  wshcmx.exception.throwIfNull(sqlInstance, "sqlInstance");
  sqlInstance.Init(wshcmx.connectionString);

  const queryResult = sqlInstance.ExecuteProcedure(query, EncodeJson(parameters));

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
  wshcmx.exception.throwIfNull(wshcmx.net, "wshcmx.net");
  const sqlInstance = wshcmx.net.CreateClassObject<Sql>("wshcmx.Sql");

  wshcmx.exception.throwIfNull(sqlInstance, "sqlInstance");
  sqlInstance.Init(wshcmx.connectionString);

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