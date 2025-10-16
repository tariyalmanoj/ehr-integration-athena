// examples/complete-workflow.js

const { AthenaClient } = require('../packages/core/src/client');
const { PatientResource } = require('../packages/patients/src/index');
const { ProviderResource } = require('../packages/providers/src/index');
const { BillingResource } = require('../packages/billing/src/index');

/**
 * A more complex workflow demonstrating how to use multiple resources together.
 */
(async () => {
  try {
    // 1. Initialize a single client for all resources
    const client = new AthenaClient({
      clientId: process.env.ATHENA_CLIENT_ID,
      clientSecret: process.env.ATHENA_CLIENT_SECRET,
      environment: 'preview', // Use 'preview' for testing, 'production' for live
      practiceId: '195900' // Your practice ID
    });

    // 2. Instantiate all the resources you'll need
    const patients = new PatientResource(client);
    const providers = new ProviderResource(client);
    const billing = new BillingResource(client);

    console.log('--- Starting Complete Workflow Example ---');

    // 3. Find a patient to work with
    console.log('\nStep A: Searching for a patient...');
    const patientResults = await patients.searchPatients({ firstname: 'John' });
    
    if (!patientResults.patients || patientResults.patients.length === 0) {
      console.log('No patient found. Exiting workflow.');
      return;
    }
    
    const patientId = patientResults.patients[0].patientid;
    console.log(`Patient found with ID: ${patientId}`);

    // 4. Get the full details, problems, and medications for that patient
    console.log(`\nStep B: Fetching details for patient ${patientId}...`);
    const [patientDetails, patientProblems, patientMedications] = await Promise.allSettled([
      patients.getPatient(patientId),
      patients.getPatientProblems(patientId),
      patients.getPatientMedications(patientId)
    ]);
    console.log(`Details for ${patientDetails.firstname} ${patientDetails.lastname}:`);
    console.log('  - Problems Found:', patientProblems.problems.length);
    console.log('  - Medications Found:', patientMedications.medications.length);

    // 5. Check the patient's billing balance
    const departmentId = '1'; // Replace with a valid department ID
    console.log(`\nStep C: Checking billing balance for department ${departmentId}...`);
    const balance = await billing.getPatientBalance(patientId, departmentId);
    console.log('Patient Balance:', balance);

    // 6. Find an available provider
    console.log('\nStep D: Listing available providers...');
    const providerList = await providers.listProviders({ limit: 5 });
    if (!providerList.providers || providerList.providers.length === 0) {
      console.log('No providers found.');
      return;
    }
    console.log(`Found ${providerList.totalcount} providers. Showing first ${providerList.providers.length}.`);
    const firstProvider = providerList.providers[0];
    console.log(`Example Provider: ${firstProvider.displayname} (ID: ${firstProvider.providerid})`);

    console.log('\n--- Workflow Complete ---');

  } catch (error) {
    console.error('An error occurred during the workflow:', error.message);
  }
})();
