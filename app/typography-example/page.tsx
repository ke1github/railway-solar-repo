import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyP,
  TypographyLarge,
  TypographySmall,
  TypographyCaption,
  TypographyList,
  TypographyInlineCode,
  TypographyLead,
} from "@/components/ui/typography";

export default function TypographyExample() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-subtle to-background-accent p-8">
      <div className="container mx-auto max-w-4xl">
        <Card className="mb-8">
          <CardHeader>
            <TypographyH1>Typography System</TypographyH1>
            <TypographyLead>
              This page demonstrates the Railway Solar typography system
            </TypographyLead>
          </CardHeader>
          <CardContent>
            <TypographyP>
              The typography system provides consistent text styling across the
              entire application. It includes predefined classes and React
              components for headings, paragraphs, and other text elements.
            </TypographyP>
          </CardContent>
        </Card>

        {/* Headings */}
        <Card className="mb-8">
          <CardHeader>
            <TypographyH2>Heading Elements</TypographyH2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <TypographyH1>Heading 1 (H1)</TypographyH1>
              <TypographyCaption>
                36px / 2.25rem with 1.25 line height
              </TypographyCaption>
            </div>
            <div>
              <TypographyH2>Heading 2 (H2)</TypographyH2>
              <TypographyCaption>
                30px / 1.875rem with 1.25 line height
              </TypographyCaption>
            </div>
            <div>
              <TypographyH3>Heading 3 (H3)</TypographyH3>
              <TypographyCaption>
                24px / 1.5rem with 1.25 line height
              </TypographyCaption>
            </div>
            <div>
              <TypographyH4>Heading 4 (H4)</TypographyH4>
              <TypographyCaption>
                20px / 1.25rem with 1.375 line height
              </TypographyCaption>
            </div>
          </CardContent>
        </Card>

        {/* Body Text */}
        <Card className="mb-8">
          <CardHeader>
            <TypographyH2>Body Text</TypographyH2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <TypographyLarge>
                This is large body text (18px / 1.125rem)
              </TypographyLarge>
              <TypographyCaption>
                Used for important paragraphs or lead text
              </TypographyCaption>
            </div>
            <div>
              <TypographyP>
                This is regular body text (16px / 1rem). It's the standard text
                size used throughout the application for most paragraph content.
                This size provides good readability across different screen
                sizes.
              </TypographyP>
              <TypographyCaption>Default paragraph text</TypographyCaption>
            </div>
            <div>
              <TypographySmall>
                This is small body text (14px / 0.875rem). It's used for less
                important information or where space is limited, such as in
                cards or sidebar content.
              </TypographySmall>
              <TypographyCaption>
                Used for secondary information
              </TypographyCaption>
            </div>
            <div>
              <TypographyCaption>
                This is caption text (12px / 0.75rem). It's used for helper
                text, footnotes, or other supporting information that doesn't
                need to be prominent.
              </TypographyCaption>
              <TypographyCaption>
                Used for labels, helper text and hints
              </TypographyCaption>
            </div>
          </CardContent>
        </Card>

        {/* Using Classes Directly */}
        <Card className="mb-8">
          <CardHeader>
            <TypographyH2>Using CSS Classes Directly</TypographyH2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h1 className="text-heading-1">Heading 1 with CSS Class</h1>
              <p className="text-caption">Using the text-heading-1 class</p>
            </div>
            <div>
              <p className="text-body-lg">Large Body Text with CSS Class</p>
              <p className="text-caption">Using the text-body-lg class</p>
            </div>
            <div>
              <p className="text-body">Regular Body Text with CSS Class</p>
              <p className="text-caption">Using the text-body class</p>
            </div>
            <div>
              <p className="text-body-sm">Small Body Text with CSS Class</p>
              <p className="text-caption">Using the text-body-sm class</p>
            </div>
          </CardContent>
        </Card>

        {/* Other Typography Elements */}
        <Card className="mb-8">
          <CardHeader>
            <TypographyH2>Other Typography Elements</TypographyH2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <TypographyP>
                You can use{" "}
                <TypographyInlineCode>inline code</TypographyInlineCode> for
                technical references.
              </TypographyP>
            </div>
            <div>
              <TypographyP>Here's a list of items:</TypographyP>
              <TypographyList>
                <li>First item in the list</li>
                <li>Second item in the list</li>
                <li>
                  Third item with{" "}
                  <TypographyInlineCode>inline code</TypographyInlineCode>
                </li>
              </TypographyList>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card>
          <CardHeader>
            <TypographyH2>Implementation Guide</TypographyH2>
          </CardHeader>
          <CardContent>
            <TypographyP>
              For detailed information on using the typography system, check the
              Typography Guide document.
            </TypographyP>
            <div className="mt-4">
              <Button variant="railway">View Typography Guide</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
