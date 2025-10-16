const { ClaimResource } = require('../src/index');

const mockClient = {
  practiceId: '195900',
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
};

describe('ClaimResource', () => {
  let claims;

  beforeEach(() => {
    claims = new ClaimResource(mockClient);
    jest.clearAllMocks();
  });

  describe('getClaim', () => {
    test('should get claim by ID', async () => {
      mockClient.get.mockResolvedValue({ claimid: '123' });
      
      await claims.getClaim('123');
      
      expect(mockClient.get).toHaveBeenCalledWith(
        '/v1/195900/claims/123',
        {}
      );
    });
  });

  describe('listClaims', () => {
    test('should list claims', async () => {
      const params = { departmentid: '1' };
      mockClient.get.mockResolvedValue({ claims: [] });
      
      await claims.listClaims(params);
      
      expect(mockClient.get).toHaveBeenCalledWith(
        '/v1/195900/claims',
        params
      );
    });
  });

  describe('createClaim', () => {
    test('should create claim', async () => {
      const claimData = { patientid: '123', departmentid: '1' };
      mockClient.post.mockResolvedValue({ claimid: '456' });
      
      await claims.createClaim(claimData);
      
      expect(mockClient.post).toHaveBeenCalledWith(
        '/v1/195900/claims',
        claimData
      );
    });
  });

  describe('submitClaim', () => {
    test('should submit claim', async () => {
      mockClient.post.mockResolvedValue({ success: true });
      
      await claims.submitClaim('123');
      
      expect(mockClient.post).toHaveBeenCalledWith(
        '/v1/195900/claims/123/submit'
      );
    });
  });

  describe('voidClaim', () => {
    test('should void claim', async () => {
      const voidData = { reason: 'duplicate' };
      mockClient.post.mockResolvedValue({ success: true });
      
      await claims.voidClaim('123', voidData);
      
      expect(mockClient.post).toHaveBeenCalledWith(
        '/v1/195900/claims/123/void',
        voidData
      );
    });
  });

  describe('getPatientClaims', () => {
    test('should get patient claims', async () => {
      mockClient.get.mockResolvedValue({ claims: [] });
      
      await claims.getPatientClaims('123');
      
      expect(mockClient.get).toHaveBeenCalledWith(
        '/v1/195900/patients/123/claims',
        {}
      );
    });
  });

  describe('addClaimNote', () => {
    test('should add claim note', async () => {
      const noteData = { note: 'Follow up required' };
      mockClient.post.mockResolvedValue({ noteid: '1' });
      
      await claims.addClaimNote('123', noteData);
      
      expect(mockClient.post).toHaveBeenCalledWith(
        '/v1/195900/claims/123/notes',
        noteData
      );
    });
  });
});
