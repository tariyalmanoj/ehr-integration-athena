const { ProcedureCodeResource } = require('../src/index');

const mockClient = {
  practiceId: '195900',
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

describe('ProcedureCodeResource', () => {
  let procedureCodes;

  beforeEach(() => {
    procedureCodes = new ProcedureCodeResource(mockClient);
    jest.clearAllMocks();
  });

  describe('searchProcedureCodes', () => {
    test('should search procedure codes', async () => {
      const params = { searchvalue: '99213' };
      mockClient.get.mockResolvedValue({ cptcodes: [] });
      await procedureCodes.searchProcedureCodes(params);
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/reference/order/cpt', params);
    });
  });

  describe('getProcedureCode', () => {
    test('should get procedure code by CPT code', async () => {
      mockClient.get.mockResolvedValue({ cptcode: '99213' });
      await procedureCodes.getProcedureCode('99213');
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/reference/order/cpt/99213');
    });
  });

  describe('getCPTCodes', () => {
    test('should get CPT codes', async () => {
      const params = { searchvalue: '992' };
      mockClient.get.mockResolvedValue({ cptcodes: [] });
      await procedureCodes.getCPTCodes(params);
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/misc/cptcodes', params);
    });

    test('should get CPT codes with default params', async () => {
      mockClient.get.mockResolvedValue({ cptcodes: [] });
      await procedureCodes.getCPTCodes();
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/misc/cptcodes', {});
    });
  });

  describe('getICD10Codes', () => {
    test('should search ICD-10 codes', async () => {
      const params = { searchvalue: 'diabetes' };
      mockClient.get.mockResolvedValue({ icd10codes: [] });
      await procedureCodes.getICD10Codes(params);
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/reference/icd10', params);
    });
  });

  describe('getSNOMEDCodes', () => {
    test('should get SNOMED codes', async () => {
      const params = { searchvalue: 'diabetes' };
      mockClient.get.mockResolvedValue({ snomedcodes: [] });
      await procedureCodes.getSNOMEDCodes(params);
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/reference/snomed', params);
    });
  });

  describe('getLOINCCodes', () => {
    test('should get LOINC codes', async () => {
      const params = { searchvalue: 'glucose' };
      mockClient.get.mockResolvedValue({ loincodes: [] });
      await procedureCodes.getLOINCCodes(params);
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/reference/loinc', params);
    });
  });

  describe('getModifierCodes', () => {
    test('should get modifier codes', async () => {
      mockClient.get.mockResolvedValue({ modifiers: [] });
      await procedureCodes.getModifierCodes();
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/misc/modifiers');
    });
  });

  describe('getPlaceOfServiceCodes', () => {
    test('should get place of service codes', async () => {
      mockClient.get.mockResolvedValue({ placeofservices: [] });
      await procedureCodes.getPlaceOfServiceCodes();
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/misc/placeofservices');
    });
  });

  describe('searchDiagnosisCodes', () => {
    test('should search diagnosis codes', async () => {
      const params = { searchvalue: 'E11' };
      mockClient.get.mockResolvedValue({ diagnosiscodes: [] });
      await procedureCodes.searchDiagnosisCodes(params);
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/misc/diagnosiscodes', params);
    });
  });

  describe('searchNDCCodes', () => {
    test('should search NDC codes', async () => {
      const params = { searchvalue: '00002' };
      mockClient.get.mockResolvedValue({ ndccodes: [] });
      await procedureCodes.searchNDCCodes(params);
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/reference/ndc', params);
    });
  });

  describe('searchRxNormCodes', () => {
    test('should search RxNorm codes', async () => {
      const params = { searchvalue: 'metformin' };
      mockClient.get.mockResolvedValue({ rxnormcodes: [] });
      await procedureCodes.searchRxNormCodes(params);
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/reference/rxnorm', params);
    });
  });

  describe('getProcedureCodeWithFee', () => {
    test('should get procedure code with fee', async () => {
      const params = {
        departmentid: 1,
        insurancepackageid: 2,
        procedurecode: '99213',
      };
      mockClient.get.mockResolvedValue({ fee: 100 });
      await procedureCodes.getProcedureCodeWithFee(params);
      expect(mockClient.get).toHaveBeenCalledWith(
        '/v1/195900/feeschedules/checkprocedure',
        params,
      );
    });

    test('should reject missing required fee schedule fields', async () => {
      await expect(
        procedureCodes.getProcedureCodeWithFee({ departmentid: 1 }),
      ).rejects.toThrow('Invalid input');
    });
  });
});
