// components/layout/SiteLayout.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SiteLayout() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Layout Design</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">Layout Diagram Placeholder</p>
        </div>
      </CardContent>
    </Card>
  );
}
