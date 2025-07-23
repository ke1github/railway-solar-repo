// app/sites/[id]/design/page.tsx
export default async function SiteDesignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Design Details - Site {id}</h1>
      <p className="text-muted-foreground">Design specifications and technical drawings</p>
    </div>
  );
}
