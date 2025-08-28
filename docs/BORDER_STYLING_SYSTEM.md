# Border Styling System Documentation

## Overview

This document explains the standardized border styling system implemented across the Railway Solar application. The system provides consistent borders throughout the application using CSS variables, utility classes, and component properties.

## CSS Variables

The system uses CSS variables for border properties:

```css
--border-width-thin: 1px;
--border-width-medium: 2px;
--border-width-thick: 4px;
--border-opacity-subtle: 0.3;
--border-opacity-medium: 0.5;
--border-opacity-full: 1;
```

## Utility Classes

The following utility classes are available:

- `.border-standard`: Medium opacity border (default for most components)
- `.border-subtle`: Subtle/light opacity border
- `.border-prominent`: Full opacity border
- `.border-top`: Top border only
- `.border-bottom`: Bottom border only
- `.border-left`: Left border only
- `.border-right`: Right border only
- `.border-medium`: Medium width border
- `.border-thick`: Thick width border

## Component Border Properties

UI components have been updated to support consistent border styling through properties:

### Card Component

```tsx
<Card withBorder={true} borderStyle="standard">
  Card content
</Card>
```

Properties:

- `withBorder`: Boolean to toggle border visibility (default: false)
- `borderStyle`: "subtle" | "standard" | "prominent" (default: "standard")

### Table Component

```tsx
<Table withBorder={true} borderStyle="standard" withRowBorders={true}>
  Table content
</Table>
```

Properties:

- `withBorder`: Boolean to toggle border around table (default: false)
- `borderStyle`: "subtle" | "standard" | "prominent" (default: "standard")
- `withRowBorders`: Boolean to toggle borders between rows (default: false)

### Input Component

```tsx
<Input withBorder={true} borderStyle="subtle" />
```

Properties:

- `withBorder`: Boolean to toggle border visibility (default: true)
- `borderStyle`: "none" | "subtle" | "standard" | "prominent" (default: "subtle")

### Textarea Component

```tsx
<Textarea withBorder={true} borderStyle="subtle" />
```

Properties:

- `withBorder`: Boolean to toggle border visibility (default: true)
- `borderStyle`: "none" | "subtle" | "standard" | "prominent" (default: "subtle")

### Select Component

```tsx
<SelectTrigger withBorder={true} borderStyle="subtle" />
```

Properties:

- `withBorder`: Boolean to toggle border visibility (default: true)
- `borderStyle`: "none" | "subtle" | "standard" | "prominent" (default: "subtle")

### Button Component

```tsx
<Button withBorder={true} borderStyle="standard" />
```

Properties:

- `withBorder`: Boolean to toggle border visibility (default: depends on variant)
- `borderStyle`: "none" | "subtle" | "standard" | "prominent" (default depends on variant)

## Tailwind Extensions

We've extended Tailwind with border utilities:

```js
borderWidth: {
  thin: "var(--border-width-thin)",
  medium: "var(--border-width-medium)",
  thick: "var(--border-width-thick)",
},
borderOpacity: {
  subtle: "var(--border-opacity-subtle)",
  medium: "var(--border-opacity-medium)",
  full: "var(--border-opacity-full)",
},
```

Use these in your Tailwind classes:

- `border-thin`
- `border-medium`
- `border-thick`
- `border-opacity-subtle`
- `border-opacity-medium`
- `border-opacity-full`

## Best Practices

1. For content containers, use `Card` with `withBorder={true}`
2. For inputs and form elements, the subtle border is recommended (default)
3. For tables with data, use `withBorder={true}` and `withRowBorders={true}`
4. For layout containers, use the `border-subtle` utility class
5. For UI separation (e.g., Navbar), use the appropriate directional border class (e.g., `border-bottom`)
