import { wshcmx } from ".";

/**
 * Метод возвращает массив из перечисляемых свойств переданного объекта,
 * @param {Object} obj Объект
 * @returns {string[]} Ключи объекта
 */
export function keys(obj: Object): string[] {
  if (wshcmx.type.isUndef(obj) || DataType(obj) != "object") {
    return [];
  }

  const keys = [];
  let key: XmlElem<unknown> | string;

  for (key in obj) {
    keys.push(ObjectType(key) == "XmElem" ? (key as unknown as XmlElem<unknown>).Name : key);
  }

  return keys;
}

/**
 * Метод возвращает массив из перечисляемых свойств переданного объекта,
 * @param {Object} obj Объект
 * @returns {unknown[][]} Ключи и значения объекта
 */
export function entries<T extends Object>(obj: T): unknown[][] {
  const r: unknown[][] = [];
  let key: string;

  for (key in obj) {
    r.push([key, obj[key]]);
  }

  return r;
}