"use client";

import { BorderStyleShowcase } from "@/components/examples/BorderStyleShowcase";

export default function BorderStylingPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-heading-1 mb-8">Border Styling System</h1>

      <div className="mb-8">
        <p className="text-body-lg mb-4">
          This page demonstrates the standardized border styling system
          implemented across the Railway Solar application. The system provides
          consistent borders throughout the application using CSS variables,
          utility classes, and component properties.
        </p>

        <p className="text-body mb-2">
          For full documentation, see{" "}
          <code className="bg-muted px-1 py-0.5 rounded">
            docs/BORDER_STYLING_SYSTEM.md
          </code>
        </p>
      </div>

      <BorderStyleShowcase />
    </div>
  );
}
