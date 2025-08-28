"use client";

import React from "react";
import {
  Settings,
  Home,
  User,
  FileText,
  ExternalLink,
  Mail,
  Info,
  Paintbrush,
} from "lucide-react";

import { ModernTabList } from "@/components/ui/modern-tab-list";
import { ButtonLink } from "@/components/ui/button-link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function UIShowcasePage() {
  // Sample tab content
  const tabContent = (title: string) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>This is a sample content for {title}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          This is a demonstration of the ModernTabList component with different
          styling variants. You can customize each tab with icons, badges, and
          different layouts.
        </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <ButtonLink href="#" variant="railway-primary" icon={<Settings />}>
          Settings
        </ButtonLink>
        <ButtonLink href="#" variant="railway-secondary">
          Learn More
        </ButtonLink>
      </CardFooter>
    </Card>
  );

  // Sample tabs data
  const tabs = [
    {
      id: "home",
      label: "Home",
      icon: <Home className="size-4" />,
      content: tabContent("Home Tab"),
    },
    {
      id: "profile",
      label: "Profile",
      icon: <User className="size-4" />,
      badge: "3",
      content: tabContent("Profile Tab"),
    },
    {
      id: "messages",
      label: "Messages",
      icon: <Mail className="size-4" />,
      badge: "12",
      content: tabContent("Messages Tab"),
    },
    {
      id: "about",
      label: "About",
      icon: <Info className="size-4" />,
      content: tabContent("About Tab"),
    },
  ];

  return (
    <div className="container py-10 space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-6">Modern UI Components</h1>
        <p className="text-muted-foreground max-w-2xl mb-10">
          Showcase of reusable components designed for the Railway Solar project
          with consistent styling, animations, and responsive behaviors.
        </p>

        <div className="flex flex-wrap gap-3 mb-6">
          <ButtonLink
            href="/ui-showcase/border-styling"
            variant="outline"
            icon={<Paintbrush className="size-4" />}
          >
            Border Styling System
          </ButtonLink>
        </div>
      </div>

      {/* ModernTabList Component Showcase */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b pb-2">
          ModernTabList Component
        </h2>

        <div className="space-y-10">
          <div>
            <h3 className="text-lg font-medium mb-4">Railway Style</h3>
            <ModernTabList tabs={tabs} variant="railway" animated={true} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Pills Style</h3>
            <ModernTabList tabs={tabs} variant="pills" animated={true} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Underlined Style</h3>
            <ModernTabList tabs={tabs} variant="underlined" animated={true} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Vertical Layout</h3>
            <ModernTabList
              tabs={tabs}
              variant="railway"
              orientation="vertical"
              animated={true}
            />
          </div>
        </div>
      </section>

      {/* ButtonLink Component Showcase */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b pb-2">
          ButtonLink Component
        </h2>

        <div className="space-y-10">
          <div>
            <h3 className="text-lg font-medium mb-4">Railway Variants</h3>
            <div className="flex flex-wrap gap-4">
              <ButtonLink href="#" variant="railway-primary">
                Railway Primary
              </ButtonLink>

              <ButtonLink href="#" variant="railway-secondary">
                Railway Secondary
              </ButtonLink>

              <ButtonLink href="#" variant="railway-primary" size="sm">
                Small Size
              </ButtonLink>

              <ButtonLink href="#" variant="railway-primary" size="lg">
                Large Size
              </ButtonLink>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">With Icons</h3>
            <div className="flex flex-wrap gap-4">
              <ButtonLink
                href="#"
                variant="railway-primary"
                icon={<Settings />}
              >
                With Icon
              </ButtonLink>

              <ButtonLink
                href="#"
                variant="railway-secondary"
                icon={<FileText />}
                iconPosition="right"
              >
                Icon Right
              </ButtonLink>

              <ButtonLink href="#" variant="default" showChevron>
                With Chevron
              </ButtonLink>

              <ButtonLink href="https://example.com" variant="outline">
                External Link
              </ButtonLink>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">
              Standard Button Variants
            </h3>
            <div className="flex flex-wrap gap-4">
              <ButtonLink href="#" variant="default">
                Default
              </ButtonLink>
              <ButtonLink href="#" variant="secondary">
                Secondary
              </ButtonLink>
              <ButtonLink href="#" variant="outline">
                Outline
              </ButtonLink>
              <ButtonLink href="#" variant="ghost">
                Ghost
              </ButtonLink>
              <ButtonLink href="#" variant="link">
                Link Style
              </ButtonLink>
              <ButtonLink href="#" variant="destructive">
                Destructive
              </ButtonLink>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">
              Comparison with Regular Buttons
            </h3>
            <div className="flex flex-wrap gap-4">
              <ButtonLink href="#" variant="default">
                Link as Button
              </ButtonLink>
              <Button>Regular Button</Button>

              <ButtonLink href="#" variant="railway-primary">
                Railway Link
              </ButtonLink>
              <Button className="bg-railway-gradient text-slate-900 shadow-railway">
                Railway Button
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
