import { wshcmx } from ".";

type NonNullable<T> = T & {};

export function throwIfNull<T>(parameter: T, parameterName: string): asserts parameter is NonNullable<T> {
  if (wshcmx.type.isNull(parameter)) {
    throw new Error(`Value cannot be null. (Parameter name: ${parameterName})`);
  }
}