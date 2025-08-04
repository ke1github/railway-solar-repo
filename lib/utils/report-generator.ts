// lib/utils/report-generator.ts
import { ISolarInstallation } from "@/models/SolarInstallation";
import { IEnergyProduction } from "@/models/EnergyProduction";
import {
  formatCurrency,
  formatLargeNumber,
  calculateCarbonOffset,
} from "./solar-analytics";

/**
 * Generate CSV data for energy production
 * @param energyData Array of energy production records
 * @returns CSV string with headers
 */
export function generateEnergyProductionCSV(
  energyData: IEnergyProduction[]
): string {
  if (!energyData.length) return "";

  const headers = [
    "Date",
    "Energy Produced (kWh)",
    "Peak Output (kW)",
    "Sun Hours",
    "Weather Conditions",
    "Temperature (°C)",
    "Notes",
  ];

  const rows = energyData.map((record) => [
    new Date(record.date).toISOString().split("T")[0],
    record.energyProduced.toString(),
    record.peakOutput.toString(),
    record.sunHours.toString(),
    record.weatherConditions,
    record.temperature?.toString() || "",
    record.notes?.replace(/,/g, ";").replace(/\n/g, " ") || "",
  ]);

  const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
    "\n"
  );

  return csv;
}

/**
 * Format installation details for PDF report
 * @param installation Solar installation
 * @param includeFinancials Whether to include financial details
 * @returns Formatted installation details object
 */
export function formatInstallationForReport(
  installation: ISolarInstallation,
  includeFinancials: boolean = true
) {
  const formattedData = {
    basic: {
      stationCode: installation.stationCode,
      capacity: `${installation.capacity} kW`,
      panelType: installation.panelType,
      numberOfPanels: installation.numberOfPanels.toString(),
      installedArea: `${installation.installedArea} m²`,
      installationDate: installation.installationDate
        ? new Date(installation.installationDate).toLocaleDateString()
        : "N/A",
      status: installation.status,
    },
    technical: {
      mountingType: installation.mounting?.type || "N/A",
      mountingAngle: installation.mounting?.angle
        ? `${installation.mounting.angle}°`
        : "N/A",
      orientation: installation.mounting?.orientation || "N/A",
      inverterCount: installation.inverters?.count.toString() || "N/A",
      inverterBrand: installation.inverters?.brand || "N/A",
      batteryInstalled: installation.batteries?.installed ? "Yes" : "No",
      batteryCapacity:
        installation.batteries?.installed && installation.batteries.capacity
          ? `${installation.batteries.capacity} kWh`
          : "N/A",
      gridConnected: installation.gridConnection?.isGridConnected
        ? "Yes"
        : "No",
      connectionType: installation.gridConnection?.connectionType || "N/A",
    },
    maintenance: {
      schedule: installation.maintenanceSchedule,
      lastMaintenance: installation.lastMaintenance
        ? new Date(installation.lastMaintenance).toLocaleDateString()
        : "Never",
      nextMaintenance: installation.nextMaintenance
        ? new Date(installation.nextMaintenance).toLocaleDateString()
        : "Not scheduled",
      expectedLifespan: `${installation.expectedLifespan} years`,
      warrantyPeriod: installation.warrantyPeriod
        ? `${installation.warrantyPeriod} years`
        : "N/A",
    },
  };

  // Add financial data if requested
  if (includeFinancials && installation.totalCost) {
    return {
      ...formattedData,
      financial: {
        totalCost: formatCurrency(
          installation.totalCost,
          installation.costCurrency
        ),
        costPerWatt: formatCurrency(
          installation.totalCost / (installation.capacity * 1000),
          installation.costCurrency
        ),
        contractor: installation.contractor || "N/A",
      },
    };
  }

  return formattedData;
}

/**
 * Generate energy statistics summary for reports
 * @param installation Solar installation
 * @param energyData Energy production data
 * @param params Additional parameters
 * @returns Formatted energy statistics
 */
export function generateEnergyStatisticsSummary(
  installation: ISolarInstallation,
  energyData: IEnergyProduction[],
  params: { energyPrice?: number; carbonFactor?: number } = {}
) {
  const energyPrice = params.energyPrice || 8; // Default energy price in INR per kWh
  const carbonFactor = params.carbonFactor || 0.85; // Default carbon factor in kg CO2 per kWh

  // Calculate total energy
  const totalEnergy = energyData.reduce(
    (sum, record) => sum + record.energyProduced,
    0
  );

  // Calculate peak day
  let peakDay = null;
  if (energyData.length > 0) {
    peakDay = energyData.reduce(
      (max, record) =>
        record.energyProduced > max.energyProduced ? record : max,
      energyData[0]
    );
  }

  // Calculate average daily production
  const uniqueDays = new Set(
    energyData.map(
      (record) => new Date(record.date).toISOString().split("T")[0]
    )
  );
  const averageDailyProduction =
    uniqueDays.size > 0 ? totalEnergy / uniqueDays.size : 0;

  // Calculate financial savings
  const totalSavings = totalEnergy * energyPrice;

  // Calculate carbon offset
  const totalCarbonOffset = calculateCarbonOffset(totalEnergy, carbonFactor);

  return {
    totalEnergyProduced: `${formatLargeNumber(totalEnergy, 2)} kWh`,
    averageDailyProduction: `${averageDailyProduction.toFixed(2)} kWh/day`,
    peakDayProduction: peakDay
      ? `${peakDay.energyProduced.toFixed(2)} kWh (${new Date(
          peakDay.date
        ).toLocaleDateString()})`
      : "N/A",
    totalDataPoints: energyData.length.toString(),
    dateRange:
      energyData.length > 0
        ? `${new Date(
            Math.min(...energyData.map((d) => new Date(d.date).getTime()))
          ).toLocaleDateString()} to ${new Date(
            Math.max(...energyData.map((d) => new Date(d.date).getTime()))
          ).toLocaleDateString()}`
        : "N/A",
    estimatedSavings: formatCurrency(totalSavings),
    carbonOffsetTotal: `${formatLargeNumber(totalCarbonOffset, 2)} kg CO₂`,
    carbonOffsetEquivalent: `${(totalCarbonOffset / 2400).toFixed(
      2
    )} trees planted`,
  };
}

/**
 * Generate performance comparison data for benchmarking
 * @param installation Current installation
 * @param compareData Comparison data points
 * @returns Performance comparison results
 */
export function generatePerformanceComparison(
  installation: ISolarInstallation,
  compareData: {
    averageEfficiency: number;
    averageOutput: number;
    bestEfficiency: number;
    bestOutput: number;
  }
) {
  const installationEfficiency =
    installation.generationData?.averageDailyGeneration && installation.capacity
      ? (installation.generationData.averageDailyGeneration /
          (installation.capacity * 24)) *
        100
      : 0;

  const installationOutput =
    installation.generationData?.averageDailyGeneration || 0;

  return {
    efficiencyComparison: {
      current: `${installationEfficiency.toFixed(2)}%`,
      average: `${compareData.averageEfficiency.toFixed(2)}%`,
      best: `${compareData.bestEfficiency.toFixed(2)}%`,
      percentOfAverage:
        compareData.averageEfficiency > 0
          ? `${(
              (installationEfficiency / compareData.averageEfficiency) *
              100
            ).toFixed(0)}%`
          : "N/A",
      percentOfBest:
        compareData.bestEfficiency > 0
          ? `${(
              (installationEfficiency / compareData.bestEfficiency) *
              100
            ).toFixed(0)}%`
          : "N/A",
    },
    outputComparison: {
      current: `${installationOutput.toFixed(2)} kWh/day`,
      average: `${compareData.averageOutput.toFixed(2)} kWh/day`,
      best: `${compareData.bestOutput.toFixed(2)} kWh/day`,
      percentOfAverage:
        compareData.averageOutput > 0
          ? `${((installationOutput / compareData.averageOutput) * 100).toFixed(
              0
            )}%`
          : "N/A",
      percentOfBest:
        compareData.bestOutput > 0
          ? `${((installationOutput / compareData.bestOutput) * 100).toFixed(
              0
            )}%`
          : "N/A",
    },
  };
}

/**
 * Generate projection data for future energy production
 * @param installation Solar installation
 * @param historicalData Historical energy production data
 * @param projectionYears Number of years to project
 * @returns Projection data by year
 */
export function generateProductionProjection(
  installation: ISolarInstallation,
  historicalData: IEnergyProduction[],
  projectionYears: number = 5
) {
  // Skip if no historical data
  if (historicalData.length === 0) return [];

  // Calculate average daily production from historical data
  const uniqueDays = new Set(
    historicalData.map(
      (record) => new Date(record.date).toISOString().split("T")[0]
    )
  );
  const totalEnergy = historicalData.reduce(
    (sum, record) => sum + record.energyProduced,
    0
  );
  const avgDailyProduction =
    uniqueDays.size > 0 ? totalEnergy / uniqueDays.size : 0;

  // Standard degradation rate for solar panels (0.5% per year)
  const annualDegradationRate = 0.005;

  // Generate projection for the specified number of years
  const currentYear = new Date().getFullYear();
  const projection = [];

  for (let i = 0; i < projectionYears; i++) {
    const year = currentYear + i;
    const degradationFactor = Math.pow(1 - annualDegradationRate, i);
    const projectedDailyProduction = avgDailyProduction * degradationFactor;
    const projectedAnnualProduction = projectedDailyProduction * 365;

    projection.push({
      year,
      projectedDailyProduction: projectedDailyProduction.toFixed(2),
      projectedAnnualProduction: projectedAnnualProduction.toFixed(2),
      degradationPercent: (100 - degradationFactor * 100).toFixed(2),
    });
  }

  return projection;
}
