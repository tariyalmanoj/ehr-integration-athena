# API Reference

This document provides a high-level reference for the modules and methods available in the AthenaHealth API SDK.

## Core Module (`@athena-api/core`)

### `AthenaClient`
The main client for handling authentication and making HTTP requests.

- `new AthenaClient(config)`: Creates a new client instance.
  - `config`: An object with `clientId`, `clientSecret`, `environment`, and `practiceId`.

## Resource Modules

All resource classes are instantiated by passing an `AthenaClient` instance to their constructor. Example: `new PatientResource(client)`.

---

### PatientResource (`@athena-api/patients`)
Manages patient demographics, clinical data, and administrative information.

**Key Methods:**
- `getPatient(patientId)`: Retrieves a single patient's details.
- `searchPatients(params)`: Searches for patients based on demographic criteria.
- `createPatient(patientData)`: Creates a new patient record.
- `updatePatient(patientId, patientData)`: Updates an existing patient's information.
- `getPatientProblems(patientId)`: Fetches the patient's problem list.
- `getPatientMedications(patientId)`: Fetches the patient's medication list.
- `getPatientAllergies(patientId)`: Fetches the patient's allergy list.
- `getPatientAppointments(patientId)`: Retrieves a list of the patient's appointments.

---

### ProviderResource (`@athena-api/providers`)
Manages provider and referring provider information.

**Key Methods:**
- `getProvider(providerId)`: Retrieves details for a single provider.
- `listProviders(params)`: Lists all providers in the practice.
- `getReferringProviders(params)`: Searches for referring providers.
- `createReferringProvider(providerData)`: Adds a new referring provider.

---

### BillingResource (`@athena-api/billing`)
Manages all financial aspects, including charges, payments, and claims.

**Key Methods:**
- `getPatientCharges(patientId, params)`: Retrieves a list of charges for a patient.
- `createCharge(chargeData)`: Creates a new charge for a service.
- `recordPayment(paymentData)`: Records a payment from a patient.
- `getPatientBalance(patientId, departmentId)`: Gets the outstanding balance for a patient.

---

### EncounterResource (`@athena-api/encounters`)
Manages clinical encounter details.

**Key Methods:**
- `getEncounter(encounterId)`: Retrieves details of a specific encounter.
- `getPatientEncounters(patientId)`: Lists all encounters for a patient.
- `getEncounterDiagnoses(encounterId)`: Fetches diagnoses linked to an encounter.
- `signEncounter(encounterId)`: Signs and closes an encounter note.

---

### Other Modules

- **Departments (`@athena-api/departments`)**: Manages practice departments.
- **Procedure Codes (`@athena-api/procedure-codes`)**: Looks up CPT, ICD-10, and other codes.
- **Claims (`@athena-api/claims`)**: Manages claim submission and tracking.
- **Insurance (`@athena-api/insurance`)**: Manages patient insurance and eligibility checks.
