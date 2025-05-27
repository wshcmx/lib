export function isArray(value: unknown): value is unknown[] {
  return DataType(value) == "object" && IsArray(value) && ObjectType(value) == "JsArray";
}

export function isBinary(value: unknown): value is Binary {
  return ObjectType(value) == "JsBinary";
}

export function isBoolean(value: unknown): value is boolean {
  return DataType(value) == "bool";
}

export function isDate(value: unknown): value is Date {
  return DataType(value) == "date" || OptDate(value) !== undefined;
}

/**
 * Проверяет равна ли функция `null`, `undefined` или ``.
 * @param { unknown } value Проверяемое значение.
 * @returns { boolean }
 */
export function isEmpty(v: unknown): v is undefined | null | "" {
  if (isObject(v) || isArray(v) || isXmlDocument(v)) {
    return false;
  }

  return (v === undefined || v === null || StrCharCount(v as string) === 0);
}

export function isError(value: unknown): value is Error {
  return ObjectType(value) == "BmErrorInfo";
}

export function isNull(v: unknown): v is null {
  return v === null;
}

export function isNumber(value: unknown): value is number {
  return DataType(value) == "integer";
}

export function isObject(value: unknown): value is object {
  return DataType(value) == "object" && ObjectType(value) == "JsObject";
}

export function isPrimitive(value: unknown): value is (number | boolean | string | undefined | null) {
  const type = DataType(value);

  return (
    type == "integer"
    || type == "float"
    || type == "bool"
    || type == "string"
    || value === undefined
    || value === null
  );
}

export function isReal(value: number) {
  return DataType(value) == "real" && value !== (value ^ 0);
}

export function isString(value: unknown): value is string {
  return DataType(value) == "string";
}

export function isUndef(value: unknown): value is null | undefined {
  return value === undefined || value === null;
}

export function isXmlDocument(value: unknown): value is XmlDocument {
  return ObjectType(value) == "XmlDocument";
}
