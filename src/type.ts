/**
 * Функции для проверки типов значений в 1С:Предприятие.
 * @param value - Проверяемое значение.
 * @returns {boolean} Возвращает `true`, если значение является массивом.
 */
export function isArray(value: unknown): value is unknown[] {
  return DataType(value) == "object" && IsArray(value) && ObjectType(value) == "JsArray";
}

/**
 * Проверяет является ли значение бинарным.
 * @param value - Проверяемое значение.
 * @returns {boolean} Возвращает `true`, если значение является бинарным.
 */
export function isBinary(value: unknown): value is Binary {
  return ObjectType(value) == "JsBinary";
}

/**
 * Проверяет является ли значение булевым.
 * @param value - Проверяемое значение.
 * @returns {boolean} Возвращает `true`, если значение является булевым.
 */
export function isBoolean(value: unknown): value is boolean {
  return DataType(value) == "bool";
}

/**
 * Проверяет является ли значение датой.
 * @param value - Проверяемое значение.
 * @returns {boolean} Возвращает `true`, если значение является датой.
 */
export function isDate(value: unknown): value is Date {
  return DataType(value) == "date" || OptDate(value) !== undefined;
}

/**
 * Проверяет равна ли функция `null`, `undefined` или ``.
 * @param { unknown } v Проверяемое значение.
 * @returns { boolean }
 */
export function isEmpty(v: unknown): v is undefined | null | "" {
  if (isObject(v) || isArray(v) || isXmlDocument(v)) {
    return false;
  }

  return (v === undefined || v === null || StrCharCount(v as string) === 0);
}

/**
 * Проверяет является ли значение ошибкой.
 * @param value - Проверяемое значение.
 * @returns {boolean} Возвращает `true`, если значение является ошибкой.
 */
export function isError(value: unknown): value is Error {
  return ObjectType(value) == "BmErrorInfo";
}

/**
 * Проверяет является ли значение `null`.
 * @param v - Проверяемое значение.
 * @returns {boolean} Возвращает `true`, если значение является `null`.
 */
export function isNull(v: unknown): v is null {
  return v === null;
}

/**
 * Проверяет является ли значение `undefined`.
 * @param v - Проверяемое значение.
 * @returns {boolean} Возвращает `true`, если значение является `undefined`.
 */
export function isUndefined(v: unknown): v is null {
  return v === undefined;
}

/**
 * Проверяет является ли значение числом.
 * @param value - Проверяемое значение.
 * @returns {boolean} Возвращает `true`, если значение является числом.
 */
export function isNumber(value: unknown): value is number {
  return DataType(value) == "integer";
}

/**
 * Проверяет является ли значение объектом.
 * @param value - Проверяемое значение.
 * @returns {boolean} Возвращает `true`, если значение является объектом.
 */
export function isObject(value: unknown): value is object {
  return DataType(value) == "object" && ObjectType(value) == "JsObject";
}

/**
 * Проверяет является ли значение примитивом (число, строка, булево, `null` или `undefined`).
 * @param value - Проверяемое значение.
 * @returns {boolean} Возвращает `true`, если значение является примитивом (число, строка, булево, `null` или `undefined`).
 */
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

/**
 * Проверяет является ли значение реальным числом (с плавающей запятой).
 * @param value - Проверяемое значение.
 * @returns {boolean} Возвращает `true`, если значение является реальным числом (с плавающей запятой).
 */
export function isReal(value: unknown): value is number {
  return DataType(value) == "real" && value !== ((value as number) ^ 0);
}

/**
 * Проверяет является ли значение строкой.
 * @param value - Проверяемое значение.
 * @returns {boolean} Возвращает `true`, если значение является строкой.
 */
export function isString(value: unknown): value is string {
  return DataType(value) == "string";
}

/**
 * Проверяет является ли значение `null` или `undefined`.
 * @param value - Проверяемое значение.
 * @returns {boolean} Возвращает `true`, если значение является `null` или `undefined`.
 */
export function isUndef(value: unknown): value is null | undefined {
  return value === undefined || value === null;
}

/**
 * Проверяет является ли значение XML-документом.
 * @param value - Проверяемое значение.
 * @returns {boolean} Возвращает `true`, если значение является XML-документом.
 */
export function isXmlDocument(value: unknown): value is XmlDocument {
  return ObjectType(value) == "XmlDocument";
}
