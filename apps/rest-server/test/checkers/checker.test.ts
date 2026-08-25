import { expect } from 'bun:test';
import type { ErrorFields } from '@repo/core/error';
import { DEFAULT_PAGE_SIZE } from '@repo/core/pagination';
import type z from 'zod';
import type { ErrorBody, PageResponse } from '#api/common/common.payload.js';
import type { HttpResponse } from '../request-maker.test.js';

type PageResponseType = z.infer<typeof PageResponse>;
type ErrorDetail = { message: string };

const isErrorDetail = (value: any): value is ErrorDetail => Boolean(value?.message);
const isErrorDetailList = (value: any): value is ErrorDetail[] => Array.isArray(value) && value.every(isErrorDetail);

export function checkErrors<T>(response: HttpResponse<T>, expectedErrors: ErrorFields[]) {
  expect(response.data.errors).toHaveLength(expectedErrors.length);

  response.data.errors!.forEach((error, index) => {
    const { uuid, details, ...errorFields } = error;
    const expectedError = expectedErrors[index]!;
    expect(errorFields).toEqual({ code: expectedError.code!, message: expectedError.message! });

    if (expectedError.details) {
      checkErrorDetails(details, expectedError.details);
    }
  });
}

function checkErrorDetails(details: ErrorBody['details'], expectedDetails: unknown): void {
  if (isErrorDetailList(expectedDetails)) {
    expect(details).toEqual(expectedDetails.map(({ message }) => expect.objectContaining({ message })));
  } else if (isErrorDetail(expectedDetails)) {
    expect(details).toEqual(expect.objectContaining({ message: expectedDetails.message }));
  } else {
    expect.unreachable(
      `Cannot assert details: expected { message } or a list of { message }, has ${JSON.stringify(expectedDetails)}`,
    );
  }
}

export function checkEmptyList<T>(data: T): void {
  expect(data).toEqual(<T>{
    nodes: [],
    count: 0,
    pageInfo: {
      limit: DEFAULT_PAGE_SIZE,
      offset: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  });
}

export function checkPage(data: PageResponseType, expected: Partial<PageResponseType> = {}): void {
  expect(data).toEqual({
    limit: expected.limit ?? DEFAULT_PAGE_SIZE,
    offset: expected.offset ?? 0,
    hasNextPage: expected.hasNextPage ?? false,
    hasPreviousPage: expected.hasPreviousPage ?? false,
  });
}
