const { BaseResource } = require('@athena-api/core');

class InsuranceResource extends BaseResource {
  // Get insurance packages
  async getInsurancePackages(params = {}) {
    return this.client.get(this.buildEndpoint('/insurancepackages'), params);
  }

  // Get insurance package by ID
  async getInsurancePackage(packageId) {
    return this.client.get(this.buildEndpoint(`/insurancepackages/${packageId}`));
  }

  // Create insurance package
  async createInsurancePackage(packageData) {
    return this.client.post(this.buildEndpoint('/insurancepackages'), packageData);
  }

  // Update insurance package
  async updateInsurancePackage(packageId, packageData) {
    return this.client.put(
      this.buildEndpoint(`/insurancepackages/${packageId}`),
      packageData
    );
  }

  // Get patient insurance
  async getPatientInsurance(patientId, params = {}) {
    return this.client.get(
      this.buildEndpoint(`/patients/${patientId}/insurances`),
      params
    );
  }

  // Get patient insurance by sequence
  async getPatientInsuranceBySequence(patientId, sequenceNumber) {
    return this.client.get(
      this.buildEndpoint(`/patients/${patientId}/insurances/${sequenceNumber}`)
    );
  }

  // Create patient insurance
  async createPatientInsurance(patientId, insuranceData) {
    return this.client.post(
      this.buildEndpoint(`/patients/${patientId}/insurances`),
      insuranceData
    );
  }

  // Update patient insurance
  async updatePatientInsurance(patientId, sequenceNumber, insuranceData) {
    return this.client.put(
      this.buildEndpoint(`/patients/${patientId}/insurances/${sequenceNumber}`),
      insuranceData
    );
  }

  // Delete patient insurance
  async deletePatientInsurance(patientId, sequenceNumber) {
    return this.client.delete(
      this.buildEndpoint(`/patients/${patientId}/insurances/${sequenceNumber}`)
    );
  }

  // Check insurance eligibility
  async checkEligibility(eligibilityData) {
    return this.client.post(this.buildEndpoint('/eligibility/check'), eligibilityData);
  }

  // Get eligibility check status
  async getEligibilityStatus(checkId) {
    return this.client.get(this.buildEndpoint(`/eligibility/${checkId}`));
  }

  // List eligibility checks
  async listEligibilityChecks(params = {}) {
    return this.client.get(this.buildEndpoint('/eligibility'), params);
  }

  // Verify patient insurance
  async verifyPatientInsurance(patientId, params = {}) {
    return this.client.get(
      this.buildEndpoint(`/patients/${patientId}/insurances/verify`),
      params,
    );
  }

  // Get insurance authorization
  async getAuthorization(authorizationId) {
    return this.client.get(this.buildEndpoint(`/authorizations/${authorizationId}`));
  }

  // Create insurance authorization
  async createAuthorization(authorizationData) {
    return this.client.post(this.buildEndpoint('/authorizations'), authorizationData);
  }

  // Update insurance authorization
  async updateAuthorization(authorizationId, authorizationData) {
    return this.client.put(
      this.buildEndpoint(`/authorizations/${authorizationId}`),
      authorizationData
    );
  }

  // Get patient authorizations
  async getPatientAuthorizations(patientId, params = {}) {
    return this.client.get(
      this.buildEndpoint(`/patients/${patientId}/authorizations`),
      params
    );
  }

  // Get insurance card images
  async getInsuranceCardImages(patientId, sequenceNumber) {
    return this.client.get(
      this.buildEndpoint(
        `/patients/${patientId}/insurances/${sequenceNumber}/cardimages`
      )
    );
  }

  // Upload insurance card image
  async uploadInsuranceCardImage(patientId, sequenceNumber, imageData) {
    return this.client.post(
      this.buildEndpoint(
        `/patients/${patientId}/insurances/${sequenceNumber}/cardimages`
      ),
      imageData
    );
  }
}

module.exports = { InsuranceResource };
