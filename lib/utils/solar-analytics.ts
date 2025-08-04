// lib/utils/solar-analytics.ts
import { ISolarInstallation } from "@/models/SolarInstallation";
import { IEnergyProduction } from "@/models/EnergyProduction";

/**
 * Calculate efficiency of a solar installation based on its capacity and energy production
 * @param energyProduced Amount of energy produced in kWh
 * @param peakCapacity Peak capacity of the installation in kW
 * @param sunHours Number of sun hours
 * @returns Efficiency percentage
 */
export function calculateEfficiency(
  energyProduced: number,
  peakCapacity: number,
  sunHours: number
): number {
  if (!peakCapacity || !sunHours) return 0;

  const potentialEnergy = peakCapacity * sunHours;
  if (potentialEnergy === 0) return 0;

  return (energyProduced / potentialEnergy) * 100;
}

/**
 * Calculate return on investment (ROI) for a solar installation
 * @param installation The solar installation
 * @param energyPrice Price per kWh
 * @param totalEnergyProduced Total energy produced in kWh
 * @returns ROI data object with payback period and other metrics
 */
export function calculateROI(
  installation: ISolarInstallation,
  energyPrice: number,
  totalEnergyProduced: number
) {
  if (!installation.totalCost || !totalEnergyProduced || !energyPrice) {
    return {
      paybackPeriodYears: null,
      savingsToDate: 0,
      estimatedAnnualSavings: 0,
      roi: 0,
    };
  }

  // Calculate financial metrics
  const savingsToDate = totalEnergyProduced * energyPrice;

  // Estimate annual production based on available data
  const installationAgeInDays =
    (new Date().getTime() - new Date(installation.installationDate).getTime()) /
    (1000 * 60 * 60 * 24);
  const estimatedAnnualProduction =
    (totalEnergyProduced / installationAgeInDays) * 365;
  const estimatedAnnualSavings = estimatedAnnualProduction * energyPrice;

  // Calculate payback period
  const paybackPeriodYears = installation.totalCost / estimatedAnnualSavings;

  // Calculate ROI percentage
  const roi = (savingsToDate / installation.totalCost) * 100;

  return {
    paybackPeriodYears,
    savingsToDate,
    estimatedAnnualSavings,
    roi,
  };
}

/**
 * Calculate carbon offset from solar energy production
 * @param energyProduced Energy produced in kWh
 * @param carbonFactor Carbon emission factor for grid electricity (kg CO2 per kWh)
 * @returns Carbon offset in kg of CO2
 */
export function calculateCarbonOffset(
  energyProduced: number,
  carbonFactor: number = 0.85 // Default value for India's grid
): number {
  return energyProduced * carbonFactor;
}

/**
 * Generate performance report for a solar installation
 * @param installation Solar installation
 * @param energyData Energy production data
 * @param params Additional parameters
 * @returns Performance report
 */
export function generatePerformanceReport(
  installation: ISolarInstallation,
  energyData: IEnergyProduction[],
  params: {
    energyPrice: number;
    carbonFactor: number;
  } = { energyPrice: 8, carbonFactor: 0.85 }
) {
  // Calculate total energy production
  const totalEnergyProduced = energyData.reduce(
    (sum, record) => sum + record.energyProduced,
    0
  );

  // Calculate average daily production
  const uniqueDays = new Set(
    energyData.map(
      (record) => new Date(record.date).toISOString().split("T")[0]
    )
  ).size;
  const avgDailyProduction = uniqueDays ? totalEnergyProduced / uniqueDays : 0;

  // Calculate average sun hours
  const avgSunHours = energyData.length
    ? energyData.reduce((sum, record) => sum + record.sunHours, 0) /
      energyData.length
    : 0;

  // Calculate peak production day
  const peakProductionDay = energyData.length
    ? energyData.reduce(
        (max, record) =>
          record.energyProduced > max.energyProduced ? record : max,
        energyData[0]
      )
    : null;

  // Calculate efficiency
  const efficiencyData = energyData.map((record) => ({
    date: record.date,
    efficiency: calculateEfficiency(
      record.energyProduced,
      installation.capacity,
      record.sunHours
    ),
  }));

  const avgEfficiency = efficiencyData.length
    ? efficiencyData.reduce((sum, item) => sum + item.efficiency, 0) /
      efficiencyData.length
    : 0;

  // Calculate ROI
  const roi = calculateROI(
    installation,
    params.energyPrice,
    totalEnergyProduced
  );

  // Calculate carbon offset
  const carbonOffset = calculateCarbonOffset(
    totalEnergyProduced,
    params.carbonFactor
  );

  // Weather impact analysis
  const weatherImpact = analyzeWeatherImpact(energyData);

  return {
    installationId: installation._id,
    stationCode: installation.stationCode,
    capacity: installation.capacity,
    totalEnergyProduced,
    avgDailyProduction,
    avgSunHours,
    peakProductionDay: peakProductionDay
      ? {
          date: peakProductionDay.date,
          energyProduced: peakProductionDay.energyProduced,
          weather: peakProductionDay.weatherConditions,
        }
      : null,
    avgEfficiency,
    roi,
    carbonOffset,
    weatherImpact,
    dataPoints: energyData.length,
    startDate: energyData.length
      ? new Date(Math.min(...energyData.map((d) => new Date(d.date).getTime())))
      : null,
    endDate: energyData.length
      ? new Date(Math.max(...energyData.map((d) => new Date(d.date).getTime())))
      : null,
  };
}

/**
 * Analyze the impact of weather on energy production
 * @param energyData Energy production data
 * @returns Weather impact analysis
 */
function analyzeWeatherImpact(energyData: IEnergyProduction[]) {
  if (!energyData.length) return {};

  // Group by weather condition
  const weatherGroups: Record<
    string,
    { count: number; totalEnergy: number; avgEnergy: number }
  > = {};

  energyData.forEach((record) => {
    const weather = record.weatherConditions;
    if (!weatherGroups[weather]) {
      weatherGroups[weather] = { count: 0, totalEnergy: 0, avgEnergy: 0 };
    }

    weatherGroups[weather].count += 1;
    weatherGroups[weather].totalEnergy += record.energyProduced;
  });

  // Calculate averages
  Object.keys(weatherGroups).forEach((weather) => {
    weatherGroups[weather].avgEnergy =
      weatherGroups[weather].totalEnergy / weatherGroups[weather].count;
  });

  return weatherGroups;
}

/**
 * Calculate maintenance health score for a solar installation
 * @param installation Solar installation
 * @returns Health score (0-100) and recommendations
 */
export function calculateMaintenanceHealthScore(
  installation: ISolarInstallation
) {
  let score = 100;
  const recommendations: string[] = [];

  // Check if maintenance is due or overdue
  if (installation.nextMaintenance) {
    const now = new Date();
    const nextMaintenance = new Date(installation.nextMaintenance);
    const daysDiff =
      (nextMaintenance.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

    if (daysDiff < 0) {
      // Maintenance is overdue
      score -= Math.min(40, Math.abs(daysDiff) * 0.5); // Reduce score based on how overdue
      recommendations.push(
        `Maintenance is overdue by ${Math.abs(Math.round(daysDiff))} days.`
      );
    } else if (daysDiff < 14) {
      // Maintenance is coming up soon
      recommendations.push(
        `Schedule maintenance within ${Math.round(daysDiff)} days.`
      );
    }
  } else if (installation.lastMaintenance) {
    // Has previous maintenance but next is not calculated
    recommendations.push("Update maintenance schedule.");
  } else {
    // No maintenance records
    score -= 30;
    recommendations.push(
      "No maintenance records found. Schedule initial maintenance."
    );
  }

  // Check installation age vs expected lifespan
  if (installation.installationDate) {
    const ageInYears =
      (new Date().getTime() -
        new Date(installation.installationDate).getTime()) /
      (1000 * 60 * 60 * 24 * 365);
    const lifePercentUsed = (ageInYears / installation.expectedLifespan) * 100;

    if (lifePercentUsed > 80) {
      score -= 20;
      recommendations.push(
        `System at ${Math.round(
          lifePercentUsed
        )}% of expected lifespan. Consider replacement planning.`
      );
    } else if (lifePercentUsed > 60) {
      score -= 10;
      recommendations.push(
        `System at ${Math.round(
          lifePercentUsed
        )}% of expected lifespan. Increase maintenance frequency.`
      );
    }
  }

  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score));

  return {
    score: Math.round(score),
    recommendations,
  };
}

/**
 * Format currency values for display
 * @param value Numeric value
 * @param currency Currency code (ISO)
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number,
  currency: string = "INR"
): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format large numbers for display with appropriate units (k, M, B)
 * @param value Numeric value
 * @param decimals Number of decimal places
 * @returns Formatted string with units
 */
export function formatLargeNumber(value: number, decimals: number = 2): string {
  if (value === null || value === undefined) return "N/A";
  if (value === 0) return "0";

  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (absValue < 1000) {
    return sign + absValue.toFixed(decimals);
  } else if (absValue < 1000000) {
    return sign + (absValue / 1000).toFixed(decimals) + "k";
  } else if (absValue < 1000000000) {
    return sign + (absValue / 1000000).toFixed(decimals) + "M";
  } else {
    return sign + (absValue / 1000000000).toFixed(decimals) + "B";
  }
}
