const { BaseResource } = require('@athena-api/core');
const Joi = require('joi');
const querystring =require( "querystring")

class PatientResource extends BaseResource {
  // Get patient by ID
  async getPatient(patientId, params = {}) {
    const schema = Joi.string().required();
    const { error } = schema.validate(patientId);
    if (error) {
      throw new Error(`Invalid patientId: ${error.message}`);
    }
    return this.client.get(this.buildEndpoint(`/patients/${patientId}`), params);
  }

  // Search patients
  async searchPatients(params) {
    return this.client.get(this.buildEndpoint('/patients'), params);
  }

  // Create new patient
  async createPatient(patientData) {
    const patient = querystring.parse(patientData);
    const schema = Joi.object({
      departmentid: Joi.number().required(),
      lastname: Joi.string().required(),
      firstname: Joi.string().required(),
      ssn: Joi.string().required(),
      dob: Joi.string().required(),
    }).required().unknown(true);
    const { error } = schema.validate(patient);
    if (error) {
      throw new Error(`Invalid patient data: ${error.message}`);
    }
    return this.client.post(this.buildEndpoint('/patients'), patientData);
  }

  // Update patient
  async updatePatient(patientId, patientData) {
    return this.client.put(this.buildEndpoint(`/patients/${patientId}`), patientData);
  }

  // Delete patient
  async deletePatient(patientId) {
    const schema = Joi.string().required();
    const { error } = schema.validate(patientId);
    if (error) {
      throw new Error(`Invalid patientId: ${error.message}`);
    }
    return this.client.delete(this.buildEndpoint(`/patients/${patientId}`));
  }

  // Get patient chart
  async getPatientChart(patientId, departmentId) {
    return this.client.get(
      this.buildEndpoint(`/patients/${patientId}/chart`),
      { departmentid: departmentId },
    );
  }

  // Get patient problems
  async getPatientProblems(patientId, params = {}) {
    return this.client.get(this.buildEndpoint(`/chart/${patientId}/problems`), params);
  }

  // Create patient problem
  async createPatientProblem(patientId, problemData) {
    return this.client.post(this.buildEndpoint(`/chart/${patientId}/problems`), problemData);
  }

  // Update patient problem
  async updatePatientProblem(patientId, problemId, problemData) {
    return this.client.put(
      this.buildEndpoint(`/chart/${patientId}/problems/${problemId}`),
      problemData,
    );
  }

  // Delete patient problem
  async deletePatientProblem(patientId, problemId) {
    return this.client.delete(this.buildEndpoint(`/chart/${patientId}/problems/${problemId}`));
  }

  // Get patient medications
  async getPatientMedications(patientId, params = {}) {
    return this.client.get(this.buildEndpoint(`/chart/${patientId}/medications`), params);
  }

  // Get patient allergies
  async getPatientAllergies(patientId) {
    return this.client.get(this.buildEndpoint(`/chart/${patientId}/allergies`));
  }

  // Create patient allergy
  async createPatientAllergy(patientId, allergyData) {
    return this.client.post(this.buildEndpoint(`/chart/${patientId}/allergies`), allergyData);
  }

  // Delete patient allergy
  async deletePatientAllergy(patientId, allergyId) {
    return this.client.delete(this.buildEndpoint(`/chart/${patientId}/allergies/${allergyId}`));
  }

  // Get patient immunizations
  async getPatientImmunizations(patientId) {
    return this.client.get(this.buildEndpoint(`/chart/${patientId}/immunizations`));
  }

  // Get patient vitals
  async getPatientVitals(patientId, params = {}) {
    return this.client.get(this.buildEndpoint(`/chart/${patientId}/vitals`), params);
  }

  // Get patient lab results
  async getPatientLabResults(patientId, params = {}) {
    return this.client.get(this.buildEndpoint(`/patients/${patientId}/labresults`), params);
  }

  // Get patient documents
  async getPatientDocuments(patientId, params = {}) {
    return this.client.get(this.buildEndpoint(`/patients/${patientId}/documents`), params);
  }

  // Get patient insurance
  async getPatientInsurance(patientId) {
    return this.client.get(this.buildEndpoint(`/patients/${patientId}/insurances`));
  }

  // Create patient insurance
  async createPatientInsurance(patientId, insuranceData) {
    return this.client.post(
      this.buildEndpoint(`/patients/${patientId}/insurances`),
      insuranceData,
    );
  }

  // Update patient insurance
  async updatePatientInsurance(patientId, insuranceId, insuranceData) {
    return this.client.put(
      this.buildEndpoint(`/patients/${patientId}/insurances/${insuranceId}`),
      insuranceData,
    );
  }

  // Delete patient insurance
  async deletePatientInsurance(patientId, insuranceId) {
    return this.client.delete(
      this.buildEndpoint(`/patients/${patientId}/insurances/${insuranceId}`),
    );
  }

  // Get patient balance
  async getPatientBalance(patientId, departmentId) {
    return this.client.get(
      this.buildEndpoint(`/patients/${patientId}/collectionsbalance`),
      { departmentid: departmentId },
    );
  }

  // Get patient appointments
  async getPatientAppointments(patientId, params = {}) {
    return this.client.get(this.buildEndpoint(`/patients/${patientId}/appointments`), params);
  }

  // Get patient cases
  async getPatientCases(patientId, params = {}) {
    return this.client.get(this.buildEndpoint(`/patients/${patientId}/patientcases`), params);
  }

  // Get patient social history
  async getPatientSocialHistory(patientId, params = {}) {
    return this.client.get(this.buildEndpoint(`/chart/${patientId}/socialhistory`), params);
  }

  // Update patient social history
  async updatePatientSocialHistory(patientId, socialHistoryData) {
    return this.client.put(
      this.buildEndpoint(`/chart/${patientId}/socialhistory`),
      socialHistoryData,
    );
  }

  // Get patient pharmacy preferences
  async getPatientPharmacy(patientId) {
    return this.client.get(this.buildEndpoint(`/patients/${patientId}/preferredpharmacies`));
  }

  // Set patient preferred pharmacy
  async setPatientPharmacy(patientId, pharmacyData) {
    return this.client.put(
      this.buildEndpoint(`/patients/${patientId}/preferredpharmacies`),
      pharmacyData,
    );
  }
}

module.exports = { PatientResource };
