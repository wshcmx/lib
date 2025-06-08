import { wshcmx } from ".";

type NonNullable<T> = T & {};

export function throwIfNull<T>(parameter: T, parameterName: string): asserts parameter is NonNullable<T> {
  if (wshcmx.type.isNull(parameter)) {
    throw new Error(`Value cannot be null. (Parameter name: ${parameterName})`);
  }
}

export function throwIfUndefined<T>(parameter: T, parameterName: string): asserts parameter is NonNullable<T> {
  if (wshcmx.type.isUndefined(parameter)) {
    throw new Error(`Value cannot be Undefined. (Parameter name: ${parameterName})`);
  }
}

export function throwIfEmpty<T>(parameter: T, parameterName: string): asserts parameter is NonNullable<T> {
  if (wshcmx.type.isEmpty(parameter)) {
    throw new Error(`Value cannot be empty. (Parameter name: ${parameterName})`);
  }
}