const { BaseResource } = require('@athena-api/core');

class ProviderResource extends BaseResource {
  // Get provider by ID
  async getProvider(providerId, params = {}) {
    return this.client.get(this.buildEndpoint(`/providers/${providerId}`), params);
  }

  // List all providers
  async listProviders(params = {}) {
    return this.client.get(this.buildEndpoint('/providers'), params);
  }

  // Create provider
  async createProvider(providerData) {
    return this.client.post(this.buildEndpoint('/providers'), providerData);
  }

  // Update provider
  async updateProvider(providerId, providerData) {
    return this.client.put(this.buildEndpoint(`/providers/${providerId}`), providerData);
  }

  // Delete provider
  async deleteProvider(providerId) {
    return this.client.delete(this.buildEndpoint(`/providers/${providerId}`));
  }

  // Get provider schedule
  async getProviderSchedule(providerId, params) {
    return this.client.get(
      this.buildEndpoint(`/providers/${providerId}/appointments`),
      params
    );
  }

  // Get provider specialties
  async getProviderSpecialties() {
    return this.client.get(this.buildEndpoint('/customfields/specialty'));
  }

  // Get changed providers
  async getChangedProviders(params) {
    return this.client.get(this.buildEndpoint('/providers/changed'), params);
  }

  // Get referring providers
  async getReferringProviders(params = {}) {
    return this.client.get(this.buildEndpoint('/referringproviders'), params);
  }

  // Get referring provider by ID
  async getReferringProvider(referringProviderId) {
    return this.client.get(
      this.buildEndpoint(`/referringproviders/${referringProviderId}`)
    );
  }

  // Create referring provider
  async createReferringProvider(providerData) {
    return this.client.post(this.buildEndpoint('/referringproviders'), providerData);
  }

  // Update referring provider
  async updateReferringProvider(referringProviderId, providerData) {
    return this.client.put(
      this.buildEndpoint(`/referringproviders/${referringProviderId}`),
      providerData
    );
  }

  // Delete referring provider
  async deleteReferringProvider(referringProviderId) {
    return this.client.delete(
      this.buildEndpoint(`/referringproviders/${referringProviderId}`)
    );
  }

  // Get provider portal enrollment
  async getProviderPortalEnrollment(providerId) {
    return this.client.get(
      this.buildEndpoint(`/providers/${providerId}/portalenrollment`)
    );
  }
}

module.exports = { ProviderResource };
