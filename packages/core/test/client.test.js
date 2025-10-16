const AthenaClient = require('../src/client');
const BaseResource = require('../src/base-resource');

describe('AthenaClient', () => {
  describe('Constructor Validation', () => {
    test('should throw error when config is empty', () => {
      expect(() => {
        new AthenaClient({});
      }).toThrow('Missing required configuration');
    });

    test('should throw error for missing clientId', () => {
      expect(() => {
        new AthenaClient({
          clientSecret: 'test-secret',
          environment: 'preview',
          practiceId: '195900'
        });
      }).toThrow('Missing required configuration: clientId');
    });

    test('should throw error for missing clientSecret', () => {
      expect(() => {
        new AthenaClient({
          clientId: 'test-id',
          environment: 'preview',
          practiceId: '195900'
        });
      }).toThrow('Missing required configuration: clientSecret');
    });

    test('should throw error for missing environment', () => {
      expect(() => {
        new AthenaClient({
          clientId: 'test-id',
          clientSecret: 'test-secret',
          practiceId: '195900'
        });
      }).toThrow('Missing required configuration: environment');
    });

    test('should throw error for missing practiceId', () => {
      expect(() => {
        new AthenaClient({
          clientId: 'test-id',
          clientSecret: 'test-secret',
          environment: 'preview'
        });
      }).toThrow('Missing required configuration: practiceId');
    });

    test('should throw error for multiple missing fields', () => {
      expect(() => {
        new AthenaClient({
          clientId: 'test-id'
        });
      }).toThrow('Missing required configuration');
    });

    test('should throw error for invalid environment', () => {
      expect(() => {
        new AthenaClient({
          clientId: 'test-id',
          clientSecret: 'test-secret',
          environment: 'staging',
          practiceId: '195900'
        });
      }).toThrow('Environment must be either "preview" or "production"');
    });

    test('should throw error for invalid environment type', () => {
      expect(() => {
        new AthenaClient({
          clientId: 'test-id',
          clientSecret: 'test-secret',
          environment: 'development',
          practiceId: '195900'
        });
      }).toThrow('Environment must be either "preview" or "production"');
    });
  });

  describe('Client Initialization - Preview Environment', () => {
    let client;

    beforeEach(() => {
      client = new AthenaClient({
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        environment: 'preview',
        practiceId: '195900'
      });
    });

    test('should create client with valid preview config', () => {
      expect(client).toBeInstanceOf(AthenaClient);
      expect(client.clientId).toBe('test-client-id');
      expect(client.clientSecret).toBe('test-client-secret');
      expect(client.practiceId).toBe('195900');
      expect(client.baseUrl).toBe('https://api.preview.platform.athenahealth.com');
    });

    test('should set correct token URL for preview', () => {
      expect(client.tokenUrl).toBe('https://api.preview.platform.athenahealth.com/oauth2/v1/token');
    });

    test('should set default timeout to 30000ms', () => {
      expect(client.timeout).toBe(30000);
    });

    test('should initialize with no access token', () => {
      expect(client.accessToken).toBeNull();
      expect(client.tokenExpiry).toBeNull();
    });

    test('should set debug to false by default', () => {
      expect(client.debug).toBe(false);
    });
  });

  describe('Client Initialization - Production Environment', () => {
    let client;

    beforeEach(() => {
      client = new AthenaClient({
        clientId: 'prod-client-id',
        clientSecret: 'prod-client-secret',
        environment: 'production',
        practiceId: '195900'
      });
    });

    test('should create client with valid production config', () => {
      expect(client).toBeInstanceOf(AthenaClient);
      expect(client.baseUrl).toBe('https://api.platform.athenahealth.com');
    });

    test('should set correct token URL for production', () => {
      expect(client.tokenUrl).toBe('https://api.platform.athenahealth.com/oauth2/v1/token');
    });
  });

  describe('Custom Configuration Options', () => {
    test('should accept custom timeout', () => {
      const client = new AthenaClient({
        clientId: 'test-id',
        clientSecret: 'test-secret',
        environment: 'preview',
        practiceId: '195900',
        timeout: 60000
      });
      
      expect(client.timeout).toBe(60000);
    });

    test('should accept custom maxRetries', () => {
      const client = new AthenaClient({
        clientId: 'test-id',
        clientSecret: 'test-secret',
        environment: 'preview',
        practiceId: '195900',
        maxRetries: 5
      });
      
      expect(client.maxRetries).toBe(5);
    });

    test('should enable debug mode when specified', () => {
      const client = new AthenaClient({
        clientId: 'test-id',
        clientSecret: 'test-secret',
        environment: 'preview',
        practiceId: '195900',
        debug: true
      });
      
      expect(client.debug).toBe(true);
    });

    test('should handle all custom options together', () => {
      const client = new AthenaClient({
        clientId: 'test-id',
        clientSecret: 'test-secret',
        environment: 'production',
        practiceId: '195900',
        timeout: 45000,
        maxRetries: 5,
        debug: true
      });
      
      expect(client.timeout).toBe(45000);
      expect(client.maxRetries).toBe(5);
      expect(client.debug).toBe(true);
    });
  });

  describe('buildEndpoint Method', () => {
    let client;

    beforeEach(() => {
      client = new AthenaClient({
        clientId: 'test-id',
        clientSecret: 'test-secret',
        environment: 'preview',
        practiceId: '195900'
      });
    });

    test('should build simple endpoint with practice ID', () => {
      const endpoint = client.buildEndpoint('/patients');
      expect(endpoint).toBe('/v1/195900/patients');
    });

    test('should build endpoint with resource ID', () => {
      const endpoint = client.buildEndpoint('/patients/123456');
      expect(endpoint).toBe('/v1/195900/patients/123456');
    });

    test('should build nested endpoint', () => {
      const endpoint = client.buildEndpoint('/patients/123/appointments');
      expect(endpoint).toBe('/v1/195900/patients/123/appointments');
    });

    test('should build complex nested endpoint', () => {
      const endpoint = client.buildEndpoint('/chart/123/problems/456');
      expect(endpoint).toBe('/v1/195900/chart/123/problems/456');
    });

    test('should handle paths without leading slash', () => {
      const endpoint = client.buildEndpoint('patients');
      expect(endpoint).toBe('/v1/195900patients');
    });

    test('should work with different practice IDs', () => {
      const client2 = new AthenaClient({
        clientId: 'test',
        clientSecret: 'test',
        environment: 'preview',
        practiceId: '999999'
      });
      
      const endpoint = client2.buildEndpoint('/providers');
      expect(endpoint).toBe('/v1/999999/providers');
    });
  });

  describe('HTTP Client Initialization', () => {
    test('should initialize axios http client', () => {
      const client = new AthenaClient({
        clientId: 'test',
        clientSecret: 'test',
        environment: 'preview',
        practiceId: '195900'
      });
      
      expect(client.httpClient).toBeDefined();
      expect(client.httpClient.defaults.timeout).toBe(30000);
    });

    test('should set default content-type header', () => {
      const client = new AthenaClient({
        clientId: 'test',
        clientSecret: 'test',
        environment: 'preview',
        practiceId: '195900'
      });
      
      expect(client.httpClient.defaults.headers['Content-Type']).toBe('application/json');
    });
  });
});

describe('BaseResource', () => {
  describe('Constructor Validation', () => {
    test('should throw error if client not provided', () => {
      expect(() => {
        new BaseResource();
      }).toThrow('Client is required');
    });

    test('should throw error if client is null', () => {
      expect(() => {
        new BaseResource(null);
      }).toThrow('Client is required');
    });

    test('should throw error if client is undefined', () => {
      expect(() => {
        new BaseResource(undefined);
      }).toThrow('Client is required');
    });

    test('should accept valid client instance', () => {
      const client = new AthenaClient({
        clientId: 'test',
        clientSecret: 'test',
        environment: 'preview',
        practiceId: '195900'
      });
      
      const resource = new BaseResource(client);
      expect(resource).toBeInstanceOf(BaseResource);
    });
  });

  describe('Client Storage', () => {
    test('should store client instance', () => {
      const client = new AthenaClient({
        clientId: 'test',
        clientSecret: 'test',
        environment: 'preview',
        practiceId: '195900'
      });
      
      const resource = new BaseResource(client);
      expect(resource.client).toBe(client);
      expect(resource.client).toBeInstanceOf(AthenaClient);
    });

    test('should access client properties', () => {
      const client = new AthenaClient({
        clientId: 'test',
        clientSecret: 'test',
        environment: 'preview',
        practiceId: '195900'
      });
      
      const resource = new BaseResource(client);
      expect(resource.client.practiceId).toBe('195900');
      expect(resource.client.baseUrl).toBe('https://api.preview.platform.athenahealth.com');
    });
  });

  describe('buildEndpoint Method', () => {
    let resource;

    beforeEach(() => {
      const client = new AthenaClient({
        clientId: 'test',
        clientSecret: 'test',
        environment: 'preview',
        practiceId: '195900'
      });
      resource = new BaseResource(client);
    });

    test('should build endpoint with practice ID', () => {
      const endpoint = resource.buildEndpoint('/patients');
      expect(endpoint).toBe('/v1/195900/patients');
    });

    test('should build endpoint with resource ID', () => {
      const endpoint = resource.buildEndpoint('/patients/123');
      expect(endpoint).toBe('/v1/195900/patients/123');
    });

    test('should build nested resource endpoint', () => {
      const endpoint = resource.buildEndpoint('/patients/123/appointments');
      expect(endpoint).toBe('/v1/195900/patients/123/appointments');
    });

    test('should build chart endpoints', () => {
      const endpoint = resource.buildEndpoint('/chart/123/problems');
      expect(endpoint).toBe('/v1/195900/chart/123/problems');
    });

    test('should build complex nested paths', () => {
      const endpoint = resource.buildEndpoint('/chart/123/encounter/456/diagnoses');
      expect(endpoint).toBe('/v1/195900/chart/123/encounter/456/diagnoses');
    });

    test('should work with different practice IDs', () => {
      const client2 = new AthenaClient({
        clientId: 'test',
        clientSecret: 'test',
        environment: 'preview',
        practiceId: '555555'
      });
      
      const resource2 = new BaseResource(client2);
      const endpoint = resource2.buildEndpoint('/departments');
      expect(endpoint).toBe('/v1/555555/departments');
    });
  });
});
