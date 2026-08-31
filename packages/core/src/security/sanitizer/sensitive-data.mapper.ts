const SENSITIVE_PATTERNS = [
  /access[_-]?key/i,
  /api[_-]?key/i,
  /auth/i,
  /bearer/i,
  /cookie/i,
  /credential/i,
  /password/i,
  /private[_-]?key/i,
  /secret/i,
  /session/i,
  /token/i,
  /passphrase/i,
  /client[_-]?secret/i,
  /refresh[_-]?token/i,
  /id[_-]?token/i,
  /jwt/i,
  /oauth/i,
  /^pwd$/i,
  /^pass$/i,
  /^pin$/i,
  /^otp$/i,
];

export function redactSensitiveData<T>(data: T): T {
  if (!data || typeof data !== 'object') {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map(item => redactSensitiveData(item)) as T;
  }

  const redacted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    const isSensitive = SENSITIVE_PATTERNS.some(pattern => pattern.test(key));

    if (isSensitive) {
      redacted[key] = '[REDACTED]';
    } else if (value && typeof value === 'object') {
      redacted[key] = redactSensitiveData(value);
    } else {
      redacted[key] = value;
    }
  }

  return redacted as T;
}
