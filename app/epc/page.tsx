// app/epc/page.tsx
import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getEPCDashboardStats } from "@/lib/actions/epc-actions";

interface ProjectItem {
  projectId: string;
  projectName: string;
  priority: string;
  healthScore: number;
  createdAt: string;
}

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

export default async function EPCPage() {
  const result = await getEPCDashboardStats();

  if (!result.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background-subtle to-background-accent">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <Card className="p-8 text-center max-w-md">
              <h3 className="text-xl font-semibold mb-4 text-red-600">
                Error Loading EPC Dashboard
              </h3>
              <p className="text-muted-foreground mb-6">{result.error}</p>
              <Link href="/epc/projects/new">
                <Button variant="railway">Create First Project</Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const data = result.stats;

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background-subtle to-background-accent">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <Card className="p-8 text-center max-w-md">
              <h3 className="text-xl font-semibold mb-4 text-yellow-600">
                No EPC Data
              </h3>
              <p className="text-muted-foreground mb-6">
                No EPC projects found in the system.
              </p>
              <Link href="/epc/projects/new">
                <Button variant="railway">Create First Project</Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
      medium:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
      critical: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    };
    return (
      colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-subtle to-background-accent">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-4xl font-bold text-foreground">
              EPC Project Management
            </h1>
            <div className="flex gap-3">
              <Link href="/epc/projects/new">
                <Button variant="railway">➕ New Project</Button>
              </Link>
              <Link href="/epc/projects">
                <Button variant="outline">📋 All Projects</Button>
              </Link>
            </div>
          </div>
          <p className="text-xl text-muted-foreground">
            Engineering • Procurement • Construction Management for Railway
            Solar Installations
          </p>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Projects
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {data.overview.totalProjects}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  🏗️
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Projects
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {data.overview.activeProjects}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  ⚡
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Budget Utilization
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {data.overview.totalBudget > 0
                      ? `${Math.round(
                          (data.overview.totalSpent /
                            data.overview.totalBudget) *
                            100
                        )}%`
                      : "0%"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  💰
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Avg Health Score
                  </p>
                  <p
                    className={`text-3xl font-bold ${getHealthScoreColor(
                      data.overview.avgHealthScore
                    )}`}
                  >
                    {Math.round(data.overview.avgHealthScore)}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                  📊
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Phase Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔧 Engineering Phase
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>In Progress</span>
                  <span className="font-semibold">
                    {data.phases.engineeringInProgress} projects
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${data.phases.avgEngineeringProgress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  Average Progress:{" "}
                  {Math.round(data.phases.avgEngineeringProgress)}%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📦 Procurement Phase
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>In Progress</span>
                  <span className="font-semibold">
                    {data.phases.procurementInProgress} projects
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${data.phases.avgProcurementProgress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  Average Progress:{" "}
                  {Math.round(data.phases.avgProcurementProgress)}%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏗️ Construction Phase
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>In Progress</span>
                  <span className="font-semibold">
                    {data.phases.constructionInProgress} projects
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${data.phases.avgConstructionProgress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  Average Progress:{" "}
                  {Math.round(data.phases.avgConstructionProgress)}%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Critical Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                🚨 Critical Projects
                <Badge variant="destructive">
                  {data.criticalProjects.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.criticalProjects.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    ✅ No critical projects - All systems healthy!
                  </p>
                ) : (
                  data.criticalProjects
                    .slice(0, 5)
                    .map((project: ProjectItem) => (
                      <div
                        key={project.projectId}
                        className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-lg"
                      >
                        <div>
                          <div className="font-semibold">
                            {project.projectName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {project.projectId}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getPriorityColor(project.priority)}>
                            {project.priority.toUpperCase()}
                          </Badge>
                          <div
                            className={`text-sm font-semibold ${getHealthScoreColor(
                              project.healthScore
                            )}`}
                          >
                            Health: {project.healthScore}%
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
              {data.criticalProjects.length > 5 && (
                <div className="mt-4 text-center">
                  <Link href="/epc/projects">
                    <Button variant="outline" size="sm">
                      View All Critical Projects
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                📋 Recent Projects
                <Badge variant="secondary">{data.recentProjects.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.recentProjects.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No recent projects found
                  </p>
                ) : (
                  data.recentProjects
                    .slice(0, 5)
                    .map((project: ProjectItem) => (
                      <div
                        key={project.projectId}
                        className="flex items-center justify-between p-3 bg-card rounded-lg border"
                      >
                        <div>
                          <div className="font-semibold">
                            {project.projectName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {project.projectId}
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-sm font-semibold ${getHealthScoreColor(
                              project.healthScore
                            )}`}
                          >
                            {project.healthScore}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(project.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
              {data.recentProjects.length > 5 && (
                <div className="mt-4 text-center">
                  <Link href="/epc/projects">
                    <Button variant="outline" size="sm">
                      View All Projects
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
