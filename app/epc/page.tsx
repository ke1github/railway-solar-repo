// app/epc/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface EPCDashboardData {
  overview: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalBudget: number;
    totalSpent: number;
    avgHealthScore: number;
  };
  phases: {
    engineeringInProgress: number;
    procurementInProgress: number;
    constructionInProgress: number;
    avgEngineeringProgress: number;
    avgProcurementProgress: number;
    avgConstructionProgress: number;
  };
  priorityDistribution: Array<{
    _id: string;
    count: number;
  }>;
  recentProjects: Array<{
    projectId: string;
    projectName: string;
    overallStatus: string;
    priority: string;
    healthScore: number;
    createdAt: string;
  }>;
  criticalProjects: Array<{
    projectId: string;
    projectName: string;
    overallStatus: string;
    priority: string;
    healthScore: number;
  }>;
  upcomingMilestones: Array<{
    projectId: string;
    projectName: string;
    milestone: {
      name: string;
      targetDate: string;
    };
  }>;
  resourceUtilization: Array<{
    _id: string;
    totalAllocation: number;
    teamMembers: number;
  }>;
}

export default function EPCDashboard() {
  const [data, setData] = useState<EPCDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/epc/dashboard');
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'planning': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      'active': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'on_hold': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      'completed': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      'medium': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'high': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      'critical': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="absolute inset-0 neural-bg opacity-40"></div>
        <div className="relative container mx-auto px-6 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="neural-card p-8 text-center">
              <div className="w-16 h-16 mx-auto border-4 border-accent/20 border-t-accent rounded-full rotate-slow"></div>
              <h3 className="text-xl font-semibold mt-4 neural-text">Loading EPC Dashboard...</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="absolute inset-0 neural-bg opacity-40"></div>
        <div className="relative container mx-auto px-6 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="neural-card p-8 text-center max-w-md">
              <h3 className="text-xl font-semibold mb-4 text-red-600">Error Loading Dashboard</h3>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={fetchDashboardData} className="btn-primary">
                Try Again
              </Button>
            </div>
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
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-4xl font-bold neural-text">
              EPC Project Management
            </h1>
            <div className="flex gap-3">
              <Link href="/epc/projects/new">
                <Button className="btn-primary">
                  ➕ New Project
                </Button>
              </Link>
              <Link href="/epc/projects">
                <Button variant="outline" className="btn-secondary">
                  📋 All Projects
                </Button>
              </Link>
            </div>
          </div>
          <p className="text-xl text-muted-foreground">
            Engineering • Procurement • Construction Management for Railway Solar Installations
          </p>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="neural-card hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                  <p className="text-3xl font-bold neural-text">{data.overview.totalProjects}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  🏗️
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="neural-card hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                  <p className="text-3xl font-bold text-blue-600">{data.overview.activeProjects}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  ⚡
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="neural-card hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Budget Utilization</p>
                  <p className="text-3xl font-bold text-green-600">
                    {data.overview.totalBudget > 0 
                      ? `${Math.round((data.overview.totalSpent / data.overview.totalBudget) * 100)}%`
                      : '0%'
                    }
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  💰
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="neural-card hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Health Score</p>
                  <p className={`text-3xl font-bold ${getHealthScoreColor(data.overview.avgHealthScore)}`}>
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
          <Card className="neural-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔧 Engineering Phase
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>In Progress</span>
                  <span className="font-semibold">{data.phases.engineeringInProgress} projects</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${data.phases.avgEngineeringProgress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  Average Progress: {Math.round(data.phases.avgEngineeringProgress)}%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="neural-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📦 Procurement Phase
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>In Progress</span>
                  <span className="font-semibold">{data.phases.procurementInProgress} projects</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${data.phases.avgProcurementProgress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  Average Progress: {Math.round(data.phases.avgProcurementProgress)}%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="neural-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏗️ Construction Phase
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>In Progress</span>
                  <span className="font-semibold">{data.phases.constructionInProgress} projects</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${data.phases.avgConstructionProgress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  Average Progress: {Math.round(data.phases.avgConstructionProgress)}%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Critical Projects */}
          <Card className="neural-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                🚨 Critical Projects
                <Badge variant="destructive">{data.criticalProjects.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.criticalProjects.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    ✅ No critical projects - All systems healthy!
                  </p>
                ) : (
                  data.criticalProjects.slice(0, 5).map((project) => (
                    <div key={project.projectId} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
                      <div>
                        <div className="font-semibold">{project.projectName}</div>
                        <div className="text-sm text-muted-foreground">{project.projectId}</div>
                      </div>
                      <div className="text-right">
                        <Badge className={getPriorityColor(project.priority)}>
                          {project.priority.toUpperCase()}
                        </Badge>
                        <div className={`text-sm font-semibold ${getHealthScoreColor(project.healthScore)}`}>
                          Health: {project.healthScore}%
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Milestones */}
          <Card className="neural-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                📅 Upcoming Milestones
                <Badge variant="outline">{data.upcomingMilestones.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.upcomingMilestones.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    📋 No upcoming milestones in the next 30 days
                  </p>
                ) : (
                  data.upcomingMilestones.slice(0, 5).map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                      <div>
                        <div className="font-semibold">{item.milestone.name}</div>
                        <div className="text-sm text-muted-foreground">{item.projectName}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">
                          {new Date(item.milestone.targetDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">{item.projectId}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
