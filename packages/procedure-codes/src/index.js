const { BaseResource } = require('@athena-api/core');
const Joi = require('joi');

class ProcedureCodeResource extends BaseResource {
  // Search procedure codes
  async searchProcedureCodes(params) {
    return this.client.get(this.buildEndpoint('/reference/order/cpt'), params);
  }

  // Get procedure code by ID
  async getProcedureCode(cptCode) {
    return this.client.get(this.buildEndpoint(`/reference/order/cpt/${cptCode}`));
  }

  // Get CPT codes
  async getCPTCodes(params = {}) {
    return this.client.get(this.buildEndpoint('/misc/cptcodes'), params);
  }

  // Get ICD-10 codes
  async getICD10Codes(params) {
    return this.client.get(this.buildEndpoint('/reference/icd10'), params);
  }

  // Get SNOMED codes
  async getSNOMEDCodes(params) {
    return this.client.get(this.buildEndpoint('/reference/snomed'), params);
  }

  // Get LOINC codes
  async getLOINCCodes(params) {
    return this.client.get(this.buildEndpoint('/reference/loinc'), params);
  }

  // Get modifier codes
  async getModifierCodes() {
    return this.client.get(this.buildEndpoint('/misc/modifiers'));
  }

  // Get place of service codes
  async getPlaceOfServiceCodes() {
    return this.client.get(this.buildEndpoint('/misc/placeofservices'));
  }

  // Get diagnosis codes
  async searchDiagnosisCodes(params) {
    return this.client.get(this.buildEndpoint('/misc/diagnosiscodes'), params);
  }

  // Get NDC (National Drug Code)
  async searchNDCCodes(params) {
    return this.client.get(this.buildEndpoint('/reference/ndc'), params);
  }

  // Get RxNorm codes
  async searchRxNormCodes(params) {
    return this.client.get(this.buildEndpoint('/reference/rxnorm'), params);
  }

  // Get Procedure code with fee schedule
  async getProcedureCodeWithFee(params) {
    const schema = Joi.object({
      departmentid: Joi.number().required(),
      insurancepackageid: Joi.number().required(),
      procedurecode: Joi.string().required(),
    });
    const { error } = schema.validate(params);
    if (error) throw new Error(`Invalid input: ${error.message}`);
    return this.client.get(this.buildEndpoint('/feeschedules/checkprocedure'), params);
  }
}

module.exports = { ProcedureCodeResource };
