const { InsuranceResource } = require('../src/index');

const mockClient = {
  practiceId: '195900',
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
};

describe('InsuranceResource', () => {
  let insurance;

  beforeEach(() => {
    insurance = new InsuranceResource(mockClient);
    jest.clearAllMocks();
  });

  describe('getInsurancePackages', () => {
    test('should get insurance packages', async () => {
      mockClient.get.mockResolvedValue({ insurancepackages: [] });
      
      await insurance.getInsurancePackages();
      
      expect(mockClient.get).toHaveBeenCalledWith(
        '/v1/195900/insurancepackages',
        {}
      );
    });
  });

  describe('getInsurancePackage', () => {
    test('should get insurance package by ID', async () => {
      mockClient.get.mockResolvedValue({ insurancepackageid: '1' });
      
      await insurance.getInsurancePackage('1');
      
      expect(mockClient.get).toHaveBeenCalledWith(
        '/v1/195900/insurancepackages/1'
      );
    });
  });

  describe('getPatientInsurance', () => {
    test('should get patient insurance', async () => {
      mockClient.get.mockResolvedValue({ insurances: [] });
      
      await insurance.getPatientInsurance('123');
      
      expect(mockClient.get).toHaveBeenCalledWith(
        '/v1/195900/patients/123/insurances',
        {}
      );
    });
  });

  describe('createPatientInsurance', () => {
    test('should create patient insurance', async () => {
      const insuranceData = { 
        insurancepackageid: '1',
        insurancepolicynumber: 'ABC123' 
      };
      mockClient.post.mockResolvedValue({ sequencenumber: 1 });
      
      await insurance.createPatientInsurance('123', insuranceData);
      
      expect(mockClient.post).toHaveBeenCalledWith(
        '/v1/195900/patients/123/insurances',
        insuranceData
      );
    });
  });

  describe('checkEligibility', () => {
    test('should check insurance eligibility', async () => {
      const eligibilityData = { 
        patientid: '123',
        departmentid: '1'
      };
      mockClient.post.mockResolvedValue({ eligible: true });
      
      await insurance.checkEligibility(eligibilityData);
      
      expect(mockClient.post).toHaveBeenCalledWith(
        '/v1/195900/eligibility/check',
        eligibilityData
      );
    });
  });

  describe('getEligibilityStatus', () => {
    test('should get eligibility check status', async () => {
      mockClient.get.mockResolvedValue({ status: 'complete' });
      
      await insurance.getEligibilityStatus('456');
      
      expect(mockClient.get).toHaveBeenCalledWith(
        '/v1/195900/eligibility/456'
      );
    });
  });

  describe('createAuthorization', () => {
    test('should create authorization', async () => {
      const authData = { 
        patientid: '123',
        authorizationnumber: 'AUTH123'
      };
      mockClient.post.mockResolvedValue({ authorizationid: '1' });
      
      await insurance.createAuthorization(authData);
      
      expect(mockClient.post).toHaveBeenCalledWith(
        '/v1/195900/authorizations',
        authData
      );
    });
  });

  describe('uploadInsuranceCardImage', () => {
    test('should upload insurance card image', async () => {
      const imageData = { image: 'base64data' };
      mockClient.post.mockResolvedValue({ success: true });
      
      await insurance.uploadInsuranceCardImage('123', 1, imageData);
      
      expect(mockClient.post).toHaveBeenCalledWith(
        '/v1/195900/patients/123/insurances/1/cardimages',
        imageData
      );
    });
  });
});
