# Appwrite Integration for Railway Solar Project

This document explains how to migrate from the existing MongoDB-based models to Appwrite for backend services.

## Overview

Appwrite is a backend-as-a-service platform that provides APIs for authentication, databases, storage, and more. It's a good fit for this project as it simplifies backend development and deployment.

## Getting Started

### 1. Install Appwrite SDK

First, install the Appwrite SDK:

```bash
npm install appwrite
```

### 2. Set up Appwrite account and project

1. Sign up for an Appwrite account at [https://appwrite.io/](https://appwrite.io/)
2. Create a new project in the Appwrite console
3. Note down your Project ID

### 3. Configure environment variables

Add the following environment variables to your `.env.local` file:

```
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id
NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID=your-storage-bucket-id
```

### 4. Create collections in Appwrite

Create the following collections in your Appwrite database:

#### Sites Collection

- Name: Sites
- ID: sites
- Attributes:
  - name (string, required)
  - location (object, required) with attributes:
    - latitude (number, required)
    - longitude (number, required)
    - address (string, required)
    - city (string)
    - state (string)
    - country (string)
    - postalCode (string)
  - type (string, required) with allowed values: 'railway', 'commercial', 'utility', 'residential'
  - capacity (number, required)
  - status (string, required) with allowed values: 'active', 'under-construction', 'planned', 'decommissioned'
  - commissioned (string)
  - division (string)
  - zone (string)
  - description (string)
  - images (array of strings)
  - tags (array of strings)

#### EPC Projects Collection

- Name: EPC Projects
- ID: epc_projects
- Attributes:
  - name (string, required)
  - client (string, required)
  - location (object, required) with attributes similar to Sites
  - status (string, required) with allowed values: 'planning', 'procurement', 'construction', 'testing', 'completed', 'cancelled'
  - capacity (number, required)
  - startDate (string, required)
  - endDate (string)
  - description (string)
  - budget (number, required)
  - contractValue (number, required)
  - progress (number, required)
  - siteId (string)
  - contacts (array of objects) with attributes:
    - name (string, required)
    - role (string, required)
    - email (string)
    - phone (string)
  - milestones (array of objects) with attributes:
    - title (string, required)
    - dueDate (string, required)
    - completed (boolean, required)
    - description (string)

#### Solar Installations Collection

- Name: Solar Installations
- ID: solar_installations
- Attributes:
  - name (string, required)
  - siteId (string, required)
  - installationType (string, required) with allowed values: 'roof-mounted', 'ground-mounted', 'canopy', 'floating'
  - capacity (number, required)
  - panels (number, required)
  - efficiency (number, required)
  - installationDate (string, required)
  - lastMaintenance (string)
  - nextMaintenance (string)
  - status (string, required) with allowed values: 'operational', 'maintenance', 'offline', 'degraded'
  - manufacturer (string, required)
  - modelNumber (string, required)
  - warrantyEnd (string)
  - orientation (string)
  - tilt (number)
  - inverters (array of objects) with attributes:
    - manufacturer (string, required)
    - model (string, required)
    - capacity (number, required)
    - quantity (number, required)

#### Energy Production Collection

- Name: Energy Production
- ID: energy_production
- Attributes:
  - installationId (string, required)
  - date (string, required)
  - energy (number, required)
  - peakPower (number, required)
  - sunshine (number, required)
  - efficiency (number, required)
  - co2Saved (number, required)
  - revenue (number)
  - weatherConditions (object) with attributes:
    - temperature (number, required)
    - cloudCover (number, required)
    - rainfall (number, required)

### 5. Create storage bucket

Create a storage bucket for uploading files:

- Name: Railway Solar Files
- ID: railway_solar_files
- File Permissions: Make sure your bucket allows the appropriate permissions for your app's needs

## Usage

### New Action Files

The repository now includes Appwrite-specific action files that replace the MongoDB-based ones:

- `lib/actions/appwrite-solar-actions.ts` - Actions for solar installations and energy production
- `lib/actions/appwrite-site-actions.ts` - Actions for sites management

### Types

New type definitions for Appwrite collections are in `types/appwrite-models.ts`.

### Configuration

The Appwrite client and helpers are configured in `lib/appwrite.ts`.

## Migration Steps

1. Install Appwrite SDK
2. Configure environment variables
3. Set up Appwrite collections and storage
4. Update imports to use Appwrite action files instead of MongoDB-based ones
5. Migrate data from MongoDB to Appwrite collections (can be done manually or using a script)

## Benefits of Appwrite

- Simplified authentication with built-in providers
- Automatic API generation with SDKs
- Built-in storage for files
- Realtime updates with subscriptions
- Easier deployment without managing a separate database
- Free tier for development and small projects

## Additional Resources

- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite SDK for Web](https://appwrite.io/docs/sdks/web)
- [Appwrite SDK for Server](https://appwrite.io/docs/sdks/server/nodejs)
