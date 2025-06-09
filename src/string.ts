/**
 * Преобразует строку в PascalCase из snake_case.
 * @param str - Строка в snake_case
 * @returns {string} Строка в PascalCase
 */
export function snakeToPascal(str: string): string {
  return ArrayExtract(str.split("_"), "StrTitleCase(This)").join("");
}