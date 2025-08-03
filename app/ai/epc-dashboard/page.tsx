"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Calendar,
  AlertTriangle,
  BarChart4,
  Layers,
  Lightbulb,
  Zap,
  Clock,
} from "lucide-react";

// Define types for the AI-powered analytics
interface ProjectAnalytics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  projectByPhase: {
    planning: number;
    survey: number;
    design: number;
    procurement: number;
    installation: number;
    commissioning: number;
    operational: number;
    maintenance: number;
  };
  averageDelay: number; // in days
  riskBreakdown: {
    high: number;
    medium: number;
    low: number;
  };
  materialStatus: {
    ordered: number;
    shipped: number;
    delivered: number;
    installed: number;
    defective: number;
  };
  performanceMetrics: {
    onTimeCompletionRate: number; // percentage
    qualityScore: number; // out of 100
    costVariance: number; // percentage +/- from budget
    clientSatisfaction: number; // out of 10
  };
}

// Mock data for demonstration - in a real app, this would come from the API
const mockAnalytics: ProjectAnalytics = {
  totalProjects: 247,
  activeProjects: 183,
  completedProjects: 64,
  projectByPhase: {
    planning: 32,
    survey: 47,
    design: 38,
    procurement: 26,
    installation: 24,
    commissioning: 16,
    operational: 48,
    maintenance: 16,
  },
  averageDelay: 14.3,
  riskBreakdown: {
    high: 24,
    medium: 89,
    low: 134,
  },
  materialStatus: {
    ordered: 87,
    shipped: 56,
    delivered: 134,
    installed: 78,
    defective: 12,
  },
  performanceMetrics: {
    onTimeCompletionRate: 72.4,
    qualityScore: 88.6,
    costVariance: 4.2, // over budget
    clientSatisfaction: 7.8,
  },
};

// AI Recommendations component
function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<string[]>([
    "Consider reassigning resources from Southern region to address delays in Northern zone sites",
    "Expedite procurement for phase 3 projects - current delivery schedule risks delaying 8 sites",
    "Review quality control procedures in Eastern division - defect rate 3.2% above average",
    "Implement weather contingency plans for monsoon season for 24 sites in vulnerable areas",
    "Schedule preventive maintenance for 8 operational sites with efficiency below 85%",
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
          AI Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <li
              key={index}
              className="flex items-start gap-2 pb-2 border-b last:border-0"
            >
              <div className="h-6 w-6 flex items-center justify-center rounded-full bg-primary/10 text-primary text-sm mt-0.5">
                {index + 1}
              </div>
              <p className="text-sm">{recommendation}</p>
            </li>
          ))}
        </ul>
        <div className="mt-4 text-right text-xs text-muted-foreground">
          Updated 2 hours ago • Based on last 30 days of project data
        </div>
      </CardContent>
    </Card>
  );
}

// Timeline Prediction component
function TimelinePrediction() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-blue-500" />
          AI Timeline Predictions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">
                Northern Zone (32 sites)
              </span>
              <Badge variant="outline" className="text-amber-500">
                +14 days
              </Badge>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-amber-500 h-2 rounded-full"
                style={{ width: "78%" }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>Expected: Sep 15, 2023</span>
              <span>Predicted: Sep 29, 2023</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">
                Southern Zone (28 sites)
              </span>
              <Badge variant="outline" className="text-green-500">
                On track
              </Badge>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: "92%" }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>Expected: Oct 30, 2023</span>
              <span>Predicted: Oct 28, 2023</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">
                Eastern Zone (42 sites)
              </span>
              <Badge variant="outline" className="text-red-500">
                +21 days
              </Badge>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full"
                style={{ width: "65%" }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>Expected: Aug 25, 2023</span>
              <span>Predicted: Sep 15, 2023</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">
                Western Zone (36 sites)
              </span>
              <Badge variant="outline" className="text-green-500">
                -5 days
              </Badge>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: "87%" }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>Expected: Nov 10, 2023</span>
              <span>Predicted: Nov 5, 2023</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Risk Assessment component
function RiskAssessment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
          AI Risk Assessment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex mb-6">
          <div className="flex-1 text-center p-2 border-r">
            <div className="text-3xl font-bold text-red-500">
              {mockAnalytics.riskBreakdown.high}
            </div>
            <div className="text-xs text-muted-foreground mt-1">High Risk</div>
          </div>
          <div className="flex-1 text-center p-2 border-r">
            <div className="text-3xl font-bold text-amber-500">
              {mockAnalytics.riskBreakdown.medium}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Medium Risk
            </div>
          </div>
          <div className="flex-1 text-center p-2">
            <div className="text-3xl font-bold text-green-500">
              {mockAnalytics.riskBreakdown.low}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Low Risk</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="border rounded-md p-3 bg-red-50">
            <div className="font-medium mb-1">Critical Risk Factors</div>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc ml-4">
              <li>Material shortages affecting 8 sites</li>
              <li>Weather delays in monsoon-affected regions</li>
              <li>Workforce availability in Eastern Zone</li>
            </ul>
          </div>
          <div className="border rounded-md p-3">
            <div className="font-medium mb-1">Risk Mitigation Suggestions</div>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc ml-4">
              <li>Diversify supplier base for critical components</li>
              <li>
                Add 15% buffer to installation timelines in monsoon regions
              </li>
              <li>Cross-train teams for multi-site deployment</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Performance Insights component
function PerformanceInsights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart4 className="mr-2 h-5 w-5 text-indigo-500" />
          AI Performance Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded-lg p-3">
            <div className="text-sm text-muted-foreground mb-1">
              On-Time Completion
            </div>
            <div className="text-2xl font-bold">
              {mockAnalytics.performanceMetrics.onTimeCompletionRate}%
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full mt-2">
              <div
                className="bg-blue-500 h-1.5 rounded-full"
                style={{
                  width: `${mockAnalytics.performanceMetrics.onTimeCompletionRate}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="border rounded-lg p-3">
            <div className="text-sm text-muted-foreground mb-1">
              Quality Score
            </div>
            <div className="text-2xl font-bold">
              {mockAnalytics.performanceMetrics.qualityScore}
              <span className="text-sm">/100</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full mt-2">
              <div
                className="bg-green-500 h-1.5 rounded-full"
                style={{
                  width: `${mockAnalytics.performanceMetrics.qualityScore}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="border rounded-lg p-3">
            <div className="text-sm text-muted-foreground mb-1">
              Cost Variance
            </div>
            <div className="text-2xl font-bold text-amber-500">
              +{mockAnalytics.performanceMetrics.costVariance}%
            </div>
            <div className="text-xs text-muted-foreground">
              Above budgeted cost
            </div>
          </div>

          <div className="border rounded-lg p-3">
            <div className="text-sm text-muted-foreground mb-1">
              Client Satisfaction
            </div>
            <div className="text-2xl font-bold">
              {mockAnalytics.performanceMetrics.clientSatisfaction}
              <span className="text-sm">/10</span>
            </div>
            <div className="flex text-amber-400 mt-1">
              {[
                ...Array(
                  Math.floor(
                    mockAnalytics.performanceMetrics.clientSatisfaction
                  )
                ),
              ].map((_, i) => (
                <Zap key={i} className="h-4 w-4" />
              ))}
              {[
                ...Array(
                  10 -
                    Math.floor(
                      mockAnalytics.performanceMetrics.clientSatisfaction
                    )
                ),
              ].map((_, i) => (
                <Zap key={i} className="h-4 w-4 text-muted" />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main EPC Dashboard Component
export default function EPCDashboard() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<ProjectAnalytics>(mockAnalytics);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-subtle to-background-accent">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              AI-Powered EPC Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Advanced analytics and intelligent insights for solar project
              management
            </p>
          </div>
          <Link href="/ai">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Back to AI Dashboard
            </Button>
          </Link>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Total Projects
                  </div>
                  <div className="text-3xl font-bold mt-1">
                    {analytics.totalProjects}
                  </div>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Layers className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex gap-4 mt-4">
                <div>
                  <Badge variant="secondary">
                    {analytics.activeProjects} Active
                  </Badge>
                </div>
                <div>
                  <Badge variant="outline">
                    {analytics.completedProjects} Completed
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Average Delay
                  </div>
                  <div className="text-3xl font-bold mt-1">
                    {analytics.averageDelay} days
                  </div>
                </div>
                <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <div className="flex gap-4 mt-4">
                <div className="text-sm text-muted-foreground">
                  {analytics.performanceMetrics.onTimeCompletionRate}% projects
                  on time
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Energy Potential
                  </div>
                  <div className="text-3xl font-bold mt-1">168.4 MW</div>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                Carbon offset equivalent: 241,830 tonnes/year
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Phases */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Project Phase Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {Object.entries(analytics.projectByPhase).map(
                ([phase, count]) => (
                  <div
                    key={phase}
                    className="border rounded-lg p-3 flex-1 min-w-[150px]"
                  >
                    <div className="text-sm capitalize">{phase}</div>
                    <div className="text-2xl font-bold mt-1">{count}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {Math.round((count / analytics.totalProjects) * 100)}% of
                      projects
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* AI Components Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <AIRecommendations />
          <TimelinePrediction />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <RiskAssessment />
          <PerformanceInsights />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-end">
          <Button variant="outline">Generate Full Report</Button>
          <Button>View Project Details</Button>
        </div>
      </div>
    </div>
  );
}
