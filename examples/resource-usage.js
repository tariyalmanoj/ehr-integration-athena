// examples/resource-usage.js

const { AthenaClient } = require('@athena-api/core');
const { PatientResource } = require('../packages/patients/src/index');
const { BillingResource } = require('../packages/billing/src/index');

// Initialize a single, shared client instance
const client = new AthenaClient({
  clientId: process.env.ATHENA_CLIENT_ID,
  clientSecret: process.env.ATHENA_CLIENT_SECRET,
  environment: 'preview',
  practiceId: '195900'
});

// Instantiate resources
const patients = new PatientResource(client);
const billing = new BillingResource(client);

/**
 * A reusable function to fetch comprehensive patient information.
 * @param {string} patientId - The ID of the patient to fetch.
 * @returns {Promise<Object|null>} An object with patient details, or null if not found.
 */
async function getPatientDashboard(patientId) {
  try {
    console.log(`\nFetching dashboard for patient ID: ${patientId}`);
    
    // Use Promise.all to fetch data concurrently for better performance
    const [details, problems, medications, balance] = await Promise.all([
      patients.getPatient(patientId),
      patients.getPatientProblems(patientId, { showinactive: false }),
      patients.getPatientMedications(patientId),
      billing.getPatientBalance(patientId, '1') // Assuming department '1'
    ]);

    return {
      details,
      problemCount: problems.problems.length,
      medicationCount: medications.medications.length,
      balance: balance.balance
    };
  } catch (err) {
    console.error(`Error fetching dashboard for patient ${patientId}:`, err.message);
    return null;
  }
}

/**
 * A simple function demonstrating how to use the exported functions.
 */
async function main() {
  const testPatientId = '123'; // Replace with a valid patient ID
  const dashboardData = await getPatientDashboard(testPatientId);

  if (dashboardData) {
    console.log('--- Patient Dashboard ---');
    console.log('Name:', `${dashboardData.details.firstname} ${dashboardData.details.lastname}`);
    console.log('Active Problems:', dashboardData.problemCount);
    console.log('Active Medications:', dashboardData.medicationCount);
    console.log('Current Balance:', `$${dashboardData.balance}`);
    console.log('-------------------------');
  }
}

// This allows the file to be both run directly and imported as a module.
if (require.main === module) {
  main();
}

module.exports = {
  getPatientDashboard
};
