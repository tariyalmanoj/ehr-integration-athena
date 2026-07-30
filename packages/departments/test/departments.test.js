const { DepartmentResource } = require('../src/index');

const mockClient = {
  practiceId: '195900',
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
};

describe('DepartmentResource', () => {
  let departments;

  beforeEach(() => {
    departments = new DepartmentResource(mockClient);
    jest.clearAllMocks();
  });

  test('should get department by ID', async () => {
    mockClient.get.mockResolvedValue({ departmentid: '1' });
    await departments.getDepartment('1');
    expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/departments/1', {});
  });

  test('should get department with params', async () => {
    mockClient.get.mockResolvedValue({ departmentid: '1' });
    await departments.getDepartment(1, { showalldepartments: true });
    expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/departments/1', {
      showalldepartments: true,
    });
  });

  test('should reject invalid departmentId on get', async () => {
    await expect(departments.getDepartment('abc')).rejects.toThrow('Invalid departmentId');
  });

  test('should list all departments', async () => {
    mockClient.get.mockResolvedValue({ departments: [] });
    await departments.listDepartments();
    expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/departments', {});
  });

  test('should list departments with params', async () => {
    const params = { providerid: '10' };
    mockClient.get.mockResolvedValue({ departments: [] });
    await departments.listDepartments(params);
    expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/departments', params);
  });

  test('should create department', async () => {
    const departmentData = { name: 'Cardiology' };
    mockClient.post.mockResolvedValue({ departmentid: '2' });
    await departments.createDepartment(departmentData);
    expect(mockClient.post).toHaveBeenCalledWith('/v1/195900/departments', departmentData);
  });

  test('should update department', async () => {
    const departmentData = { name: 'Updated' };
    mockClient.put.mockResolvedValue({ success: true });
    await departments.updateDepartment(1, departmentData);
    expect(mockClient.put).toHaveBeenCalledWith('/v1/195900/departments/1', departmentData);
  });

  test('should reject invalid departmentId on update', async () => {
    await expect(departments.updateDepartment('xyz', {})).rejects.toThrow(
      'Invalid departmentId',
    );
  });

  test('should get department facilities', async () => {
    mockClient.get.mockResolvedValue({ facilities: [] });
    await departments.getDepartmentFacilities();
    expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/departments/facilities', {});
  });

  test('should get department insurance packages', async () => {
    mockClient.get.mockResolvedValue({ insurancepackages: [] });
    await departments.getDepartmentInsurancePackages(1);
    expect(mockClient.get).toHaveBeenCalledWith(
      '/v1/195900/departments/1/insurancepackages',
    );
  });

  test('should reject invalid departmentId for insurance packages', async () => {
    await expect(departments.getDepartmentInsurancePackages('bad')).rejects.toThrow(
      'Invalid departmentId',
    );
  });

  test('should get practice info', async () => {
    mockClient.get.mockResolvedValue({ practiceid: '195900' });
    await departments.getPracticeInfo();
    expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/practiceinfo');
  });

  test('should get department providers', async () => {
    const params = { limit: 10 };
    mockClient.get.mockResolvedValue({ providers: [] });
    await departments.getDepartmentProviders(1, params);
    expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/departments/1/providers', params);
  });

  test('should reject invalid departmentId for providers', async () => {
    await expect(departments.getDepartmentProviders(undefined)).rejects.toThrow(
      'Invalid departmentId',
    );
  });

  test('should get department appointment types', async () => {
    const params = { showpatientfacingonly: true };
    mockClient.get.mockResolvedValue({ appointmenttypes: [] });
    await departments.getDepartmentAppointmentTypes(1, params);
    expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/appointmenttypes', {
      departmentid: 1,
      showpatientfacingonly: true,
    });
  });

  test('should reject invalid departmentId for appointment types', async () => {
    await expect(departments.getDepartmentAppointmentTypes('nope')).rejects.toThrow(
      'Invalid departmentId',
    );
  });
});
