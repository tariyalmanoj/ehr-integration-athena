const { EncounterResource } = require('../src/index');

const mockClient = {
  practiceId: '195900',
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
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

  test('should get encounter with params', async () => {
    mockClient.get.mockResolvedValue({ encounterid: '123' });
    await encounters.getEncounter('123', { showdiagnoses: true });
    expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/chart/encounter/123', {
      showdiagnoses: true,
    });
  });

  test('should get patient encounters', async () => {
    mockClient.get.mockResolvedValue({ encounters: [] });
    await encounters.getPatientEncounters('123');
    expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/patients/123/encounters', {});
  });

  test('should get patient encounters with params', async () => {
    const params = { departmentid: '1' };
    mockClient.get.mockResolvedValue({ encounters: [] });
    await encounters.getPatientEncounters('123', params);
    expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/patients/123/encounters', params);
  });

  test('should create encounter', async () => {
    const encounterData = { patientid: '123', departmentid: '1' };
    mockClient.post.mockResolvedValue({ encounterid: '456' });
    await encounters.createEncounter(encounterData);
    expect(mockClient.post).toHaveBeenCalledWith('/v1/195900/chart/encounter', encounterData);
  });

  test('should update encounter', async () => {
    const encounterData = { appointmentid: '99' };
    mockClient.put.mockResolvedValue({ success: true });
    await encounters.updateEncounter('123', encounterData);
    expect(mockClient.put).toHaveBeenCalledWith(
      '/v1/195900/chart/encounter/123',
      encounterData,
    );
  });

  test('should get encounter summary', async () => {
    mockClient.get.mockResolvedValue({ summary: 'ok' });
    await encounters.getEncounterSummary('123');
    expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/chart/encounter/123/summary');
  });

  test('should get encounter diagnoses', async () => {
    mockClient.get.mockResolvedValue({ diagnoses: [] });
    await encounters.getEncounterDiagnoses('123');
    expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/chart/encounter/123/diagnoses');
  });

  test('should add encounter diagnosis', async () => {
    const diagnosisData = { snomedcode: '44054006' };
    mockClient.post.mockResolvedValue({ diagnosisid: '1' });
    await encounters.addEncounterDiagnosis('123', diagnosisData);
    expect(mockClient.post).toHaveBeenCalledWith(
      '/v1/195900/chart/encounter/123/diagnoses',
      diagnosisData,
    );
  });

  test('should update encounter diagnosis', async () => {
    const diagnosisData = { note: 'updated' };
    mockClient.put.mockResolvedValue({ success: true });
    await encounters.updateEncounterDiagnosis('123', '1', diagnosisData);
    expect(mockClient.put).toHaveBeenCalledWith(
      '/v1/195900/chart/encounter/123/diagnoses/1',
      diagnosisData,
    );
  });

  test('should delete encounter diagnosis', async () => {
    mockClient.delete.mockResolvedValue({ success: true });
    await encounters.deleteEncounterDiagnosis('123', '1');
    expect(mockClient.delete).toHaveBeenCalledWith(
      '/v1/195900/chart/encounter/123/diagnoses/1',
    );
  });

  test('should get encounter orders', async () => {
    mockClient.get.mockResolvedValue({ orders: [] });
    await encounters.getEncounterOrders('123');
    expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/chart/encounter/123/orders');
  });

  test('should get changed encounters', async () => {
    const params = { leaveunprocessed: false };
    mockClient.get.mockResolvedValue({ encounters: [] });
    await encounters.getChangedEncounters(params);
    expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/chart/encounter/changed', params);
  });

  test('should sign encounter', async () => {
    mockClient.post.mockResolvedValue({ success: true });
    await encounters.signEncounter('123');
    expect(mockClient.post).toHaveBeenCalledWith('/v1/195900/chart/encounter/123/sign');
  });

  test('should get encounter vitals', async () => {
    mockClient.get.mockResolvedValue({ vitals: [] });
    await encounters.getEncounterVitals('123');
    expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/chart/encounter/123/vitals');
  });

  test('should add encounter vitals', async () => {
    const vitalsData = { readingtaken: '01/01/2025' };
    mockClient.post.mockResolvedValue({ success: true });
    await encounters.addEncounterVitals('123', vitalsData);
    expect(mockClient.post).toHaveBeenCalledWith(
      '/v1/195900/chart/encounter/123/vitals',
      vitalsData,
    );
  });
});
