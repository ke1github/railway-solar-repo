// app/epc/projects/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
    engineering: {
      status: string;
      progress: number;
      startDate?: string;
      completedDate?: string;
      assignedTeam: string[];
      documents: string[];
    };
    procurement: {
      status: string;
      progress: number;
      startDate?: string;
      completedDate?: string;
      vendor: string;
      purchaseOrders: string[];
      deliverySchedule?: string;
    };
    construction: {
      status: string;
      progress: number;
      startDate?: string;
      completedDate?: string;
      contractor: string;
      milestones: Array<{
        name: string;
        targetDate: string;
        completedDate?: string;
        status: string;
      }>;
    };
  };
  resources: {
    budget: {
      total: number;
      allocated: number;
      spent: number;
      currency: string;
    };
    timeline: {
      plannedStartDate: string;
      plannedEndDate: string;
      actualStartDate?: string;
      actualEndDate?: string;
    };
    team: Array<{
      memberId: string;
      name: string;
      role: string;
      phase: string;
      allocation: number;
    }>;
  };
  qualityControl: {
    inspections: Array<{
      type: string;
      date: string;
      inspector: string;
      status: string;
      notes: string;
    }>;
    certifications: string[];
    compliance: Array<{
      requirement: string;
      status: string;
      evidence: string;
    }>;
  };
  risks: Array<{
    id: string;
    description: string;
    probability: string;
    impact: string;
    mitigation: string;
    status: string;
    owner: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function EPCProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<EPCProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/epc/projects/${projectId}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('EPC project not found');
          }
          throw new Error('Failed to fetch project details');
        }
        const result = await response.json();
        setProject(result);
      } catch (err) {
        console.error('Project fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  const getStatusColor = (status: string) => {
    const colors = {
      'not_started': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      'planning': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      'active': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'in_progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
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

  const getRiskColor = (risk: { probability: string; impact: string }) => {
    if (risk.probability === 'high' && risk.impact === 'high') return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    if (risk.probability === 'high' || risk.impact === 'high') return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
    if (risk.probability === 'medium' && risk.impact === 'medium') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
  };

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="absolute inset-0 neural-bg opacity-40"></div>
        <div className="relative container mx-auto px-6 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="neural-card p-8 text-center">
              <div className="w-16 h-16 mx-auto border-4 border-accent/20 border-t-accent rounded-full rotate-slow"></div>
              <h3 className="text-xl font-semibold mt-4 neural-text">Loading EPC Project...</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="absolute inset-0 neural-bg opacity-40"></div>
        <div className="relative container mx-auto px-6 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="neural-card p-8 text-center max-w-md">
              <h3 className="text-xl font-semibold mb-4 text-red-600">Project Not Found</h3>
              <p className="text-muted-foreground mb-6">{error}</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => router.back()} variant="outline">
                  ← Go Back
                </Button>
                <Link href="/epc/projects">
                  <Button className="btn-primary">
                    📋 All Projects
                  </Button>
                </Link>
              </div>
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
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className={getStatusColor(project.overallStatus)}>
                {project.overallStatus.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge className={getPriorityColor(project.priority)}>
                {project.priority.toUpperCase()}
              </Badge>
            </div>
            <h1 className="text-4xl font-bold neural-text">{project.projectName}</h1>
            <p className="text-xl text-muted-foreground">{project.projectId}</p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${getHealthScoreColor(project.healthScore)}`}>
              {project.healthScore}%
            </div>
            <div className="text-sm text-muted-foreground">Health Score</div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="neural-card hover-lift">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{project.overallProgress}%</div>
              <div className="text-sm text-muted-foreground">Overall Progress</div>
            </CardContent>
          </Card>
          <Card className="neural-card hover-lift">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600">
                {formatCurrency(project.resources.budget.total, project.resources.budget.currency)}
              </div>
              <div className="text-sm text-muted-foreground">Total Budget</div>
            </CardContent>
          </Card>
          <Card className="neural-card hover-lift">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600">
                {Math.round((project.resources.budget.spent / project.resources.budget.total) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Budget Used</div>
            </CardContent>
          </Card>
          <Card className="neural-card hover-lift">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600">
                {Math.ceil((new Date(project.resources.timeline.plannedEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
              </div>
              <div className="text-sm text-muted-foreground">Days Remaining</div>
            </CardContent>
          </Card>
        </div>

        {/* Phase Progress */}
        <Card className="neural-card mb-8">
          <CardHeader>
            <CardTitle>Phase Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Engineering */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold flex items-center gap-2">
                    🔧 Engineering
                  </h3>
                  <Badge className={getStatusColor(project.phases.engineering.status)}>
                    {project.phases.engineering.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${project.phases.engineering.progress}%` }}
                  ></div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Progress: {project.phases.engineering.progress}%
                </div>
                {project.phases.engineering.assignedTeam.length > 0 && (
                  <div className="text-sm">
                    <strong>Team:</strong> {project.phases.engineering.assignedTeam.join(', ')}
                  </div>
                )}
              </div>

              {/* Procurement */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold flex items-center gap-2">
                    📦 Procurement
                  </h3>
                  <Badge className={getStatusColor(project.phases.procurement.status)}>
                    {project.phases.procurement.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${project.phases.procurement.progress}%` }}
                  ></div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Progress: {project.phases.procurement.progress}%
                </div>
                {project.phases.procurement.vendor && (
                  <div className="text-sm">
                    <strong>Vendor:</strong> {project.phases.procurement.vendor}
                  </div>
                )}
              </div>

              {/* Construction */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold flex items-center gap-2">
                    🏗️ Construction
                  </h3>
                  <Badge className={getStatusColor(project.phases.construction.status)}>
                    {project.phases.construction.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-green-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${project.phases.construction.progress}%` }}
                  ></div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Progress: {project.phases.construction.progress}%
                </div>
                {project.phases.construction.contractor && (
                  <div className="text-sm">
                    <strong>Contractor:</strong> {project.phases.construction.contractor}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Milestones */}
          <Card className="neural-card">
            <CardHeader>
              <CardTitle>Construction Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {project.phases.construction.milestones.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    No milestones defined yet
                  </p>
                ) : (
                  project.phases.construction.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div>
                        <div className="font-semibold">{milestone.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Target: {formatDate(milestone.targetDate)}
                        </div>
                      </div>
                      <Badge className={getStatusColor(milestone.status)}>
                        {milestone.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Risks */}
          <Card className="neural-card">
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {project.risks.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    No risks identified
                  </p>
                ) : (
                  project.risks.filter(risk => risk.status === 'open').slice(0, 5).map((risk) => (
                    <div key={risk.id} className="p-3 rounded-lg border">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-semibold text-sm">{risk.description}</div>
                        <Badge className={getRiskColor(risk)}>
                          {risk.probability}/{risk.impact}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Mitigation: {risk.mitigation}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Owner: {risk.owner}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-8">
          <div className="flex gap-3">
            <Button onClick={() => router.back()} variant="outline">
              ← Back
            </Button>
            <Link href={`/sites/${project.siteId}`}>
              <Button variant="outline">
                🏗️ View Site
              </Button>
            </Link>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              📊 Generate Report
            </Button>
            <Button className="btn-primary">
              ✏️ Edit Project
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
