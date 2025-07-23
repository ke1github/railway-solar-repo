# Railway Solar App - Database Scripts

This directory contains essential database management scripts for the Railway Solar App.

## 📁 Files

### Scripts
- **`check-database-status.ts`** - Database status checker and analytics

### Data Management
The Railway Solar App now uses **form-based data entry** instead of database seeding. Sites and EPC projects are created through professional web forms with proper validation.

## 🚀 Usage

### Check Database Status
```bash
npm run db:status
```
This will show current database status and analytics.

## 📊 Data Management Approach

### Professional Form-Based Entry
- **Sites**: Added through `/sites/new` with comprehensive site information forms
- **EPC Projects**: Created through `/epc/projects/new` with project management forms
- **Server Actions**: All data operations use Next.js 15 server actions for better performance and type safety

### Data Structure

Each railway site includes:
- **Basic Info**: Location name, site ID, address, coordinates
- **Technical Specs**: Feasible capacity, area, panel type, installation type
- **Management**: Status, priority, energy generation tracking
- **Documentation**: Notes and special considerations

EPC Projects include:
- **Project Management**: ID, name, description, timeline, budget
- **Client Information**: Contact details and requirements
- **Site Association**: Multiple sites can be linked to projects
- **Phase Tracking**: Engineering, Procurement, Construction phases
- **Team Management**: Project manager and team size

## 🏗️ Site Status Types
- `planned` - Initial planning phase
- `in-progress` - Under development/construction
- `operational` - Fully operational
- `under-maintenance` - Maintenance in progress
- `decommissioned` - End of lifecycle

## 🔧 EPC Project Status Types
- `planning` - Project planning phase
- `in-progress` - Active development
- `on-hold` - Temporarily paused
- `completed` - Successfully completed
- `cancelled` - Project cancelled

## 🌍 Clusters
- **KGP (Kharagpur)**: 75 sites - 1,146 kW
- **BLS (Balasore)**: 28 sites - 386 kW  
- **GII (Giridih)**: 24 sites - 383 kW
- **KGP 2 (Kharagpur-2)**: 13 sites - 175 kW
- **MCA (Mecheda)**: 17 sites - 151 kW
- **HALDIA**: 14 sites - 142.5 kW
- **DGHA (Digha)**: 3 sites - 28 kW

**Total: 174 sites with 2,411.5 kW capacity across 42,974.1 sq.m area**
