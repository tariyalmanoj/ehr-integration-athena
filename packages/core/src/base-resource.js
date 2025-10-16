/**
 * Base Resource class
 * All resource classes extend this base class
 */
class BaseResource {
  /**
   * @param {AthenaClient} client - Athena Health client instance
   */
  constructor(client) {
    if (!client) {
      throw new Error('Client is required');
    }
    this.client = client;
  }

  /**
   * Build endpoint with practice ID
   * @param {string} path - API path
   * @returns {string} Full endpoint
   */
  buildEndpoint(path) {
    return `/v1/${this.client.practiceId}${path}`;
  }

  /**
   * Handle pagination
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @param {number} limit - Maximum results per page
   * @returns {AsyncGenerator} Paginated results
   */
  async *paginate(endpoint, params = {}, limit = 100) {
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const response = await this.client.get(endpoint, {
        ...params,
        limit,
        offset
      });

      const items = response.results || response.data || [];
      
      for (const item of items) {
        yield item;
      }

      hasMore = items.length === limit;
      offset += limit;
    }
  }
}

module.exports = BaseResource;
