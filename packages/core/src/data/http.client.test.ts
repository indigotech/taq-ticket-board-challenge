import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'bun:test';
import { URLSearchParams } from 'node:url';
import { ZodError, z } from 'zod';
import { type BaseError, GENERIC_ERROR_MESSAGE, isBaseError } from '#root/error/index.js';
import { configureLogger } from '#root/log/index.js';
import { type TestRoute, TestServer } from '#test/test-server.js';
import { HttpClient, type HttpMethods } from './http.client.js';

describe('HttpClient', () => {
  let server: TestServer;
  let timeout: NodeJS.Timeout;

  beforeAll(() => {
    configureLogger('critical', () => ({}));
  });

  beforeEach(async () => {
    server = new TestServer();
    await server.start();
  });

  afterEach(async () => {
    await server.close();
    clearTimeout(timeout);
  });

  it('should send a request to a given endpoint', async () => {
    server.addRoute({
      route: '/',
      method: 'get',
      response: { body: 'Hello World!\n' },
    });

    const response = await HttpClient.request({
      method: 'GET',
      url: 'http://localhost:9999/',
      responseSchema: null,
    });

    expect(response.status).toBe(200);
    expect(response.data).toBe('Hello World!\n');
  });

  it('should accept all methods', async () => {
    for (const method of ['GET', 'POST', 'PUT', 'DELETE']) {
      server.addRoute({
        method: method.toLocaleLowerCase() as TestRoute['method'],
        route: '/user',
        response: {
          body: {
            id: '1',
          },
        },
      });
      const response = await HttpClient.request({
        method: method as HttpMethods,
        url: 'http://localhost:9999/user',
        responseSchema: null,
      });
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ id: '1' });
    }
  });

  it('should send body', async () => {
    server.addRoute({
      method: 'post',
      route: '/body',
      handler: async (req, res) => {
        if (req.body.test === '1') {
          expect(req.headers['content-type']).toBe('application/json');
          res.send({ body: 'ok' });
        } else {
          res.statusCode = 500;
          res.send({});
        }
      },
    });
    const response = await HttpClient.request({
      method: 'POST',
      url: 'http://localhost:9999/body',
      responseSchema: null,
      body: {
        test: '1',
      },
    });
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ body: 'ok' });
    expect(response.request?.body).toEqual({
      test: '1',
    });
  });

  it('should send x-www-form-urlencoded body', async () => {
    server.addRoute({
      method: 'post',
      route: '/body',
      handler: async (req, res) => {
        if (req.body.test === '1') {
          expect(req.headers['content-type']).toBe('application/x-www-form-urlencoded;charset=utf-8');
          res.send({ body: 'ok' });
        } else {
          res.statusCode = 500;
          res.send({});
        }
      },
    });

    const body = new URLSearchParams();
    body.append('test', '1');

    const response = await HttpClient.request({
      method: 'POST',
      url: 'http://localhost:9999/body',
      responseSchema: null,
      body,
    });
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ body: 'ok' });
    expect(response.request?.body).toBe(body.toString());
  });

  it('should send query string', async () => {
    server.addRoute({
      method: 'get',
      route: '/user',
      handler: async (req, res) => {
        if (req.query.page === '1') {
          res.send({ body: 'ok' });
        } else {
          res.statusCode = 500;
          res.send({});
        }
      },
    });
    const response = await HttpClient.request({
      method: 'GET',
      url: 'http://localhost:9999/user',
      responseSchema: null,
      query: {
        page: 1,
      },
    });
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ body: 'ok' });
  });

  it('should send patch request', async () => {
    server.addRoute({
      method: 'patch',
      route: '/user',
      handler: async (req, res) => {
        expect(req.body.data).toBe(1);
        expect(req.query.queryData).toBe('2');
        res.statusCode = 204;
        res.send();
      },
    });
    const response = await HttpClient.request({
      method: 'PATCH',
      url: 'http://localhost:9999/user',
      responseSchema: null,
      body: {
        data: 1,
      },
      query: {
        queryData: 2,
      },
    });
    expect(response.status).toBe(204);
    expect(response.data).toBe('');
  });

  it('should throw error if status code is above 400', async () => {
    server.addRoute({
      method: 'get',
      route: '/400',
      response: {
        body: {
          message: 'error',
        },
        code: 400,
      },
    });

    const error = await captureBaseError(
      HttpClient.request({
        method: 'GET',
        url: 'http://localhost:9999/400',
        responseSchema: null,
      }),
    );

    expect(error.details.status).toBe(400);
    expect(error.details.data).toEqual({
      message: 'error',
    });
  });

  it('should throw error if timeout is reached', async () => {
    server.addRoute({
      method: 'get',
      route: '/timeout',
      handler: async (_req, res) => {
        timeout = setTimeout(() => {
          res.send('ok');
        }, 2000);
      },
    });
    const error = await captureBaseError(
      HttpClient.request({
        method: 'GET',
        url: 'http://localhost:9999/timeout',
        responseSchema: null,
        timeout: 1,
      }),
    );

    expect(error.status).toBe(500);
    expect(error.code).toBe('GLB_01');
    expect(error.message).toBe(GENERIC_ERROR_MESSAGE);
    expect(error.details).toBe('ECONNABORTED');
  });

  it('should throw error if the given server is offline', async () => {
    await server.close();
    const error = await captureBaseError(
      HttpClient.request({
        method: 'GET',
        url: 'http://localhost:9999/',
        responseSchema: null,
      }),
    );

    expect(error.status).toBe(500);
    expect(error.code).toBe('GLB_01');
    expect(error.message).toBe(GENERIC_ERROR_MESSAGE);
    expect(error.details).toBe('ECONNREFUSED');
  });

  it('should throw error if the given server is offline', async () => {
    await server.close();
    const error = await captureBaseError(
      HttpClient.request({
        method: 'GET',
        url: 'http://localhost:9999/',
        responseSchema: null,
      }),
    );

    expect(error.status).toBe(500);
    expect(error.code).toBe('GLB_01');
    expect(error.message).toBe(GENERIC_ERROR_MESSAGE);
    expect(error.details).toBe('ECONNREFUSED');
  });

  it('should validate response schema', async () => {
    server.addRoute({
      route: '/',
      method: 'get',
      response: { body: { data: 'Hello World!\n' } },
    });

    const response = await HttpClient.request({
      method: 'GET',
      url: 'http://localhost:9999/',
      responseSchema: z.object({ data: z.string() }),
    });

    expect(response.status).toBe(200);
    expect(response.data.data).toBe('Hello World!\n');
  });

  it('should throw error because of response schema validation', async () => {
    server.addRoute({
      route: '/',
      method: 'get',
      response: { body: { data: 'Hello World!\n' } },
    });

    const error = await captureBaseError(
      HttpClient.request({
        method: 'GET',
        url: 'http://localhost:9999/',
        responseSchema: z.object({ data: z.number() }),
      }),
    );

    expect(error.status).toBe(500);
    expect(error.code).toBe('GLB_01');
    expect(error.message).toBe(GENERIC_ERROR_MESSAGE);
    expect(error.details).toBeInstanceOf(ZodError);
  });

  it('should redact sensitive data from request headers/query/body, even in successful response', async () => {
    const headers = { authorization: 'Bearer JWT' };
    const query = { token: 'token' };
    const body = { password: 1234567890 };

    server.addRoute({
      method: 'patch',
      route: '/user/:id',
      handler: async (req, res) => {
        expect(req.headers).toMatchObject(headers);
        expect(req.query).toEqual(query);
        expect(req.body).toEqual(body);
        res.send();
      },
    });

    const response = await HttpClient.request({
      method: 'PATCH',
      url: 'http://localhost:9999/user/1',
      responseSchema: null,
      headers,
      query,
      body,
    });

    expect(response.status).toBe(200);
    expect(response.request?.headers).toMatchObject({ authorization: '[REDACTED]' });
    expect(response.request?.query).toEqual({ token: '[REDACTED]' });
    expect(response.request?.body).toEqual({ password: '[REDACTED]' });
  });

  async function captureBaseError<T = any>(operation: Promise<unknown>): Promise<BaseError<T>> {
    try {
      await operation;
    } catch (error) {
      if (isBaseError(error)) {
        return error as BaseError<T>;
      }
      throw error;
    }

    throw new Error('expected the operation to reject with a BaseError');
  }
});
