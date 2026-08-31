export interface Paginated<Model> {
  count: number;
  nodes: Model[];
  pageInfo: PageInfo;
}

export interface PageInput {
  offset?: number;
  limit: number;
}

export interface PageInfo {
  offset: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

export function buildPageInfo(args: PageInput, totalItems: number): PageInfo {
  const offset = args.offset ?? 0;
  const limit = args.limit ?? DEFAULT_PAGE_SIZE;

  return {
    limit,
    offset,
    hasNextPage: totalItems > offset + limit,
    hasPreviousPage: offset > 0,
  };
}
