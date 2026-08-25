import type { PageInfo, PageInput, Paginated } from '@repo/core/pagination';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@repo/core/pagination';
import { type ZodType, z } from 'zod';

const ErrorResponse = z.object({
  code: z.string(),
  message: z.string(),
  uuid: z.string().optional(),
  details: z.union([z.looseObject({}), z.array(z.looseObject({}))]).optional(),
});

export type ErrorBody = z.infer<typeof ErrorResponse>;

export const ErrorsResponse = z
  .object({
    errors: z.array(ErrorResponse),
  })
  .meta({ id: 'ErrorsResponse' });

export const EmptyResponse = z.unknown();

export const PageResponse = z.object({
  limit: z.number(),
  offset: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
}) satisfies ZodType<PageInfo>;

export const PaginatedResponse = <Model>(modelSchema: ZodType<Model>) =>
  z.object({
    nodes: z.array(modelSchema),
    count: z.number(),
    pageInfo: PageResponse,
  }) satisfies ZodType<Paginated<Model>>;

export const PageRequest = z.object({
  limit: z.coerce
    .number()
    .min(1)
    .default(DEFAULT_PAGE_SIZE)
    .transform(value => Math.min(value, MAX_PAGE_SIZE))
    .meta({ description: `Maximum of ${MAX_PAGE_SIZE} items` }),
  offset: z.coerce.number().min(0).optional(),
}) satisfies ZodType<PageInput>;
