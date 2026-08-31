import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { GENERIC_ERROR_MESSAGE, NotFoundError } from '@repo/core/error';
import { OverrideManager } from '@repo/core/test';
import axios from 'axios';
import { type AnyElysia, Elysia } from 'elysia';
import z from 'zod';
import { API_PREFIX, configureRestServer } from '#api/rest.config.js';
import { Env } from '#env/index.js';
import { ValidationError } from '#test/checkers/validation.error.test.js';

describe('Unit - Error Middleware', () => {
  const port = 10031;
  const baseUrl = `http://localhost:${port}${API_PREFIX}`;
  let app: AnyElysia;

  const OkResponse = z.object({ ok: z.boolean() }).meta({ id: 'OkResponse' });

  const validationBody = z.object({
    name: z.string().refine(value => value.length > 0, 'Name is required.'),
    email: z.email(),
  });

  const testController = new Elysia({ prefix: '/errors' })
    .model({ OkResponse })
    .get(
      '/base',
      () => {
        throw new NotFoundError({ code: 'TST_01', message: 'Test resource not found.' });
      },
      { response: { 200: 'OkResponse' } },
    )
    .get(
      '/internal',
      () => {
        throw new Error('boom');
      },
      { response: { 200: 'OkResponse' } },
    )
    .post('/validation', () => ({ ok: true }), { body: validationBody, response: { 200: 'OkResponse' } });

  beforeAll(async () => {
    app = await configureRestServer({ port, controllers: [testController] });
  });

  afterAll(async () => {
    await app.stop();
  });

  it('should map a BaseError to its status, code and message', async () => {
    const response = await axios.get(`${baseUrl}/errors/base`, { validateStatus: () => true });

    expect(response.status).toBe(404);
    expect(response.data.errors).toHaveLength(1);
    expect(response.data.errors[0]).toEqual({
      code: 'TST_01',
      message: 'Test resource not found.',
      uuid: expect.any(String),
    });
  });

  it('should use the custom refine message as the field detail', async () => {
    const body = { name: '', email: 'valid@email.com' };
    const response = await axios.post(`${baseUrl}/errors/validation`, body, { validateStatus: () => true });

    expect(response.status).toBe(422);
    expect(response.data.errors[0]).toEqual({
      code: 'VAL_01',
      message: 'Os dados enviados são inválidos. Por favor, reveja as informações.',
      uuid: expect.any(String),
      details: [{ path: 'name', message: 'Name is required.' }],
    });
  });

  it('should use the builtin validator message as the field detail', async () => {
    const body = { name: 'Admin Taqtile', email: 'not-an-email' };
    const response = await axios.post(`${baseUrl}/errors/validation`, body, { validateStatus: () => true });

    expect(response.status).toBe(422);
    expect(response.data.errors[0]).toEqual({
      code: 'VAL_01',
      message: 'Os dados enviados são inválidos. Por favor, reveja as informações.',
      uuid: expect.any(String),
      details: [{ path: 'email', message: ValidationError.email }],
    });
  });

  it('should map an unmatched route to a 404 with GLB_02', async () => {
    const response = await axios.get(`${baseUrl}/does-not-exist`, { validateStatus: () => true });

    expect(response.status).toBe(404);
    expect(response.data.errors[0]).toEqual({
      code: 'GLB_02',
      message: GENERIC_ERROR_MESSAGE,
      uuid: expect.any(String),
      details: { message: `Route ${API_PREFIX}/does-not-exist does not match an existing route.` },
    });
  });

  it('should map an unexpected error to a 500 with GLB_01', async () => {
    const response = await axios.get(`${baseUrl}/errors/internal`, { validateStatus: () => true });

    expect(response.status).toBe(500);
    expect(response.data.errors[0]).toEqual({
      code: 'GLB_01',
      message: GENERIC_ERROR_MESSAGE,
      uuid: expect.any(String),
      details: { name: 'Error', message: 'boom' },
    });
  });

  describe('when OPEN_API_SCHEMA_VISIBLE is false', () => {
    const manager = new OverrideManager();

    beforeAll(() => {
      manager.set(Env, 'OPEN_API_SCHEMA_VISIBLE', false);
    });

    afterAll(() => {
      manager.restoreAll();
    });

    it('should omit details on a validation error', async () => {
      const body = { name: '', email: 'valid@email.com' };
      const response = await axios.post(`${baseUrl}/errors/validation`, body, { validateStatus: () => true });

      expect(response.status).toBe(422);
      expect(response.data.errors[0]).not.toHaveProperty('details');
      expect(response.data.errors[0]).toEqual({
        code: 'VAL_01',
        message: 'Os dados enviados são inválidos. Por favor, reveja as informações.',
        uuid: expect.any(String),
      });
    });

    it('should omit details on an unmatched route', async () => {
      const response = await axios.get(`${baseUrl}/does-not-exist`, { validateStatus: () => true });

      expect(response.status).toBe(404);
      expect(response.data.errors[0]).not.toHaveProperty('details');
      expect(response.data.errors[0]).toEqual({
        code: 'GLB_02',
        message: GENERIC_ERROR_MESSAGE,
        uuid: expect.any(String),
      });
    });

    it('should omit details on an unexpected error', async () => {
      const response = await axios.get(`${baseUrl}/errors/internal`, { validateStatus: () => true });

      expect(response.status).toBe(500);
      expect(response.data.errors[0]).not.toHaveProperty('details');
      expect(response.data.errors[0]).toEqual({
        code: 'GLB_01',
        message: GENERIC_ERROR_MESSAGE,
        uuid: expect.any(String),
      });
    });
  });
});
