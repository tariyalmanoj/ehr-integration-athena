const { BaseResource } = require('@athena-api/core');
const Joi = require('joi');

class DepartmentResource extends BaseResource {
  // Get department by ID
  async getDepartment(departmentId, params = {}) {
    const schema = Joi.number().required();
    const { error } = schema.validate(departmentId);
    if (error) {
      throw new Error(`Invalid departmentId: ${error.message}`);
    }
    return this.client.get(this.buildEndpoint(`/departments/${departmentId}`), params);
  }

  // List all departments
  async listDepartments(params = {}) {
    return this.client.get(this.buildEndpoint('/departments'), params);
  }

  // Create department
  async createDepartment(departmentData) {
    return this.client.post(this.buildEndpoint('/departments'), departmentData);
  }

  // Update department
  async updateDepartment(departmentId, departmentData) {
    const schema = Joi.number().required();
    const { error } = schema.validate(departmentId);
    if (error) {
      throw new Error(`Invalid departmentId: ${error.message}`);
    }
    return this.client.put(
      this.buildEndpoint(`/departments/${departmentId}`),
      departmentData,
    );
  }

  // Get department facilities
  async getDepartmentFacilities(params = {}) {
    return this.client.get(this.buildEndpoint('/departments/facilities'), params);
  }

  // Get department insurance packages
  async getDepartmentInsurancePackages(departmentId) {
    const schema = Joi.number().required();
    const { error } = schema.validate(departmentId);
    if (error) {
      throw new Error(`Invalid departmentId: ${error.message}`);
    }
    return this.client.get(
      this.buildEndpoint(`/departments/${departmentId}/insurancepackages`),
    );
  }

  // Get practice information
  async getPracticeInfo() {
    return this.client.get(this.buildEndpoint('/practiceinfo'));
  }

  // Get department providers
  async getDepartmentProviders(departmentId, params = {}) {
    const schema = Joi.number().required();
    const { error } = schema.validate(departmentId);
    if (error) {
      throw new Error(`Invalid departmentId: ${error.message}`);
    }
    return this.client.get(
      this.buildEndpoint(`/departments/${departmentId}/providers`),
      params,
    );
  }

  // Get appointment types for department
  async getDepartmentAppointmentTypes(departmentId, params = {}) {
    const schema = Joi.number().required();
    const { error } = schema.validate(departmentId);
    if (error) {
      throw new Error(`Invalid departmentId: ${error.message}`);
    }
    return this.client.get(this.buildEndpoint('/appointmenttypes'), {
      departmentid: departmentId,
      ...params,
    });
  }
}

module.exports = { DepartmentResource };
