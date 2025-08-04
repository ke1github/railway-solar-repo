// components/forms/ZoneForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { zoneSchema, type ZoneFormData } from "@/lib/validation";
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
import { createZone, updateZone } from "@/lib/actions/hierarchy-actions";

interface ZoneFormProps {
  initialData?: Partial<ZoneFormData>;
  zoneId?: string;
  isEditing?: boolean;
}

export default function ZoneForm({
  initialData,
  zoneId,
  isEditing = false,
}: ZoneFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ZoneFormData>({
    resolver: zodResolver(zoneSchema),
    defaultValues: initialData || {},
  });

  const onSubmit = async (data: ZoneFormData) => {
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
      if (isEditing && zoneId) {
        response = await updateZone(zoneId, formData);
      } else {
        response = await createZone(formData);
      }

      if (response.success) {
        setSuccess(
          isEditing
            ? "Zone updated successfully!"
            : "Zone created successfully!"
        );
        if (!isEditing) {
          reset(); // Only reset the form for new zones
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Zone" : "Create New Zone"}</CardTitle>
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
              <Label htmlFor="code">Zone Code *</Label>
              <Input
                id="code"
                placeholder="Enter zone code"
                {...register("code")}
                disabled={isSubmitting || (isEditing && initialData?.code)}
              />
              {errors.code && (
                <p className="text-red-500 text-sm">{errors.code.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Zone Name *</Label>
              <Input
                id="name"
                placeholder="Enter zone name"
                {...register("name")}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                placeholder="Enter region"
                {...register("region")}
                disabled={isSubmitting}
              />
              {errors.region && (
                <p className="text-red-500 text-sm">{errors.region.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="headOffice">Head Office</Label>
              <Input
                id="headOffice"
                placeholder="Enter head office location"
                {...register("headOffice")}
                disabled={isSubmitting}
              />
              {errors.headOffice && (
                <p className="text-red-500 text-sm">
                  {errors.headOffice.message}
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
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Processing..."
                : isEditing
                ? "Update Zone"
                : "Create Zone"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
