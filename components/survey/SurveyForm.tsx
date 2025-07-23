// components/survey/SurveyForm.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SurveyForm() {
  const [formData, setFormData] = useState({
    surveyor: '',
    surveyDate: '',
    soilType: '',
    accessibility: '',
    notes: ''
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Survey Form</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input 
          placeholder="Surveyor Name" 
          value={formData.surveyor}
          onChange={(e) => setFormData({...formData, surveyor: e.target.value})}
        />
        <Input 
          type="date" 
          placeholder="Survey Date"
          value={formData.surveyDate}
          onChange={(e) => setFormData({...formData, surveyDate: e.target.value})}
        />
        <Input 
          placeholder="Soil Type"
          value={formData.soilType}
          onChange={(e) => setFormData({...formData, soilType: e.target.value})}
        />
        <Button className="w-full">Save Survey</Button>
      </CardContent>
    </Card>
  );
}
