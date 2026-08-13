// Type definitions for @athena-api/core

export interface ClientConfig {
  clientId: string;
  clientSecret: string;
  environment: 'preview' | 'production';
  practiceId: string;
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
  debug?: boolean;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

export interface APIErrorContext {
  type: 'NETWORK_ERROR' | 'VALIDATION_ERROR' | 'AUTH_ERROR' | 'PERMISSION_ERROR' | 'NOT_FOUND' | 'RATE_LIMIT_ERROR' | 'SERVER_ERROR' | 'API_ERROR';
  retryAfter?: string;
}

export class AthenaAPIError extends Error {
  constructor(
    message: string,
    statusCode: number | null,
    originalError: Error,
    context: APIErrorContext
  );
  
  name: string;
  statusCode: number | null;
  originalError: Error;
  context: APIErrorContext;
  timestamp: string;
}

export class AthenaClient {
  constructor(config: ClientConfig);
  
  // Configuration properties
  clientId: string;
  clientSecret: string;
  practiceId: string;
  environment: 'preview' | 'production';
  baseUrl: string;
  tokenUrl: string;
  timeout: number;
  maxRetries: number;
  debug: boolean;
  
  // Token management
  accessToken: string | null;
  tokenExpiry: number | null;
  
  // HTTP methods
  get<T = any>(endpoint: string, params?: Record<string, any>): Promise<T>;
  post<T = any>(endpoint: string, data?: Record<string, any>): Promise<T>;
  put<T = any>(endpoint: string, data?: Record<string, any>): Promise<T>;
  delete<T = any>(endpoint: string): Promise<T>;
  
  // Endpoint building
  buildEndpoint(path: string): string;
  
  // Internal methods (not typically called directly)
  authenticate(): Promise<void>;
  ensureValidToken(): Promise<void>;
  handleResponseError(error: Error): Promise<never>;
}

export interface PaginateOptions {
  limit?: number;
  offset?: number;
}

export interface PaginationResult<T> {
  results?: T[];
  data?: T[];
  totalcount?: number;
}