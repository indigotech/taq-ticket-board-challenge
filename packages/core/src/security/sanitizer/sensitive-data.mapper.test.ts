import { describe, expect, it } from 'bun:test';
import { redactSensitiveData } from './sensitive-data.mapper.js';

describe('SensitiveDataMapper', () => {
  it('should redact sensitive data that matches specific keys', () => {
    const input = {
      x_access_key: 'access_key',
      'x-api-key': 'x-api-key',
      authorization: 'auth match authorization',
      BEARER: 'UPPERCASE BEARER',
      cookies: 'cookie plural',
      credential: true,
      password: 1234567890,
      private_key: null,
      secret: undefined,
      nestedProp1: { Sessions: [1, 2, 3] },
      nestedProp2: { someKey: { Token: { key: 'value' } } },
    };

    const output = redactSensitiveData<Record<string, unknown>>(input);

    expect(output).toEqual({
      x_access_key: '[REDACTED]',
      'x-api-key': '[REDACTED]',
      authorization: '[REDACTED]',
      BEARER: '[REDACTED]',
      cookies: '[REDACTED]',
      credential: '[REDACTED]',
      password: '[REDACTED]',
      private_key: '[REDACTED]',
      secret: '[REDACTED]',
      nestedProp1: { Sessions: '[REDACTED]' },
      nestedProp2: { someKey: { Token: '[REDACTED]' } },
    });
  });

  it('should not redact data that does not match keys', () => {
    const input = {
      username: 'username',
      email: 'email@example.com',
      key: 'value',
    };

    const output = redactSensitiveData(input);

    expect(output).toEqual(input);
  });
});
