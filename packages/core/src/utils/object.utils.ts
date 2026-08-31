export function safeJsonParse(value: any): Record<string, any> | undefined {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
