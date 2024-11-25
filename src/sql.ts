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
