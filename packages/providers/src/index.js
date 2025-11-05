const { BaseResource } = require('@athena-api/core');
const Joi = require('joi');

class ProviderResource extends BaseResource {
  // Get provider by ID
  async getProvider(providerId, params = {}) {
    const schema = Joi.number().required();
    const { error } = schema.validate(providerId);
    if (error) {
      throw new Error(`Invalid providerId: ${error.message}`);
    }
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
    const schema = Joi.number().required();
    const { error } = schema.validate(providerId);
    if (error) {
      throw new Error(`Invalid providerId: ${error.message}`);
    }
    return this.client.put(this.buildEndpoint(`/providers/${providerId}`), providerData);
  }

  // Delete provider
  async deleteProvider(providerId) {
    const schema = Joi.number().required();
    const { error } = schema.validate(providerId);
    if (error) {
      throw new Error(`Invalid providerId: ${error.message}`);
    }
    return this.client.delete(this.buildEndpoint(`/providers/${providerId}`));
  }

  // Get provider schedule
  async getProviderSchedule(providerId, params) {
    const schema = Joi.number().required();
    const { error } = schema.validate(providerId);
    if (error) {
      throw new Error(`Invalid providerId: ${error.message}`);
    }
    return this.client.get(
      this.buildEndpoint(`/providers/${providerId}/appointments`),
      params,
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
    const schema = Joi.number().required();
    const { error } = schema.validate(referringProviderId);
    if (error) {
      throw new Error(`Invalid referringProviderId: ${error.message}`);
    }
    return this.client.get(
      this.buildEndpoint(`/referringproviders/${referringProviderId}`),
    );
  }

  // Create referring provider
  async createReferringProvider(providerData) {
    return this.client.post(this.buildEndpoint('/referringproviders'), providerData);
  }

  // Update referring provider
  async updateReferringProvider(referringProviderId, providerData) {
    const schema = Joi.number().required();
    const { error } = schema.validate(referringProviderId);
    if (error) {
      throw new Error(`Invalid referringProviderId: ${error.message}`);
    }
    return this.client.put(
      this.buildEndpoint(`/referringproviders/${referringProviderId}`),
      providerData,
    );
  }

  // Delete referring provider
  async deleteReferringProvider(referringProviderId) {
    const schema = Joi.number().required();
    const { error } = schema.validate(referringProviderId);
    if (error) {
      throw new Error(`Invalid referringProviderId: ${error.message}`);
    }
    return this.client.delete(
      this.buildEndpoint(`/referringproviders/${referringProviderId}`),
    );
  }

  // Get provider portal enrollment
  async getProviderPortalEnrollment(providerId) {
    const schema = Joi.number().required();
    const { error } = schema.validate(providerId);
    if (error) {
      throw new Error(`Invalid providerId: ${error.message}`);
    }
    return this.client.get(
      this.buildEndpoint(`/providers/${providerId}/portalenrollment`),
    );
  }
}

module.exports = { ProviderResource };
