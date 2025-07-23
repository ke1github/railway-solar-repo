// app/sites/[id]/survey/page.tsx
export default async function SiteSurveyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Site Survey - Site {id}</h1>
      <p className="text-muted-foreground">Site survey data and forms</p>
    </div>
  );
}
