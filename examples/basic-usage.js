// examples/basic-usage.js

const { AthenaClient } = require('../packages/core/src/client');
const { PatientResource } = require('../packages/patients/src/index');

/**
 * A simple async function to demonstrate basic usage.
 * 
 * NOTE: Make sure to set your credentials in environment variables:
 * - ATHENA_CLIENT_ID
 * - ATHENA_CLIENT_SECRET
 */
(async () => {
  try {
    // 1. Initialize the AthenaClient
    // It's recommended to pull credentials from environment variables for security.
    const client = new AthenaClient({
      clientId: process.env.ATHENA_CLIENT_ID,
      clientSecret: process.env.ATHENA_CLIENT_SECRET,
      environment: 'preview', // Use 'preview' for testing, 'production' for live
      practiceId: '195900' // Your practice ID
    });

    // 2. Instantiate the resource you need, passing the client to it
    const patients = new PatientResource(client);
    
    // --- Example 1: Fetch a specific patient by their ID ---
    const patientId = '1'; // Replace with a valid patient ID from your preview environment
    console.log(`\nFetching patient with ID: ${patientId}...`);
    
    const patient = await patients.getPatient(patientId);
    console.log('--- Patient Found ---');
    console.log('Patient Name:', `${patient.firstname} ${patient.lastname}`);
    console.log('DOB:', patient.dob);
    console.log('---------------------\n');

    // --- Example 2: Search for patients by name ---
    const searchParams = { firstname: 'John', lastname: 'Doe' };
    console.log(`Searching for patients with name: ${searchParams.firstname} ${searchParams.lastname}...`);

    const searchResults = await patients.searchPatients(searchParams);
    console.log('--- Search Results ---');
    console.log('Total Found:', searchResults.totalcount);
    if (searchResults.patients && searchResults.patients.length > 0) {
      console.log('First Result:', searchResults.patients[0]);
    }
    console.log('----------------------\n');

  } catch (error) {
    console.error('An error occurred:', error.message);
  }
})();
