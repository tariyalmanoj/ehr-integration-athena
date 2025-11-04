const { BaseResource } = require('@athena-api/core');
const Joi = require('joi');
const querystring = require("querystring");

class ClaimResource extends BaseResource {
  // Get claim by ID
  async getClaim(claimId, params = {}) {
    const schema = Joi.string().required();
    const { error } = schema.validate(claimId);
    if (error) {
      throw new Error(`Invalid claimId: ${error.message}`);
    }
    return this.client.get(this.buildEndpoint(`/claims/${claimId}`), params);
  }

  // List claims
  async listClaims(params = {}) {
    return this.client.get(this.buildEndpoint('/claims'), params);
  }

  // Create claim
  async createClaim(claimData) {
    const claim = querystring.parse(claimData);
    const schema = Joi.object({
      patientid: Joi.number().required(),
      departmentid: Joi.number().required(),
      supervisingproviderid: Joi.number().required(),
      claimcharges: Joi.array()
        .items(
          Joi.object({
            procedurecode: Joi.string().required(),
            icd10code1: Joi.string().required(),
            icd10code2: Joi.string().optional(),
            icd10code3: Joi.string().optional(),
            icd10code4: Joi.string().optional(),
            icd10code5: Joi.string().optional(),
            icd10code6: Joi.string().optional(),
          }),
        )
        .min(1)
        .required(),
    }).required().unknown(true);
    const { error } = schema.validate({...claim, claimcharges: JSON.parse(claim.claimcharges)});
    if (error) {
      throw new Error(`Invalid claimData: ${error.message}`);
    }
    return this.client.post(this.buildEndpoint('/claims'), claimData);
  }

  // Update claim
  async updateClaim(claimId, claimData) {
    const schema = Joi.string().required();
    const { error } = schema.validate(claimId);
    if (error) {
      throw new Error(`Invalid claimId: ${error.message}`);
    }
    return this.client.put(this.buildEndpoint(`/claims/${claimId}`), claimData);
  }

  // Delete claim
  async deleteClaim(claimId) {
    const schema = Joi.string().required();
    const { error } = schema.validate(claimId);
    if (error) {
      throw new Error(`Invalid claimId: ${error.message}`);
    }
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
      params,
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
      attachmentData,
    );
  }

  // Get changed claims
  async getChangedClaims(params) {
    return this.client.get(this.buildEndpoint('/claims/changed'), params);
  }
}

module.exports = { ClaimResource };
