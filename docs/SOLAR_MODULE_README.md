# Railway Solar Management System - Enhanced Features

## New Solar Installation Tracking System

This module adds comprehensive tracking of solar installations across the railway network, with capabilities for:

- Recording detailed technical specifications of solar panels and systems
- Tracking energy production data over time
- Visualizing energy generation with interactive charts
- Monitoring efficiency metrics across the network
- Managing installations through their entire lifecycle
- Calculating financial metrics and ROI
- Analyzing performance and maintenance health
- Generating reports and forecasting future production

## Key Components

### Models

1. **SolarInstallation** - Tracks the physical solar installation with:

   - Technical specifications (capacity, panel types, area)
   - Location information (connected to Railway Stations)
   - Maintenance schedules
   - Grid connection details
   - Equipment information (inverters, batteries)

2. **EnergyProduction** - Records energy generation data:
   - Daily production metrics
   - Peak output monitoring
   - Weather condition correlation
   - Efficiency calculations

### UI Components

1. **SolarInstallationList** - A filterable, sortable list of all solar installations
2. **EnergyProductionChart** - Interactive chart showing energy generation trends
3. **Solar Dashboard** - Overview of the entire solar network with key metrics

### Features

- **Comprehensive Installation Details**: Track every aspect of a solar installation from planning to decommissioning
- **Performance Monitoring**: Record and analyze energy production data
- **Efficiency Analysis**: Calculate and visualize performance metrics
- **Station Integration**: Connect solar data with the railway station hierarchy
- **Documentation Management**: Store and access installation documents

## Technical Implementation

The implementation uses:

- Zod schemas for data validation
- MongoDB with Mongoose for data storage
- Chart.js for data visualization
- Next.js server components for efficient rendering
- Shadcn UI components for consistent styling

## Utility Libraries

The system includes several utility libraries to support the solar installation management:

### Solar Analytics (`solar-analytics.ts`)

- Efficiency calculation functions
- ROI and financial metrics
- Carbon offset calculations
- Performance reporting
- Maintenance health scoring

### Report Generator (`report-generator.ts`)

- CSV data export
- Formatted installation details
- Energy statistics summaries
- Performance comparisons
- Production projections

### Notification Service (`notification-service.ts`)

- Maintenance due notifications
- Performance issue alerts
- Energy recording confirmations
- Multi-channel notification support

### Data Validation (`data-validation.ts`)

- Input sanitization
- Schema-based validation
- Error formatting
- Query parameter validation

### Date Utilities (`date-utils.ts`)

- Date formatting and comparison
- Relative date display
- Maintenance schedule calculations
- Date grouping and analysis

### Solar Calculator (`solar-calculator.ts`)

- Potential energy calculations
- Panel efficiency estimations
- Degradation modeling
- Optimal tilt angle calculations
- LCOE and payback period analysis

### API Response Formatter (`api-response.ts`)

- Standardized API responses
- Error handling
- Pagination support
- Validation error formatting

## Future Enhancements

Possible enhancements include:

- Real-time energy monitoring via IoT integration
- Predictive maintenance scheduling
- Financial ROI calculations
- Carbon offset tracking
- Mobile app for field technicians
