// components/photo/PhotoGallery.tsx
"use client";
import { Card, CardContent } from "@/components/ui/card";

interface Photo {
  id: string;
  url: string;
  caption: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {photos.map((photo) => (
        <Card key={photo.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <span className="text-muted-foreground">Photo: {photo.caption}</span>
            </div>
            <div className="p-4">
              <p className="text-sm text-muted-foreground">{photo.caption}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
