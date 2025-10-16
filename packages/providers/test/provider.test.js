const { ProviderResource } = require('../src/index');

const mockClient = {
  practiceId: '195900',
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
};

describe('ProviderResource', () => {
  let providers;

  beforeEach(() => {
    providers = new ProviderResource(mockClient);
    jest.clearAllMocks();
  });

  // --- Provider CRUD Operations (No changes here) ---
  describe('Provider CRUD Operations', () => {
    test('should get provider by ID', async () => {
      mockClient.get.mockResolvedValue({ providerid: '1', firstname: 'Dr. John' });
      const result = await providers.getProvider('1');
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/providers/1', {});
      expect(result.providerid).toBe('1');
    });

    test('should list all providers', async () => {
      mockClient.get.mockResolvedValue({ providers: [] });
      await providers.listProviders({ limit: 10 });
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/providers', { limit: 10 });
    });

    test('should create provider', async () => {
      const providerData = { firstname: 'Dr. John', lastname: 'Smith', npi: '1234567890' };
      mockClient.post.mockResolvedValue({ providerid: '1' });
      const result = await providers.createProvider(providerData);
      expect(mockClient.post).toHaveBeenCalledWith('/v1/195900/providers', providerData);
      expect(result.providerid).toBe('1');
    });

    test('should update provider', async () => {
      const providerData = { firstname: 'Dr. Jane' };
      mockClient.put.mockResolvedValue({ success: true });
      await providers.updateProvider('1', providerData);
      expect(mockClient.put).toHaveBeenCalledWith('/v1/195900/providers/1', providerData);
    });

    test('should delete provider', async () => {
      mockClient.delete.mockResolvedValue({ success: true });
      await providers.deleteProvider('1');
      expect(mockClient.delete).toHaveBeenCalledWith('/v1/195900/providers/1');
    });
  });

  // --- Other Provider Methods (No changes here) ---
  describe('Provider Schedule', () => {
    test('should get provider schedule', async () => {
      const params = { startdate: '2025-10-01', enddate: '2025-10-10' };
      mockClient.get.mockResolvedValue({ appointments: [] });
      await providers.getProviderSchedule('1', params);
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/providers/1/appointments', params);
    });
  });

  describe('Provider Specialties', () => {
    test('should get provider specialties', async () => {
      mockClient.get.mockResolvedValue({ specialties: [] });
      await providers.getProviderSpecialties();
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/customfields/specialty');
    });
  });

  describe('Changed Providers', () => {
    test('should get changed providers', async () => {
      const params = { leaveunprocessed: false };
      mockClient.get.mockResolvedValue({ providers: [] });
      await providers.getChangedProviders(params);
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/providers/changed', params);
    });
  });

  // --- Referring Providers (CORRECTED TESTS) ---
  describe('Referring Providers', () => {
    test('should get referring providers', async () => {
      mockClient.get.mockResolvedValue({ referringproviders: [] });
      await providers.getReferringProviders();
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/referringproviders', {});
    });

    test('should get referring providers with search', async () => {
      const params = { searchvalue: 'Smith' };
      mockClient.get.mockResolvedValue({ referringproviders: [] });
      await providers.getReferringProviders(params);
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/referringproviders', params);
    });

    test('should get referring provider by ID', async () => {
      mockClient.get.mockResolvedValue({ referringproviderid: '1' });
      await providers.getReferringProvider('1');
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/referringproviders/1');
    });

    // ⭐️ FIX #1: Called createReferringProvider instead of createProvider
    test('should create referring provider', async () => {
      const providerData = { firstname: 'Dr. Jane', lastname: 'Doe' };
      mockClient.post.mockResolvedValue({ referringproviderid: '1' });
      
      await providers.createReferringProvider(providerData); // Corrected method
      
      expect(mockClient.post).toHaveBeenCalledWith('/v1/195900/referringproviders', providerData);
    });

    // ⭐️ FIX #2: Called updateReferringProvider instead of updateProvider
    test('should update referring provider', async () => {
      const providerData = { phone: '555-1234' };
      mockClient.put.mockResolvedValue({ success: true });
      
      await providers.updateReferringProvider('1', providerData); // Corrected method
      
      expect(mockClient.put).toHaveBeenCalledWith('/v1/195900/referringproviders/1', providerData);
    });

    // ⭐️ FIX #3: Called deleteReferringProvider instead of deleteProvider
    test('should delete referring provider', async () => {
      mockClient.delete.mockResolvedValue({ success: true });
      
      await providers.deleteReferringProvider('1'); // Corrected method
      
      expect(mockClient.delete).toHaveBeenCalledWith('/v1/195900/referringproviders/1');
    });
  });

  describe('Provider Portal Enrollment', () => {
    test('should get provider portal enrollment', async () => {
      mockClient.get.mockResolvedValue({ enrolled: true });
      await providers.getProviderPortalEnrollment('1');
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/providers/1/portalenrollment');
    });
  });
});
