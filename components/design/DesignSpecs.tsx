// components/design/DesignSpecs.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DesignSpecs() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Design Specifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Panel Specifications</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Type: Monocrystalline</li>
              <li>Power: 540W per panel</li>
              <li>Efficiency: 21.2%</li>
              <li>Warranty: 25 years</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Inverter Specifications</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Type: String Inverter</li>
              <li>Power: 50kW</li>
              <li>Efficiency: 98.5%</li>
              <li>Warranty: 10 years</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
