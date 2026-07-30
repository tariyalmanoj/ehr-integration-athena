const { ClaimResource } = require('../src/index');
const querystring = require('querystring');

const mockClient = {
  practiceId: '195900',
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
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
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/claims/123', {});
    });

    test('should get claim with params', async () => {
      mockClient.get.mockResolvedValue({ claimid: '123' });
      await claims.getClaim('123', { showclaims: true });
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/claims/123', { showclaims: true });
    });

    test('should reject invalid claimId', async () => {
      await expect(claims.getClaim(undefined)).rejects.toThrow('Invalid claimId');
    });
  });

  describe('listClaims', () => {
    test('should list claims', async () => {
      const params = { departmentid: '1' };
      mockClient.get.mockResolvedValue({ claims: [] });
      await claims.listClaims(params);
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/claims', params);
    });

    test('should list claims with default empty params', async () => {
      mockClient.get.mockResolvedValue({ claims: [] });
      await claims.listClaims();
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/claims', {});
    });
  });

  describe('createClaim', () => {
    test('should create claim', async () => {
      const claimData = {
        patientid: '123',
        departmentid: '1',
        supervisingproviderid: '45',
        claimcharges: [{ procedurecode: '2343', icd10code1: 'ES' }],
      };
      mockClient.post.mockResolvedValue({ claimid: '456' });
      await claims.createClaim(claimData);
      expect(mockClient.post).toHaveBeenCalledWith('/v1/195900/claims', claimData);
    });

    test('should create claim from querystring body', async () => {
      const claimcharges = JSON.stringify([{ procedurecode: '99213', icd10code1: 'E11.9' }]);
      const claimData = querystring.stringify({
        patientid: '123',
        departmentid: '1',
        supervisingproviderid: '45',
        claimcharges,
      });
      mockClient.post.mockResolvedValue({ claimid: '789' });
      await claims.createClaim(claimData);
      expect(mockClient.post).toHaveBeenCalledWith('/v1/195900/claims', claimData);
    });

    test('should reject createClaim missing required fields', async () => {
      await expect(claims.createClaim({ patientid: '123' })).rejects.toThrow('Invalid claimData');
    });

    test('should reject createClaim with empty claimcharges', async () => {
      await expect(
        claims.createClaim({
          patientid: '123',
          departmentid: '1',
          supervisingproviderid: '45',
          claimcharges: [],
        }),
      ).rejects.toThrow('Invalid claimData');
    });

    test('should reject createClaim with incomplete charge', async () => {
      await expect(
        claims.createClaim({
          patientid: '123',
          departmentid: '1',
          supervisingproviderid: '45',
          claimcharges: [{ procedurecode: '99213' }],
        }),
      ).rejects.toThrow('Invalid claimData');
    });
  });

  describe('updateClaim', () => {
    test('should update claim', async () => {
      const claimData = { notes: 'updated' };
      mockClient.put.mockResolvedValue({ success: true });
      await claims.updateClaim('123', claimData);
      expect(mockClient.put).toHaveBeenCalledWith('/v1/195900/claims/123', claimData);
    });

    test('should reject invalid claimId on update', async () => {
      await expect(claims.updateClaim(null, {})).rejects.toThrow('Invalid claimId');
    });
  });

  describe('deleteClaim', () => {
    test('should delete claim', async () => {
      mockClient.delete.mockResolvedValue({ success: true });
      await claims.deleteClaim('123');
      expect(mockClient.delete).toHaveBeenCalledWith('/v1/195900/claims/123');
    });

    test('should reject invalid claimId on delete', async () => {
      await expect(claims.deleteClaim(undefined)).rejects.toThrow('Invalid claimId');
    });
  });

  describe('submitClaim', () => {
    test('should submit claim', async () => {
      mockClient.post.mockResolvedValue({ success: true });
      await claims.submitClaim('123');
      expect(mockClient.post).toHaveBeenCalledWith('/v1/195900/claims/123/submit');
    });
  });

  describe('resubmitClaim', () => {
    test('should resubmit claim', async () => {
      mockClient.post.mockResolvedValue({ success: true });
      await claims.resubmitClaim('123');
      expect(mockClient.post).toHaveBeenCalledWith('/v1/195900/claims/123/resubmit');
    });
  });

  describe('voidClaim', () => {
    test('should void claim', async () => {
      const voidData = { reason: 'duplicate' };
      mockClient.post.mockResolvedValue({ success: true });
      await claims.voidClaim('123', voidData);
      expect(mockClient.post).toHaveBeenCalledWith('/v1/195900/claims/123/void', voidData);
    });

    test('should void claim with default empty body', async () => {
      mockClient.post.mockResolvedValue({ success: true });
      await claims.voidClaim('123');
      expect(mockClient.post).toHaveBeenCalledWith('/v1/195900/claims/123/void', {});
    });
  });

  describe('getPatientClaims', () => {
    test('should get patient claims', async () => {
      mockClient.get.mockResolvedValue({ claims: [] });
      await claims.getPatientClaims('123');
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/patients/123/claims', {});
    });
  });

  describe('getClosedPatientClaims', () => {
    test('should get closed patient claims', async () => {
      const params = { departmentid: '1' };
      mockClient.get.mockResolvedValue({ claims: [] });
      await claims.getClosedPatientClaims('123', params);
      expect(mockClient.get).toHaveBeenCalledWith(
        '/v1/195900/patients/123/claims/closed',
        params,
      );
    });

    test('should get closed patient claims with default params', async () => {
      mockClient.get.mockResolvedValue({ claims: [] });
      await claims.getClosedPatientClaims('123');
      expect(mockClient.get).toHaveBeenCalledWith(
        '/v1/195900/patients/123/claims/closed',
        {},
      );
    });
  });

  describe('getClaimStatus', () => {
    test('should get claim status', async () => {
      mockClient.get.mockResolvedValue({ status: 'BILLED' });
      await claims.getClaimStatus('123');
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/claims/123/status');
    });
  });

  describe('getClaimNotes', () => {
    test('should get claim notes', async () => {
      mockClient.get.mockResolvedValue({ notes: [] });
      await claims.getClaimNotes('123');
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/claims/123/notes');
    });
  });

  describe('addClaimNote', () => {
    test('should add claim note', async () => {
      const noteData = { note: 'Follow up required' };
      mockClient.post.mockResolvedValue({ noteid: '1' });
      await claims.addClaimNote('123', noteData);
      expect(mockClient.post).toHaveBeenCalledWith('/v1/195900/claims/123/notes', noteData);
    });
  });

  describe('getClaimDenials', () => {
    test('should get claim denials', async () => {
      const params = { startdate: '01/01/2025' };
      mockClient.get.mockResolvedValue({ denials: [] });
      await claims.getClaimDenials(params);
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/claims/denials', params);
    });

    test('should get claim denials with default params', async () => {
      mockClient.get.mockResolvedValue({ denials: [] });
      await claims.getClaimDenials();
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/claims/denials', {});
    });
  });

  describe('updateClaimDenial', () => {
    test('should update claim denial', async () => {
      const denialData = { status: 'appealed' };
      mockClient.put.mockResolvedValue({ success: true });
      await claims.updateClaimDenial('123', denialData);
      expect(mockClient.put).toHaveBeenCalledWith('/v1/195900/claims/123/denial', denialData);
    });
  });

  describe('getClaimAttachments', () => {
    test('should get claim attachments', async () => {
      mockClient.get.mockResolvedValue({ attachments: [] });
      await claims.getClaimAttachments('123');
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/claims/123/attachments');
    });
  });

  describe('uploadClaimAttachment', () => {
    test('should upload claim attachment', async () => {
      const attachmentData = { attachmentcontents: 'base64' };
      mockClient.post.mockResolvedValue({ attachmentid: '1' });
      await claims.uploadClaimAttachment('123', attachmentData);
      expect(mockClient.post).toHaveBeenCalledWith(
        '/v1/195900/claims/123/attachments',
        attachmentData,
      );
    });
  });

  describe('getChangedClaims', () => {
    test('should get changed claims', async () => {
      const params = { leaveunprocessed: false };
      mockClient.get.mockResolvedValue({ claims: [] });
      await claims.getChangedClaims(params);
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/claims/changed', params);
    });
  });
});
