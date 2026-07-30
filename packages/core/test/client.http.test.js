jest.mock('axios');

const axios = require('axios');
const { AthenaClient, AthenaAPIError } = require('../src/client');
const BaseResource = require('../src/base-resource');

describe('AthenaAPIError', () => {
  test('should create error with status, context, and timestamp', () => {
    const original = new Error('root');
    const err = new AthenaAPIError('boom', 400, original, { type: 'VALIDATION_ERROR' });

    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('AthenaAPIError');
    expect(err.message).toBe('boom');
    expect(err.statusCode).toBe(400);
    expect(err.originalError).toBe(original);
    expect(err.context).toEqual({ type: 'VALIDATION_ERROR' });
    expect(err.timestamp).toBeDefined();
  });
});

describe('AthenaClient HTTP and auth', () => {
  let mockHttpClient;
  let requestInterceptor;
  let responseErrorInterceptor;

  const validConfig = {
    clientId: 'test-id',
    clientSecret: 'test-secret',
    environment: 'preview',
    practiceId: '195900',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    requestInterceptor = null;
    responseErrorInterceptor = null;

    mockHttpClient = jest.fn();
    mockHttpClient.get = jest.fn();
    mockHttpClient.post = jest.fn();
    mockHttpClient.put = jest.fn();
    mockHttpClient.delete = jest.fn();
    mockHttpClient.defaults = {
      timeout: 60000,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };
    mockHttpClient.interceptors = {
      request: {
        use: jest.fn((onFulfilled) => {
          requestInterceptor = onFulfilled;
        }),
      },
      response: {
        use: jest.fn((onFulfilled, onRejected) => {
          responseErrorInterceptor = onRejected;
        }),
      },
    };

    axios.create.mockReturnValue(mockHttpClient);
  });

  test('should accept custom baseUrl override', () => {
    const client = new AthenaClient({
      ...validConfig,
      baseUrl: 'https://custom.example.com',
    });
    expect(client.baseUrl).toBe('https://custom.example.com');
    expect(client.tokenUrl).toBe('https://custom.example.com/oauth2/v1/token');
  });

  test('should authenticate and cache token', async () => {
    axios.post.mockResolvedValue({
      data: { access_token: 'token-1', expires_in: 3600 },
    });

    const client = new AthenaClient(validConfig);
    await client.authenticate();

    expect(axios.post).toHaveBeenCalled();
    expect(client.accessToken).toBe('token-1');
    expect(client.tokenExpiry).toBeGreaterThan(Date.now());
  });

  test('should reuse valid token in ensureValidToken', async () => {
    axios.post.mockResolvedValue({
      data: { access_token: 'token-1', expires_in: 3600 },
    });

    const client = new AthenaClient(validConfig);
    await client.authenticate();
    axios.post.mockClear();

    await client.ensureValidToken();
    expect(axios.post).not.toHaveBeenCalled();
  });

  test('should refresh expired token', async () => {
    axios.post
      .mockResolvedValueOnce({ data: { access_token: 'old', expires_in: 3600 } })
      .mockResolvedValueOnce({ data: { access_token: 'new', expires_in: 3600 } });

    const client = new AthenaClient(validConfig);
    await client.authenticate();
    client.tokenExpiry = Date.now() - 1000;

    await client.ensureValidToken();
    expect(client.accessToken).toBe('new');
  });

  test('should wrap authentication failures as AthenaAPIError', async () => {
    axios.post.mockRejectedValue({
      message: 'fail',
      response: { status: 401, data: { error_description: 'bad credentials' } },
    });

    const client = new AthenaClient(validConfig);
    await expect(client.authenticate()).rejects.toMatchObject({
      name: 'AthenaAPIError',
      statusCode: 401,
      context: { type: 'AUTH_ERROR' },
    });
  });

  test('should export package entrypoint', () => {
    const api = require('../src/index');
    expect(api.AthenaClient).toBe(AthenaClient);
    expect(api.BaseResource).toBeDefined();
  });

  test('should sleep for given duration', async () => {
    jest.useFakeTimers();
    const client = new AthenaClient(validConfig);
    const promise = client.sleep(1000);
    jest.advanceTimersByTime(1000);
    await expect(promise).resolves.toBeUndefined();
    jest.useRealTimers();
  });

  test('should log when debug is enabled', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    axios.post.mockResolvedValue({
      data: { access_token: 'tok', expires_in: 3600 },
    });

    const client = new AthenaClient({ ...validConfig, debug: true });
    await client.authenticate();
    expect(logSpy).toHaveBeenCalledWith('[Auth] Token acquired');

    const config = { headers: {}, method: 'get', url: '/x' };
    await requestInterceptor(config);
    expect(logSpy).toHaveBeenCalledWith('[Request]', 'GET', '/x');

    client.sleep = jest.fn().mockResolvedValue();
    mockHttpClient.mockResolvedValue({ data: {} });
    await client.handleResponseError({
      config: { url: '/retry' },
      response: { status: 503, data: {}, headers: {} },
    });
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[Retry'), '/retry');
    logSpy.mockRestore();
  });

  test('response success interceptor should log in debug mode', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    let responseSuccess;
    mockHttpClient.interceptors.response.use = jest.fn((onFulfilled, onRejected) => {
      responseSuccess = onFulfilled;
      responseErrorInterceptor = onRejected;
    });

    new AthenaClient({ ...validConfig, debug: true });
    const response = { status: 200, config: { url: '/ok' } };
    expect(responseSuccess(response)).toBe(response);
    expect(logSpy).toHaveBeenCalledWith('[Response]', 200, '/ok');
    logSpy.mockRestore();
  });

  test('request interceptor should reject errors', async () => {
    new AthenaClient(validConfig);
    const onRejected = mockHttpClient.interceptors.request.use.mock.calls[0][1];
    await expect(onRejected(new Error('req failed'))).rejects.toThrow('req failed');
  });

  test('should perform get/post/put/delete via http client', async () => {
    const client = new AthenaClient(validConfig);
    mockHttpClient.get.mockResolvedValue({ data: { ok: 'get' } });
    mockHttpClient.post.mockResolvedValue({ data: { ok: 'post' } });
    mockHttpClient.put.mockResolvedValue({ data: { ok: 'put' } });
    mockHttpClient.delete.mockResolvedValue({ data: { ok: 'delete' } });

    await expect(client.get('/path', { a: 1 })).resolves.toEqual({ ok: 'get' });
    await expect(client.post('/path', { b: 2 })).resolves.toEqual({ ok: 'post' });
    await expect(client.put('/path', { c: 3 })).resolves.toEqual({ ok: 'put' });
    await expect(client.delete('/path')).resolves.toEqual({ ok: 'delete' });

    expect(mockHttpClient.get).toHaveBeenCalledWith('/path', { params: { a: 1 } });
    expect(mockHttpClient.post).toHaveBeenCalledWith('/path', { b: 2 });
    expect(mockHttpClient.put).toHaveBeenCalledWith('/path', { c: 3 });
    expect(mockHttpClient.delete).toHaveBeenCalledWith('/path');
  });

  test('request interceptor should attach bearer token', async () => {
    axios.post.mockResolvedValue({
      data: { access_token: 'tok', expires_in: 3600 },
    });
    const client = new AthenaClient(validConfig);
    expect(requestInterceptor).toBeInstanceOf(Function);

    const config = { headers: {}, method: 'get', url: '/x' };
    const result = await requestInterceptor(config);
    expect(result.headers.Authorization).toBe('Bearer tok');
  });

  test('shouldRetryRequest should retry transient statuses and network errors', () => {
    const client = new AthenaClient(validConfig);
    expect(client.shouldRetryRequest({ response: undefined })).toBe(true);
    expect(client.shouldRetryRequest({ response: { status: 429 } })).toBe(true);
    expect(client.shouldRetryRequest({ response: { status: 500 } })).toBe(true);
    expect(client.shouldRetryRequest({ response: { status: 400 } })).toBe(false);
    expect(client.shouldRetryRequest({ response: { status: 401 } })).toBe(false);
    expect(client.shouldRetryRequest({ response: { status: 404 } })).toBe(false);
  });

  test('createAPIError should map status codes', () => {
    const client = new AthenaClient(validConfig);

    expect(client.createAPIError({ message: 'offline' }).context.type).toBe('NETWORK_ERROR');
    expect(
      client.createAPIError({ response: { status: 400, data: { error: 'x' }, headers: {} } })
        .context.type,
    ).toBe('VALIDATION_ERROR');
    expect(
      client.createAPIError({ response: { status: 401, data: {}, headers: {} } }).context.type,
    ).toBe('AUTH_ERROR');
    expect(
      client.createAPIError({ response: { status: 403, data: {}, headers: {} } }).context.type,
    ).toBe('PERMISSION_ERROR');
    expect(
      client.createAPIError({ response: { status: 404, data: {}, headers: {} } }).context.type,
    ).toBe('NOT_FOUND');
    expect(
      client.createAPIError({
        response: { status: 429, data: {}, headers: { 'retry-after': '30' } },
      }).context,
    ).toMatchObject({ type: 'RATE_LIMIT_ERROR', retryAfter: '30' });
    expect(
      client.createAPIError({ response: { status: 503, data: {}, headers: {} } }).context.type,
    ).toBe('SERVER_ERROR');
    expect(
      client.createAPIError({
        response: { status: 418, data: { message: 'teapot' }, headers: {} },
      }).message,
    ).toContain('HTTP 418');
  });

  test('handleResponseError should retry then succeed', async () => {
    const client = new AthenaClient({ ...validConfig, maxRetries: 3 });
    client.sleep = jest.fn().mockResolvedValue();
    mockHttpClient.mockResolvedValue({ data: { recovered: true } });

    const error = {
      config: { url: '/retry' },
      response: { status: 503, data: {}, headers: {} },
    };

    const result = await client.handleResponseError(error);
    expect(client.sleep).toHaveBeenCalled();
    expect(mockHttpClient).toHaveBeenCalledWith(error.config);
    expect(result).toEqual({ data: { recovered: true } });
  });

  test('handleResponseError should throw AthenaAPIError when not retryable', async () => {
    const client = new AthenaClient(validConfig);
    const error = {
      config: { url: '/bad', _retry: true },
      response: { status: 400, data: { error: 'bad' }, headers: {} },
    };

    await expect(client.handleResponseError(error)).rejects.toBeInstanceOf(AthenaAPIError);
  });

  test('response interceptor should delegate to handleResponseError', async () => {
    const client = new AthenaClient(validConfig);
    client.handleResponseError = jest.fn().mockRejectedValue(new Error('handled'));
    expect(responseErrorInterceptor).toBeInstanceOf(Function);
    await expect(responseErrorInterceptor({ config: {} })).rejects.toThrow('handled');
    expect(client.handleResponseError).toHaveBeenCalled();
  });
});

describe('BaseResource.paginate', () => {
  test('should paginate using results until short page', async () => {
    const mockClient = {
      practiceId: '195900',
      get: jest
        .fn()
        .mockResolvedValueOnce({ results: [{ id: 1 }, { id: 2 }] })
        .mockResolvedValueOnce({ results: [{ id: 3 }] }),
    };

    const resource = new BaseResource(mockClient);
    const items = [];
    for await (const item of resource.paginate('/patients', { departmentid: 1 }, 2)) {
      items.push(item);
    }

    expect(items).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(mockClient.get).toHaveBeenNthCalledWith(1, '/patients', {
      departmentid: 1,
      limit: 2,
      offset: 0,
    });
    expect(mockClient.get).toHaveBeenNthCalledWith(2, '/patients', {
      departmentid: 1,
      limit: 2,
      offset: 2,
    });
  });

  test('should paginate using data key', async () => {
    const mockClient = {
      practiceId: '195900',
      get: jest.fn().mockResolvedValue({ data: [{ id: 'a' }] }),
    };

    const resource = new BaseResource(mockClient);
    const items = [];
    for await (const item of resource.paginate('/items', {}, 10)) {
      items.push(item);
    }

    expect(items).toEqual([{ id: 'a' }]);
  });
});
