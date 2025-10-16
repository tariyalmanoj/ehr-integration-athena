# Authentication Guide

The AthenaHealth API SDK handles authentication automatically, but it's helpful to understand the underlying process. The API uses the **OAuth 2.0 Client Credentials Grant Flow**.

## Overview

In this flow, your application passes its own credentials (a `clientId` and `clientSecret`) to the AthenaHealth authorization server in exchange for an access token. This token must then be included in the header of all subsequent API requests.

## The Process Handled by the SDK

When you create an instance of the `AthenaClient`, it prepares to perform the following steps:

1.  **First API Call**: On the first call to any resource method (e.g., `patients.getPatient()`), the `AthenaClient` automatically detects that it does not have an access token.

2.  **Token Request**: It sends a `POST` request to the AthenaHealth token endpoint:
    - **URL**: `https://api.preview.platform.athenahealth.com/oauth2/v1/token`
    - **Body**: `grant_type=client_credentials&scope=athena/service/Athenanet.MDP.*`
    - **Headers**: Includes a `Basic` authorization header containing a base64-encoded string of your `clientId:clientSecret`.

3.  **Token Reception**: The authorization server validates the credentials and returns a JSON payload containing the access token and its expiry time (typically 3600 seconds).
    ```
    {
      "access_token": "a1b2c3d4...",
      "token_type": "bearer",
      "expires_in": 3600,
      "scope": "athena/service/Athenanet.MDP.*"
    }
    ```

4.  **Token Caching**: The `AthenaClient` caches this `access_token` and its expiry time internally.

5.  **API Request Execution**: The client then retries the original API request (e.g., to fetch a patient), this time adding the `Authorization: Bearer a1b2c3d4...` header.

## Automatic Token Refresh

The SDK is designed to handle token expiry automatically.

- **Before each API call**, the `AthenaClient` checks if the cached token is expired or close to expiring.
- **If the token is expired**, it automatically performs the authentication flow again (steps 2-4) to get a new token *before* executing your requested API call.

This ensures you don't have to manually manage token lifetimes in your application code.

## Security Best Practices

- **Never hard-code credentials**. Always use environment variables (`process.env`) or a secure secret management service.
- **Limit credential exposure**. Ensure your server-side environment where the credentials live is secure.
- **Use the provided `AthenaClient`**. Do not try to implement the OAuth flow yourself, as the client is built to handle it securely and efficiently.
