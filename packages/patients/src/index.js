const { BaseResource } = require('@athena-api/core');
const Joi = require('joi');
const querystring = require('querystring');

/**
 * Validates that a value is a non-empty string
 * @param {*} value - Value to validate
 * @returns {boolean} True if valid string, false otherwise
 */
function isValidString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validates that a value is a positive integer or numeric string
 * @param {*} value - Value to validate
 * @returns {boolean} True if valid ID, false otherwise
 */
function isValidId(value) {
  if (typeof value === 'number') {
    return Number.isInteger(value) && value > 0;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return /^\d+$/.test(trimmed) && parseInt(trimmed, 10) > 0;
  }
  return false;
}

/**
 * Validates that a value is a valid object with at least one property
 * @param {*} value - Value to validate
 * @returns {boolean} True if valid object, false otherwise
 */
function isValidObject(value) {
  return typeof value === 'object' && value !== null && Object.keys(value).length > 0;
}

/**
 * Validates query parameters
 * @param {Object} params - Query parameters to validate
 * @returns {void}
 */
function validateParams(params) {
  if (params === undefined || params === null) {
    return;
  }
  
  if (typeof params !== 'object' || Array.isArray(params)) {
    throw new Error('Parameters must be an object');
  }
}

class PatientResource extends BaseResource {
  /**
   * Get patient by ID
   * @param {string|number} patientId - Patient identifier
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Patient data
   */
  async getPatient(patientId, params = {}) {
    // Validate patientId
    if (!isValidString(patientId) && !isValidId(patientId)) {
      throw new Error(`Invalid patientId: must be a non-empty string or positive integer`);
    }
    
    // Validate params
    validateParams(params);
    
    return this.client.get(this.buildEndpoint(`/patients/${patientId}`), params);
  }

  /**
   * Search patients
   * @param {Object} params - Search parameters (firstname, lastname, dob, etc.)
   * @returns {Promise<Object>} Search results
   */
  async searchPatients(params = {}) {
    validateParams(params);
    return this.client.get(this.buildEndpoint('/patients'), params);
  }

  /**
   * Create new patient
   * @param {Object|string} patientData - Patient data object or query string
   * @returns {Promise<Object>} Created patient data
   */
  async createPatient(patientData) {
    // Validate input
    if (!isValidObject(patientData) && !isValidString(patientData)) {
      throw new Error('Invalid patient data: must be a non-empty object or query string');
    }

    const patient = isValidString(patientData)
      ? querystring.parse(patientData)
      : { ...patientData };

    // Validate required fields
    const schema = Joi.object({
      departmentid: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
      lastname: Joi.string().required(),
      firstname: Joi.string().required(),
      ssn: Joi.string().required(),
      dob: Joi.string().required(),
    }).unknown(true);

    const { error } = schema.validate(patient);
    if (error) {
      throw new Error(`Invalid patient data: ${error.message}`);
    }

    return this.client.post(this.buildEndpoint('/patients'), patientData);
  }

  /**
   * Update patient
   * @param {string|number} patientId - Patient identifier
   * @param {Object} patientData - Patient data to update
   * @returns {Promise<Object>} Updated patient data
   */
  async updatePatient(patientId, patientData) {
    // Validate patientId
    if (!isValidString(patientId) && !isValidId(patientId)) {
      throw new Error(`Invalid patientId: must be a non-empty string or positive integer`);
    }

    // Validate patientData
    if (!isValidObject(patientData)) {
      throw new Error('Invalid patient data: must be a non-empty object');
    }

    return this.client.put(this.buildEndpoint(`/patients/${patientId}`), patientData);
  }

  /**
   * Delete patient
   * @param {string|number} patientId - Patient identifier
   * @returns {Promise<Object>} Deletion result
   */
  async deletePatient(patientId) {
    // Validate patientId
    if (!isValidString(patientId) && !isValidId(patientId)) {
      throw new Error(`Invalid patientId: must be a non-empty string or positive integer`);
    }

    return this.client.delete(this.buildEndpoint(`/patients/${patientId}`));
  }

  /**
   * Get patient chart
   * @param {string|number} patientId - Patient identifier
   * @param {string|number} departmentId - Department identifier
   * @returns {Promise<Object>} Patient chart data
   */
  async getPatientChart(patientId, departmentId) {
    // Validate inputs
    if (!isValidString(patientId) && !isValidId(patientId)) {
      throw new Error(`Invalid patientId: must be a non-empty string or positive integer`);
    }

    if (!isValidString(departmentId) && !isValidId(departmentId)) {
      throw new Error(`Invalid departmentId: must be a non-empty string or positive integer`);
    }

    return this.client.get(
      this.buildEndpoint(`/patients/${patientId}/chart`),
      { departmentid: departmentId },
    );
  }

  /**
   * Get patient problems
   * @param {string|number} patientId - Patient identifier
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Patient problems data
   */
  async getPatientProblems(patientId, params = {}) {
    // Validate inputs
    if (!isValidString(patientId) && !isValidId(patientId)) {
      throw new Error(`Invalid patientId: must be a non-empty string or positive integer`);
    }

    validateParams(params);

    return this.client.get(this.buildEndpoint(`/chart/${patientId}/problems`), params);
  }

  /**
   * Create patient problem
   * @param {string|number} patientId - Patient identifier
   * @param {Object} problemData - Problem data to create
   * @returns {Promise<Object>} Created problem data
   */
  async createPatientProblem(patientId, problemData) {
    // Validate inputs
    if (!isValidString(patientId) && !isValidId(patientId)) {
      throw new Error(`Invalid patientId: must be a non-empty string or positive integer`);
    }

    if (!isValidObject(problemData)) {
      throw new Error('Invalid problem data: must be a non-empty object');
    }

    return this.client.post(this.buildEndpoint(`/chart/${patientId}/problems`), problemData);
  }

  /**
   * Update patient problem
   * @param {string|number} patientId - Patient identifier
   * @param {string|number} problemId - Problem identifier
   * @param {Object} problemData - Problem data to update
   * @returns {Promise<Object>} Updated problem data
   */
  async updatePatientProblem(patientId, problemId, problemData) {
    // Validate inputs
    if (!isValidString(patientId) && !isValidId(patientId)) {
      throw new Error(`Invalid patientId: must be a non-empty string or positive integer`);
    }

    if (!isValidString(problemId) && !isValidId(problemId)) {
      throw new Error(`Invalid problemId: must be a non-empty string or positive integer`);
    }

    if (!isValidObject(problemData)) {
      throw new Error('Invalid problem data: must be a non-empty object');
    }

    return this.client.put(
      this.buildEndpoint(`/chart/${patientId}/problems/${problemId}`),
      problemData,
    );
  }

  /**
   * Delete patient problem
   * @param {string|number} patientId - Patient identifier
   * @param {string|number} problemId - Problem identifier
   * @returns {Promise<Object>} Deletion result
   */
  async deletePatientProblem(patientId, problemId) {
    // Validate inputs
    if (!isValidString(patientId) && !isValidId(patientId)) {
      throw new Error(`Invalid patientId: must be a non-empty string or positive integer`);
    }

    if (!isValidString(problemId) && !isValidId(problemId)) {
      throw new Error(`Invalid problemId: must be a non-empty string or positive integer`);
    }

    return this.client.delete(this.buildEndpoint(`/chart/${patientId}/problems/${problemId}`));
  }

  /**
   * Get patient medications
   * @param {string|number} patientId - Patient identifier
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Patient medications data
   */
  async getPatientMedications(patientId, params = {}) {
    // Validate inputs
    if (!isValidString(patientId) && !isValidId(patientId)) {
      throw new Error(`Invalid patientId: must be a non-empty string or positive integer`);
    }

    validateParams(params);

    return this.client.get(this.buildEndpoint(`/chart/${patientId}/medications`), params);
  }

  /**
   * Get patient allergies
   * @param {string|number} patientId - Patient identifier
   * @returns {Promise<Object>} Patient allergies data
   */
  async getPatientAllergies(patientId) {
    // Validate inputs
    if (!isValidString(patientId) && !isValidId(patientId)) {
      throw new Error(`Invalid patientId: must be a non-empty string or positive integer`);
    }

    return this.client.get(this.buildEndpoint(`/chart/${patientId}/allergies`));
  }

  /**
   * Create patient allergy
   * @param {string|number} patientId - Patient identifier
   * @param {Object} allergyData - Allergy data to create
   * @returns {Promise<Object>} Created allergy data
   */
  async createPatientAllergy(patientId, allergyData) {
    // Validate inputs
    if (!isValidString(patientId) && !isValidId(patientId)) {
      throw new Error(`Invalid patientId: must be a non-empty string or positive integer`);
    }

    if (!isValidObject(allergyData)) {
      throw new Error('Invalid allergy data: must be a non-empty object');
    }

    return this.client.post(this.buildEndpoint(`/chart/${patientId}/allergies`), allergyData);
  }

  /**
   * Delete patient allergy
   * @param {string|number} patientId - Patient identifier
   * @param {string|number} allergyId - Allergy identifier
   * @returns {Promise<Object>} Deletion result
   */
  async deletePatientAllergy(patientId, allergyId) {
    // Validate inputs
    if (!isValidString(patientId) && !isValidId(patientId)) {
      throw new Error(`Invalid patientId: must be a non-empty string or positive integer`);
    }

    if (!isValidString(allergyId) && !isValidId(allergyId)) {
      throw new Error(`Invalid allergyId: must be a non-empty string or positive integer`);
    }

    return this.client.delete(this.buildEndpoint(`/chart/${patientId}/allergies/${allergyId}`));
  }

  /**
   * Get patient immunizations
   * @param {string|number} patientId - Patient identifier
   * @returns {Promise<Object>} Patient immunizations data
   */
  async getPatientImmunizations(patientId) {
    // Validate inputs
    if (!isValidString(patientId) && !isValidId(patientId)) {
      throw new Error(`Invalid patientId: must be a non-empty string or positive integer`);
    }

    return this.client.get(this.buildEndpoint(`/chart/${patientId}/immunizations`));
  }

  /**
   * Get patient vitals
   * @param {string|number} patientId - Patient identifier
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Patient vitals data
   */
  async getPatientVitals(patientId, params = {}) {
    // Validate inputs
    if (!isValidString(patientId) && !isValidId(patientId)) {
      throw new Error(`Invalid patientId: must be a non-empty string or positive integer`);
    }

    validateParams(params);

    return this.client.get(this.buildEndpoint(`/chart/${patientId}/vitals`), params);
  }

  /**
   * Get patient lab results
   * @param {string|number} patientId - Patient identifier
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Lab results data
   */
  async getPatientLabResults(patientId, params = {}) {
    // Validate inputs
    if (!isValidString(patientId) && !isValidId(patientId)) {
      throw new Error(`Invalid patientId: must be a non-empty string or positive integer`);
    }

    validateParams(params);

    return this.client.get(this.buildEndpoint(`/patients/${patientId}/labresults`), params);
  }

  /**
   * Get patient documents
   * @param {string|number} patientId - Patient identifier
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Patient documents data
   */
  async getPatientDocuments(patientId, params = {}) {
    // Validate inputs
    if (!isValidString(patientId) && !isValidId(patientId)) {
      throw new Error(`Invalid patientId: must be a non-empty string or positive integer`);
    }

    validateParams(params);

    return this.client.get(this.buildEndpoint(`/patients/${patientId}/documents`), params);
  }

  /**
   * Get patient insurance
   * @param {string|number} patientId - Patient identifier
   * @returns {Promise<Object>} Patient insurance data
   */
  async getPatientInsurance(patientId) {
    // Validate inputs
    if (!isValidString(patientId) && !isValidId(patientId)) {
      throw new Error(`Invalid patientId: must be a non-empty string or positive integer`);
    }

    return this.client.get(this.buildEndpoint(`/patients/${patientId}/insurances`));
  }

  /**
   * Create patient insurance
   * @param {string|number} patientId - Patient identifier
   * @param {Object} insuranceData - Insurance data to create
   * @returns {Promise<Object>} Created insurance data
   */
  async createPatientInsurance(patientId, insuranceData) {
    // Validate inputs
    if (!isValidString(patientId) && !isValidId(patientId)) {
      throw new Error(`Invalid patientId: must be a non-empty string or positive integer`);
    }

    if (!isValidObject(insuranceData)) {
      throw new Error('Invalid insurance data: must be a non-empty object');
    }

    return this.client.post(
      this.buildEndpoint(`/patients/${patientId}/insurances`),
      insuranceData,
    );
  }

  /**
   * Update patient insurance
   * @param {string|number} patientId - Patient identifier
   * @param {string|number} insuranceId - Insurance identifier
   * @param {Object} insuranceData - Insurance data to update
   * @returns {Promise<Object>} Updated insurance data
   */
  async updatePatientInsurance(patientId, insuranceId, insuranceData) {
    // Validate inputs
    if (!isValidString(patientId) && !isValidId(patientId)) {
      throw new Error(`Invalid patientId: must be a non-empty string or positive integer`);
    }

    if (!isValidString(insuranceId) && !isValidId(insuranceId)) {
      throw new Error(`Invalid insuranceId: must be a non-empty string or positive integer`);
    }

    if (!isValidObject(insuranceData)) {
      throw new Error('Invalid insurance data: must be a non-empty object');
    }

    return this.client.put(
      this.buildEndpoint(`/patients/${patientId}/insurances/${insuranceId}`),
      insuranceData,
    );
  }

  /**
   * Delete patient insurance
   * @param {string|number} patientId - Patient identifier
   * @param {string|number} insuranceId - Insurance identifier
   * @returns {Promise<Object>} Deletion result
   */
  async deletePatientInsurance(patientId, insuranceId) {
    // Validate inputs
    if (!isValidString(patientId) && !isValidId(patientId)) {
      throw new Error(`Invalid patientId: must be a non-empty string or positive integer`);
    }

    if (!isValidString(insuranceId) && !isValidId(insuranceId)) {
      throw new Error(`Invalid insuranceId: must be a non-empty string or positive integer`);
    }

    return this.client.delete(
      this.buildEndpoint(`/patients/${patientId}/insurances/${insuranceId}`),
    );
  }

  /**
   * Get patient balance
   * @param {string|number} patientId - Patient identifier
   * @param {string|number} departmentId - Department identifier
   * @returns {Promise<Object>} Patient balance data
   */
  async getPatientBalance(patientId, departmentId) {
    // Validate inputs
    if (!isValidString(patientId) && !isValidId(patientId)) {
      throw new Error(`Invalid patientId: must be a non-empty string or positive integer`);
    }

    if (!isValidString(departmentId) && !isValidId(departmentId)) {
      throw new Error(`Invalid departmentId: must be a non-empty string or positive integer`);
    }

    return this.client.get(
      this.buildEndpoint(`/patients/${patientId}/collectionsbalance`),
      { departmentid: departmentId },
    );
  }

  /**
   * Get patient appointments
   * @param {string|number} patientId - Patient identifier
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Patient appointments data
   */
  async getPatientAppointments(patientId, params = {}) {
    // Validate inputs
    if (!isValidString(patientId) && !isValidId(patientId)) {
      throw new Error(`Invalid patientId: must be a non-empty string or positive integer`);
    }

    validateParams(params);

    return this.client.get(this.buildEndpoint(`/patients/${patientId}/appointments`), params);
  }

  /**
   * Get patient cases
   * @param {string|number} patientId - Patient identifier
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Patient cases data
   */
  async getPatientCases(patientId, params = {}) {
    // Validate inputs
    if (!isValidString(patientId) && !isValidId(patientId)) {
      throw new Error(`Invalid patientId: must be a non-empty string or positive integer`);
    }

    validateParams(params);

    return this.client.get(this.buildEndpoint(`/patients/${patientId}/patientcases`), params);
  }

  /**
   * Get patient social history
   * @param {string|number} patientId - Patient identifier
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Social history data
   */
  async getPatientSocialHistory(patientId, params = {}) {
    // Validate inputs
    if (!isValidString(patientId) && !isValidId(patientId)) {
      throw new Error(`Invalid patientId: must be a non-empty string or positive integer`);
    }

    validateParams(params);

    return this.client.get(this.buildEndpoint(`/chart/${patientId}/socialhistory`), params);
  }

  /**
   * Update patient social history
   * @param {string|number} patientId - Patient identifier
   * @param {Object} socialHistoryData - Social history data to update
   * @returns {Promise<Object>} Updated social history data
   */
  async updatePatientSocialHistory(patientId, socialHistoryData) {
    // Validate inputs
    if (!isValidString(patientId) && !isValidId(patientId)) {
      throw new Error(`Invalid patientId: must be a non-empty string or positive integer`);
    }

    if (!isValidObject(socialHistoryData)) {
      throw new Error('Invalid social history data: must be a non-empty object');
    }

    return this.client.put(
      this.buildEndpoint(`/chart/${patientId}/socialhistory`),
      socialHistoryData,
    );
  }

  /**
   * Get patient pharmacy preferences
   * @param {string|number} patientId - Patient identifier
   * @returns {Promise<Object>} Patient pharmacy data
   */
  async getPatientPharmacy(patientId) {
    // Validate inputs
    if (!isValidString(patientId) && !isValidId(patientId)) {
      throw new Error(`Invalid patientId: must be a non-empty string or positive integer`);
    }

    return this.client.get(this.buildEndpoint(`/patients/${patientId}/preferredpharmacies`));
  }

  /**
   * Set patient preferred pharmacy
   * @param {string|number} patientId - Patient identifier
   * @param {Object} pharmacyData - Pharmacy data to set
   * @returns {Promise<Object>} Updated pharmacy data
   */
  async setPatientPharmacy(patientId, pharmacyData) {
    // Validate inputs
    if (!isValidString(patientId) && !isValidId(patientId)) {
      throw new Error(`Invalid patientId: must be a non-empty string or positive integer`);
    }

    if (!isValidObject(pharmacyData)) {
      throw new Error('Invalid pharmacy data: must be a non-empty object');
    }

    return this.client.put(
      this.buildEndpoint(`/patients/${patientId}/preferredpharmacies`),
      pharmacyData,
    );
  }
}

module.exports = { PatientResource };
