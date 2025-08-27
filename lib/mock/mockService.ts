// lib/mock/mockService.ts
import mockData from "./mockData";
import {
  SolarStation,
  EnergyData,
  Project,
  ProjectIssue,
  Milestone,
  MaintenanceRecord,
  Alert,
  Notification,
  User,
  Contractor,
  WeatherForecast,
  FinancialSummary,
} from "./mockTypes";

// Simulate API response format
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  totalCount?: number;
  page?: number;
  pageSize?: number;
}

// Define the Dashboard Stats interface
interface DashboardStats {
  stationStats: {
    operational: number;
    total: number;
    underMaintenance: number;
    underConstruction: number;
    planned: number;
  };
  energyStats: {
    totalCapacity: number;
    todayProduction: number;
    monthlySavings: number;
  };
  projectStats: {
    active: number;
    total: number;
    completed: number;
  };
  alertStats: {
    open: number;
    critical: number;
  };
}

// Class to manage mock data - can be replaced with Appwrite later
export class MockDataService {
  private data = mockData;

  // Helper method to simulate network delay
  private async simulateDelay(
    minMs: number = 200,
    maxMs: number = 800
  ): Promise<void> {
    const delay = Math.floor(Math.random() * (maxMs - minMs + 1) + minMs);
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Solar Stations
  async getSolarStations(
    filter?: Partial<SolarStation>
  ): Promise<ApiResponse<SolarStation[]>> {
    await this.simulateDelay();

    try {
      let stations = [...this.data.solarStations];

      // Apply filters if provided
      if (filter) {
        stations = stations.filter((station) => {
          for (const [key, value] of Object.entries(filter)) {
            if (station[key as keyof SolarStation] !== value) {
              return false;
            }
          }
          return true;
        });
      }

      return {
        success: true,
        data: stations,
        totalCount: stations.length,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch solar stations: ${error}`,
      };
    }
  }

  async getSolarStationById(id: string): Promise<ApiResponse<SolarStation>> {
    await this.simulateDelay(100, 400);

    try {
      const station = this.data.solarStations.find((s) => s.id === id);

      if (!station) {
        return {
          success: false,
          error: `Solar station with ID ${id} not found`,
        };
      }

      return {
        success: true,
        data: station,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch solar station: ${error}`,
      };
    }
  }

  // Energy Data
  async getEnergyData(
    stationId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<EnergyData[]>> {
    await this.simulateDelay();

    try {
      let energyData = [...this.data.energyData];

      // Filter by station ID if provided
      if (stationId) {
        energyData = energyData.filter((data) => data.stationId === stationId);
      }

      // Filter by date range if provided
      if (startDate) {
        const start = new Date(startDate);
        energyData = energyData.filter(
          (data) => new Date(data.timestamp) >= start
        );
      }

      if (endDate) {
        const end = new Date(endDate);
        energyData = energyData.filter(
          (data) => new Date(data.timestamp) <= end
        );
      }

      return {
        success: true,
        data: energyData,
        totalCount: energyData.length,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch energy data: ${error}`,
      };
    }
  }

  // Projects
  async getProjects(
    filter?: Partial<Project>
  ): Promise<ApiResponse<Project[]>> {
    await this.simulateDelay();

    try {
      let projects = [...this.data.projects];

      // Apply filters if provided
      if (filter) {
        projects = projects.filter((project) => {
          for (const [key, value] of Object.entries(filter)) {
            if (project[key as keyof Project] !== value) {
              return false;
            }
          }
          return true;
        });
      }

      return {
        success: true,
        data: projects,
        totalCount: projects.length,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch projects: ${error}`,
      };
    }
  }

  async getProjectById(id: string): Promise<ApiResponse<Project>> {
    await this.simulateDelay(100, 400);

    try {
      const project = this.data.projects.find((p) => p.id === id);

      if (!project) {
        return {
          success: false,
          error: `Project with ID ${id} not found`,
        };
      }

      return {
        success: true,
        data: project,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch project: ${error}`,
      };
    }
  }

  // Project Issues
  async getProjectIssues(
    projectId?: string
  ): Promise<ApiResponse<ProjectIssue[]>> {
    await this.simulateDelay();

    try {
      let issues = [...this.data.projectIssues];

      // Filter by project ID if provided
      if (projectId) {
        issues = issues.filter((issue) => issue.projectId === projectId);
      }

      return {
        success: true,
        data: issues,
        totalCount: issues.length,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch project issues: ${error}`,
      };
    }
  }

  // Milestones
  async getProjectMilestones(
    projectId?: string
  ): Promise<ApiResponse<Milestone[]>> {
    await this.simulateDelay();

    try {
      let milestones = [...this.data.projectMilestones];

      // Filter by project ID if provided
      if (projectId) {
        milestones = milestones.filter(
          (milestone) => milestone.projectId === projectId
        );
      }

      return {
        success: true,
        data: milestones,
        totalCount: milestones.length,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch project milestones: ${error}`,
      };
    }
  }

  // Maintenance Records
  async getMaintenanceRecords(
    stationId?: string
  ): Promise<ApiResponse<MaintenanceRecord[]>> {
    await this.simulateDelay();

    try {
      let records = [...this.data.maintenanceRecords];

      // Filter by station ID if provided
      if (stationId) {
        records = records.filter((record) => record.stationId === stationId);
      }

      return {
        success: true,
        data: records,
        totalCount: records.length,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch maintenance records: ${error}`,
      };
    }
  }

  // Weather Forecasts
  async getWeatherForecasts(
    stationId?: string
  ): Promise<ApiResponse<WeatherForecast[]>> {
    await this.simulateDelay();

    try {
      let forecasts = [...this.data.weatherForecasts];

      // Filter by station ID if provided
      if (stationId) {
        forecasts = forecasts.filter(
          (forecast) => forecast.stationId === stationId
        );
      }

      return {
        success: true,
        data: forecasts,
        totalCount: forecasts.length,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch weather forecasts: ${error}`,
      };
    }
  }

  // Financial Summaries
  async getFinancialSummaries(): Promise<ApiResponse<FinancialSummary[]>> {
    await this.simulateDelay();

    try {
      const summaries = [...this.data.financialSummaries];

      return {
        success: true,
        data: summaries,
        totalCount: summaries.length,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch financial summaries: ${error}`,
      };
    }
  }

  // Alerts
  async getAlerts(stationId?: string): Promise<ApiResponse<Alert[]>> {
    await this.simulateDelay();

    try {
      let alerts = [...this.data.alerts];

      // Filter by station ID if provided
      if (stationId) {
        alerts = alerts.filter((alert) => alert.stationId === stationId);
      }

      return {
        success: true,
        data: alerts,
        totalCount: alerts.length,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch alerts: ${error}`,
      };
    }
  }

  // Notifications
  async getNotifications(userId: string): Promise<ApiResponse<Notification[]>> {
    await this.simulateDelay();

    try {
      const notifications = this.data.notifications.filter(
        (n) => n.userId === userId
      );

      return {
        success: true,
        data: notifications,
        totalCount: notifications.length,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch notifications: ${error}`,
      };
    }
  }

  // Users
  async getUsers(): Promise<ApiResponse<User[]>> {
    await this.simulateDelay();

    try {
      const users = [...this.data.users];

      return {
        success: true,
        data: users,
        totalCount: users.length,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch users: ${error}`,
      };
    }
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    await this.simulateDelay(100, 400);

    try {
      const user = this.data.users.find((u) => u.id === id);

      if (!user) {
        return {
          success: false,
          error: `User with ID ${id} not found`,
        };
      }

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch user: ${error}`,
      };
    }
  }

  // Contractors
  async getContractors(): Promise<ApiResponse<Contractor[]>> {
    await this.simulateDelay();

    try {
      const contractors = [...this.data.contractors];

      return {
        success: true,
        data: contractors,
        totalCount: contractors.length,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch contractors: ${error}`,
      };
    }
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    await this.simulateDelay();

    try {
      // Calculate various stats from mock data
      const operationalStations = this.data.solarStations.filter(
        (s) => s.status === "operational"
      ).length;
      const totalStations = this.data.solarStations.length;
      const totalCapacity = this.data.solarStations.reduce(
        (sum, station) => sum + station.capacity,
        0
      );

      // Calculate today's energy production (sum of most recent energy data for each station)
      const today = new Date().toISOString().split("T")[0];
      const latestEnergyData = this.data.energyData.filter((d) =>
        d.timestamp.startsWith(today)
      );

      const todayProduction = latestEnergyData.reduce(
        (sum, data) => sum + data.production,
        0
      );

      // Get active projects
      const activeProjects = this.data.projects.filter(
        (p) => p.status !== "completed" && p.status !== "cancelled"
      ).length;

      // Get open alerts
      const openAlerts = this.data.alerts.filter((a) => !a.resolved).length;

      return {
        success: true,
        data: {
          stationStats: {
            operational: operationalStations,
            total: totalStations,
            underMaintenance: this.data.solarStations.filter(
              (s) => s.status === "maintenance"
            ).length,
            underConstruction: this.data.solarStations.filter(
              (s) => s.status === "construction"
            ).length,
            planned: this.data.solarStations.filter(
              (s) => s.status === "planned"
            ).length,
          },
          energyStats: {
            totalCapacity,
            todayProduction,
            monthlySavings: this.data.financialSummaries[0]?.netSavings || 0,
          },
          projectStats: {
            active: activeProjects,
            total: this.data.projects.length,
            completed: this.data.projects.filter(
              (p) => p.status === "completed"
            ).length,
          },
          alertStats: {
            open: openAlerts,
            critical: this.data.alerts.filter(
              (a) => !a.resolved && a.severity === "critical"
            ).length,
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch dashboard stats: ${error}`,
      };
    }
  }
}

// Create singleton instance
const mockDataService = new MockDataService();
export default mockDataService;
