const { EncounterResource } = require('../src/index');

const mockClient = {
  practiceId: '195900',
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
};

describe('EncounterResource', () => {
  let encounters;

  beforeEach(() => {
    encounters = new EncounterResource(mockClient);
    jest.clearAllMocks();
  });

  test('should get encounter by ID', async () => {
    mockClient.get.mockResolvedValue({ encounterid: '123' });
    await encounters.getEncounter('123');
    expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/chart/encounter/123', {});
  });

  test('should get patient encounters', async () => {
    mockClient.get.mockResolvedValue({ encounters: [] });
    await encounters.getPatientEncounters('123');
    expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/patients/123/encounters', {});
  });

  test('should create encounter', async () => {
    const encounterData = { patientid: '123', departmentid: '1' };
    mockClient.post.mockResolvedValue({ encounterid: '456' });
    await encounters.createEncounter(encounterData);
    expect(mockClient.post).toHaveBeenCalledWith('/v1/195900/chart/encounter', encounterData);
  });

  test('should sign encounter', async () => {
    mockClient.post.mockResolvedValue({ success: true });
    await encounters.signEncounter('123');
    expect(mockClient.post).toHaveBeenCalledWith('/v1/195900/chart/encounter/123/sign');
  });
});
