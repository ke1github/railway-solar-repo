// components/forms/EPCProjectForm.tsx
'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EPCProjectData {
  projectId?: string;
  projectName?: string;
  description?: string;
  clientName?: string;
  contactEmail?: string;
  contactPhone?: string;
  budget?: number;
  startDate?: string;
  estimatedEndDate?: string;
  status?: string;
  priority?: string;
  sites?: string[];
  projectManager?: string;
  teamSize?: number;
  notes?: string;
}

interface EPCProjectFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  initialData?: EPCProjectData;
  isEditing?: boolean;
  availableSites?: Array<{ id: string; locationName: string; }>;
}

export default function EPCProjectForm({ 
  onSubmit, 
  initialData, 
  isEditing = false,
  availableSites = []
}: EPCProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedSites, setSelectedSites] = useState<string[]>(initialData?.sites || []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const formData = new FormData(event.currentTarget);
      
      // Add selected sites to form data
      selectedSites.forEach(siteId => {
        formData.append('sites', siteId);
      });

      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ submit: 'Failed to submit form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSiteToggle = (siteId: string) => {
    setSelectedSites(prev => 
      prev.includes(siteId) 
        ? prev.filter(id => id !== siteId)
        : [...prev, siteId]
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {isEditing ? 'Edit EPC Project' : 'Create New EPC Project'}
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            {isEditing ? 'Update the project information below' : 'Create a new Engineering, Procurement & Construction project for railway solar installations'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Project Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Project ID <span className="text-red-500">*</span>
                </label>
                <Input
                  name="projectId"
                  defaultValue={initialData?.projectId || ''}
                  placeholder="e.g., EPC_RAIL_2024_001"
                  required
                  className="w-full"
                />
                {errors.projectId && (
                  <p className="text-red-500 text-sm mt-1">{errors.projectId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="projectName"
                  defaultValue={initialData?.projectName || ''}
                  placeholder="e.g., Northern Railway Solar Installation Phase 1"
                  required
                  className="w-full"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Project Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                defaultValue={initialData?.description || ''}
                placeholder="Comprehensive description of the EPC project scope, objectives, and deliverables..."
                rows={4}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
              />
            </div>

            {/* Client Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Client Name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="clientName"
                  defaultValue={initialData?.clientName || ''}
                  placeholder="e.g., Indian Railways"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Contact Email <span className="text-red-500">*</span>
                </label>
                <Input
                  name="contactEmail"
                  type="email"
                  defaultValue={initialData?.contactEmail || ''}
                  placeholder="client@railways.gov.in"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Contact Phone
                </label>
                <Input
                  name="contactPhone"
                  type="tel"
                  defaultValue={initialData?.contactPhone || ''}
                  placeholder="+91 98765 43210"
                  className="w-full"
                />
              </div>
            </div>

            {/* Project Management */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Budget (₹) <span className="text-red-500">*</span>
                </label>
                <Input
                  name="budget"
                  type="number"
                  step="0.01"
                  defaultValue={initialData?.budget || ''}
                  placeholder="50000000"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Project Manager <span className="text-red-500">*</span>
                </label>
                <Input
                  name="projectManager"
                  defaultValue={initialData?.projectManager || ''}
                  placeholder="Project Manager Name"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Team Size
                </label>
                <Input
                  name="teamSize"
                  type="number"
                  defaultValue={initialData?.teamSize || ''}
                  placeholder="15"
                  className="w-full"
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <Input
                  name="startDate"
                  type="date"
                  defaultValue={initialData?.startDate || ''}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Estimated End Date <span className="text-red-500">*</span>
                </label>
                <Input
                  name="estimatedEndDate"
                  type="date"
                  defaultValue={initialData?.estimatedEndDate || ''}
                  required
                  className="w-full"
                />
              </div>
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Project Status <span className="text-red-500">*</span>
                </label>
                <select 
                  name="status" 
                  defaultValue={initialData?.status || 'planning'}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                >
                  <option value="planning">Planning</option>
                  <option value="in-progress">In Progress</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Priority Level <span className="text-red-500">*</span>
                </label>
                <select 
                  name="priority" 
                  defaultValue={initialData?.priority || 'medium'}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            {/* Site Selection */}
            {availableSites.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-4">
                  Associated Sites
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto p-4 border rounded-lg">
                  {availableSites.map((site) => (
                    <div key={site.id} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id={`site-${site.id}`}
                        checked={selectedSites.includes(site.id)}
                        onChange={() => handleSiteToggle(site.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label 
                        htmlFor={`site-${site.id}`}
                        className="text-sm cursor-pointer hover:text-blue-600"
                      >
                        {site.locationName}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {selectedSites.length} site(s) selected
                </p>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Project Notes
              </label>
              <textarea
                name="notes"
                defaultValue={initialData?.notes || ''}
                placeholder="Additional project notes, special requirements, or considerations..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
              />
            </div>

            {/* Error Display */}
            {errors.submit && (
              <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-red-600 dark:text-red-400">{errors.submit}</p>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => window.history.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{isEditing ? 'Updating...' : 'Creating...'}</span>
                  </div>
                ) : (
                  <span>{isEditing ? 'Update Project' : 'Create Project'}</span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
