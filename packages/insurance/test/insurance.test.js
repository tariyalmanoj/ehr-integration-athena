const { InsuranceResource } = require('../src/index');

const mockClient = {
  practiceId: '195900',
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
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
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/insurancepackages', {});
    });

    test('should get insurance packages with params', async () => {
      const params = { insuranceplanname: 'Aetna' };
      mockClient.get.mockResolvedValue({ insurancepackages: [] });
      await insurance.getInsurancePackages(params);
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/insurancepackages', params);
    });
  });

  describe('getInsurancePackage', () => {
    test('should get insurance package by ID', async () => {
      mockClient.get.mockResolvedValue({ insurancepackageid: '1' });
      await insurance.getInsurancePackage('1');
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/insurancepackages/1');
    });
  });

  describe('createInsurancePackage', () => {
    test('should create insurance package', async () => {
      const packageData = { insuranceplanname: 'BCBS' };
      mockClient.post.mockResolvedValue({ insurancepackageid: '2' });
      await insurance.createInsurancePackage(packageData);
      expect(mockClient.post).toHaveBeenCalledWith(
        '/v1/195900/insurancepackages',
        packageData,
      );
    });
  });

  describe('updateInsurancePackage', () => {
    test('should update insurance package', async () => {
      const packageData = { insuranceplanname: 'Updated' };
      mockClient.put.mockResolvedValue({ success: true });
      await insurance.updateInsurancePackage('1', packageData);
      expect(mockClient.put).toHaveBeenCalledWith(
        '/v1/195900/insurancepackages/1',
        packageData,
      );
    });
  });

  describe('getPatientInsurance', () => {
    test('should get patient insurance', async () => {
      mockClient.get.mockResolvedValue({ insurances: [] });
      await insurance.getPatientInsurance('123');
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/patients/123/insurances', {});
    });

    test('should get patient insurance with params', async () => {
      const params = { showcancelled: false };
      mockClient.get.mockResolvedValue({ insurances: [] });
      await insurance.getPatientInsurance('123', params);
      expect(mockClient.get).toHaveBeenCalledWith(
        '/v1/195900/patients/123/insurances',
        params,
      );
    });
  });

  describe('getPatientInsuranceBySequence', () => {
    test('should get patient insurance by sequence', async () => {
      mockClient.get.mockResolvedValue({ sequencenumber: 1 });
      await insurance.getPatientInsuranceBySequence('123', 1);
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/patients/123/insurances/1');
    });
  });

  describe('createPatientInsurance', () => {
    test('should create patient insurance', async () => {
      const insuranceData = {
        insurancepackageid: '1',
        insurancepolicynumber: 'ABC123',
      };
      mockClient.post.mockResolvedValue({ sequencenumber: 1 });
      await insurance.createPatientInsurance('123', insuranceData);
      expect(mockClient.post).toHaveBeenCalledWith(
        '/v1/195900/patients/123/insurances',
        insuranceData,
      );
    });
  });

  describe('updatePatientInsurance', () => {
    test('should update patient insurance', async () => {
      const insuranceData = { insurancepolicynumber: 'XYZ' };
      mockClient.put.mockResolvedValue({ success: true });
      await insurance.updatePatientInsurance('123', 1, insuranceData);
      expect(mockClient.put).toHaveBeenCalledWith(
        '/v1/195900/patients/123/insurances/1',
        insuranceData,
      );
    });
  });

  describe('deletePatientInsurance', () => {
    test('should delete patient insurance', async () => {
      mockClient.delete.mockResolvedValue({ success: true });
      await insurance.deletePatientInsurance('123', 1);
      expect(mockClient.delete).toHaveBeenCalledWith('/v1/195900/patients/123/insurances/1');
    });
  });

  describe('checkEligibility', () => {
    test('should check insurance eligibility', async () => {
      const eligibilityData = { patientid: '123', departmentid: '1' };
      mockClient.post.mockResolvedValue({ eligible: true });
      await insurance.checkEligibility(eligibilityData);
      expect(mockClient.post).toHaveBeenCalledWith(
        '/v1/195900/eligibility/check',
        eligibilityData,
      );
    });
  });

  describe('getEligibilityStatus', () => {
    test('should get eligibility check status', async () => {
      mockClient.get.mockResolvedValue({ status: 'complete' });
      await insurance.getEligibilityStatus('456');
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/eligibility/456');
    });
  });

  describe('listEligibilityChecks', () => {
    test('should list eligibility checks', async () => {
      const params = { patientid: '123' };
      mockClient.get.mockResolvedValue({ eligibilitychecks: [] });
      await insurance.listEligibilityChecks(params);
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/eligibility', params);
    });

    test('should list eligibility checks with default params', async () => {
      mockClient.get.mockResolvedValue({ eligibilitychecks: [] });
      await insurance.listEligibilityChecks();
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/eligibility', {});
    });
  });

  describe('verifyPatientInsurance', () => {
    test('should verify patient insurance', async () => {
      const params = { departmentid: '1' };
      mockClient.get.mockResolvedValue({ verified: true });
      await insurance.verifyPatientInsurance('123', params);
      expect(mockClient.get).toHaveBeenCalledWith(
        '/v1/195900/patients/123/insurances/verify',
        params,
      );
    });

    test('should verify patient insurance with default params', async () => {
      mockClient.get.mockResolvedValue({ verified: true });
      await insurance.verifyPatientInsurance('123');
      expect(mockClient.get).toHaveBeenCalledWith(
        '/v1/195900/patients/123/insurances/verify',
        {},
      );
    });
  });

  describe('getAuthorization', () => {
    test('should get authorization', async () => {
      mockClient.get.mockResolvedValue({ authorizationid: '1' });
      await insurance.getAuthorization('1');
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/authorizations/1');
    });
  });

  describe('createAuthorization', () => {
    test('should create authorization', async () => {
      const authData = { patientid: '123', authorizationnumber: 'AUTH123' };
      mockClient.post.mockResolvedValue({ authorizationid: '1' });
      await insurance.createAuthorization(authData);
      expect(mockClient.post).toHaveBeenCalledWith('/v1/195900/authorizations', authData);
    });
  });

  describe('updateAuthorization', () => {
    test('should update authorization', async () => {
      const authData = { status: 'approved' };
      mockClient.put.mockResolvedValue({ success: true });
      await insurance.updateAuthorization('1', authData);
      expect(mockClient.put).toHaveBeenCalledWith('/v1/195900/authorizations/1', authData);
    });
  });

  describe('getPatientAuthorizations', () => {
    test('should get patient authorizations', async () => {
      const params = { departmentid: '1' };
      mockClient.get.mockResolvedValue({ authorizations: [] });
      await insurance.getPatientAuthorizations('123', params);
      expect(mockClient.get).toHaveBeenCalledWith(
        '/v1/195900/patients/123/authorizations',
        params,
      );
    });

    test('should get patient authorizations with default params', async () => {
      mockClient.get.mockResolvedValue({ authorizations: [] });
      await insurance.getPatientAuthorizations('123');
      expect(mockClient.get).toHaveBeenCalledWith(
        '/v1/195900/patients/123/authorizations',
        {},
      );
    });
  });

  describe('getInsuranceCardImages', () => {
    test('should get insurance card images', async () => {
      mockClient.get.mockResolvedValue({ images: [] });
      await insurance.getInsuranceCardImages('123', 1);
      expect(mockClient.get).toHaveBeenCalledWith(
        '/v1/195900/patients/123/insurances/1/cardimages',
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
        imageData,
      );
    });
  });
});
