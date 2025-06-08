import { wshcmx } from ".";

/**
 * Выбрасывает исключение, если параметр равен null.
 * @param parameter - Параметр, который нужно проверить.
 * @param parameterName - Имя параметра, для использования в сообщении об ошибке.
 * @throws {Error} Если параметр равен null.
 */
export function throwIfNull<T>(parameter: T | null, parameterName: string): asserts parameter is T {
  if (wshcmx.type.isNull(parameter)) {
    throw new Error(`Value cannot be null. (Parameter name: ${parameterName})`);
  }
}

/**
 * Выбрасывает исключение, если параметр равен undefined.
 * @param parameter - Параметр, который нужно проверить.
 * @param parameterName - Имя параметра, для использования в сообщении об ошибке.
 * @throws {Error} Если параметр равен undefined.
 */
export function throwIfUndefined<T>(parameter: T | undefined, parameterName: string): asserts parameter is T {
  if (wshcmx.type.isUndefined(parameter)) {
    throw new Error(`Value cannot be Undefined. (Parameter name: ${parameterName})`);
  }
}

/**
 * Выбрасывает исключение, если параметр равен null, undefined или пустой строке.
 * @param parameter - Параметр, который нужно проверить.
 * @param parameterName - Имя параметра, для использования в сообщении об ошибке.
 * @throws {Error} Если параметр равен null, undefined или пустой строке.
 */
export function throwIfEmpty<T>(parameter: T | null | undefined | "", parameterName: string): asserts parameter is T {
  if (wshcmx.type.isEmpty(parameter)) {
    throw new Error(`Value cannot be empty. (Parameter name: ${parameterName})`);
  }
}