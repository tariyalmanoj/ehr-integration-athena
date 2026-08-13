// Type definitions for @athena-api/core BaseResource

import { AthenaClient, PaginateOptions, PaginationResult } from './client';

export interface PaginateOptions {
  limit?: number;
  offset?: number;
}

export interface PaginationResult<T> {
  results?: T[];
  data?: T[];
  totalcount?: number;
}

export class BaseResource {
  constructor(client: AthenaClient);
  
  client: AthenaClient;
  
  /**
   * Build endpoint with practice ID and path normalization
   * @param path - API path (with or without leading slash)
   * @returns Full endpoint URL
   */
  buildEndpoint(path: string): string;
  
  /**
   * Handle pagination for list endpoints
   * @param endpoint - API endpoint to paginate
   * @param params - Query parameters
   * @param limit - Maximum results per page (default: 100)
   * @returns AsyncGenerator yielding paginated results
   */
  paginate<T = any>(
    endpoint: string,
    params?: Record<string, any>,
    limit?: number
  ): AsyncGenerator<T, void, unknown>;
}