# Getting Started with the AthenaHealth API SDK

Welcome! This guide provides a straightforward path to installing, configuring, and using the AthenaHealth API SDK in your Node.js project.

## 1. Prerequisites

Before you start, make sure you have the following ready:

- **Node.js**: Version 14.x or higher installed.
- **NPM**: Included with Node.js.
- **API Credentials**: Your unique `clientId` and `clientSecret` from your AthenaHealth developer account.
- **Practice ID**: The specific `practiceId` for the environment you are targeting.

## 2. Installation

The SDK is structured as a monorepo with multiple NPM workspaces. You can install all modules and their dependencies with a single command from the project's root directory.

This command will read the  workspaces  config and install all packages

npm install



This installs all dependencies into a shared `node_modules` folder at the root, making management simple.

## 3. Environment Configuration

For security, your credentials should not be hard-coded. The recommended approach is to use environment variables.

Create a `.env` file in the root of your project:

.env file
ATHENA_CLIENT_ID=“YOUR_CLIENT_ID”
ATHENA_CLIENT_SECRET=“YOUR_CLIENT_SECRET”
ATHENA_PRACTICE_ID=“YOUR_PRACTICE_ID”

> **Note**: Remember to add `.env` to your `.gitignore` file to prevent committing your secrets to version control.

To load these variables into your application, use a package like `dotenv`. Install it with `npm install dotenv`.

## 4. Usage Example

Here is a complete example of how to initialize the client and fetch data. You can save this as `index.js`.

// Load environment variables from .env file require(‘dotenv’).config();
const { AthenaClient } = require(’./packages/core/src/index’);
const { PatientResource } = require(’./packages/patients/src/index’);
(async () => {
  try {
  // 1. Initialize the AthenaClient
const client = new AthenaClient({
  clientId: process.env.ATHENA_CLIENT_ID,
clientSecret: process.env.ATHENA_CLIENT_SECRET,
environment: ‘preview’, // Or ‘production’
practiceId: process.env.ATHENA_PRACTICE_ID
});

// 2. Instantiate the resource you want to use
const patients = new PatientResource(client);

// 3. Make an API call
const patientId = '1'; // Use a valid patient ID for your practice
console.log(`Fetching data for patient ID: ${patientId}...`);

const patient = await patients.getPatient(patientId);

console.log('--- Patient Details ---');
console.log(patient);
console.log('-----------------------');
} catch (error) {
  // The SDK provides detailed error messages
console.error(‘API Error:’, error.message);
}
})();



### To Run the Example
Execute the file from your terminal:
node index.js


## 5. Running Tests

The SDK comes with a comprehensive test suite for each module.

#### Run All Tests
To run the tests for every package simultaneously, use the root `test` script:

npm test


#### Run Tests for a Single Package
To test an individual module, use the `--workspace` (or `-w`) flag:

Example for the ‘patients’ module
npm test –workspace=@athena-api/patients


---
**Happy Coding!**
