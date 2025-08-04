// components/forms/DivisionForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { divisionSchema, type DivisionFormData } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  createDivision,
  updateDivision,
} from "@/lib/actions/hierarchy-actions";
import { getZones } from "@/lib/actions/hierarchy-actions";

interface DivisionFormProps {
  initialData?: Partial<DivisionFormData>;
  divisionId?: string;
  isEditing?: boolean;
}

export default function DivisionForm({
  initialData,
  divisionId,
  isEditing = false,
}: DivisionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [zones, setZones] = useState<
    Array<{ _id: string; code: string; name: string }>
  >([]);
  const [isLoadingZones, setIsLoadingZones] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<DivisionFormData>({
    resolver: zodResolver(divisionSchema),
    defaultValues: initialData || {},
  });

  const selectedZoneId = watch("zoneId");

  useEffect(() => {
    async function fetchZones() {
      setIsLoadingZones(true);
      try {
        const response = await getZones();
        if (response.success && response.data) {
          setZones(response.data);
        } else {
          setError("Failed to load zones");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load zones");
      } finally {
        setIsLoadingZones(false);
      }
    }

    fetchZones();
  }, []);

  const onSubmit = async (data: DivisionFormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      let response;
      if (isEditing && divisionId) {
        response = await updateDivision(divisionId, formData);
      } else {
        response = await createDivision(formData);
      }

      if (response.success) {
        setSuccess(
          isEditing
            ? "Division updated successfully!"
            : "Division created successfully!"
        );
        if (!isEditing) {
          reset(); // Only reset the form for new divisions
        }
      } else {
        setError(response.error || "An error occurred");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleZoneChange = (zoneId: string) => {
    setValue("zoneId", zoneId);

    // Set zoneCode based on selected zone
    const selectedZone = zones.find((zone) => zone._id === zoneId);
    if (selectedZone) {
      setValue("zoneCode", selectedZone.code);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Division" : "Create New Division"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mb-4 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Division Code *</Label>
              <Input
                id="code"
                placeholder="Enter division code"
                {...register("code")}
                disabled={isSubmitting || (isEditing && initialData?.code)}
              />
              {errors.code && (
                <p className="text-red-500 text-sm">{errors.code.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Division Name *</Label>
              <Input
                id="name"
                placeholder="Enter division name"
                {...register("name")}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zoneId">Zone *</Label>
              <Select
                disabled={isLoadingZones || isSubmitting}
                value={selectedZoneId}
                onValueChange={handleZoneChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select zone" />
                </SelectTrigger>
                <SelectContent>
                  {zones.map((zone) => (
                    <SelectItem key={zone._id} value={zone._id}>
                      {zone.name} ({zone.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.zoneId && (
                <p className="text-red-500 text-sm">{errors.zoneId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="headquarter">Headquarter</Label>
              <Input
                id="headquarter"
                placeholder="Enter headquarter location"
                {...register("headquarter")}
                disabled={isSubmitting}
              />
              {errors.headquarter && (
                <p className="text-red-500 text-sm">
                  {errors.headquarter.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="divisionType">Division Type</Label>
              <Select
                defaultValue={initialData?.divisionType || "mixed"}
                onValueChange={(value) =>
                  register("divisionType").onChange({ target: { value } })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select division type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="administrative">Administrative</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
              {errors.divisionType && (
                <p className="text-red-500 text-sm">
                  {errors.divisionType.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input
                id="contactPerson"
                placeholder="Enter contact person name"
                {...register("contactPerson")}
                disabled={isSubmitting}
              />
              {errors.contactPerson && (
                <p className="text-red-500 text-sm">
                  {errors.contactPerson.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="Enter contact email"
                {...register("contactEmail")}
                disabled={isSubmitting}
              />
              {errors.contactEmail && (
                <p className="text-red-500 text-sm">
                  {errors.contactEmail.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                placeholder="Enter contact phone number"
                {...register("contactPhone")}
                disabled={isSubmitting}
              />
              {errors.contactPhone && (
                <p className="text-red-500 text-sm">
                  {errors.contactPhone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                defaultValue={initialData?.status || "active"}
                onValueChange={(value) =>
                  register("status").onChange({ target: { value } })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="merged">Merged</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status.message}</p>
              )}
            </div>
          </div>

          {/* Hidden input for zoneCode, will be set automatically */}
          <input type="hidden" {...register("zoneCode")} />

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoadingZones}>
              {isSubmitting
                ? "Processing..."
                : isEditing
                ? "Update Division"
                : "Create Division"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
