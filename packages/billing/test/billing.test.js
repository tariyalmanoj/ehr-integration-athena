const { BillingResource } = require('../src/index');

const mockClient = {
  practiceId: '195900',
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
};

describe('BillingResource', () => {
  let billing;

  beforeEach(() => {
    billing = new BillingResource(mockClient);
    jest.clearAllMocks();
  });

  describe('Patient Charges', () => {
    describe('getPatientCharges', () => {
      test('should get patient charges without filters', async () => {
        mockClient.get.mockResolvedValue({ 
          charges: [
            { chargeid: '1', amount: 100 },
            { chargeid: '2', amount: 150 }
          ]
        });
        
        const result = await billing.getPatientCharges('123');
        
        expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/patients/123/charges', {});
        expect(result.charges).toHaveLength(2);
      });

      test('should get patient charges with date filter', async () => {
        const params = { 
          startdate: '01/01/2025', 
          enddate: '01/31/2025' 
        };
        mockClient.get.mockResolvedValue({ charges: [] });
        
        await billing.getPatientCharges('123', params);
        
        expect(mockClient.get).toHaveBeenCalledWith(
          '/v1/195900/patients/123/charges',
          params
        );
      });

      test('should get charges with department filter', async () => {
        const params = { departmentid: '1' };
        mockClient.get.mockResolvedValue({ charges: [] });
        
        await billing.getPatientCharges('123', params);
        
        expect(mockClient.get).toHaveBeenCalledWith(
          '/v1/195900/patients/123/charges',
          params
        );
      });

      test('should get charges with show closed', async () => {
        const params = { showclosed: true };
        mockClient.get.mockResolvedValue({ charges: [] });
        
        await billing.getPatientCharges('123', params);
        
        expect(mockClient.get).toHaveBeenCalledWith(
          '/v1/195900/patients/123/charges',
          params
        );
      });
    });

    describe('createCharge', () => {
      test('should create charge with required fields', async () => {
        const chargeData = { 
          amount: 100, 
          cptcode: '99213',
          patientid: '123',
          departmentid: '1',
          servicedate: '01/15/2025'
        };
        mockClient.post.mockResolvedValue({ chargeid: '1' });
        
        const result = await billing.createCharge(chargeData);
        
        expect(mockClient.post).toHaveBeenCalledWith('/v1/195900/charges', chargeData);
        expect(result.chargeid).toBe('1');
      });

      test('should create charge with modifiers', async () => {
        const chargeData = { 
          amount: 150,
          cptcode: '99214',
          modifiers: ['25'],
          patientid: '123',
          departmentid: '1',
          servicedate: '01/15/2025'
        };
        mockClient.post.mockResolvedValue({ chargeid: '2' });
        
        await billing.createCharge(chargeData);
        
        expect(mockClient.post).toHaveBeenCalledWith('/v1/195900/charges', chargeData);
      });

      test('should create charge with diagnosis codes', async () => {
        const chargeData = { 
          amount: 200,
          cptcode: '99215',
          diagnosiscodes: ['E11.9', 'I10'],
          patientid: '123',
          departmentid: '1',
          servicedate: '01/15/2025'
        };
        mockClient.post.mockResolvedValue({ chargeid: '3' });
        
        await billing.createCharge(chargeData);
        
        expect(mockClient.post).toHaveBeenCalledWith('/v1/195900/charges', chargeData);
      });
    });

    describe('updateCharge', () => {
      test('should update charge amount', async () => {
        const chargeData = { amount: 150 };
        mockClient.put.mockResolvedValue({ success: true });
        
        await billing.updateCharge('1', chargeData);
        
        expect(mockClient.put).toHaveBeenCalledWith('/v1/195900/charges/1', chargeData);
      });

      test('should update charge CPT code', async () => {
        const chargeData = { cptcode: '99214' };
        mockClient.put.mockResolvedValue({ success: true });
        
        await billing.updateCharge('1', chargeData);
        
        expect(mockClient.put).toHaveBeenCalledWith('/v1/195900/charges/1', chargeData);
      });

      test('should update multiple charge fields', async () => {
        const chargeData = { 
          amount: 175,
          cptcode: '99214',
          modifiers: ['25', '59']
        };
        mockClient.put.mockResolvedValue({ success: true });
        
        await billing.updateCharge('1', chargeData);
        
        expect(mockClient.put).toHaveBeenCalledWith('/v1/195900/charges/1', chargeData);
      });
    });

    describe('deleteCharge', () => {
      test('should delete charge', async () => {
        mockClient.delete.mockResolvedValue({ success: true });
        
        await billing.deleteCharge('1');
        
        expect(mockClient.delete).toHaveBeenCalledWith('/v1/195900/charges/1');
      });

      test('should delete different charge', async () => {
        mockClient.delete.mockResolvedValue({ success: true });
        
        await billing.deleteCharge('999');
        
        expect(mockClient.delete).toHaveBeenCalledWith('/v1/195900/charges/999');
      });
    });
  });

  describe('Payments', () => {
    describe('getPatientPayments', () => {
      test('should get patient payments', async () => {
        mockClient.get.mockResolvedValue({ 
          payments: [
            { paymentid: '1', amount: 50 }
          ]
        });
        
        await billing.getPatientPayments('123');
        
        expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/patients/123/payments', {});
      });

      test('should get payments with date range', async () => {
        const params = { 
          startdate: '01/01/2025',
          enddate: '01/31/2025'
        };
        mockClient.get.mockResolvedValue({ payments: [] });
        
        await billing.getPatientPayments('123', params);
        
        expect(mockClient.get).toHaveBeenCalledWith(
          '/v1/195900/patients/123/payments',
          params
        );
      });
    });

    describe('recordPayment', () => {
      test('should record patient payment', async () => {
        const paymentData = { 
          amount: 50, 
          patientid: '123',
          departmentid: '1',
          copay: true
        };
        mockClient.post.mockResolvedValue({ paymentid: '1' });
        
        const result = await billing.recordPayment(paymentData);
        
        expect(mockClient.post).toHaveBeenCalledWith('/v1/195900/payments', paymentData);
        expect(result.paymentid).toBe('1');
      });

      test('should record credit card payment', async () => {
        const paymentData = { 
          amount: 100,
          patientid: '123',
          departmentid: '1',
          paymentmethod: 'CREDITCARD'
        };
        mockClient.post.mockResolvedValue({ paymentid: '2' });
        
        await billing.recordPayment(paymentData);
        
        expect(mockClient.post).toHaveBeenCalledWith('/v1/195900/payments', paymentData);
      });

      test('should record check payment', async () => {
        const paymentData = { 
          amount: 75,
          patientid: '123',
          departmentid: '1',
          paymentmethod: 'CHECK',
          checknumber: '1234'
        };
        mockClient.post.mockResolvedValue({ paymentid: '3' });
        
        await billing.recordPayment(paymentData);
        
        expect(mockClient.post).toHaveBeenCalledWith('/v1/195900/payments', paymentData);
      });
    });
  });

  describe('Statements', () => {
    describe('getPatientStatements', () => {
      test('should get patient statements', async () => {
        mockClient.get.mockResolvedValue({ statements: [] });
        
        await billing.getPatientStatements('123');
        
        expect(mockClient.get).toHaveBeenCalledWith(
          '/v1/195900/patients/123/statements',
          {}
        );
      });

      test('should get statements with filters', async () => {
        const params = { departmentid: '1' };
        mockClient.get.mockResolvedValue({ statements: [] });
        
        await billing.getPatientStatements('123', params);
        
        expect(mockClient.get).toHaveBeenCalledWith(
          '/v1/195900/patients/123/statements',
          params
        );
      });
    });

    describe('createStatement', () => {
      test('should create patient statement', async () => {
        const statementData = { 
          patientid: '123', 
          departmentid: '1'
        };
        mockClient.post.mockResolvedValue({ statementid: '1' });
        
        await billing.createStatement(statementData);
        
        expect(mockClient.post).toHaveBeenCalledWith(
          '/v1/195900/statements',
          statementData
        );
      });
    });
  });

  describe('Collections', () => {
    describe('getCollectionsActions', () => {
      test('should get collections actions', async () => {
        mockClient.get.mockResolvedValue({ actions: [] });
        
        await billing.getCollectionsActions();
        
        expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/collectionsactions', {});
      });

      test('should get collections actions with filters', async () => {
        const params = { departmentid: '1' };
        mockClient.get.mockResolvedValue({ actions: [] });
        
        await billing.getCollectionsActions(params);
        
        expect(mockClient.get).toHaveBeenCalledWith(
          '/v1/195900/collectionsactions',
          params
        );
      });
    });

    describe('getPatientBalance', () => {
      test('should get patient balance', async () => {
        mockClient.get.mockResolvedValue({ 
          balance: 150.00,
          insurancebalance: 50.00,
          patientbalance: 100.00
        });
        
        const result = await billing.getPatientBalance('123', '1');
        
        expect(mockClient.get).toHaveBeenCalledWith(
          '/v1/195900/patients/123/collectionsbalance',
          { departmentid: '1' }
        );
        expect(result.balance).toBe(150.00);
      });

      test('should get balance for different department', async () => {
        mockClient.get.mockResolvedValue({ balance: 200.00 });
        
        await billing.getPatientBalance('123', '5');
        
        expect(mockClient.get).toHaveBeenCalledWith(
          '/v1/195900/patients/123/collectionsbalance',
          { departmentid: '5' }
        );
      });
    });
  });

  describe('Payment Plans', () => {
    describe('getPaymentPlans', () => {
      test('should get patient payment plans', async () => {
        mockClient.get.mockResolvedValue({ 
          paymentplans: [
            { paymentplanid: '1', totalamount: 500 }
          ]
        });
        
        await billing.getPaymentPlans('123');
        
        expect(mockClient.get).toHaveBeenCalledWith(
          '/v1/195900/patients/123/paymentplans'
        );
      });
    });

    describe('createPaymentPlan', () => {
      test('should create payment plan', async () => {
        const planData = { 
          amount: 100, 
          frequency: 'MONTHLY',
          numberofpayments: 10
        };
        mockClient.post.mockResolvedValue({ paymentplanid: '1' });
        
        await billing.createPaymentPlan('123', planData);
        
        expect(mockClient.post).toHaveBeenCalledWith(
          '/v1/195900/patients/123/paymentplans',
          planData
        );
      });

      test('should create weekly payment plan', async () => {
        const planData = { 
          amount: 50,
          frequency: 'WEEKLY',
          numberofpayments: 20
        };
        mockClient.post.mockResolvedValue({ paymentplanid: '2' });
        
        await billing.createPaymentPlan('123', planData);
        
        expect(mockClient.post).toHaveBeenCalledWith(
          '/v1/195900/patients/123/paymentplans',
          planData
        );
      });
    });
  });

  describe('Refunds', () => {
    describe('getRefunds', () => {
      test('should get refunds', async () => {
        mockClient.get.mockResolvedValue({ refunds: [] });
        
        await billing.getRefunds();
        
        expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/refunds', {});
      });

      test('should get refunds with filters', async () => {
        const params = { 
          startdate: '01/01/2025',
          enddate: '01/31/2025'
        };
        mockClient.get.mockResolvedValue({ refunds: [] });
        
        await billing.getRefunds(params);
        
        expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/refunds', params);
      });
    });

    describe('createRefund', () => {
      test('should create refund', async () => {
        const refundData = { 
          amount: 25, 
          paymentid: '1',
          reason: 'Overpayment'
        };
        mockClient.post.mockResolvedValue({ refundid: '1' });
        
        await billing.createRefund(refundData);
        
        expect(mockClient.post).toHaveBeenCalledWith('/v1/195900/refunds', refundData);
      });
    });
  });

  describe('Adjustments', () => {
    describe('getAdjustments', () => {
      test('should get adjustments', async () => {
        mockClient.get.mockResolvedValue({ adjustments: [] });
        
        await billing.getAdjustments();
        
        expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/adjustments', {});
      });

      test('should get adjustments with date filter', async () => {
        const params = { 
          startdate: '01/01/2025',
          enddate: '01/31/2025'
        };
        mockClient.get.mockResolvedValue({ adjustments: [] });
        
        await billing.getAdjustments(params);
        
        expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/adjustments', params);
      });
    });

    describe('createAdjustment', () => {
      test('should create positive adjustment', async () => {
        const adjustmentData = { 
          amount: 10,
          chargeid: '1',
          reason: 'Discount applied'
        };
        mockClient.post.mockResolvedValue({ adjustmentid: '1' });
        
        await billing.createAdjustment(adjustmentData);
        
        expect(mockClient.post).toHaveBeenCalledWith(
          '/v1/195900/adjustments',
          adjustmentData
        );
      });

      test('should create negative adjustment', async () => {
        const adjustmentData = { 
          amount: -15,
          chargeid: '2',
          reason: 'Billing correction'
        };
        mockClient.post.mockResolvedValue({ adjustmentid: '2' });
        
        await billing.createAdjustment(adjustmentData);
        
        expect(mockClient.post).toHaveBeenCalledWith(
          '/v1/195900/adjustments',
          adjustmentData
        );
      });
    });
  });

  describe('Transactions', () => {
    test('should get transaction details', async () => {
      mockClient.get.mockResolvedValue({ 
        transactionid: '1',
        amount: 100,
        type: 'PAYMENT'
      });
      
      await billing.getTransaction('1');
      
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/transactions/1');
    });

    test('should get different transaction', async () => {
      mockClient.get.mockResolvedValue({ transactionid: '999' });
      
      await billing.getTransaction('999');
      
      expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/transactions/999');
    });
  });

  describe('ERA (Electronic Remittance Advice)', () => {
    describe('getERA', () => {
      test('should get ERA by ID', async () => {
        mockClient.get.mockResolvedValue({ 
          eraid: '1',
          checkamount: 500
        });
        
        await billing.getERA('1');
        
        expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/eras/1');
      });
    });

    describe('listERAs', () => {
      test('should list all ERAs', async () => {
        mockClient.get.mockResolvedValue({ eras: [] });
        
        await billing.listERAs();
        
        expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/eras', {});
      });

      test('should list ERAs with date filter', async () => {
        const params = { 
          startdate: '01/01/2025',
          enddate: '01/31/2025'
        };
        mockClient.get.mockResolvedValue({ eras: [] });
        
        await billing.listERAs(params);
        
        expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/eras', params);
      });

      test('should list ERAs with payer filter', async () => {
        const params = { payerid: '12345' };
        mockClient.get.mockResolvedValue({ eras: [] });
        
        await billing.listERAs(params);
        
        expect(mockClient.get).toHaveBeenCalledWith('/v1/195900/eras', params);
      });
    });
  });
});
