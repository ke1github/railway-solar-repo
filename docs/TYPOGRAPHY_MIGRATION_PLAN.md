# Typography Migration Plan

This document outlines a step-by-step plan to migrate the entire Railway Solar application to use the new typography system.

## Why Migrate?

The new typography system provides:

- Consistent text styling across the application
- Responsive typography that scales well on different devices
- Semantic component names that make code more readable
- A single source of truth for text styling

## Migration Process

### Phase 1: Assessment (2 days)

1. **Inventory Current Text Styles**

   - Run `grep_search` for `text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)`
   - Document pages and components using custom font sizes
   - Identify highest-priority pages for migration

2. **Create Test Coverage**
   - Ensure visual regression tests are in place
   - Document current visual appearance

### Phase 2: Core Components Migration (3 days)

1. **Shared Layout Components**

   - Update Navbar.tsx
   - Update SiteLayout.tsx
   - Update any shared footer components

2. **High-visibility Components**

   - Card components
   - Form headers and labels
   - Button text

3. **Table Components**
   - Table headers
   - Table cells
   - Pagination text

### Phase 3: Page-by-Page Migration (5-7 days)

1. **Dashboard Pages**

   - Home page (completed)
   - Analytics dashboard
   - EPC dashboard

2. **Form Pages**

   - Site forms
   - Project forms
   - User forms

3. **Detail Pages**

   - Site details
   - Project details
   - Profile pages

4. **List Pages**
   - Site listings
   - Project listings
   - Report pages

### Phase 4: Testing and Refinement (2-3 days)

1. **Visual Testing**

   - Cross-browser testing
   - Mobile/tablet/desktop responsive testing
   - Dark mode testing

2. **Performance Checks**

   - Check for any rendering performance issues
   - Validate bundle size impact

3. **Accessibility Testing**
   - Verify text meets contrast requirements
   - Check screen reader compatibility

## Best Practices for Migration

### When Updating Components

1. **Replace Direct Tailwind Classes**:

   ```tsx
   // Before
   <h1 className="text-4xl font-bold mb-2">Title</h1>

   // After (Option 1 - Component)
   <TypographyH1 className="mb-2">Title</TypographyH1>

   // After (Option 2 - CSS Class)
   <h1 className="text-heading-1 mb-2">Title</h1>
   ```

2. **Update Text Hierarchy**:

   - Use H1 for main page titles
   - Use H2 for section headers
   - Use H3 for subsection headers
   - Use H4 for card titles or minor section headers

3. **Apply Body Text Consistently**:
   - Use `TypographyP` or `text-body` for main paragraph text
   - Use `TypographySmall` or `text-body-sm` for supporting text
   - Use `TypographyCaption` or `text-caption` for helper text, labels, etc.

### When Creating New Components

1. Always use the Typography components or classes
2. Follow the semantic hierarchy (H1 -> H4)
3. Use consistent spacing around text elements

## Example Component Migration

```tsx
// Before
function ExampleCard({ title, description }) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

// After
function ExampleCard({ title, description }) {
  return (
    <div className="border rounded-lg p-4">
      <TypographyH4 className="mb-2">{title}</TypographyH4>
      <TypographySmall className="text-gray-600">{description}</TypographySmall>
    </div>
  );
}
```

## Resources

1. Check the [Typography Guide](./TYPOGRAPHY_GUIDE.md) for reference
2. View the Typography Example page at `/typography-example` for live examples
3. The `typography.tsx` component provides all needed text components
4. Global CSS classes are available in `globals.css`

## Support

If you have questions about migrating a specific component, contact the design team lead or review the example page at `/typography-example`.
