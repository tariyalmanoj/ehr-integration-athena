const { BaseResource } = require('@athena-api/core');

class EncounterResource extends BaseResource {
  // Get encounter
  async getEncounter(encounterId, params = {}) {
    return this.client.get(this.buildEndpoint(`/chart/encounter/${encounterId}`), params);
  }

  // Get patient encounters
  async getPatientEncounters(patientId, params = {}) {
    return this.client.get(
      this.buildEndpoint(`/patients/${patientId}/encounters`),
      params
    );
  }

  // Create encounter
  async createEncounter(encounterData) {
    return this.client.post(this.buildEndpoint('/chart/encounter'), encounterData);
  }

  // Update encounter
  async updateEncounter(encounterId, encounterData) {
    return this.client.put(
      this.buildEndpoint(`/chart/encounter/${encounterId}`),
      encounterData
    );
  }

  // Get encounter summary
  async getEncounterSummary(encounterId) {
    return this.client.get(this.buildEndpoint(`/chart/encounter/${encounterId}/summary`));
  }

  // Get encounter diagnoses
  async getEncounterDiagnoses(encounterId) {
    return this.client.get(
      this.buildEndpoint(`/chart/encounter/${encounterId}/diagnoses`)
    );
  }

  // Add encounter diagnosis
  async addEncounterDiagnosis(encounterId, diagnosisData) {
    return this.client.post(
      this.buildEndpoint(`/chart/encounter/${encounterId}/diagnoses`),
      diagnosisData
    );
  }

  // Update encounter diagnosis
  async updateEncounterDiagnosis(encounterId, diagnosisId, diagnosisData) {
    return this.client.put(
      this.buildEndpoint(`/chart/encounter/${encounterId}/diagnoses/${diagnosisId}`),
      diagnosisData
    );
  }

  // Delete encounter diagnosis
  async deleteEncounterDiagnosis(encounterId, diagnosisId) {
    return this.client.delete(
      this.buildEndpoint(`/chart/encounter/${encounterId}/diagnoses/${diagnosisId}`)
    );
  }

  // Get encounter orders
  async getEncounterOrders(encounterId) {
    return this.client.get(this.buildEndpoint(`/chart/encounter/${encounterId}/orders`));
  }

  // Get changed encounters
  async getChangedEncounters(params) {
    return this.client.get(this.buildEndpoint('/chart/encounter/changed'), params);
  }

  // Sign encounter
  async signEncounter(encounterId) {
    return this.client.post(this.buildEndpoint(`/chart/encounter/${encounterId}/sign`));
  }

  // Get encounter vitals
  async getEncounterVitals(encounterId) {
    return this.client.get(this.buildEndpoint(`/chart/encounter/${encounterId}/vitals`));
  }

  // Add encounter vitals
  async addEncounterVitals(encounterId, vitalsData) {
    return this.client.post(
      this.buildEndpoint(`/chart/encounter/${encounterId}/vitals`),
      vitalsData
    );
  }
}

module.exports = { EncounterResource };
