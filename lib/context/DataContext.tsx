// lib/context/DataContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import mockDataService from "../mock/mockService";
import type {
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
} from "../mock/mockTypes";

// Define the shape of our dashboard stats
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

// Define the context type
interface DataContextType {
  // Data state
  solarStations: SolarStation[];
  projects: Project[];
  alerts: Alert[];
  dashboardStats: DashboardStats | null;
  currentUser: User | null;
  energyData: EnergyData[];
  notifications: Notification[];

  // Loading states
  isLoadingSolarStations: boolean;
  isLoadingProjects: boolean;
  isLoadingAlerts: boolean;
  isLoadingDashboardStats: boolean;
  isLoadingEnergyData: boolean;
  isLoadingNotifications: boolean;

  // Error states
  solarStationsError: string | null;
  projectsError: string | null;
  alertsError: string | null;
  dashboardStatsError: string | null;
  energyDataError: string | null;
  notificationsError: string | null;

  // Data fetching methods
  fetchSolarStations: (filter?: Partial<SolarStation>) => Promise<void>;
  fetchSolarStationById: (id: string) => Promise<SolarStation | null>;
  fetchProjects: (filter?: Partial<Project>) => Promise<void>;
  fetchProjectById: (id: string) => Promise<Project | null>;
  fetchAlerts: (stationId?: string) => Promise<void>;
  fetchEnergyData: (
    stationId?: string,
    startDate?: string,
    endDate?: string
  ) => Promise<void>;
  fetchNotifications: (userId: string) => Promise<void>;
  fetchDashboardStats: () => Promise<void>;

  // Utility methods
  refreshAllData: () => Promise<void>;
}

// Create context with default values
const DataContext = createContext<DataContextType>({
  // Default data states
  solarStations: [],
  projects: [],
  alerts: [],
  dashboardStats: null,
  currentUser: null,
  energyData: [],
  notifications: [],

  // Default loading states
  isLoadingSolarStations: false,
  isLoadingProjects: false,
  isLoadingAlerts: false,
  isLoadingDashboardStats: false,
  isLoadingEnergyData: false,
  isLoadingNotifications: false,

  // Default error states
  solarStationsError: null,
  projectsError: null,
  alertsError: null,
  dashboardStatsError: null,
  energyDataError: null,
  notificationsError: null,

  // Default data fetching methods (placeholders that will be implemented in provider)
  fetchSolarStations: async () => {},
  fetchSolarStationById: async () => null,
  fetchProjects: async () => {},
  fetchProjectById: async () => null,
  fetchAlerts: async () => {},
  fetchEnergyData: async () => {},
  fetchNotifications: async () => {},
  fetchDashboardStats: async () => {},
  refreshAllData: async () => {},
});

// Provider component
export const DataProvider = ({ children }: { children: ReactNode }) => {
  // Data states
  const [solarStations, setSolarStations] = useState<SolarStation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [energyData, setEnergyData] = useState<EnergyData[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Loading states
  const [isLoadingSolarStations, setIsLoadingSolarStations] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(false);
  const [isLoadingDashboardStats, setIsLoadingDashboardStats] = useState(false);
  const [isLoadingEnergyData, setIsLoadingEnergyData] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  // Error states
  const [solarStationsError, setSolarStationsError] = useState<string | null>(
    null
  );
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [alertsError, setAlertsError] = useState<string | null>(null);
  const [dashboardStatsError, setDashboardStatsError] = useState<string | null>(
    null
  );
  const [energyDataError, setEnergyDataError] = useState<string | null>(null);
  const [notificationsError, setNotificationsError] = useState<string | null>(
    null
  );

  // Fetch methods
  const fetchSolarStations = async (filter?: Partial<SolarStation>) => {
    setIsLoadingSolarStations(true);
    setSolarStationsError(null);

    try {
      const response = await mockDataService.getSolarStations(filter);

      if (response.success && response.data) {
        setSolarStations(response.data);
      } else {
        setSolarStationsError(
          response.error || "Failed to fetch solar stations"
        );
      }
    } catch (error) {
      setSolarStationsError(`Error fetching solar stations: ${error}`);
    } finally {
      setIsLoadingSolarStations(false);
    }
  };

  const fetchSolarStationById = async (
    id: string
  ): Promise<SolarStation | null> => {
    try {
      const response = await mockDataService.getSolarStationById(id);

      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching solar station by ID: ${error}`);
      return null;
    }
  };

  const fetchProjects = async (filter?: Partial<Project>) => {
    setIsLoadingProjects(true);
    setProjectsError(null);

    try {
      const response = await mockDataService.getProjects(filter);

      if (response.success && response.data) {
        setProjects(response.data);
      } else {
        setProjectsError(response.error || "Failed to fetch projects");
      }
    } catch (error) {
      setProjectsError(`Error fetching projects: ${error}`);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const fetchProjectById = async (id: string): Promise<Project | null> => {
    try {
      const response = await mockDataService.getProjectById(id);

      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching project by ID: ${error}`);
      return null;
    }
  };

  const fetchAlerts = async (stationId?: string) => {
    setIsLoadingAlerts(true);
    setAlertsError(null);

    try {
      const response = await mockDataService.getAlerts(stationId);

      if (response.success && response.data) {
        setAlerts(response.data);
      } else {
        setAlertsError(response.error || "Failed to fetch alerts");
      }
    } catch (error) {
      setAlertsError(`Error fetching alerts: ${error}`);
    } finally {
      setIsLoadingAlerts(false);
    }
  };

  const fetchEnergyData = async (
    stationId?: string,
    startDate?: string,
    endDate?: string
  ) => {
    setIsLoadingEnergyData(true);
    setEnergyDataError(null);

    try {
      const response = await mockDataService.getEnergyData(
        stationId,
        startDate,
        endDate
      );

      if (response.success && response.data) {
        setEnergyData(response.data);
      } else {
        setEnergyDataError(response.error || "Failed to fetch energy data");
      }
    } catch (error) {
      setEnergyDataError(`Error fetching energy data: ${error}`);
    } finally {
      setIsLoadingEnergyData(false);
    }
  };

  const fetchNotifications = async (userId: string) => {
    setIsLoadingNotifications(true);
    setNotificationsError(null);

    try {
      const response = await mockDataService.getNotifications(userId);

      if (response.success && response.data) {
        setNotifications(response.data);
      } else {
        setNotificationsError(
          response.error || "Failed to fetch notifications"
        );
      }
    } catch (error) {
      setNotificationsError(`Error fetching notifications: ${error}`);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  const fetchDashboardStats = async () => {
    setIsLoadingDashboardStats(true);
    setDashboardStatsError(null);

    try {
      const response = await mockDataService.getDashboardStats();

      if (response.success && response.data) {
        setDashboardStats(response.data as DashboardStats);
      } else {
        setDashboardStatsError(
          response.error || "Failed to fetch dashboard stats"
        );
      }
    } catch (error) {
      setDashboardStatsError(`Error fetching dashboard stats: ${error}`);
    } finally {
      setIsLoadingDashboardStats(false);
    }
  };

  // Fetch current user (simulate login)
  const fetchCurrentUser = async () => {
    try {
      const response = await mockDataService.getUsers();

      if (response.success && response.data && response.data.length > 0) {
        // Just use the first user from the mock data as the current user
        setCurrentUser(response.data[0]);
      }
    } catch (error) {
      console.error(`Error fetching current user: ${error}`);
    }
  };

  // Utility method to refresh all data (except user-related data)
  const refreshAllData = async () => {
    await Promise.all([
      fetchSolarStations(),
      fetchProjects(),
      fetchAlerts(),
      fetchDashboardStats(),
    ]);
  };

  // Initial data loading
  useEffect(() => {
    // Load user data once at initialization
    fetchCurrentUser();
  }, []);

  // Fetch notifications when currentUser changes
  useEffect(() => {
    if (currentUser) {
      fetchNotifications(currentUser.id);
    }
  }, [currentUser]);

  // Set up data refresh
  useEffect(() => {
    // Initial data load
    refreshAllData();

    // Set up periodic refresh (every 30 seconds) to simulate real-time data
    const intervalId = setInterval(() => {
      refreshAllData();
    }, 30000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Context value
  const contextValue: DataContextType = {
    // Data state
    solarStations,
    projects,
    alerts,
    dashboardStats,
    currentUser,
    energyData,
    notifications,

    // Loading states
    isLoadingSolarStations,
    isLoadingProjects,
    isLoadingAlerts,
    isLoadingDashboardStats,
    isLoadingEnergyData,
    isLoadingNotifications,

    // Error states
    solarStationsError,
    projectsError,
    alertsError,
    dashboardStatsError,
    energyDataError,
    notificationsError,

    // Data fetching methods
    fetchSolarStations,
    fetchSolarStationById,
    fetchProjects,
    fetchProjectById,
    fetchAlerts,
    fetchEnergyData,
    fetchNotifications,
    fetchDashboardStats,
    refreshAllData,
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

// Custom hook for using the context
export const useData = () => useContext(DataContext);
