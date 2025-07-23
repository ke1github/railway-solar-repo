// components/delivery/DeliveryTracker.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DeliveryTracker() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipment Delivery Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded">
            <span>Solar Panels (200 units)</span>
            <span className="text-green-600 font-medium">Delivered</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
            <span>Inverters (5 units)</span>
            <span className="text-blue-600 font-medium">In Transit</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded">
            <span>Mounting Hardware</span>
            <span className="text-orange-600 font-medium">Pending</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
