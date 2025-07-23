// app/sites/[id]/photos/page.tsx
export default async function SitePhotosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Site Photos - Site {id}</h1>
      <p className="text-muted-foreground">Photo gallery and documentation</p>
    </div>
  );
}
