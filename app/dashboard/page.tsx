// app/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Battery, Cpu, Sun, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your Railway Solar monitoring dashboard.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Sun className="w-4 h-4 mr-2 text-yellow-500" />
              Total Production
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.34 MWh</div>
            <p className="text-xs text-muted-foreground mt-1">
              +5.2% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Zap className="w-4 h-4 mr-2 text-blue-500" />
              Active Sites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12/15</div>
            <p className="text-xs text-muted-foreground mt-1">
              3 sites in maintenance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Battery className="w-4 h-4 mr-2 text-green-500" />
              Storage Capacity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.8 MWh</div>
            <p className="text-xs text-muted-foreground mt-1">
              75% of total capacity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Cpu className="w-4 h-4 mr-2 text-purple-500" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground mt-1">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Energy Production
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-[4/3] bg-muted rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">Energy Production Chart</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-start space-x-3 border-b border-border pb-3 last:border-0"
                >
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    {i % 2 === 0 ? <Sun size={14} /> : <Zap size={14} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {i % 2 === 0
                        ? "Site maintenance completed"
                        : "Production threshold reached"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {i % 2 === 0 ? "Site A-" + i : "Station B-" + i} • {i}{" "}
                      hour{i !== 1 ? "s" : ""} ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
