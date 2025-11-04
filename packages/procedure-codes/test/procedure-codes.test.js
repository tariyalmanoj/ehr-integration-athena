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
      
      expect(mockClient.get).toHaveBeenCalledWith(
        '/v1/195900/reference/order/cpt',
        params
      );
    });
  });

  describe('getProcedureCode', () => {
    test('should get procedure code by CPT code', async () => {
      mockClient.get.mockResolvedValue({ cptcode: '99213' });
      
      await procedureCodes.getProcedureCode('99213');
      
      expect(mockClient.get).toHaveBeenCalledWith(
        '/v1/195900/reference/order/cpt/99213'
      );
    });
  });

  describe('getICD10Codes', () => {
    test('should search ICD-10 codes', async () => {
      const params = { searchvalue: 'diabetes' };
      mockClient.get.mockResolvedValue({ icd10codes: [] });
      
      await procedureCodes.getICD10Codes(params);
      
      expect(mockClient.get).toHaveBeenCalledWith(
        '/v1/195900/reference/icd10',
        params
      );
    });
  });

  describe('getModifierCodes', () => {
    test('should get modifier codes', async () => {
      mockClient.get.mockResolvedValue({ modifiers: [] });
      
      await procedureCodes.getModifierCodes();
      
      expect(mockClient.get).toHaveBeenCalledWith(
        '/v1/195900/misc/modifiers'
      );
    });
  });

  describe('searchDiagnosisCodes', () => {
    test('should search diagnosis codes', async () => {
      const params = { searchvalue: 'E11' };
      mockClient.get.mockResolvedValue({ diagnosiscodes: [] });
      
      await procedureCodes.searchDiagnosisCodes(params);
      
      expect(mockClient.get).toHaveBeenCalledWith(
        '/v1/195900/misc/diagnosiscodes',
        params
      );
    });
  });
});
