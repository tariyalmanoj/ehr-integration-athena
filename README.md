# Athena Health API - Modular Node.js SDK

⚠️ **Disclaimer**: This is an **unofficial, community-maintained** package and is **not affiliated with, endorsed by, or sponsored by athenahealth, Inc.**

athenahealth® is a registered trademark of athenahealth, Inc.

## Overview

A comprehensive, modular Node.js SDK for athenahealth APIs with 800+ endpoints organized into focused packages.

## Architecture

This is a monorepo using NPM workspaces with independent packages:

- `@athena-api/core` - OAuth 2.0 authentication & HTTP client (required)
- `@athena-api/patients` - Patient management
- `@athena-api/providers` - Provider management
- `@athena-api/billing` - Billing & payments
- `@athena-api/encounters` - Encounter management
- `@athena-api/departments` - Department management
- `@athena-api/procedure-codes` - CPT, ICD-10, SNOMED codes
- `@athena-api/claims` - Claims management
- `@athena-api/insurance` - Insurance & eligibility

## Installation

Install only what you need:

