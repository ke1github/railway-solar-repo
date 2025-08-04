// components/forms/SiteForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { siteSchema, type SiteFormData } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  createSite,
  updateSite,
  getStations,
} from "@/lib/actions/hierarchy-actions";

interface SiteFormProps {
  initialData?: Partial<SiteFormData>;
  siteId?: string;
  isEditing?: boolean;
}

export default function SiteForm({
  initialData,
  siteId,
  isEditing = false,
}: SiteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [stations, setStations] = useState<
    Array<{
      _id: string;
      code: string;
      name: string;
      divisionId: string;
      divisionCode: string;
      zoneId: string;
      zoneCode: string;
    }>
  >([]);
  const [isLoadingStations, setIsLoadingStations] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<SiteFormData>({
    resolver: zodResolver(siteSchema),
    defaultValues: initialData || {
      siteType: "rooftop",
      status: "identified",
      projectPhase: "planning",
      sanctionedLoadUnit: "kW",
      waterSource: false,
      environmentalClearance: true,
    },
  });

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {isEditing ? "Edit Railway Site" : "Add New Railway Site"}
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            {isEditing
              ? "Update the site information below"
              : "Enter details for the new railway solar installation site"}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Location Name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="locationName"
                  defaultValue={initialData?.locationName || ""}
                  placeholder="e.g., Delhi Junction Railway Station"
                  required
                  className="w-full"
                />
                {errors.locationName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.locationName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Site ID <span className="text-red-500">*</span>
                </label>
                <Input
                  name="id"
                  defaultValue={initialData?.id || ""}
                  placeholder="e.g., RAIL_001"
                  required
                  className="w-full"
                />
                {errors.id && (
                  <p className="text-red-500 text-sm mt-1">{errors.id}</p>
                )}
              </div>
            </div>

            {/* Address Information */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <Input
                name="address"
                defaultValue={initialData?.address || ""}
                placeholder="Complete address of the railway installation"
                required
                className="w-full"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            {/* Geographic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <Input
                  name="state"
                  defaultValue={initialData?.state || ""}
                  placeholder="e.g., Delhi"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Cluster <span className="text-red-500">*</span>
                </label>
                <Input
                  name="cluster"
                  defaultValue={initialData?.cluster || ""}
                  placeholder="e.g., Northern Railway"
                  required
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Latitude
                </label>
                <Input
                  name="latitude"
                  type="number"
                  step="any"
                  defaultValue={initialData?.latitude || ""}
                  placeholder="e.g., 28.6139"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Longitude
                </label>
                <Input
                  name="longitude"
                  type="number"
                  step="any"
                  defaultValue={initialData?.longitude || ""}
                  placeholder="e.g., 77.2090"
                  className="w-full"
                />
              </div>
            </div>

            {/* Capacity Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Feasible Capacity (kW) <span className="text-red-500">*</span>
                </label>
                <Input
                  name="feasibleCapacity"
                  type="number"
                  step="0.01"
                  defaultValue={initialData?.feasibleCapacity || ""}
                  placeholder="e.g., 150.00"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Feasible Area (m²) <span className="text-red-500">*</span>
                </label>
                <Input
                  name="feasibleArea"
                  type="number"
                  step="0.01"
                  defaultValue={initialData?.feasibleArea || ""}
                  placeholder="e.g., 1000.00"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Energy Generated (kWh)
                </label>
                <Input
                  name="energyGenerated"
                  type="number"
                  step="0.01"
                  defaultValue={initialData?.energyGenerated || "0"}
                  placeholder="e.g., 180000.00"
                  className="w-full"
                />
              </div>
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  defaultValue={initialData?.status || "planned"}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                >
                  <option value="planned">Planned</option>
                  <option value="in-progress">In Progress</option>
                  <option value="operational">Operational</option>
                  <option value="under-maintenance">Under Maintenance</option>
                  <option value="decommissioned">Decommissioned</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Priority Level
                </label>
                <select
                  name="priority"
                  defaultValue={initialData?.priority || "medium"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Panel Type
                </label>
                <select
                  name="panelType"
                  defaultValue={initialData?.panelType || "monocrystalline"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                >
                  <option value="monocrystalline">Monocrystalline</option>
                  <option value="polycrystalline">Polycrystalline</option>
                  <option value="thin-film">Thin Film</option>
                  <option value="bifacial">Bifacial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Installation Type
                </label>
                <select
                  name="installationType"
                  defaultValue={initialData?.installationType || "rooftop"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                >
                  <option value="rooftop">Rooftop</option>
                  <option value="ground-mounted">Ground Mounted</option>
                  <option value="canopy">Canopy</option>
                  <option value="tracking">Solar Tracking</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              <textarea
                name="notes"
                defaultValue={initialData?.notes || ""}
                placeholder="Additional notes or special considerations..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
              />
            </div>

            {/* Error Display */}
            {errors.submit && (
              <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-red-600 dark:text-red-400">
                  {errors.submit}
                </p>
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
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{isEditing ? "Updating..." : "Creating..."}</span>
                  </div>
                ) : (
                  <span>{isEditing ? "Update Site" : "Create Site"}</span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
