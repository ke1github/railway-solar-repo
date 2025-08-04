// lib/utils/solar-calculator.ts

/**
 * Calculate the total potential solar energy based on panel area and efficiency
 * @param area Panel area in square meters
 * @param efficiency Panel efficiency as decimal (e.g., 0.20 for 20%)
 * @param solarIrradiance Solar irradiance in kWh/m²/day (typical value around 4-6)
 * @returns Potential energy in kWh per day
 */
export function calculatePotentialEnergy(
  area: number,
  efficiency: number,
  solarIrradiance: number
): number {
  return area * efficiency * solarIrradiance;
}

/**
 * Calculate panel efficiency from rated capacity and area
 * @param ratedCapacity Rated capacity in kW
 * @param area Panel area in square meters
 * @param standardIrradiance Standard test condition irradiance (typically 1 kW/m²)
 * @returns Panel efficiency as decimal
 */
export function calculatePanelEfficiency(
  ratedCapacity: number,
  area: number,
  standardIrradiance: number = 1
): number {
  if (area <= 0 || standardIrradiance <= 0) return 0;
  return ratedCapacity / (area * standardIrradiance);
}

/**
 * Estimate solar panel degradation over time
 * @param initialCapacity Initial capacity in kW
 * @param ageInYears Age of panels in years
 * @param degradationRate Annual degradation rate as decimal (typically 0.005 for 0.5%)
 * @returns Current estimated capacity in kW
 */
export function estimatePanelDegradation(
  initialCapacity: number,
  ageInYears: number,
  degradationRate: number = 0.005
): number {
  return initialCapacity * Math.pow(1 - degradationRate, ageInYears);
}

/**
 * Calculate optimal panel tilt angle based on latitude
 * @param latitude Location latitude in degrees
 * @param season Optimization target season
 * @returns Optimal tilt angle in degrees
 */
export function calculateOptimalTiltAngle(
  latitude: number,
  season: "summer" | "winter" | "year-round" = "year-round"
): number {
  const absLatitude = Math.abs(latitude);

  switch (season) {
    case "summer":
      return absLatitude * 0.9 - 23.5;
    case "winter":
      return absLatitude * 0.9 + 29;
    case "year-round":
    default:
      return absLatitude * 0.87;
  }
}

/**
 * Calculate the expected energy production based on capacity and location
 * @param capacityKW System capacity in kW
 * @param sunHours Peak sun hours per day
 * @param performanceRatio System performance ratio (typically 0.75-0.85)
 * @param days Number of days to calculate for
 * @returns Expected energy production in kWh
 */
export function calculateExpectedProduction(
  capacityKW: number,
  sunHours: number,
  performanceRatio: number = 0.8,
  days: number = 1
): number {
  return capacityKW * sunHours * performanceRatio * days;
}

/**
 * Calculate the system's performance ratio
 * @param actualProduction Actual energy produced in kWh
 * @param capacityKW System capacity in kW
 * @param sunHours Peak sun hours
 * @returns Performance ratio as decimal
 */
export function calculatePerformanceRatio(
  actualProduction: number,
  capacityKW: number,
  sunHours: number
): number {
  const theoreticalProduction = capacityKW * sunHours;
  if (theoreticalProduction <= 0) return 0;
  return actualProduction / theoreticalProduction;
}

/**
 * Calculate the number of panels required for a desired capacity
 * @param desiredCapacityKW Desired system capacity in kW
 * @param panelWatts Wattage per panel
 * @returns Number of panels needed
 */
export function calculateRequiredPanels(
  desiredCapacityKW: number,
  panelWatts: number
): number {
  if (panelWatts <= 0) return 0;
  return Math.ceil((desiredCapacityKW * 1000) / panelWatts);
}

/**
 * Estimate the area required for a solar installation
 * @param numberOfPanels Number of panels
 * @param panelLength Panel length in meters
 * @param panelWidth Panel width in meters
 * @param spacingFactor Additional spacing factor (1.1 adds 10% for spacing)
 * @returns Required area in square meters
 */
export function estimateRequiredArea(
  numberOfPanels: number,
  panelLength: number,
  panelWidth: number,
  spacingFactor: number = 1.1
): number {
  return numberOfPanels * panelLength * panelWidth * spacingFactor;
}

/**
 * Calculate the energy loss due to temperature
 * @param capacityKW System capacity in kW
 * @param temperatureCelsius Ambient temperature in Celsius
 * @param temperatureCoefficient Temperature power coefficient (typically -0.003 to -0.005 per °C)
 * @returns Adjusted capacity in kW
 */
export function calculateTemperatureEffect(
  capacityKW: number,
  temperatureCelsius: number,
  temperatureCoefficient: number = -0.004
): number {
  // Standard test conditions temperature is 25°C
  const temperatureDifference = temperatureCelsius - 25;
  return capacityKW * (1 + temperatureDifference * temperatureCoefficient);
}

/**
 * Estimate the carbon offset from solar energy production
 * @param energyProduced Energy produced in kWh
 * @param emissionFactor Grid emission factor in kg CO2/kWh
 * @returns Carbon offset in kg of CO2
 */
export function calculateCarbonOffset(
  energyProduced: number,
  emissionFactor: number = 0.85
): number {
  return energyProduced * emissionFactor;
}

/**
 * Calculate the levelized cost of energy (LCOE)
 * @param totalCost Total system cost
 * @param annualProduction Annual energy production in kWh
 * @param lifespanYears System lifespan in years
 * @param discountRate Annual discount rate as decimal
 * @returns LCOE in currency units per kWh
 */
export function calculateLCOE(
  totalCost: number,
  annualProduction: number,
  lifespanYears: number,
  discountRate: number = 0.05
): number {
  if (annualProduction <= 0 || lifespanYears <= 0) return 0;

  let discountedEnergy = 0;
  const discountedCost = totalCost;

  for (let year = 1; year <= lifespanYears; year++) {
    // Account for panel degradation (0.5% per year)
    const yearlyProduction = annualProduction * Math.pow(0.995, year - 1);
    discountedEnergy += yearlyProduction / Math.pow(1 + discountRate, year);
  }

  return discountedCost / discountedEnergy;
}

/**
 * Calculate the payback period for a solar installation
 * @param systemCost Total system cost
 * @param annualSavings Annual energy savings
 * @param electricityInflation Annual electricity price inflation rate
 * @returns Payback period in years
 */
export function calculatePaybackPeriod(
  systemCost: number,
  annualSavings: number,
  electricityInflation: number = 0.03
): number {
  if (annualSavings <= 0) return Infinity;

  let cumulativeSavings = 0;
  let years = 0;

  while (cumulativeSavings < systemCost) {
    years++;
    cumulativeSavings +=
      annualSavings * Math.pow(1 + electricityInflation, years - 1);

    if (years > 100) {
      return Infinity; // Avoid infinite loop
    }
  }

  // Fractional year calculation
  const excessSavings = cumulativeSavings - systemCost;
  const lastYearSavings =
    annualSavings * Math.pow(1 + electricityInflation, years - 1);
  const fractionOfYear = excessSavings / lastYearSavings;

  return years - fractionOfYear;
}
