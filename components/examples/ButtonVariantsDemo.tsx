"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export default function ButtonVariantsDemo() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-heading-1 mb-8">Button Variants Demo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-heading-3 mb-4">Standard Button Variants</h2>

          <div className="flex flex-wrap gap-4">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="railway">Railway</Button>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-heading-3 mb-4">Subtle Button Variants</h2>

          <div className="flex flex-wrap gap-4">
            <Button variant="subtle">Subtle</Button>
            <Button variant="muted">Muted</Button>
            <Button variant="soft">Soft</Button>
            <Button variant="soft-destructive">Soft Destructive</Button>
            <Button variant="flat">Flat</Button>
            <Button variant="railway-muted">Railway Muted</Button>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-heading-3 mb-4">Button Sizes</h2>

        <div className="flex flex-wrap gap-4 items-center">
          <Button size="sm" variant="subtle">
            Small
          </Button>
          <Button size="default" variant="subtle">
            Default
          </Button>
          <Button size="lg" variant="subtle">
            Large
          </Button>
          <Button size="icon" variant="subtle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </Button>
        </div>
      </div>

      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-heading-3 mb-4">Border Styles</h2>

        <div className="flex flex-wrap gap-4">
          <Button variant="outline" borderStyle="subtle">
            Subtle Border
          </Button>
          <Button variant="outline" borderStyle="standard">
            Standard Border
          </Button>
          <Button variant="outline" borderStyle="prominent">
            Prominent Border
          </Button>
        </div>
      </div>
    </div>
  );
}
