export function safeJsonParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback ? fallback : str;
  }
}

export function safeJsonStringify(obj, fallback = null) {
  try {
    return JSON.stringify(obj);
  } catch {
    return fallback ? fallback : obj;
  }
}
