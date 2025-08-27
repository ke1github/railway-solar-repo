// lib/mock/mockData.ts
import {
  SolarStation,
  EnergyData,
  Project,
  ProjectIssue,
  Milestone,
  User,
  Notification,
  MaintenanceRecord,
  Contractor,
  WeatherForecast,
  FinancialSummary,
  Alert,
} from "./mockTypes";

import {
  addDays,
  subDays,
  format,
  addMonths,
  subMonths,
  subHours,
} from "date-fns";

// Helper to generate random number between min and max
const randomBetween = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Helper to generate random floating point number between min and max with precision
const randomFloatBetween = (
  min: number,
  max: number,
  precision: number = 2
): number => {
  const random = Math.random() * (max - min) + min;
  return parseFloat(random.toFixed(precision));
};

// Helper to pick a random item from an array
const randomItem = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

// Helper to generate a random date within a range
const randomDate = (start: Date, end: Date): string => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).toISOString();
};

// Generate a set of dates from start to end with interval days
const generateDateRange = (
  start: Date,
  end: Date,
  intervalDays: number
): string[] => {
  const dates: string[] = [];
  let currentDate = new Date(start);

  while (currentDate <= end) {
    dates.push(new Date(currentDate).toISOString());
    currentDate = addDays(currentDate, intervalDays);
  }

  return dates;
};

// Mock users
export const mockUsers: User[] = [
  {
    id: "user-001",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@railways.gov.in",
    role: "admin",
    division: "Eastern",
    zone: "Kharagpur",
    avatar: "/avatars/rajesh.jpg",
    phone: "+91 98765 43210",
    createdAt: subMonths(new Date(), 12).toISOString(),
    lastActive: new Date().toISOString(),
  },
  {
    id: "user-002",
    name: "Priya Sharma",
    email: "priya.sharma@railways.gov.in",
    role: "project_manager",
    division: "Eastern",
    zone: "Howrah",
    avatar: "/avatars/priya.jpg",
    phone: "+91 87654 32109",
    createdAt: subMonths(new Date(), 10).toISOString(),
    lastActive: subDays(new Date(), 1).toISOString(),
  },
  {
    id: "user-003",
    name: "Amit Singh",
    email: "amit.singh@railways.gov.in",
    role: "engineer",
    division: "Eastern",
    zone: "Kharagpur",
    avatar: "/avatars/amit.jpg",
    phone: "+91 76543 21098",
    createdAt: subMonths(new Date(), 8).toISOString(),
    lastActive: subDays(new Date(), 2).toISOString(),
  },
  {
    id: "user-004",
    name: "Sunita Patel",
    email: "sunita.patel@railways.gov.in",
    role: "viewer",
    division: "Eastern",
    zone: "Asansol",
    avatar: "/avatars/sunita.jpg",
    phone: "+91 65432 10987",
    createdAt: subMonths(new Date(), 6).toISOString(),
    lastActive: subDays(new Date(), 5).toISOString(),
  },
  {
    id: "user-005",
    name: "Ravi Verma",
    email: "ravi.verma@solarcorp.com",
    role: "contractor",
    avatar: "/avatars/ravi.jpg",
    phone: "+91 54321 09876",
    createdAt: subMonths(new Date(), 9).toISOString(),
    lastActive: new Date().toISOString(),
  },
];

// Mock contractors
export const mockContractors: Contractor[] = [
  {
    id: "contractor-001",
    name: "SolarTech Solutions Pvt. Ltd.",
    contactPerson: "Ravi Verma",
    email: "ravi.verma@solarcorp.com",
    phone: "+91 54321 09876",
    address: "42, Green Park Extension, New Delhi - 110016",
    specialization: [
      "Solar Panel Installation",
      "Battery Storage",
      "Maintenance",
    ],
    rating: 4.8,
    activeProjects: 3,
    completedProjects: 12,
    contractStartDate: subMonths(new Date(), 18).toISOString(),
    contractEndDate: addMonths(new Date(), 18).toISOString(),
  },
  {
    id: "contractor-002",
    name: "EcoEnergy Systems",
    contactPerson: "Anjali Desai",
    email: "anjali@ecoenergy.com",
    phone: "+91 87654 12345",
    address: "78, Sector 5, Salt Lake, Kolkata - 700091",
    specialization: ["Solar Engineering", "Grid Integration", "Energy Storage"],
    rating: 4.5,
    activeProjects: 2,
    completedProjects: 8,
    contractStartDate: subMonths(new Date(), 12).toISOString(),
    contractEndDate: addMonths(new Date(), 24).toISOString(),
  },
  {
    id: "contractor-003",
    name: "GreenWave Renewables",
    contactPerson: "Kiran Reddy",
    email: "kiran@greenwave.com",
    phone: "+91 98765 56789",
    address: "12, Industrial Area, Phase 2, Chandigarh - 160002",
    specialization: [
      "Solar Panel Manufacturing",
      "Installation",
      "Maintenance",
    ],
    rating: 4.2,
    activeProjects: 4,
    completedProjects: 15,
    contractStartDate: subMonths(new Date(), 24).toISOString(),
    contractEndDate: addMonths(new Date(), 12).toISOString(),
  },
];

// Mock solar stations
export const mockSolarStations: SolarStation[] = [
  {
    id: "station-001",
    name: "Kharagpur Main Station",
    location: "Kharagpur, West Bengal",
    coordinates: {
      latitude: 22.3316,
      longitude: 87.3231,
    },
    division: "Eastern",
    zone: "Kharagpur",
    capacity: 500, // 500 kW
    status: "operational",
    installationDate: subMonths(new Date(), 18).toISOString(),
    lastMaintenance: subMonths(new Date(), 1).toISOString(),
    nextMaintenance: addMonths(new Date(), 2).toISOString(),
    panelType: "Monocrystalline",
    panelCount: 1200,
    efficiency: 23.5,
    landArea: 5000,
    batteryStorage: true,
    batteryCapacity: 200,
    createdAt: subMonths(new Date(), 24).toISOString(),
    updatedAt: subDays(new Date(), 5).toISOString(),
  },
  {
    id: "station-002",
    name: "Howrah Junction",
    location: "Howrah, West Bengal",
    coordinates: {
      latitude: 22.5834,
      longitude: 88.3433,
    },
    division: "Eastern",
    zone: "Howrah",
    capacity: 750,
    status: "operational",
    installationDate: subMonths(new Date(), 12).toISOString(),
    lastMaintenance: subMonths(new Date(), 2).toISOString(),
    nextMaintenance: addMonths(new Date(), 1).toISOString(),
    panelType: "Polycrystalline",
    panelCount: 1800,
    efficiency: 21.2,
    landArea: 8000,
    batteryStorage: false,
    createdAt: subMonths(new Date(), 18).toISOString(),
    updatedAt: subDays(new Date(), 10).toISOString(),
  },
  {
    id: "station-003",
    name: "Asansol Railway Station",
    location: "Asansol, West Bengal",
    coordinates: {
      latitude: 23.6739,
      longitude: 86.9823,
    },
    division: "Eastern",
    zone: "Asansol",
    capacity: 300,
    status: "maintenance",
    installationDate: subMonths(new Date(), 24).toISOString(),
    lastMaintenance: subDays(new Date(), 2).toISOString(),
    nextMaintenance: addDays(new Date(), 5).toISOString(),
    panelType: "Monocrystalline",
    panelCount: 720,
    efficiency: 22.1,
    landArea: 3000,
    batteryStorage: false,
    createdAt: subMonths(new Date(), 30).toISOString(),
    updatedAt: subDays(new Date(), 2).toISOString(),
  },
  {
    id: "station-004",
    name: "Durgapur Station",
    location: "Durgapur, West Bengal",
    coordinates: {
      latitude: 23.5204,
      longitude: 87.3119,
    },
    division: "Eastern",
    zone: "Asansol",
    capacity: 400,
    status: "operational",
    installationDate: subMonths(new Date(), 15).toISOString(),
    lastMaintenance: subMonths(new Date(), 3).toISOString(),
    nextMaintenance: addMonths(new Date(), 3).toISOString(),
    panelType: "Polycrystalline",
    panelCount: 960,
    efficiency: 20.5,
    landArea: 4200,
    batteryStorage: true,
    batteryCapacity: 150,
    createdAt: subMonths(new Date(), 20).toISOString(),
    updatedAt: subDays(new Date(), 15).toISOString(),
  },
  {
    id: "station-005",
    name: "Sealdah Station",
    location: "Kolkata, West Bengal",
    coordinates: {
      latitude: 22.5726,
      longitude: 88.3739,
    },
    division: "Eastern",
    zone: "Sealdah",
    capacity: 600,
    status: "operational",
    installationDate: subMonths(new Date(), 9).toISOString(),
    lastMaintenance: subMonths(new Date(), 1).toISOString(),
    nextMaintenance: addMonths(new Date(), 2).toISOString(),
    panelType: "Monocrystalline",
    panelCount: 1440,
    efficiency: 24.1,
    landArea: 6500,
    batteryStorage: true,
    batteryCapacity: 250,
    createdAt: subMonths(new Date(), 14).toISOString(),
    updatedAt: subDays(new Date(), 7).toISOString(),
  },
  {
    id: "station-006",
    name: "Malda Town Station",
    location: "Malda, West Bengal",
    coordinates: {
      latitude: 25.022,
      longitude: 88.1417,
    },
    division: "Eastern",
    zone: "Malda",
    capacity: 350,
    status: "construction",
    installationDate: addMonths(new Date(), 2).toISOString(), // Future date
    lastMaintenance: "", // Not applicable
    nextMaintenance: addMonths(new Date(), 8).toISOString(),
    panelType: "Bifacial",
    panelCount: 840,
    efficiency: 25.0,
    landArea: 3800,
    batteryStorage: true,
    batteryCapacity: 180,
    createdAt: subMonths(new Date(), 6).toISOString(),
    updatedAt: subDays(new Date(), 3).toISOString(),
  },
  {
    id: "station-007",
    name: "Barddhaman Junction",
    location: "Barddhaman, West Bengal",
    coordinates: {
      latitude: 23.2419,
      longitude: 87.8614,
    },
    division: "Eastern",
    zone: "Howrah",
    capacity: 450,
    status: "operational",
    installationDate: subMonths(new Date(), 10).toISOString(),
    lastMaintenance: subMonths(new Date(), 2).toISOString(),
    nextMaintenance: addMonths(new Date(), 1).toISOString(),
    panelType: "Monocrystalline",
    panelCount: 1080,
    efficiency: 22.8,
    landArea: 4800,
    batteryStorage: false,
    createdAt: subMonths(new Date(), 16).toISOString(),
    updatedAt: subDays(new Date(), 20).toISOString(),
  },
  {
    id: "station-008",
    name: "Siliguri Junction",
    location: "Siliguri, West Bengal",
    coordinates: {
      latitude: 26.7089,
      longitude: 88.4295,
    },
    division: "Northeast Frontier",
    zone: "Katihar",
    capacity: 250,
    status: "planned",
    installationDate: addMonths(new Date(), 6).toISOString(), // Future date
    lastMaintenance: "", // Not applicable
    nextMaintenance: addMonths(new Date(), 12).toISOString(),
    panelType: "Bifacial",
    panelCount: 600,
    efficiency: 25.5,
    landArea: 2700,
    batteryStorage: true,
    batteryCapacity: 120,
    createdAt: subMonths(new Date(), 2).toISOString(),
    updatedAt: subDays(new Date(), 1).toISOString(),
  },
];

// Generate energy data for the past 30 days for each station
export const generateEnergyData = (): EnergyData[] => {
  const energyData: EnergyData[] = [];
  const today = new Date();
  const startDate = subDays(today, 30);

  mockSolarStations.forEach((station) => {
    if (station.status === "operational") {
      const dateRange = generateDateRange(startDate, today, 1);

      dateRange.forEach((date, index) => {
        const baseProduction = station.capacity * randomBetween(3, 6); // kWh production based on capacity
        const weatherConditions: (
          | "sunny"
          | "partially_cloudy"
          | "cloudy"
          | "rainy"
        )[] = ["sunny", "partially_cloudy", "cloudy", "rainy"];
        const weather = randomItem(weatherConditions);

        // Adjust production based on weather
        let weatherMultiplier = 1;
        switch (weather) {
          case "sunny":
            weatherMultiplier = randomFloatBetween(0.9, 1.0);
            break;
          case "partially_cloudy":
            weatherMultiplier = randomFloatBetween(0.7, 0.9);
            break;
          case "cloudy":
            weatherMultiplier = randomFloatBetween(0.4, 0.7);
            break;
          case "rainy":
            weatherMultiplier = randomFloatBetween(0.2, 0.4);
            break;
        }

        const production = baseProduction * weatherMultiplier;
        const consumption = baseProduction * randomFloatBetween(0.4, 0.8);
        const surplus = production - consumption;

        energyData.push({
          id: `energy-${station.id}-${index}`,
          stationId: station.id,
          timestamp: date,
          production,
          consumption,
          surplus,
          weather,
          temperature: randomFloatBetween(20, 38),
          peakOutput: production / randomBetween(5, 8),
          efficiency: randomFloatBetween(80, 98),
          gridExport: surplus * randomFloatBetween(0.8, 1.0),
          batteryCharge: station.batteryStorage
            ? randomBetween(20, 95)
            : undefined,
          co2Saved: production * 0.85, // kg of CO2 saved per kWh
        });
      });
    }
  });

  return energyData;
};

// Generate mock projects
export const mockProjects: Project[] = [
  {
    id: "project-001",
    name: "Kharagpur Station Solar Expansion",
    description:
      "Expansion of existing solar installation at Kharagpur Main Station to increase capacity by 250kW",
    location: "Kharagpur, West Bengal",
    division: "Eastern",
    zone: "Kharagpur",
    startDate: subMonths(new Date(), 3).toISOString(),
    targetCompletionDate: addMonths(new Date(), 3).toISOString(),
    status: "construction",
    budget: 12500000, // 1.25 Crore INR
    expenditure: 7800000, // 78 Lakh INR
    contractorId: "contractor-001",
    projectManager: "user-002",
    railwayContact: "user-001",
    capacity: 250, // kW
    priority: "high",
    risksAndIssues: [],
    milestones: [],
    tags: ["expansion", "battery-storage", "high-efficiency"],
    attachments: [],
    createdAt: subMonths(new Date(), 4).toISOString(),
    updatedAt: subDays(new Date(), 2).toISOString(),
  },
  {
    id: "project-002",
    name: "Howrah Junction Battery Integration",
    description:
      "Installation of 300kWh battery storage system at Howrah Junction to store excess solar energy",
    location: "Howrah, West Bengal",
    division: "Eastern",
    zone: "Howrah",
    startDate: subMonths(new Date(), 2).toISOString(),
    targetCompletionDate: addMonths(new Date(), 4).toISOString(),
    status: "procurement",
    budget: 18000000, // 1.8 Crore INR
    expenditure: 5400000, // 54 Lakh INR
    contractorId: "contractor-002",
    projectManager: "user-002",
    railwayContact: "user-001",
    capacity: 0, // Not adding capacity, just storage
    priority: "medium",
    risksAndIssues: [],
    milestones: [],
    tags: ["battery-storage", "grid-integration", "energy-management"],
    attachments: [],
    createdAt: subMonths(new Date(), 3).toISOString(),
    updatedAt: subDays(new Date(), 5).toISOString(),
  },
  {
    id: "project-003",
    name: "Siliguri Junction Solar Installation",
    description:
      "New 250kW solar installation at Siliguri Junction with modern bifacial panels",
    location: "Siliguri, West Bengal",
    division: "Northeast Frontier",
    zone: "Katihar",
    startDate: subMonths(new Date(), 1).toISOString(),
    targetCompletionDate: addMonths(new Date(), 5).toISOString(),
    status: "planning",
    budget: 15000000, // 1.5 Crore INR
    expenditure: 2000000, // 20 Lakh INR
    contractorId: "contractor-003",
    projectManager: "user-003",
    railwayContact: "user-001",
    capacity: 250, // kW
    priority: "medium",
    risksAndIssues: [],
    milestones: [],
    tags: ["new-installation", "bifacial", "battery-storage"],
    attachments: [],
    createdAt: subMonths(new Date(), 2).toISOString(),
    updatedAt: subDays(new Date(), 1).toISOString(),
  },
  {
    id: "project-004",
    name: "Asansol Station Panel Replacement",
    description:
      "Replacement of aging solar panels at Asansol Railway Station with higher efficiency units",
    location: "Asansol, West Bengal",
    division: "Eastern",
    zone: "Asansol",
    startDate: subDays(new Date(), 15).toISOString(),
    targetCompletionDate: addMonths(new Date(), 1).toISOString(),
    status: "procurement",
    budget: 8000000, // 80 Lakh INR
    expenditure: 3000000, // 30 Lakh INR
    contractorId: "contractor-001",
    projectManager: "user-003",
    railwayContact: "user-004",
    capacity: 50, // Additional 50kW from higher efficiency
    priority: "medium",
    risksAndIssues: [],
    milestones: [],
    tags: ["replacement", "efficiency-upgrade", "maintenance"],
    attachments: [],
    createdAt: subMonths(new Date(), 1).toISOString(),
    updatedAt: subDays(new Date(), 3).toISOString(),
  },
  {
    id: "project-005",
    name: "Eastern Division Smart Grid Integration",
    description:
      "Implementation of smart grid technology to optimize energy distribution across all Eastern Division solar installations",
    location: "Multiple Locations, Eastern Division",
    division: "Eastern",
    zone: "Multiple",
    startDate: subMonths(new Date(), 6).toISOString(),
    targetCompletionDate: addMonths(new Date(), 2).toISOString(),
    status: "testing",
    budget: 25000000, // 2.5 Crore INR
    expenditure: 20000000, // 2 Crore INR
    contractorId: "contractor-002",
    projectManager: "user-002",
    railwayContact: "user-001",
    capacity: 0, // No capacity addition, just grid optimization
    priority: "high",
    risksAndIssues: [],
    milestones: [],
    tags: ["smart-grid", "optimization", "integration", "technology"],
    attachments: [],
    createdAt: subMonths(new Date(), 7).toISOString(),
    updatedAt: subDays(new Date(), 7).toISOString(),
  },
];

// Generate project issues
export const generateProjectIssues = (): ProjectIssue[] => {
  const issues: ProjectIssue[] = [
    {
      id: "issue-001",
      projectId: "project-001",
      title: "Land Clearance Delay",
      description:
        "Delay in getting forest department clearance for additional land use",
      severity: "high",
      status: "in_progress",
      assignedTo: "user-002",
      reportedBy: "user-003",
      reportedDate: subDays(new Date(), 15).toISOString(),
      impact: "May delay construction start by 2-3 weeks",
      mitigationPlan:
        "Escalated to senior railway officials for expedited clearance",
    },
    {
      id: "issue-002",
      projectId: "project-002",
      title: "Battery Supply Shortage",
      description:
        "Global supply chain issues affecting battery cell availability",
      severity: "medium",
      status: "open",
      assignedTo: "user-002",
      reportedBy: "user-005",
      reportedDate: subDays(new Date(), 10).toISOString(),
      impact:
        "May need to reduce initial storage capacity or delay implementation",
      mitigationPlan:
        "Looking at alternative suppliers and battery technologies",
    },
    {
      id: "issue-003",
      projectId: "project-003",
      title: "Local Opposition",
      description:
        "Some local residents have concerns about land use for the installation",
      severity: "medium",
      status: "in_progress",
      assignedTo: "user-001",
      reportedBy: "user-003",
      reportedDate: subDays(new Date(), 5).toISOString(),
      impact: "Potential for project delays if not addressed",
      mitigationPlan:
        "Community outreach program and public information sessions scheduled",
    },
    {
      id: "issue-004",
      projectId: "project-004",
      title: "Panel Specification Mismatch",
      description:
        "Delivered panels don't match exact specifications in the contract",
      severity: "low",
      status: "resolved",
      assignedTo: "user-003",
      reportedBy: "user-003",
      reportedDate: subDays(new Date(), 20).toISOString(),
      resolutionDate: subDays(new Date(), 5).toISOString(),
      impact: "Minor efficiency difference of 0.5%",
      mitigationPlan: "Accepted panels with contract price adjustment",
    },
    {
      id: "issue-005",
      projectId: "project-005",
      title: "Software Integration Complexity",
      description:
        "Integration of different station management systems more complex than anticipated",
      severity: "high",
      status: "in_progress",
      assignedTo: "user-002",
      reportedBy: "user-005",
      reportedDate: subDays(new Date(), 30).toISOString(),
      impact:
        "Additional development time needed, may delay final testing phase",
      mitigationPlan:
        "Added additional developers to the team and prioritizing critical integration points",
    },
  ];

  return issues;
};

// Generate project milestones
export const generateProjectMilestones = (): Milestone[] => {
  const milestones: Milestone[] = [
    // Project 001 Milestones
    {
      id: "milestone-001",
      projectId: "project-001",
      title: "Land Preparation Complete",
      description: "Clearing and preparation of the expansion area",
      dueDate: subDays(new Date(), 10).toISOString(),
      completionDate: subDays(new Date(), 5).toISOString(),
      status: "completed",
      dependencies: [],
      assignedTo: "user-003",
      weight: 15,
    },
    {
      id: "milestone-002",
      projectId: "project-001",
      title: "Foundation Construction",
      description: "Installation of foundations for new solar arrays",
      dueDate: addDays(new Date(), 10).toISOString(),
      status: "in_progress",
      dependencies: ["milestone-001"],
      assignedTo: "user-003",
      weight: 25,
    },
    {
      id: "milestone-003",
      projectId: "project-001",
      title: "Panel Installation",
      description: "Mounting and wiring of new solar panels",
      dueDate: addDays(new Date(), 40).toISOString(),
      status: "pending",
      dependencies: ["milestone-002"],
      assignedTo: "user-005",
      weight: 35,
    },
    {
      id: "milestone-004",
      projectId: "project-001",
      title: "System Integration & Testing",
      description: "Integration with existing system and performance testing",
      dueDate: addDays(new Date(), 70).toISOString(),
      status: "pending",
      dependencies: ["milestone-003"],
      assignedTo: "user-002",
      weight: 25,
    },

    // Project 002 Milestones
    {
      id: "milestone-005",
      projectId: "project-002",
      title: "Battery Procurement",
      description: "Purchase and delivery of battery storage units",
      dueDate: addDays(new Date(), 30).toISOString(),
      status: "in_progress",
      dependencies: [],
      assignedTo: "user-002",
      weight: 40,
    },
    {
      id: "milestone-006",
      projectId: "project-002",
      title: "Battery Installation",
      description: "Installation and connection of battery storage system",
      dueDate: addDays(new Date(), 60).toISOString(),
      status: "pending",
      dependencies: ["milestone-005"],
      assignedTo: "user-005",
      weight: 30,
    },
    {
      id: "milestone-007",
      projectId: "project-002",
      title: "Control System Implementation",
      description: "Installation of battery management and control systems",
      dueDate: addDays(new Date(), 90).toISOString(),
      status: "pending",
      dependencies: ["milestone-006"],
      assignedTo: "user-002",
      weight: 30,
    },

    // Project 003 Milestones
    {
      id: "milestone-008",
      projectId: "project-003",
      title: "Site Survey & Planning",
      description: "Detailed site survey and installation planning",
      dueDate: subDays(new Date(), 5).toISOString(),
      completionDate: subDays(new Date(), 10).toISOString(),
      status: "completed",
      dependencies: [],
      assignedTo: "user-003",
      weight: 10,
    },
    {
      id: "milestone-009",
      projectId: "project-003",
      title: "Permitting & Approvals",
      description: "Obtaining necessary permits and approvals",
      dueDate: addDays(new Date(), 15).toISOString(),
      status: "in_progress",
      dependencies: ["milestone-008"],
      assignedTo: "user-001",
      weight: 15,
    },
  ];

  return milestones;
};

// Generate maintenance records
export const generateMaintenanceRecords = (): MaintenanceRecord[] => {
  const records: MaintenanceRecord[] = [
    {
      id: "maintenance-001",
      stationId: "station-001",
      type: "routine",
      startDate: subMonths(new Date(), 1).toISOString(),
      endDate: subMonths(new Date(), 1).toISOString(),
      status: "completed",
      assignedTo: ["user-003", "user-005"],
      description: "Quarterly panel cleaning and inspection",
      findings: "Minor dust accumulation, all panels functioning normally",
      actions: "Cleaned all panels, lubricated tracking mechanism",
      cost: 45000,
      attachments: [],
    },
    {
      id: "maintenance-002",
      stationId: "station-002",
      type: "routine",
      startDate: subMonths(new Date(), 2).toISOString(),
      endDate: subMonths(new Date(), 2).toISOString(),
      status: "completed",
      assignedTo: ["user-003"],
      description: "Quarterly panel cleaning and inspection",
      findings: "Three panels showing reduced output",
      actions: "Cleaned all panels, replaced three defective panels",
      cost: 65000,
      attachments: [],
    },
    {
      id: "maintenance-003",
      stationId: "station-003",
      type: "emergency",
      startDate: subDays(new Date(), 2).toISOString(),
      endDate: addDays(new Date(), 3).toISOString(),
      status: "in_progress",
      assignedTo: ["user-003", "user-005"],
      description: "Inverter failure affecting 40% of array",
      findings: "Primary inverter showing circuit board failure",
      actions:
        "Ordered replacement parts, temporary workaround implemented to maintain partial operation",
      cost: 120000,
      attachments: [],
    },
    {
      id: "maintenance-004",
      stationId: "station-004",
      type: "upgrade",
      startDate: subMonths(new Date(), 3).toISOString(),
      endDate: subMonths(new Date(), 3).toISOString(),
      status: "completed",
      assignedTo: ["user-003", "user-005"],
      description: "Monitoring system upgrade",
      findings: "Previous monitoring system outdated and missing key metrics",
      actions:
        "Installed new monitoring hardware and software with remote access capabilities",
      cost: 85000,
      attachments: [],
    },
    {
      id: "maintenance-005",
      stationId: "station-001",
      type: "routine",
      startDate: addMonths(new Date(), 2).toISOString(),
      endDate: addMonths(new Date(), 2).toISOString(),
      status: "scheduled",
      assignedTo: ["user-003"],
      description: "Quarterly panel cleaning and inspection",
      attachments: [],
    },
  ];

  return records;
};

// Generate weather forecasts
export const generateWeatherForecasts = (): WeatherForecast[] => {
  const forecasts: WeatherForecast[] = [];

  mockSolarStations.forEach((station) => {
    if (station.status !== "planned") {
      // Generate 7-day forecast
      for (let i = 0; i < 7; i++) {
        const forecastDate = addDays(new Date(), i);
        const conditions: (
          | "sunny"
          | "partially_cloudy"
          | "cloudy"
          | "rainy"
          | "stormy"
        )[] = ["sunny", "partially_cloudy", "cloudy", "rainy", "stormy"];
        const condition = randomItem(conditions);

        // Calculate predicted production based on condition
        let productionFactor = 1;
        switch (condition) {
          case "sunny":
            productionFactor = randomFloatBetween(0.9, 1.0);
            break;
          case "partially_cloudy":
            productionFactor = randomFloatBetween(0.7, 0.9);
            break;
          case "cloudy":
            productionFactor = randomFloatBetween(0.4, 0.7);
            break;
          case "rainy":
            productionFactor = randomFloatBetween(0.2, 0.4);
            break;
          case "stormy":
            productionFactor = randomFloatBetween(0.1, 0.3);
            break;
        }

        const baseProduction = station.capacity * randomBetween(3, 6);
        const predictedProduction = baseProduction * productionFactor;

        forecasts.push({
          id: `forecast-${station.id}-${i}`,
          stationId: station.id,
          date: forecastDate.toISOString(),
          sunrise: "06:15:00",
          sunset: "18:30:00",
          maxTemperature: randomBetween(24, 38),
          minTemperature: randomBetween(18, 26),
          condition,
          precipitationChance:
            condition === "sunny"
              ? randomBetween(0, 5)
              : condition === "partially_cloudy"
              ? randomBetween(5, 20)
              : condition === "cloudy"
              ? randomBetween(20, 40)
              : condition === "rainy"
              ? randomBetween(40, 80)
              : randomBetween(70, 95),
          windSpeed: randomBetween(5, 25),
          predictedProduction,
        });
      }
    }
  });

  return forecasts;
};

// Generate financial summaries
export const generateFinancialSummaries = (): FinancialSummary[] => {
  const summaries: FinancialSummary[] = [];
  const currentDate = new Date();

  // Generate monthly summaries for the past 12 months
  for (let i = 0; i < 12; i++) {
    const month = subMonths(currentDate, i);
    const periodString = format(month, "yyyy-MM");

    // Calculate total production across all operational stations
    const baseProduction = mockSolarStations
      .filter((station) => {
        const installationDate = new Date(station.installationDate);
        return station.status === "operational" && installationDate < month;
      })
      .reduce(
        (total, station) => total + station.capacity * randomBetween(80, 150),
        0
      );

    // Apply seasonal variations
    const monthIndex = month.getMonth();
    let seasonalFactor = 1;

    // Assuming India: summer (Mar-Jun) higher production, monsoon (Jul-Sep) lower, winter (Oct-Feb) moderate
    if (monthIndex >= 2 && monthIndex <= 5) {
      seasonalFactor = randomFloatBetween(0.9, 1.1); // Summer
    } else if (monthIndex >= 6 && monthIndex <= 8) {
      seasonalFactor = randomFloatBetween(0.6, 0.8); // Monsoon
    } else {
      seasonalFactor = randomFloatBetween(0.7, 0.9); // Winter
    }

    const totalProduction = baseProduction * seasonalFactor;
    const revenueGenerated = totalProduction * randomFloatBetween(5, 7); // INR per kWh
    const maintenanceCost = baseProduction * randomFloatBetween(0.5, 1.2);
    const operationalCost = baseProduction * randomFloatBetween(0.3, 0.7);
    const netSavings = revenueGenerated - maintenanceCost - operationalCost;

    summaries.push({
      id: `finance-${periodString}`,
      period: periodString,
      totalProduction,
      revenueGenerated,
      maintenanceCost,
      operationalCost,
      netSavings,
      roi: (netSavings / (maintenanceCost + operationalCost)) * 100,
      carbonOffsetValue: totalProduction * 0.85 * randomFloatBetween(500, 1000), // Value of carbon credits
    });
  }

  return summaries;
};

// Generate alerts
export const generateAlerts = (): Alert[] => {
  const alerts: Alert[] = [
    {
      id: "alert-001",
      stationId: "station-003",
      type: "system_failure",
      severity: "high",
      message: "Inverter failure detected at Asansol Railway Station",
      timestamp: subDays(new Date(), 2).toISOString(),
      acknowledged: true,
      acknowledgedBy: "user-003",
      acknowledgedAt: subDays(new Date(), 2).toISOString(),
      resolved: false,
      actions: "Maintenance team dispatched, replacement parts ordered",
    },
    {
      id: "alert-002",
      stationId: "station-001",
      type: "production_drop",
      severity: "medium",
      message: "Production drop of 15% detected in northwest section of array",
      timestamp: subDays(new Date(), 1).toISOString(),
      acknowledged: true,
      acknowledgedBy: "user-002",
      acknowledgedAt: subDays(new Date(), 1).toISOString(),
      resolved: false,
      actions: "Scheduled investigation for tomorrow",
    },
    {
      id: "alert-003",
      stationId: "station-004",
      type: "maintenance_due",
      severity: "low",
      message: "Routine maintenance due for Durgapur Station",
      timestamp: subDays(new Date(), 5).toISOString(),
      acknowledged: true,
      acknowledgedBy: "user-003",
      acknowledgedAt: subDays(new Date(), 4).toISOString(),
      resolved: true,
      resolvedBy: "user-003",
      resolvedAt: subDays(new Date(), 2).toISOString(),
      actions: "Completed routine maintenance ahead of schedule",
    },
    {
      id: "alert-004",
      stationId: "station-002",
      type: "weather_warning",
      severity: "medium",
      message: "Severe thunderstorm warning for Howrah area in next 48 hours",
      timestamp: new Date().toISOString(),
      acknowledged: false,
      resolved: false,
    },
    {
      id: "alert-005",
      stationId: "station-005",
      type: "grid_issue",
      severity: "high",
      message: "Grid connection instability detected at Sealdah Station",
      timestamp: subHours(new Date(), 6).toISOString(),
      acknowledged: true,
      acknowledgedBy: "user-002",
      acknowledgedAt: subHours(new Date(), 5).toISOString(),
      resolved: false,
      actions:
        "Coordinating with electrical department to investigate grid issues",
    },
  ];

  return alerts;
};

// Generate notifications
export const generateNotifications = (): Notification[] => {
  const notifications: Notification[] = [
    {
      id: "notification-001",
      userId: "user-001",
      title: "High Priority Alert",
      message:
        "Inverter failure at Asansol Railway Station requires immediate attention",
      type: "critical",
      relatedTo: {
        type: "station",
        id: "station-003",
      },
      read: false,
      createdAt: subDays(new Date(), 2).toISOString(),
    },
    {
      id: "notification-002",
      userId: "user-001",
      title: "Project Milestone Completed",
      message:
        "Land Preparation milestone completed for Kharagpur Station Solar Expansion",
      type: "success",
      relatedTo: {
        type: "project",
        id: "project-001",
      },
      read: true,
      createdAt: subDays(new Date(), 5).toISOString(),
    },
    {
      id: "notification-003",
      userId: "user-001",
      title: "Weather Warning",
      message:
        "Severe weather expected in Howrah area which may affect solar production",
      type: "warning",
      relatedTo: {
        type: "station",
        id: "station-002",
      },
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "notification-004",
      userId: "user-001",
      title: "New Issue Reported",
      message:
        "Local opposition reported for Siliguri Junction Solar Installation project",
      type: "info",
      relatedTo: {
        type: "issue",
        id: "issue-003",
      },
      read: false,
      createdAt: subDays(new Date(), 5).toISOString(),
    },
    {
      id: "notification-005",
      userId: "user-001",
      title: "Production Record",
      message:
        "Kharagpur Main Station achieved record daily production yesterday",
      type: "success",
      relatedTo: {
        type: "station",
        id: "station-001",
      },
      read: true,
      createdAt: subDays(new Date(), 1).toISOString(),
    },
  ];

  return notifications;
};

// Generate initial data
export const mockData = {
  users: mockUsers,
  contractors: mockContractors,
  solarStations: mockSolarStations,
  energyData: generateEnergyData(),
  projects: mockProjects,
  projectIssues: generateProjectIssues(),
  projectMilestones: generateProjectMilestones(),
  maintenanceRecords: generateMaintenanceRecords(),
  weatherForecasts: generateWeatherForecasts(),
  financialSummaries: generateFinancialSummaries(),
  alerts: generateAlerts(),
  notifications: generateNotifications(),
};

export default mockData;
