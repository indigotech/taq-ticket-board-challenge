import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import path from 'node:path';
import axios, { type AxiosError } from 'axios';
import mock from './fixtures/mock.json' with { type: 'json' };
import { type TestRoute, TestServer } from './test-server.js';

describe('TestServer', () => {
  const dirname = import.meta.dirname ?? __dirname;

  let server: TestServer;

  beforeEach(async () => {
    server = new TestServer();
    await server.start();
  });

  afterEach(async () => {
    await server.close();
  });

  it('should start a test server', async () => {
    server.addRoute({
      route: '/',
      method: 'get',
      response: { body: 'Hello World!\n' },
    });

    const response = await axios.get('http://localhost:9999/');

    expect(response.status).toBe(200);
    expect(response.data).toBe('Hello World!\n');
  });

  it('should add a custom route', async () => {
    const options: TestRoute = {
      method: 'get',
      route: '/custom',
      response: {
        body: {
          test: 'hello',
        },
      },
    };
    server.addRoute(options);

    const response = await axios.get(`http://localhost:9999${options.route}`);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(options.response?.body);
  });

  it('should register call count', async () => {
    const options: TestRoute = {
      method: 'get',
      route: '/custom',
      response: {
        body: {
          test: 'hello',
        },
      },
    };
    const spy = server.addRoute(options);

    expect(spy.calls).toHaveLength(0);

    await axios.get(`http://localhost:9999${options.route}`);
    await axios.get(`http://localhost:9999${options.route}`);

    expect(spy.calls).toHaveLength(2);
  });

  it('should add a custom route using custom handler', async () => {
    const options: TestRoute = {
      method: 'get',
      route: '/custom',
      handler: async (req, res) => {
        if (req.query.page === '1') {
          res.send({ data: [1] });
        } else if (req.query.page === '2') {
          res.send({ data: [2] });
        } else {
          res.statusCode = 404;
          res.send({
            error: 'Not Found',
          });
        }
      },
    };
    server.addRoute(options);
    let response = await axios.get(`http://localhost:9999${options.route}`, { params: { page: 1 } });

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ data: [1] });

    response = await axios.get(`http://localhost:9999${options.route}`, { params: { page: 2 } });

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ data: [2] });

    const response2 = await axios
      .get(`http://localhost:9999${options.route}`, { params: { page: 3 } })
      .catch((err: AxiosError) => err.response);

    expect(response2!.status).toBe(404);
    expect(response2!.data).toEqual({ error: 'Not Found' });
  });

  it('should add a custom route using fixture', async () => {
    const options: TestRoute = {
      method: 'get',
      route: '/custom',
      fixture: {
        path: path.join(dirname, 'fixtures', 'mock.json'),
        code: 201,
      },
    };
    server.addRoute(options);

    const response = await axios.get(`http://localhost:9999${options.route}`);

    expect(response.status).toBe(201);
    expect(response.data).toEqual(mock);
  });

  it('should transform fixture', async () => {
    const options: TestRoute = {
      method: 'get',
      route: '/custom',
      fixture: {
        path: path.join(dirname, 'fixtures', 'mock.json'),
        transform: mock => {
          mock.data = '1';
          return mock;
        },
      },
    };

    server.addRoute(options);

    const response = await axios.get(`http://localhost:9999${options.route}`);

    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      ...mock,
      data: '1',
    });
  });

  it('should add a custom route using parameters', async () => {
    const options: TestRoute = {
      method: 'get',
      route: '/custom/:param',
      handler: async (req, res) => {
        if (req.params.param === '1') {
          res.send({ data: [1] });
        } else {
          throw new Error('message');
        }
      },
    };
    server.addRoute(options);

    const response = await axios.get('http://localhost:9999/custom/1');

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ data: [1] });
  });
});
