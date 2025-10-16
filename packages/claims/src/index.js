const { BaseResource } = require('@athena-api/core');

class ClaimResource extends BaseResource {
  // Get claim by ID
  async getClaim(claimId, params = {}) {
    return this.client.get(this.buildEndpoint(`/claims/${claimId}`), params);
  }

  // List claims
  async listClaims(params = {}) {
    return this.client.get(this.buildEndpoint('/claims'), params);
  }

  // Create claim
  async createClaim(claimData) {
    return this.client.post(this.buildEndpoint('/claims'), claimData);
  }

  // Update claim
  async updateClaim(claimId, claimData) {
    return this.client.put(this.buildEndpoint(`/claims/${claimId}`), claimData);
  }

  // Delete claim
  async deleteClaim(claimId) {
    return this.client.delete(this.buildEndpoint(`/claims/${claimId}`));
  }

  // Get patient claims
  async getPatientClaims(patientId, params = {}) {
    return this.client.get(this.buildEndpoint(`/patients/${patientId}/claims`), params);
  }

  // Get closed patient claims
  async getClosedPatientClaims(patientId, params = {}) {
    return this.client.get(
      this.buildEndpoint(`/patients/${patientId}/claims/closed`),
      params
    );
  }

  // Submit claim
  async submitClaim(claimId) {
    return this.client.post(this.buildEndpoint(`/claims/${claimId}/submit`));
  }

  // Resubmit claim
  async resubmitClaim(claimId) {
    return this.client.post(this.buildEndpoint(`/claims/${claimId}/resubmit`));
  }

  // Void claim
  async voidClaim(claimId, voidData = {}) {
    return this.client.post(this.buildEndpoint(`/claims/${claimId}/void`), voidData);
  }

  // Get claim status
  async getClaimStatus(claimId) {
    return this.client.get(this.buildEndpoint(`/claims/${claimId}/status`));
  }

  // Get claim notes
  async getClaimNotes(claimId) {
    return this.client.get(this.buildEndpoint(`/claims/${claimId}/notes`));
  }

  // Add claim note
  async addClaimNote(claimId, noteData) {
    return this.client.post(this.buildEndpoint(`/claims/${claimId}/notes`), noteData);
  }

  // Get claim denials
  async getClaimDenials(params = {}) {
    return this.client.get(this.buildEndpoint('/claims/denials'), params);
  }

  // Update claim denial
  async updateClaimDenial(claimId, denialData) {
    return this.client.put(this.buildEndpoint(`/claims/${claimId}/denial`), denialData);
  }

  // Get claim attachments
  async getClaimAttachments(claimId) {
    return this.client.get(this.buildEndpoint(`/claims/${claimId}/attachments`));
  }

  // Upload claim attachment
  async uploadClaimAttachment(claimId, attachmentData) {
    return this.client.post(
      this.buildEndpoint(`/claims/${claimId}/attachments`),
      attachmentData
    );
  }

  // Get changed claims
  async getChangedClaims(params) {
    return this.client.get(this.buildEndpoint('/claims/changed'), params);
  }
}

module.exports = { ClaimResource };
