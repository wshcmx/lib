export function snakeToPascal(str: string) {
  return ArrayExtract(str.split("_"), "StrTitleCase(This)").join("");
}