import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import * as dotenv from 'dotenv';
import type { ZodType } from 'zod';

const WORKSPACE_ROOT_MARKER = 'bun.lock';

/** Loads `envFile` from the workspace root, then lets the app's own file override it. */
export function loadEnv<TSchema>(schema: ZodType<TSchema>, envFile: string): TSchema {
  const searchPaths = [join(findWorkspaceRoot(), envFile), resolve(envFile)];

  for (const path of searchPaths) {
    Object.assign(process.env, readEnvFile(path));
  }

  const result = schema.safeParse(process.env);

  if (!result.success) {
    throw new Error(`Env config validation error: ${result.error.message}`);
  }

  return result.data;
}

export function readEnvFile(path: string): Record<string, string> {
  return existsSync(path) ? dotenv.parse(readFileSync(path)) : {};
}

export function findWorkspaceRoot(): string {
  let directory = process.cwd();

  while (!existsSync(join(directory, WORKSPACE_ROOT_MARKER))) {
    const parent = dirname(directory);

    if (parent === directory) {
      return process.cwd();
    }

    directory = parent;
  }

  return directory;
}
