const { BaseResource } = require('@athena-api/core');

class BillingResource extends BaseResource {
  // Get patient charges
  async getPatientCharges(patientId, params = {}) {
    return this.client.get(this.buildEndpoint(`/patients/${patientId}/charges`), params);
  }

  // Create charge
  async createCharge(chargeData) {
    return this.client.post(this.buildEndpoint('/charges'), chargeData);
  }

  // Update charge
  async updateCharge(chargeId, chargeData) {
    return this.client.put(this.buildEndpoint(`/charges/${chargeId}`), chargeData);
  }

  // Delete charge
  async deleteCharge(chargeId) {
    return this.client.delete(this.buildEndpoint(`/charges/${chargeId}`));
  }

  // Get patient payments
  async getPatientPayments(patientId, params = {}) {
    return this.client.get(this.buildEndpoint(`/patients/${patientId}/payments`), params);
  }

  // Record payment
  async recordPayment(paymentData) {
    return this.client.post(this.buildEndpoint('/payments'), paymentData);
  }

  // Get patient statements
  async getPatientStatements(patientId, params = {}) {
    return this.client.get(this.buildEndpoint(`/patients/${patientId}/statements`), params);
  }

  // Create patient statement
  async createStatement(statementData) {
    return this.client.post(this.buildEndpoint('/statements'), statementData);
  }

  // Get collections actions
  async getCollectionsActions(params = {}) {
    return this.client.get(this.buildEndpoint('/collectionsactions'), params);
  }

  // Get patient balance
  async getPatientBalance(patientId, departmentId) {
    return this.client.get(
      this.buildEndpoint(`/patients/${patientId}/collectionsbalance`),
      { departmentid: departmentId }
    );
  }

  // Get payment plans
  async getPaymentPlans(patientId) {
    return this.client.get(this.buildEndpoint(`/patients/${patientId}/paymentplans`));
  }

  // Create payment plan
  async createPaymentPlan(patientId, planData) {
    return this.client.post(
      this.buildEndpoint(`/patients/${patientId}/paymentplans`),
      planData
    );
  }

  // Get refunds
  async getRefunds(params = {}) {
    return this.client.get(this.buildEndpoint('/refunds'), params);
  }

  // Create refund
  async createRefund(refundData) {
    return this.client.post(this.buildEndpoint('/refunds'), refundData);
  }

  // Get adjustments
  async getAdjustments(params = {}) {
    return this.client.get(this.buildEndpoint('/adjustments'), params);
  }

  // Create adjustment
  async createAdjustment(adjustmentData) {
    return this.client.post(this.buildEndpoint('/adjustments'), adjustmentData);
  }

  // Get transaction details
  async getTransaction(transactionId) {
    return this.client.get(this.buildEndpoint(`/transactions/${transactionId}`));
  }

  // Get ERA (Electronic Remittance Advice)
  async getERA(eraId) {
    return this.client.get(this.buildEndpoint(`/eras/${eraId}`));
  }

  // List ERAs
  async listERAs(params = {}) {
    return this.client.get(this.buildEndpoint('/eras'), params);
  }
}

module.exports = { BillingResource };
