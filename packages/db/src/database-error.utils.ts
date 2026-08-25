interface PostgresError {
  errno?: unknown;
  constraint?: string;
}

const UNIQUE_VIOLATION_CODE = '23505';

/**
 * Returns the name of the unique constraint that the error violated, or `null` if the error
 * is not a unique violation.
 *
 * The lookup is indirect because of two driver details: Bun puts the SQLSTATE on `errno`
 * instead of `code`, and drizzle wraps the original error on `cause`.
 */
export function violatedUniqueConstraint(error: unknown): string | null {
  if (!error || typeof error !== 'object') {
    return null;
  }

  const wrapped = error as PostgresError & { cause?: PostgresError };
  const postgresError = wrapped.errno === UNIQUE_VIOLATION_CODE ? wrapped : wrapped.cause;

  if (postgresError?.errno !== UNIQUE_VIOLATION_CODE) {
    return null;
  }

  return postgresError.constraint ?? null;
}
