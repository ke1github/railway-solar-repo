import { ISolarInstallation } from "@/models/SolarInstallation";
import { IEnergyProduction } from "@/models/EnergyProduction";

interface NotificationRecipient {
  email: string;
  name: string;
  role?: string;
}

interface NotificationChannel {
  type: "email" | "sms" | "app" | "webhook";
  enabled: boolean;
  config?: Record<string, unknown>;
}

interface NotificationTemplate {
  subject: string;
  body: string;
  priority: "low" | "medium" | "high" | "urgent";
}

/**
 * Checks if maintenance is due and generates notifications
 * @param installation Solar installation to check
 * @param recipients List of notification recipients
 * @param dayThreshold Days before maintenance to start notifying
 * @returns Notification info or null if no notification needed
 */
export function checkMaintenanceDue(
  installation: ISolarInstallation,
  recipients: NotificationRecipient[],
  dayThreshold: number = 14
): {
  template: NotificationTemplate;
  recipients: NotificationRecipient[];
} | null {
  if (!installation.nextMaintenance) return null;

  const now = new Date();
  const nextMaintenance = new Date(installation.nextMaintenance);
  const daysDiff =
    (nextMaintenance.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

  // If maintenance is overdue or due within threshold
  if (daysDiff <= dayThreshold) {
    const isOverdue = daysDiff < 0;
    const priority = isOverdue ? "urgent" : daysDiff < 7 ? "high" : "medium";

    const template: NotificationTemplate = {
      subject: isOverdue
        ? `OVERDUE: Maintenance for Solar Installation ${installation.stationCode}-${installation._id}`
        : `Upcoming Maintenance: Solar Installation ${installation.stationCode}-${installation._id}`,
      body: isOverdue
        ? `Maintenance for solar installation at ${
            installation.stationCode
          } is overdue by ${Math.abs(
            Math.round(daysDiff)
          )} days. Please schedule maintenance immediately.`
        : `Maintenance for solar installation at ${
            installation.stationCode
          } is due in ${Math.round(
            daysDiff
          )} days. Please schedule maintenance.`,
      priority,
    };

    return { template, recipients };
  }

  return null;
}

/**
 * Checks for performance issues and generates notifications
 * @param installation Solar installation to check
 * @param recentProduction Recent energy production data
 * @param recipients List of notification recipients
 * @param performanceThreshold Performance threshold percentage
 * @returns Notification info or null if no notification needed
 */
export function checkPerformanceIssues(
  installation: ISolarInstallation,
  recentProduction: IEnergyProduction[],
  recipients: NotificationRecipient[],
  performanceThreshold: number = 70
): {
  template: NotificationTemplate;
  recipients: NotificationRecipient[];
} | null {
  if (recentProduction.length === 0) return null;

  // Calculate expected production based on capacity
  const capacityKW = installation.capacity;
  let totalEfficiency = 0;
  let efficiencyPoints = 0;

  // Calculate average efficiency across production records
  recentProduction.forEach((record) => {
    const potentialEnergy = capacityKW * record.sunHours;
    if (potentialEnergy > 0) {
      const efficiency = (record.energyProduced / potentialEnergy) * 100;
      totalEfficiency += efficiency;
      efficiencyPoints++;
    }
  });

  const avgEfficiency =
    efficiencyPoints > 0 ? totalEfficiency / efficiencyPoints : 0;

  // Check if efficiency is below threshold
  if (avgEfficiency < performanceThreshold) {
    const priority =
      avgEfficiency < 50 ? "high" : avgEfficiency < 60 ? "medium" : "low";

    const template: NotificationTemplate = {
      subject: `Performance Alert: Solar Installation ${installation.stationCode}-${installation._id}`,
      body: `The solar installation at ${
        installation.stationCode
      } is operating at ${avgEfficiency.toFixed(
        1
      )}% efficiency, which is below the expected threshold of ${performanceThreshold}%. Please check for potential issues.`,
      priority,
    };

    return { template, recipients };
  }

  return null;
}

/**
 * Generates notification for successful energy data recording
 * @param installation Solar installation
 * @param energyRecord Energy production record
 * @param recipients List of notification recipients
 * @returns Notification info
 */
export function generateEnergyRecordingNotification(
  installation: ISolarInstallation,
  energyRecord: IEnergyProduction,
  recipients: NotificationRecipient[]
): { template: NotificationTemplate; recipients: NotificationRecipient[] } {
  const template: NotificationTemplate = {
    subject: `Energy Data Recorded: ${installation.stationCode}`,
    body: `Energy production data has been successfully recorded for ${
      installation.stationCode
    } on ${new Date(energyRecord.date).toLocaleDateString()}.
    
Energy Produced: ${energyRecord.energyProduced.toFixed(2)} kWh
Peak Output: ${energyRecord.peakOutput.toFixed(2)} kW
Sun Hours: ${energyRecord.sunHours}
Weather: ${energyRecord.weatherConditions}
    
This data has been added to your solar monitoring system.`,
    priority: "low",
  };

  return { template, recipients };
}

/**
 * Send notification through configured channels
 * @param notification Notification template
 * @param recipients List of notification recipients
 * @param channels Notification channels
 * @returns Promise resolving to success status
 */
export async function sendNotification(
  notification: NotificationTemplate,
  recipients: NotificationRecipient[],
  channels: NotificationChannel[] = [{ type: "app", enabled: true }]
): Promise<boolean> {
  // In a real implementation, this would connect to external services
  // For now, just log the notification
  console.log(
    `[${notification.priority.toUpperCase()}] ${notification.subject}`
  );
  console.log(`Recipients: ${recipients.map((r) => r.email).join(", ")}`);
  console.log(`Message: ${notification.body}`);
  console.log(
    `Channels: ${channels
      .filter((c) => c.enabled)
      .map((c) => c.type)
      .join(", ")}`
  );

  // Return true to simulate successful notification
  return true;
}

/**
 * Schedule recurring notifications (e.g., weekly reports)
 * @param schedule Cron-like schedule string
 * @param notificationType Type of notification to schedule
 * @param config Notification configuration
 * @returns Object with schedule information
 */
export function scheduleNotification(
  schedule: string,
  notificationType: string,
  config: Record<string, unknown>
) {
  // In a real implementation, this would connect to a job scheduler
  // For demonstration purposes, return the schedule info
  return {
    id: `notification-${Date.now()}`,
    schedule,
    notificationType,
    config,
    active: true,
  };
}

/**
 * Generate maintenance reminders for upcoming scheduled maintenance
 * @param installations List of solar installations
 * @param recipients List of notification recipients
 * @param daysThreshold Days threshold for notification
 * @returns Array of notifications
 */
export function generateMaintenanceReminders(
  installations: ISolarInstallation[],
  recipients: NotificationRecipient[],
  daysThreshold: number = 14
) {
  const notifications = [];

  for (const installation of installations) {
    const maintenanceNotification = checkMaintenanceDue(
      installation,
      recipients,
      daysThreshold
    );
    if (maintenanceNotification) {
      notifications.push({
        ...maintenanceNotification,
        installationId: installation._id,
        stationCode: installation.stationCode,
        maintenanceDate: installation.nextMaintenance,
      });
    }
  }

  return notifications;
}
