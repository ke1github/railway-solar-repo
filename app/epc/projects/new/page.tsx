// app/epc/projects/new/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface RailwaySite {
  _id: string;
  id: string;
  locationName: string;
  address: string;
  cluster: string;
  feasibleCapacity: number;
  status: string;
}

export default function NewEPCProjectPage() {
  const router = useRouter();
  const [sites, setSites] = useState<RailwaySite[]>([]);
  const [loading, setLoading] = useState(false);
  const [sitesLoading, setSitesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    projectName: '',
    siteId: '',
    projectType: 'solar_installation',
    priority: 'medium',
    budgetTotal: '',
    plannedStartDate: '',
    plannedEndDate: '',
    engineeringTeam: '',
    procurementVendor: '',
    contractor: '',
  });

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      setSitesLoading(true);
      const response = await fetch('/api/sites?limit=200');
      if (!response.ok) throw new Error('Failed to fetch sites');
      const result = await response.json();
      setSites(result.sites || []);
    } catch (err) {
      console.error('Sites fetch error:', err);
      setError('Failed to load sites');
    } finally {
      setSitesLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.projectName || !formData.siteId || !formData.budgetTotal || !formData.plannedStartDate || !formData.plannedEndDate) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const projectData = {
        projectName: formData.projectName,
        siteId: formData.siteId,
        projectType: formData.projectType,
        priority: formData.priority,
        phases: {
          engineering: {
            status: 'not_started',
            assignedTeam: formData.engineeringTeam ? [formData.engineeringTeam] : [],
            progress: 0,
          },
          procurement: {
            status: 'not_started',
            vendor: formData.procurementVendor,
            progress: 0,
          },
          construction: {
            status: 'not_started',
            contractor: formData.contractor,
            milestones: [
              {
                name: 'Foundation Preparation',
                targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                status: 'pending',
              },
              {
                name: 'Panel Installation',
                targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
                status: 'pending',
              },
              {
                name: 'System Commissioning',
                targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
                status: 'pending',
              },
            ],
            progress: 0,
          },
        },
        resources: {
          budget: {
            total: parseFloat(formData.budgetTotal),
            allocated: 0,
            spent: 0,
            currency: 'INR',
          },
          timeline: {
            plannedStartDate: new Date(formData.plannedStartDate),
            plannedEndDate: new Date(formData.plannedEndDate),
          },
          team: [],
        },
        qualityControl: {
          inspections: [],
          certifications: [],
          compliance: [
            {
              requirement: 'Railway Safety Clearance',
              status: 'pending',
              evidence: '',
            },
            {
              requirement: 'Environmental Impact Assessment',
              status: 'pending',
              evidence: '',
            },
            {
              requirement: 'Electrical Safety Certification',
              status: 'pending',
              evidence: '',
            },
          ],
        },
        risks: [
          {
            id: 'RISK-001',
            description: 'Weather delays during monsoon season',
            probability: 'medium',
            impact: 'medium',
            mitigation: 'Schedule critical work outside monsoon period',
            status: 'open',
            owner: formData.contractor || 'TBD',
          },
          {
            id: 'RISK-002',
            description: 'Regulatory approval delays',
            probability: 'low',
            impact: 'high',
            mitigation: 'Submit applications early with complete documentation',
            status: 'open',
            owner: formData.engineeringTeam || 'TBD',
          },
        ],
        overallStatus: 'planning',
        healthScore: 100,
      };

      const response = await fetch('/api/epc/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create project');
      }

      const newProject = await response.json();
      router.push(`/epc/projects/${newProject.projectId}`);
      
    } catch (err) {
      console.error('Create project error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="absolute inset-0 neural-bg opacity-40"></div>
      
      <div className="relative container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold neural-text mb-2">Create New EPC Project</h1>
          <p className="text-xl text-muted-foreground">
            Set up a new Engineering, Procurement & Construction project for railway solar installation
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Basic Information */}
              <Card className="neural-card">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Project Name *</label>
                      <Input
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleInputChange}
                        placeholder="e.g., Kharagpur Junction Solar Installation"
                        required
                        className="neural-input"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Project Type</label>
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                      >
                        <option value="solar_installation">Solar Installation</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="upgrade">System Upgrade</option>
                        <option value="expansion">Capacity Expansion</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Railway Site *</label>
                      {sitesLoading ? (
                        <div className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-800">
                          Loading sites...
                        </div>
                      ) : (
                        <select
                          name="siteId"
                          value={formData.siteId}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                        >
                          <option value="">Select a railway site</option>
                          {sites.map((site) => (
                            <option key={site.id} value={site.id}>
                              {site.locationName} - {site.address} ({site.feasibleCapacity} kW)
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Priority</label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Budget & Timeline */}
              <Card className="neural-card">
                <CardHeader>
                  <CardTitle>Budget & Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Total Budget (INR) *</label>
                      <Input
                        name="budgetTotal"
                        type="number"
                        value={formData.budgetTotal}
                        onChange={handleInputChange}
                        placeholder="e.g., 5000000"
                        required
                        className="neural-input"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Planned Start Date *</label>
                      <Input
                        name="plannedStartDate"
                        type="date"
                        value={formData.plannedStartDate}
                        onChange={handleInputChange}
                        required
                        className="neural-input"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Planned End Date *</label>
                      <Input
                        name="plannedEndDate"
                        type="date"
                        value={formData.plannedEndDate}
                        onChange={handleInputChange}
                        required
                        className="neural-input"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Team & Vendors */}
              <Card className="neural-card">
                <CardHeader>
                  <CardTitle>Team & Vendors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Engineering Team Lead</label>
                      <Input
                        name="engineeringTeam"
                        value={formData.engineeringTeam}
                        onChange={handleInputChange}
                        placeholder="e.g., Rajesh Kumar"
                        className="neural-input"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Procurement Vendor</label>
                      <Input
                        name="procurementVendor"
                        value={formData.procurementVendor}
                        onChange={handleInputChange}
                        placeholder="e.g., Solar Tech Solutions Pvt Ltd"
                        className="neural-input"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Construction Contractor</label>
                      <Input
                        name="contractor"
                        value={formData.contractor}
                        onChange={handleInputChange}
                        placeholder="e.g., Green Energy Builders"
                        className="neural-input"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Error Display */}
              {error && (
                <Card className="neural-card border-red-200 dark:border-red-800">
                  <CardContent className="p-4">
                    <div className="text-red-600 dark:text-red-400">
                      ⚠️ {error}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  ← Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Creating Project...' : '🚀 Create EPC Project'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
