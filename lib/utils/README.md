# Railway Solar Management System - Utility Libraries

This directory contains utility libraries that support the Railway Solar Management System's functionality.

## Overview

### 1. `solar-analytics.ts`

Provides analytical functions for solar installations, including:

- Efficiency calculations based on capacity, sun hours, and energy production
- ROI calculations based on installation cost and energy production
- Carbon offset estimations
- Performance health scoring
- Maintenance predictive analysis

### 2. `report-generator.ts`

Generates formatted reports and exports for solar installations:

- CSV data export for energy production records
- Formatted installation reports for stakeholders
- Summary statistics for multiple installations
- Comparative analysis between installations
- Energy production projections

### 3. `notification-service.ts`

Manages alerts and notifications for system events:

- Maintenance due notifications based on schedules
- Performance issue alerts when efficiency drops below thresholds
- Energy recording confirmations
- Support for multiple notification channels (email, SMS, app, webhooks)

### 4. `data-validation.ts`

Provides input validation and sanitization:

- Input sanitization to prevent XSS and injection attacks
- Schema-based validation using Zod
- Formatting of validation errors into user-friendly messages
- Query parameter validation and transformation

### 5. `date-utils.ts`

Helper functions for date manipulation and formatting:

- Consistent date formatting across the application
- Relative date calculations (e.g., "7 days ago")
- Maintenance schedule calculations
- Date range operations

### 6. `solar-calculator.ts`

Performs solar-specific calculations:

- Potential energy calculations based on capacity and sunlight hours
- Panel efficiency estimation over time (accounting for degradation)
- Levelized Cost of Electricity (LCOE) calculations
- Optimal tilt and orientation calculations for maximum energy production

### 7. `api-response.ts`

Standardizes API response formatting:

- Consistent success response structure
- Error response formatting with detailed messages
- Pagination support for list endpoints
- Type-safe response generation

## Usage

Import these utilities as needed in your components or server actions:

```typescript
import { calculateEfficiency, calculateROI } from "@/lib/utils/solar-analytics";
import { generateEnergyProductionCSV } from "@/lib/utils/report-generator";
import { sendNotification } from "@/lib/utils/notification-service";
```

## Best Practices

1. Always sanitize user input using the `sanitizeInput` function before processing
2. Use the standardized API response formats for consistency
3. Leverage the report generator for all data exports
4. Use the notification service for all user alerts
