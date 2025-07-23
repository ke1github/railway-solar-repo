// app/sites/[id]/layout/page.tsx
export default async function SiteLayoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Site Layout - Site {id}</h1>
      <p className="text-muted-foreground">Layout plans and diagrams</p>
    </div>
  );
}
