"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function BorderStyleShowcase() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-heading-3 mb-4">Border Utility Classes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-background border-standard">
            Standard Border
          </div>
          <div className="p-4 rounded-lg bg-background border-subtle">
            Subtle Border
          </div>
          <div className="p-4 rounded-lg bg-background border-prominent">
            Prominent Border
          </div>
          <div className="p-4 rounded-lg bg-background border-top">
            Top Border
          </div>
          <div className="p-4 rounded-lg bg-background border-bottom">
            Bottom Border
          </div>
          <div className="p-4 rounded-lg bg-background border-standard border-medium">
            Medium Width
          </div>
          <div className="p-4 rounded-lg bg-background border-standard border-thick">
            Thick Width
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-heading-3 mb-4">Card Component Borders</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card withBorder={false}>
            <CardHeader>
              <CardTitle>No Border</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Card with no border</p>
            </CardContent>
          </Card>

          <Card withBorder={true} borderStyle="subtle">
            <CardHeader>
              <CardTitle>Subtle Border</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Card with subtle border</p>
            </CardContent>
          </Card>

          <Card withBorder={true} borderStyle="standard">
            <CardHeader>
              <CardTitle>Standard Border</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Card with standard border</p>
            </CardContent>
          </Card>

          <Card withBorder={true} borderStyle="prominent">
            <CardHeader>
              <CardTitle>Prominent Border</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Card with prominent border</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-heading-3 mb-4">Table Component Borders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-heading-4 mb-2">With Border, No Row Borders</h3>
            <Table withBorder={true} withRowBorders={false}>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Project A</TableCell>
                  <TableCell>Active</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Project B</TableCell>
                  <TableCell>Pending</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div>
            <h3 className="text-heading-4 mb-2">With Border and Row Borders</h3>
            <Table withBorder={true} withRowBorders={true}>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Project A</TableCell>
                  <TableCell>Active</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Project B</TableCell>
                  <TableCell>Pending</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-heading-3 mb-4">Form Component Borders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-heading-4 mb-2">Input Borders</h3>
            <div>
              <Input placeholder="Default (Subtle Border)" className="mb-2" />
              <Input
                placeholder="No Border"
                withBorder={false}
                className="mb-2"
              />
              <Input
                placeholder="Standard Border"
                borderStyle="standard"
                className="mb-2"
              />
              <Input placeholder="Prominent Border" borderStyle="prominent" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-heading-4 mb-2">Textarea Borders</h3>
            <div>
              <Textarea
                placeholder="Default (Subtle Border)"
                className="mb-2"
              />
              <Textarea
                placeholder="No Border"
                withBorder={false}
                className="mb-2"
              />
              <Textarea
                placeholder="Standard Border"
                borderStyle="standard"
                className="mb-2"
              />
              <Textarea
                placeholder="Prominent Border"
                borderStyle="prominent"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-heading-4 mb-2">Select Borders</h3>
            <div className="flex flex-col gap-2">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Default (Subtle Border)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger withBorder={false}>
                  <SelectValue placeholder="No Border" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger borderStyle="standard">
                  <SelectValue placeholder="Standard Border" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger borderStyle="prominent">
                  <SelectValue placeholder="Prominent Border" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-heading-4 mb-2">Button Borders</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline">Default Outline (With Border)</Button>
              <Button variant="outline" withBorder={false}>
                Outline (No Border)
              </Button>
              <Button variant="outline" borderStyle="prominent">
                Prominent Border
              </Button>
              <Button variant="default" withBorder={true} borderStyle="subtle">
                Default With Border
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
