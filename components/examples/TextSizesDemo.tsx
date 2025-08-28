"use client";

import React from "react";

export default function TextSizesDemo() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-heading-1 mb-8">Text Sizes Demo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-heading-3 mb-4">Semantic Text Classes</h2>

          <div className="space-y-4">
            <div>
              <p className="text-heading-1">Heading 1</p>
              <p className="text-muted-foreground">text-heading-1</p>
            </div>

            <div>
              <p className="text-heading-2">Heading 2</p>
              <p className="text-muted-foreground">text-heading-2</p>
            </div>

            <div>
              <p className="text-heading-3">Heading 3</p>
              <p className="text-muted-foreground">text-heading-3</p>
            </div>

            <div>
              <p className="text-heading-4">Heading 4</p>
              <p className="text-muted-foreground">text-heading-4</p>
            </div>

            <div>
              <p className="text-body-lg">Body Large</p>
              <p className="text-muted-foreground">text-body-lg</p>
            </div>

            <div>
              <p className="text-body">Body</p>
              <p className="text-muted-foreground">text-body</p>
            </div>

            <div>
              <p className="text-body-sm">Body Small</p>
              <p className="text-muted-foreground">text-body-sm</p>
            </div>

            <div>
              <p className="text-caption">Caption</p>
              <p className="text-muted-foreground">text-caption</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-heading-3 mb-4">Utility Text Size Classes</h2>

          <div className="space-y-4">
            <div>
              <p className="text-5xl">Text 5XL</p>
              <p className="text-muted-foreground">text-5xl (48px)</p>
            </div>

            <div>
              <p className="text-4xl">Text 4XL</p>
              <p className="text-muted-foreground">text-4xl (36px)</p>
            </div>

            <div>
              <p className="text-3xl">Text 3XL</p>
              <p className="text-muted-foreground">text-3xl (30px)</p>
            </div>

            <div>
              <p className="text-2xl">Text 2XL</p>
              <p className="text-muted-foreground">text-2xl (24px)</p>
            </div>

            <div>
              <p className="text-xl">Text XL</p>
              <p className="text-muted-foreground">text-xl (20px)</p>
            </div>

            <div>
              <p className="text-lg">Text LG</p>
              <p className="text-muted-foreground">text-lg (18px)</p>
            </div>

            <div>
              <p className="text-base">Text Base</p>
              <p className="text-muted-foreground">text-base (16px)</p>
            </div>

            <div>
              <p className="text-sm">Text SM</p>
              <p className="text-muted-foreground">text-sm (14px)</p>
            </div>

            <div>
              <p className="text-xs">Text XS</p>
              <p className="text-muted-foreground">text-xs (12px)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-heading-3 mb-4">Combining Text Utilities</h2>

        <div className="space-y-4">
          <div>
            <p className="text-2xl font-bold uppercase tracking-wide">
              Bold, Uppercase with Wide Tracking
            </p>
            <p className="text-muted-foreground">
              text-2xl font-bold uppercase tracking-wide
            </p>
          </div>

          <div>
            <p className="text-lg font-medium italic text-primary">
              Medium, Italic, Primary Color
            </p>
            <p className="text-muted-foreground">
              text-lg font-medium italic text-primary
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold tracking-tight leading-snug">
              Small, Semibold, Tight Tracking, Snug Leading
            </p>
            <p className="text-muted-foreground">
              text-sm font-semibold tracking-tight leading-snug
            </p>
          </div>

          <div>
            <p className="text-base font-normal underline text-center">
              Base, Normal Weight, Underlined, Centered
            </p>
            <p className="text-muted-foreground">
              text-base font-normal underline text-center
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
