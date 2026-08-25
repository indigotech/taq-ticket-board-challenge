import { loadEnv } from '@repo/env';
import { EnvSchema, type EnvSchemaType } from './env-schema.js';

export let Env: EnvSchemaType;

export function configureEnv(envFile: string) {
  Env = loadEnv(EnvSchema, envFile);
}
