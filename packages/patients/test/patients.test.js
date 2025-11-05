const { PatientResource } = require('../src/index');

const mockClient = {
  practiceId: '195900',
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
};

describe('PatientResource', () => {
  let patients;

  beforeEach(() => {
    patients = new PatientResource(mockClient);
    jest.clearAllMocks();
  });

  describe('Patient CRUD Operations', () => {
    describe('getPatient', () => {
      test('should get patient by ID', async () => {
        mockClient.get.mockResolvedValue({ 
          patientid: '123', 
          firstname: 'John',
          lastname: 'Doe'
        });
        
        const result = await patients.getPatient('123');
        
        expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/patients/123', {});
        expect(result.patientid).toBe('123');
        expect(result.firstname).toBe('John');
      });

      test('should get patient with additional params', async () => {
        mockClient.get.mockResolvedValue({ patientid: '123' });
        
        await patients.getPatient('123', { showportalstatus: true });
        
        expect(mockClient.get).toHaveBeenCalledWith(
          '/v1/195900/patients/123',
          { showportalstatus: true }
        );
      });
    });

    describe('searchPatients', () => {
      test('should search patients with firstname and lastname', async () => {
        const params = {
          firstname: 'John', lastname: 'Doe', departmentid: 1, ssn: '777777777', dob: '1980-01-01' 
        };
        mockClient.get.mockResolvedValue({
          patients: [{ patientid: '123' }],
          totalcount: 1,
        });
        await patients.searchPatients(params);
        expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/patients', params);
      });

      test('should search patients with DOB', async () => {
        const params = {
          firstname: 'John',
          lastname: 'Doe',
          dob: '1980-01-01',
        };
        mockClient.get.mockResolvedValue({ patients: [] });
        await patients.searchPatients(params);
        expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/patients', params);
      });

      test('should search with phone number', async () => {
        const params = { mobilephone: '555-1234' };
        mockClient.get.mockResolvedValue({ patients: [] });
        await patients.searchPatients(params);
        expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/patients', params);
      });
    });

    describe('createPatient', () => {
      test('should create patient with required fields', async () => {
        const patientData = {
          firstname: 'John',
          lastname: 'Doe',
          dob: '1980-01-01',
          departmentid: '1',
          ssn: '777777777',
        };
        mockClient.post.mockResolvedValue({ patientid: '123' });
        const result = await patients.createPatient(patientData);
        expect(mockClient.post).toHaveBeenCalledWith('/v1/195900/patients', patientData);
        expect(result.patientid).toBe('123');
      });

      test('should create patient with full demographics', async () => {
        const patientData = {
          firstname: 'John',
          lastname: 'Doe',
          dob: '1980-01-01',
          departmentid: '1',
          address1: '123 Main St',
          city: 'Boston',
          state: 'MA',
          zip: '02101',
          mobilephone: '555-1234',
          ssn: '777777777',
        };
        mockClient.post.mockResolvedValue({ patientid: '456' });
        await patients.createPatient(patientData);
        expect(mockClient.post).toHaveBeenCalledWith('/v1/195900/patients', patientData);
      });
    });

    describe('updatePatient', () => {
      test('should update patient demographics', async () => {
        const patientData = { firstname: 'Jane' };
        mockClient.put.mockResolvedValue({ success: true });
        
        await patients.updatePatient('123', patientData);
        
        expect(mockClient.put).toHaveBeenCalledWith('/v1/195900/patients/123', patientData);
      });

      test('should update patient contact info', async () => {
        const patientData = { 
          mobilephone: '555-5678',
          email: 'john@example.com'
        };
        mockClient.put.mockResolvedValue({ success: true });
        
        await patients.updatePatient('123', patientData);
        
        expect(mockClient.put).toHaveBeenCalledWith('/v1/195900/patients/123', patientData);
      });
    });

    describe('deletePatient', () => {
      test('should delete patient', async () => {
        mockClient.delete.mockResolvedValue({ success: true });
        
        await patients.deletePatient('123');
        
        expect(mockClient.delete).toHaveBeenCalledWith('/v1/195900/patients/123');
      });
    });
  });

  describe('Patient Chart', () => {
    test('should get patient chart with department ID', async () => {
      mockClient.get.mockResolvedValue({ chart: {} });
      
      await patients.getPatientChart('123', '1');
      
      expect(mockClient.get).toHaveBeenCalledWith(
        '/v1/195900/patients/123/chart',
        { departmentid: '1' }
      );
    });

    test('should get patient chart for different department', async () => {
      mockClient.get.mockResolvedValue({ chart: {} });
      
      await patients.getPatientChart('123', '5');
      
      expect(mockClient.get).toHaveBeenCalledWith(
        '/v1/195900/patients/123/chart',
        { departmentid: '5' }
      );
    });
  });

  describe('Patient Problems', () => {
    test('should get patient problems', async () => {
      mockClient.get.mockResolvedValue({ problems: [] });
      
      await patients.getPatientProblems('123');
      
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/chart/123/problems', {});
    });

    test('should get patient problems with show inactive', async () => {
      mockClient.get.mockResolvedValue({ problems: [] });
      
      await patients.getPatientProblems('123', { showinactive: true });
      
      expect(mockClient.get).toHaveBeenCalledWith(
        '/v1/195900/chart/123/problems',
        { showinactive: true }
      );
    });

    test('should create patient problem', async () => {
      const problemData = { 
        icd10code: 'E11.9',
        problemname: 'Type 2 Diabetes'
      };
      mockClient.post.mockResolvedValue({ problemid: '1' });
      
      await patients.createPatientProblem('123', problemData);
      
      expect(mockClient.post).toHaveBeenCalledWith(
        '/v1/195900/chart/123/problems',
        problemData
      );
    });

    test('should update patient problem status', async () => {
      const problemData = { status: 'resolved' };
      mockClient.put.mockResolvedValue({ success: true });
      
      await patients.updatePatientProblem('123', '456', problemData);
      
      expect(mockClient.put).toHaveBeenCalledWith(
        '/v1/195900/chart/123/problems/456',
        problemData
      );
    });

    test('should delete patient problem', async () => {
      mockClient.delete.mockResolvedValue({ success: true });
      
      await patients.deletePatientProblem('123', '456');
      
      expect(mockClient.delete).toHaveBeenCalledWith(
        '/v1/195900/chart/123/problems/456'
      );
    });
  });

  describe('Patient Medications', () => {
    test('should get patient medications', async () => {
      mockClient.get.mockResolvedValue({ medications: [] });
      
      await patients.getPatientMedications('123');
      
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/chart/123/medications', {});
    });

    test('should get medications with allergies', async () => {
      mockClient.get.mockResolvedValue({ medications: [] });
      
      await patients.getPatientMedications('123', { showallergies: true });
      
      expect(mockClient.get).toHaveBeenCalledWith(
        '/v1/195900/chart/123/medications',
        { showallergies: true }
      );
    });
  });

  describe('Patient Allergies', () => {
    test('should get patient allergies', async () => {
      mockClient.get.mockResolvedValue({ allergies: [] });
      
      await patients.getPatientAllergies('123');
      
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/chart/123/allergies');
    });

    test('should create patient allergy', async () => {
      const allergyData = { 
        allergenname: 'Penicillin',
        reactionname: 'Hives'
      };
      mockClient.post.mockResolvedValue({ allergyid: '1' });
      
      await patients.createPatientAllergy('123', allergyData);
      
      expect(mockClient.post).toHaveBeenCalledWith(
        '/v1/195900/chart/123/allergies',
        allergyData
      );
    });

    test('should delete patient allergy', async () => {
      mockClient.delete.mockResolvedValue({ success: true });
      
      await patients.deletePatientAllergy('123', '456');
      
      expect(mockClient.delete).toHaveBeenCalledWith(
        '/v1/195900/chart/123/allergies/456'
      );
    });
  });

  describe('Patient Immunizations', () => {
    test('should get patient immunizations', async () => {
      mockClient.get.mockResolvedValue({ 
        immunizations: [
          { vaccinename: 'COVID-19' },
          { vaccinename: 'Influenza' }
        ]
      });
      
      const result = await patients.getPatientImmunizations('123');
      
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/chart/123/immunizations');
      expect(result.immunizations).toHaveLength(2);
    });
  });

  describe('Patient Vitals', () => {
    test('should get patient vitals', async () => {
      mockClient.get.mockResolvedValue({ vitals: [] });
      
      await patients.getPatientVitals('123');
      
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/chart/123/vitals', {});
    });

    test('should get vitals with date range', async () => {
      const params = { 
        startdate: '01/01/2025',
        enddate: '12/31/2025'
      };
      mockClient.get.mockResolvedValue({ vitals: [] });
      
      await patients.getPatientVitals('123', params);
      
      expect(mockClient.get).toHaveBeenCalledWith(
        '/v1/195900/chart/123/vitals',
        params
      );
    });
  });

  describe('Patient Lab Results', () => {
    test('should get patient lab results', async () => {
      mockClient.get.mockResolvedValue({ labresults: [] });
      
      await patients.getPatientLabResults('123');
      
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/patients/123/labresults', {});
    });

    test('should get lab results with filter', async () => {
      const params = { departmentid: '1' };
      mockClient.get.mockResolvedValue({ labresults: [] });
      
      await patients.getPatientLabResults('123', params);
      
      expect(mockClient.get).toHaveBeenCalledWith(
        '/v1/195900/patients/123/labresults',
        params
      );
    });
  });

  describe('Patient Documents', () => {
    test('should get patient documents', async () => {
      mockClient.get.mockResolvedValue({ documents: [] });
      
      await patients.getPatientDocuments('123');
      
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/patients/123/documents', {});
    });

    test('should get documents with filters', async () => {
      const params = { 
        departmentid: '1',
        documentclass: 'CLINICALDOCUMENT'
      };
      mockClient.get.mockResolvedValue({ documents: [] });
      
      await patients.getPatientDocuments('123', params);
      
      expect(mockClient.get).toHaveBeenCalledWith(
        '/v1/195900/patients/123/documents',
        params
      );
    });
  });

  describe('Patient Insurance', () => {
    test('should get patient insurance', async () => {
      mockClient.get.mockResolvedValue({ insurances: [] });
      
      await patients.getPatientInsurance('123');
      
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/patients/123/insurances');
    });

    test('should create patient insurance', async () => {
      const insuranceData = { 
        insurancepackageid: '1',
        insurancepolicynumber: 'ABC123456'
      };
      mockClient.post.mockResolvedValue({ sequencenumber: 1 });
      
      await patients.createPatientInsurance('123', insuranceData);
      
      expect(mockClient.post).toHaveBeenCalledWith(
        '/v1/195900/patients/123/insurances',
        insuranceData
      );
    });

    test('should update patient insurance', async () => {
      const insuranceData = { 
        insurancepolicynumber: 'XYZ789'
      };
      mockClient.put.mockResolvedValue({ success: true });
      
      await patients.updatePatientInsurance('123', '1', insuranceData);
      
      expect(mockClient.put).toHaveBeenCalledWith(
        '/v1/195900/patients/123/insurances/1',
        insuranceData
      );
    });

    test('should delete patient insurance', async () => {
      mockClient.delete.mockResolvedValue({ success: true });
      
      await patients.deletePatientInsurance('123', '1');
      
      expect(mockClient.delete).toHaveBeenCalledWith(
        '/v1/195900/patients/123/insurances/1'
      );
    });
  });

  describe('Patient Balance', () => {
    test('should get patient balance', async () => {
      mockClient.get.mockResolvedValue({ balance: 150.00 });
      
      await patients.getPatientBalance('123', '1');
      
      expect(mockClient.get).toHaveBeenCalledWith(
        '/v1/195900/patients/123/collectionsbalance',
        { departmentid: '1' }
      );
    });
  });

  describe('Patient Appointments', () => {
    test('should get patient appointments', async () => {
      mockClient.get.mockResolvedValue({ appointments: [] });
      
      await patients.getPatientAppointments('123');
      
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/patients/123/appointments', {});
    });

    test('should get future appointments only', async () => {
      const params = { showfutureappointmentsonly: true };
      mockClient.get.mockResolvedValue({ appointments: [] });
      
      await patients.getPatientAppointments('123', params);
      
      expect(mockClient.get).toHaveBeenCalledWith(
        '/v1/195900/patients/123/appointments',
        params
      );
    });
  });

  describe('Patient Cases', () => {
    test('should get patient cases', async () => {
      mockClient.get.mockResolvedValue({ cases: [] });
      
      await patients.getPatientCases('123');
      
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/patients/123/patientcases', {});
    });
  });

  describe('Patient Social History', () => {
    test('should get patient social history', async () => {
      mockClient.get.mockResolvedValue({ 
        tobacco: 'never',
        alcohol: 'social'
      });
      
      await patients.getPatientSocialHistory('123');
      
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/chart/123/socialhistory', {});
    });

    test('should update patient social history', async () => {
      const historyData = { 
        tobacco: 'former',
        alcoholdrinksperyear: 10
      };
      mockClient.put.mockResolvedValue({ success: true });
      
      await patients.updatePatientSocialHistory('123', historyData);
      
      expect(mockClient.put).toHaveBeenCalledWith(
        '/v1/195900/chart/123/socialhistory',
        historyData
      );
    });
  });

  describe('Patient Pharmacy', () => {
    test('should get patient pharmacy preferences', async () => {
      mockClient.get.mockResolvedValue({ 
        pharmacies: [{ pharmacyname: 'CVS Pharmacy' }]
      });
      
      await patients.getPatientPharmacy('123');
      
      expect(mockClient.get).toHaveBeenCalledWith(
        '/v1/195900/patients/123/preferredpharmacies'
      );
    });

    test('should set patient preferred pharmacy', async () => {
      const pharmacyData = { 
        clinicalproviderid: '12345',
        receivertype: 'HOMEDELIVERY'
      };
      mockClient.put.mockResolvedValue({ success: true });
      
      await patients.setPatientPharmacy('123', pharmacyData);
      
      expect(mockClient.put).toHaveBeenCalledWith(
        '/v1/195900/patients/123/preferredpharmacies',
        pharmacyData
      );
    });
  });
});
