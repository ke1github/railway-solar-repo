# Railway Solar Management System

A comprehensive Next.js application for managing solar installations across railway networks. This system provides real-time monitoring, site management, and performance tracking for 174 railway solar sites.

## Features

- 📊 **Real-time Dashboard** - Live statistics and performance metrics
- 🏗️ **Site Management** - Comprehensive site details and specifications
- 🗺️ **Interactive Maps** - Geographic visualization of installations
- 📈 **Performance Analytics** - Energy generation and efficiency tracking
- 🔧 **Maintenance Scheduling** - Automated maintenance planning
- 📱 **Responsive Design** - Mobile-friendly interface
- 🧮 **Solar Analytics** - ROI calculation and performance metrics
- 📄 **Report Generation** - Customizable CSV exports and formatted reports
- 🔔 **Notification System** - Alerts for maintenance and performance issues

## Tech Stack

- **Frontend**: Next.js 15.4.2, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Data Layer**: Mock data (with planned Appwrite integration)
- **API**: RESTful APIs with Next.js App Router
- **Data**: 174 railway solar sites (2,411.5 kW total capacity)

## Architecture

This project uses a data adapter pattern to allow for flexible data source implementation:

1. **Data Adapter** - Generic interface for data operations
2. **Mock Data** - Currently using in-memory mock data
3. **Data Service** - Domain-specific service layer
4. **Future Integration** - Prepared for Appwrite backend integration

See [DATA_ARCHITECTURE.md](./docs/DATA_ARCHITECTURE.md) for more details on the data architecture.

## Getting Started

### Prerequisites

- Node.js 18+
- Appwrite account (create one at [appwrite.io](https://appwrite.io))
- Environment variables configured

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables in `.env.local`:

```bash
# Check .env.example for all required variables
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_appwrite_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_appwrite_database_id
NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID=your_appwrite_storage_bucket_id
```

4. Set up Appwrite:

   - Create an Appwrite account and project
   - Set up collections as described in `docs/APPWRITE_INTEGRATION.md`

5. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:seed` - Seed database with railway sites data
- `npm run db:status` - Check database connection and status

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── sites/             # Site management pages
│   └── page.tsx           # Dashboard homepage
├── components/            # Reusable UI components
├── data/                  # CSV data files
├── lib/                   # Utility libraries
│   ├── utils/             # Helper utilities
│   │   ├── solar-analytics.ts    # ROI, efficiency calculations
│   │   ├── report-generator.ts   # Export and formatting
│   │   ├── notification-service.ts # Alert system
│   │   ├── data-validation.ts    # Input sanitization
│   │   ├── date-utils.ts         # Date formatting
│   │   ├── solar-calculator.ts   # Solar calculations
│   │   └── api-response.ts       # API response formatting
├── models/                # Database schemas
├── scripts/               # Database scripts
└── public/                # Static assets
```

## API Endpoints

- `GET /api/stats` - Overall system statistics
- `GET /api/sites` - List all sites with pagination
- `GET /api/sites/[id]` - Individual site details

## Database

The system uses MongoDB with 174 railway solar sites across 7 clusters:

- **KGP**: 75 sites, 1,146 kW
- **BLS**: 28 sites, 386 kW
- **GII**: 24 sites, 383 kW
- **KGP 2**: 13 sites, 175 kW
- **MCA**: 17 sites, 151 kW
- **HALDIA**: 14 sites, 142.5 kW
- **DGHA**: 3 sites, 28 kW

## Contributing

This is a production system for railway solar management. All changes should be tested thoroughly before deployment.

## Deploy on Vercel

To deploy this application on Vercel:

1. **Set up environment variables in Vercel**:

   - Go to your Vercel project settings
   - Add `MONGODB_URI` environment variable with your MongoDB Atlas connection string
   - Make sure to add it for all environments (Production, Preview, Development)

2. **Deploy from GitHub**:

   - Connect your GitHub repository to Vercel
   - Vercel will automatically deploy on every push to main branch

3. **Troubleshooting**:
   - If build fails with "MongoDB URI not found", ensure the environment variable is properly set in Vercel
   - The app uses dynamic rendering for database-dependent pages to avoid build-time errors

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# railway-solar-repo

# railway-solar-repo
