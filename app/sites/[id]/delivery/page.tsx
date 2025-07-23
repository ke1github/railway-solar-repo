// app/sites/[id]/delivery/page.tsx
export default async function SiteDeliveryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Delivery Status - Site {id}</h1>
      <p className="text-muted-foreground">Equipment delivery tracking and status</p>
    </div>
  );
}
