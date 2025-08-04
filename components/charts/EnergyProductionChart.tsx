// components/charts/EnergyProductionChart.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Chart from "chart.js/auto";

interface ChartData {
  labels: string[];
  values: number[];
  peak: number[];
  sunHours: number[];
  efficiency: number[];
}

interface DailyEnergyProduction {
  _id: string; // Date in YYYY-MM-DD format
  totalEnergy: number;
  avgPeakOutput: number;
  totalSunHours: number;
  date?: string;
  weatherConditions?: string;
  temperature?: number;
}

interface MonthlyEnergyProduction {
  monthName: string;
  totalEnergy: number;
  avgPeakOutput: number;
  avgSunHours: number;
  daysCount: number;
}

interface EnergyProductionChartProps {
  dailyData: DailyEnergyProduction[];
  monthlyData: MonthlyEnergyProduction[];
}

export function EnergyProductionChart({
  dailyData,
  monthlyData,
}: EnergyProductionChartProps) {
  const [chartType, setChartType] = useState<"daily" | "monthly">("daily");
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    values: [],
    peak: [],
    sunHours: [],
    efficiency: [],
  });
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Process data when it changes or chart type changes
  useEffect(() => {
    const data = chartType === "daily" ? dailyData : monthlyData;

    if (data && data.length > 0) {
      const processed: ChartData = {
        labels: [],
        values: [],
        peak: [],
        sunHours: [],
        efficiency: [],
      };

      if (chartType === "daily") {
        // Process daily data
        data.forEach((item) => {
          processed.labels.push((item as DailyEnergyProduction)._id); // Date in YYYY-MM-DD format
          processed.values.push(item.totalEnergy);
          processed.peak.push(item.avgPeakOutput);
          processed.sunHours.push(
            (item as DailyEnergyProduction).totalSunHours
          );

          // Calculate efficiency if possible
          const potential =
            item.avgPeakOutput * (item as DailyEnergyProduction).totalSunHours;
          const efficiency =
            potential > 0 ? (item.totalEnergy / potential) * 100 : 0;
          processed.efficiency.push(Number(efficiency.toFixed(2)));
        });
      } else {
        // Process monthly data
        data.forEach((item) => {
          if ("monthName" in item) {
            processed.labels.push(item.monthName);
            processed.values.push(item.totalEnergy);
            processed.peak.push(item.avgPeakOutput);
            processed.sunHours.push(item.avgSunHours * item.daysCount); // Multiply by days for total

            // Calculate efficiency if possible
            const potential =
              item.avgPeakOutput * item.avgSunHours * item.daysCount;
            const efficiency =
              potential > 0 ? (item.totalEnergy / potential) * 100 : 0;
            processed.efficiency.push(Number(efficiency.toFixed(2)));
          }
        });
      }

      setChartData(processed);
    }
  }, [chartType, dailyData, monthlyData]);

  // Initialize and update chart
  useEffect(() => {
    if (!chartRef.current || chartData.labels.length === 0) return;

    // Import Chart.js dynamically to avoid server-side rendering issues
    import("chart.js").then((ChartModule) => {
      const { Chart, registerables } = ChartModule;
      Chart.register(...registerables);

      // Destroy previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create new chart
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: chartData.labels,
            datasets: [
              {
                label: "Energy Produced (kWh)",
                data: chartData.values,
                backgroundColor: "rgba(75, 192, 192, 0.5)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
                yAxisID: "y",
              },
              {
                label: "Peak Output (kW)",
                data: chartData.peak,
                type: "line",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5,
                fill: false,
                yAxisID: "y1",
              },
              {
                label: "Sun Hours",
                data: chartData.sunHours,
                type: "line",
                backgroundColor: "rgba(255, 206, 86, 0.2)",
                borderColor: "rgba(255, 206, 86, 1)",
                borderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5,
                fill: false,
                yAxisID: "y1",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                mode: "index",
                intersect: false,
                callbacks: {
                  afterBody: function (tooltipItems: { dataIndex: unknown }[]) {
                    const index = tooltipItems[0].dataIndex;
                    return `Efficiency: ${chartData.efficiency[index]}%`;
                  },
                },
              },
              legend: {
                position: "top",
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: chartType === "daily" ? "Date" : "Month",
                },
              },
              y: {
                position: "left",
                title: {
                  display: true,
                  text: "Energy (kWh)",
                },
              },
              y1: {
                position: "right",
                grid: {
                  drawOnChartArea: false,
                },
                title: {
                  display: true,
                  text: "Peak (kW) / Sun Hours",
                },
              },
            },
          },
        });
      }
    });

    // Cleanup chart on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData, chartType]);

  // Calculate total energy production
  const totalEnergy = chartData.values.reduce((sum, value) => sum + value, 0);

  // Calculate average efficiency
  let avgEfficiency = 0;
  if (chartData.efficiency.length > 0) {
    avgEfficiency =
      chartData.efficiency.reduce((sum, val) => sum + val, 0) /
      chartData.efficiency.length;
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>
          Energy Production {chartType === "daily" ? "Daily" : "Monthly"}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Select
            value={chartType}
            onValueChange={(value: "daily" | "monthly") => setChartType(value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="View by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily View</SelectItem>
              <SelectItem value="monthly">Monthly View</SelectItem>
            </SelectContent>
          </Select>

          <Badge variant="secondary">
            {chartType === "daily" ? "Last 30 Days" : "Current Year"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-secondary rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Energy</p>
            <p className="text-2xl font-bold">{totalEnergy.toFixed(2)} kWh</p>
          </div>
          <div className="bg-secondary rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">Data Points</p>
            <p className="text-2xl font-bold">{chartData.labels.length}</p>
          </div>
          <div className="bg-secondary rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">Avg. Efficiency</p>
            <p className="text-2xl font-bold">{avgEfficiency.toFixed(2)}%</p>
          </div>
        </div>

        <div className="h-80">
          <canvas ref={chartRef} />
        </div>
      </CardContent>
    </Card>
  );
}
