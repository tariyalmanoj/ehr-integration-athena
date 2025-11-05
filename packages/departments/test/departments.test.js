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

  test('should list all departments', async () => {
    mockClient.get.mockResolvedValue({ departments: [] });
    await departments.listDepartments();
    expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/departments', {});
  });

  test('should get practice info', async () => {
    mockClient.get.mockResolvedValue({ practiceid: '195900' });
    await departments.getPracticeInfo();
    expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/practiceinfo');
  });
});
