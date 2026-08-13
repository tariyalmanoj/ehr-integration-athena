const axios = require('axios');
const qs = require('qs');
const winston = require('winston');

/**
 * Format timestamp for logging
 * @returns {string} ISO timestamp with milliseconds
 */
function getTimestamp() {
  return new Date().toISOString();
}

/**
 * Log request details to console when debug mode is enabled
 * @param {Object} config - Axios request configuration
 * @param {boolean} debug - Whether debug mode is enabled
 */
function logRequest(config, debug) {
  if (!debug) return;
  
  const timestamp = getTimestamp();
  const method = config.method.toUpperCase();
  const url = config.url || '';
  const params = config.params ? JSON.stringify(config.params) : '{}';
  
  console.log(`[${timestamp}] [${method}] ${url} Params: ${params}`);
}

/**
 * Log response details to console when debug mode is enabled
 * @param {Object} response - Axios response object
 * @param {boolean} debug - Whether debug mode is enabled
 */
function logResponse(response, debug) {
  if (!debug) return;
  
  const timestamp = getTimestamp();
  const status = response.status;
  const url = response.config.url || '';
  const headers = response.headers ? JSON.stringify(response.headers) : '{}';
  
  console.log(`[${timestamp}] [${status}] ${url} Headers: ${headers}`);
}

/**
 * Log error details to console when debug mode is enabled
 * @param {Object} error - Error object
 * @param {boolean} debug - Whether debug mode is enabled
 */
function logError(error, debug) {
  if (!debug) return;
  
  const timestamp = getTimestamp();
  const message = error.message || 'Unknown error';
  const stack = error.stack ? error.stack.split('\n').slice(0, 3).join('\n') : '';
  
  console.error(`[${timestamp}] [ERROR] ${message}\n${stack}`);
}

/**
 * Log retry attempt to console when debug mode is enabled
 * @param {number} attempt - Current attempt number
 * @param {number} maxRetries - Maximum retries allowed
 * @param {string} url - Request URL
 * @param {boolean} debug - Whether debug mode is enabled
 */
function logRetry(attempt, maxRetries, url, debug) {
  if (!debug) return;
  
  const timestamp = getTimestamp();
  console.log(`[${timestamp}] [Retry ${attempt}/${maxRetries}] Retrying: ${url}`);
}

/**
 * Log authentication events to console when debug mode is enabled
 * @param {string} message - Message to log
 * @param {boolean} debug - Whether debug mode is enabled
 */
function logAuth(message, debug) {
  if (!debug) return;
  
  const timestamp = getTimestamp();
  console.log(`[${timestamp}] [Auth] ${message}`);
}
/**
 * Custom error class for AthenaHealth API errors
 */
class AthenaAPIError extends Error {
  constructor(message, statusCode, originalError, context = {}) {
    super(message);
    this.name = 'AthenaAPIError';
    this.statusCode = statusCode;
    this.originalError = originalError;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }
}

class AthenaClient {
  constructor(config = {}) {

    this.logger = winston.createLogger({
      level: config.logLevel || 'info',
      format: winston.format.json(),
      transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
      ]
    });
    
    if (config.debug) {
      this.logger.add(new winston.transports.Console({
        format: winston.format.simple()
      }));
    }

    this.validateConfig(config);
    
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.practiceId = config.practiceId;
    this.environment = config.environment;
    
    // Configuration options
    this.timeout = config.timeout || 60000;
    this.maxRetries = config.maxRetries || 3;
    this.debug = config.debug || false;

    this.baseUrl = config.baseUrl
      || (this.environment === 'preview'
        ? 'https://api.preview.platform.athenahealth.com'
        : 'https://api.platform.athenahealth.com');

    this.tokenUrl = `${this.baseUrl}/oauth2/v1/token`;
    
    this.accessToken = null;
    this.tokenExpiry = null;
    
    this.httpClient = this.createHttpClient();
  }

  validateConfig(config) {
    const requiredFields = ['clientId', 'clientSecret', 'environment', 'practiceId'];
    const missing = requiredFields.filter(field => !config[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required configuration: ${missing.join(', ')}`);
    }
    
    if (!['preview', 'production'].includes(config.environment)) {
      throw new Error('Environment must be either "preview" or "production"');
    }
  }

  createHttpClient() {
    const client = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    // Request interceptor
    client.interceptors.request.use(
      async (config) => {
        await this.ensureValidToken();
        config.headers.Authorization = `Bearer ${this.accessToken}`;
        
        logRequest(config, this.debug);
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - ERROR HANDLING
    client.interceptors.response.use(
      (response) => {
        logResponse(response, this.debug);
        return response;
      },
      async (error) => {
        logError(error, this.debug);
        return this.handleResponseError(error);
      }
    );

    return client;
  }

  async handleResponseError(error) {
    // Implement retry logic
    if (error.config && !error.config._retry) {
      error.config._retryCount = error.config._retryCount || 0;
      
      if (error.config._retryCount < this.maxRetries && this.shouldRetryRequest(error)) {
        error.config._retryCount++;
        error.config._retry = true;
        
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, error.config._retryCount) * 1000;
        await this.sleep(delay);
        
        logRetry(error.config._retryCount, this.maxRetries, error.config.url, this.debug);
        
        return this.httpClient(error.config);
      }
    }

    // Transform to custom error
    throw this.createAPIError(error);
  }

  shouldRetryRequest(error) {
    // Network errors - always retry
    if (!error.response) return true;

    const status = error.response.status;
    
    // Retry on transient errors
    return [408, 429, 500, 502, 503, 504].includes(status);
  }

  createAPIError(error) {
    // Network errors
    if (!error.response) {
      return new AthenaAPIError(
        'Network error: Unable to reach AthenaHealth API',
        null,
        error,
        { type: 'NETWORK_ERROR' }
      );
    }

    const { status, data } = error.response;
    let message;
    let context = { type: 'API_ERROR' };

    // Categorize errors by status code
    switch (status) {
      case 400:
        message = `Bad Request: ${data.error || data.error_description || data.message || 'Invalid parameters'}`;
        context.type = 'VALIDATION_ERROR';
        break;
      case 401:
        message = 'Authentication failed: Invalid or expired credentials';
        context.type = 'AUTH_ERROR';
        break;
      case 403:
        message = 'Forbidden: You do not have permission to access this resource';
        context.type = 'PERMISSION_ERROR';
        break;
      case 404:
        message = 'Resource not found';
        context.type = 'NOT_FOUND';
        break;
      case 429:
        message = 'Rate limit exceeded: Too many requests';
        context.type = 'RATE_LIMIT_ERROR';
        context.retryAfter = error.response.headers['retry-after'];
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        message = 'Server error: AthenaHealth API is currently unavailable';
        context.type = 'SERVER_ERROR';
        break;
      default:
        message = `HTTP ${status}: ${data.error_description || data.message || 'Unknown error'}`;
    }

    return new AthenaAPIError(message, status, error, context);
  }

  async ensureValidToken() {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return;
    }
    await this.authenticate();
  }

  async authenticate() {
    try {
      const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      
      const response = await axios.post(
        this.tokenUrl,
        qs.stringify({
          grant_type: 'client_credentials',
          scope: 'athena/service/Athenanet.MDP.*'
        }),
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          timeout: this.timeout
        }
      );

      this.accessToken = response.data.access_token;
      // 1 minute buffer before actual expiry
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000;

      logAuth('Token acquired', this.debug);
    } catch (error) {
      throw new AthenaAPIError(
        `Authentication failed: ${error.response?.data?.error_description || error.message}`,
        error.response?.status,
        error,
        { type: 'AUTH_ERROR' }
      );
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Build endpoint with practice ID and path normalization
   * @param {string} path - API path (with or without leading slash)
   * @returns {string} Full endpoint URL
   */
  buildEndpoint(path) {
    // Validate input
    if (!path || typeof path !== 'string') {
      throw new Error('Path must be a non-empty string');
    }
    
    // Trim whitespace
    const normalizedPath = path.trim();
    
    // Remove leading slashes and split into segments
    let cleanPath = normalizedPath.replace(/^\/+/, '');
    
    // Replace multiple consecutive slashes with single slash
    cleanPath = cleanPath.replace(/\/+/g, '/');
    
    return `/v1/${this.practiceId}/${cleanPath}`;
  }

  async get(endpoint, params = {}) {
    const response = await this.httpClient.get(endpoint, { params });
    return response.data;
  }

  async post(endpoint, data = {}) {
    const response = await this.httpClient.post(endpoint, data);
    return response.data;
  }

  async put(endpoint, data = {}) {
    const response = await this.httpClient.put(endpoint, data);
    return response.data;
  }

  async delete(endpoint) {
    const response = await this.httpClient.delete(endpoint);
    return response.data;
  }
}

module.exports = { AthenaClient, AthenaAPIError };
