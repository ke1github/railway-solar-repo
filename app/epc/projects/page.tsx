// app/epc/projects/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EPCProject {
  _id: string;
  projectId: string;
  projectName: string;
  siteId: string;
  projectType: string;
  overallStatus: string;
  priority: string;
  healthScore: number;
  overallProgress: number;
  phases: {
    engineering: { status: string; progress: number };
    procurement: { status: string; progress: number };
    construction: { status: string; progress: number };
  };
  resources: {
    budget: {
      total: number;
      spent: number;
      currency: string;
    };
    timeline: {
      plannedStartDate: string;
      plannedEndDate: string;
    };
  };
  createdAt: string;
}

interface ProjectsData {
  projects: EPCProject[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function EPCProjectsPage() {
  const [data, setData] = useState<ProjectsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: "12",
          ...(statusFilter && { status: statusFilter }),
          ...(priorityFilter && { priority: priorityFilter }),
        });

        console.log(`Loading projects with params: ${params.toString()}`);
        const response = await fetch(`/api/epc/projects?${params}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage =
            errorData.error ||
            `Server responded with status: ${response.status}`;
          console.error(`Error response:`, errorData);
          throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log(`Loaded ${result.projects?.length || 0} projects`);
        setData(result);
      } catch (err) {
        console.error("Projects fetch error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load projects"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [currentPage, statusFilter, priorityFilter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
        ...(statusFilter && { status: statusFilter }),
        ...(priorityFilter && { priority: priorityFilter }),
      });

      console.log(`Fetching projects with params: ${params.toString()}`);
      const response = await fetch(`/api/epc/projects?${params}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error || `Server responded with status: ${response.status}`;
        console.error(`Error response:`, errorData);
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log(`Fetched ${result.projects?.length || 0} projects`);
      setData(result);
    } catch (err) {
      console.error("Projects fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      planning:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      active:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      on_hold:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
      completed:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
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

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const formatCurrency = (amount: number, currency: string = "INR") => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredProjects =
    data?.projects.filter(
      (project) =>
        project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.projectId.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="absolute inset-0 neural-bg opacity-40"></div>
        <div className="relative container mx-auto px-6 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="neural-card p-8 text-center">
              <div className="w-16 h-16 mx-auto border-4 border-accent/20 border-t-accent rounded-full rotate-slow"></div>
              <h3 className="text-xl font-semibold mt-4 neural-text">
                Loading EPC Projects...
              </h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="absolute inset-0 neural-bg opacity-40"></div>
        <div className="relative container mx-auto px-6 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <Card withBorder={true} className="p-8 text-center max-w-md">
              <CardHeader>
                <CardTitle className="text-red-600">
                  Error Loading Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{error}</p>
                <p className="text-sm text-muted-foreground">
                  This might be due to a missing API route or database
                  connection issue. Please check the MongoDB connection in your
                  .env.local file.
                </p>
                <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-left">
                  <p className="text-xs font-mono">
                    Debug: Check server logs for more details. MongoDB URI
                    should be properly configured.
                  </p>
                </div>
                <div className="flex justify-center space-x-4 mt-4">
                  <Button onClick={fetchProjects} variant="default">
                    Try Again
                  </Button>
                  <Link href="/epc">
                    <Button variant="outline">Back to EPC Dashboard</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="absolute inset-0 neural-bg opacity-40"></div>

      <div className="relative container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold neural-text">EPC Projects</h1>
            <p className="text-xl text-muted-foreground">
              Manage Engineering, Procurement & Construction Projects
            </p>
          </div>
          <Link href="/epc/projects/new">
            <Button className="btn-primary">➕ New Project</Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="neural-card mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Search Projects
                </label>
                <Input
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="neural-input"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                >
                  <option value="">All Statuses</option>
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="on_hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Priority
                </label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={fetchProjects}
                  variant="outline"
                  className="w-full"
                >
                  🔄 Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <Card className="neural-card">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-2">No Projects Found</h3>
              <p className="text-muted-foreground mb-6">
                {data?.projects.length === 0
                  ? "Start by creating your first EPC project"
                  : "Try adjusting your search or filters"}
              </p>
              <Link href="/epc/projects/new">
                <Button className="btn-primary">➕ Create First Project</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project._id} className="neural-card hover-lift">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {project.projectName}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {project.projectId}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className={getStatusColor(project.overallStatus)}>
                        {project.overallStatus.replace("_", " ").toUpperCase()}
                      </Badge>
                      <Badge className={getPriorityColor(project.priority)}>
                        {project.priority.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Health Score */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Health Score</span>
                      <span
                        className={`text-lg font-bold ${getHealthScoreColor(
                          project.healthScore
                        )}`}
                      >
                        {project.healthScore}%
                      </span>
                    </div>

                    {/* Overall Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Overall Progress</span>
                        <span className="font-semibold">
                          {project.overallProgress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.overallProgress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Phase Progress */}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="text-blue-600 font-semibold">ENG</div>
                        <div>{project.phases.engineering.progress}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-purple-600 font-semibold">
                          PROC
                        </div>
                        <div>{project.phases.procurement.progress}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-green-600 font-semibold">
                          CONST
                        </div>
                        <div>{project.phases.construction.progress}%</div>
                      </div>
                    </div>

                    {/* Budget Info */}
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>Budget</span>
                        <span className="font-semibold">
                          {formatCurrency(
                            project.resources.budget.total,
                            project.resources.budget.currency
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Spent</span>
                        <span>
                          {formatCurrency(
                            project.resources.budget.spent,
                            project.resources.budget.currency
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Link
                        href={`/epc/projects/${project.projectId}`}
                        className="flex-1"
                      >
                        <Button variant="outline" className="w-full text-xs">
                          📊 View Details
                        </Button>
                      </Link>
                      <Link
                        href={`/sites/${project.siteId}`}
                        className="flex-1"
                      >
                        <Button variant="outline" className="w-full text-xs">
                          🏗️ Site Info
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {data && data.pagination.pages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {currentPage} of {data.pagination.pages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((p) => Math.min(data.pagination.pages, p + 1))
                }
                disabled={currentPage === data.pagination.pages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
