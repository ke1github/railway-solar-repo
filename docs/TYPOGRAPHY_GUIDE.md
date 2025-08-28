# Typography System Guide for Railway Solar

This guide provides information on how to use the typography system in the Railway Solar application. Following these guidelines will ensure consistent text styling across the entire application.

## Font Sizes and Line Heights

We've defined a set of font size variables in `globals.css` that establish a consistent scale:

```css
--font-size-xs: 0.75rem; /* 12px */
--font-size-sm: 0.875rem; /* 14px */
--font-size-base: 1rem; /* 16px */
--font-size-lg: 1.125rem; /* 18px */
--font-size-xl: 1.25rem; /* 20px */
--font-size-2xl: 1.5rem; /* 24px */
--font-size-3xl: 1.875rem; /* 30px */
--font-size-4xl: 2.25rem; /* 36px */
--font-size-5xl: 3rem; /* 48px */
```

Line heights are also standardized:

```css
--line-height-none: 1;
--line-height-tight: 1.25;
--line-height-snug: 1.375;
--line-height-normal: 1.5;
--line-height-relaxed: 1.625;
--line-height-loose: 2;
```

## Typography Classes

For consistent styling, use these classes instead of combining Tailwind's text size utilities:

### Heading Classes

- `.text-heading-1`: Main page headings (36px / 2.25rem)
- `.text-heading-2`: Section headings (30px / 1.875rem)
- `.text-heading-3`: Subsection headings (24px / 1.5rem)
- `.text-heading-4`: Small headings / card titles (20px / 1.25rem)

### Body Text Classes

- `.text-body-lg`: Large body text (18px / 1.125rem)
- `.text-body`: Regular body text (16px / 1rem)
- `.text-body-sm`: Small body text (14px / 0.875rem)
- `.text-caption`: Caption text / helper text (12px / 0.75rem)

## React Components

Use our typography components for React-based components:

```jsx
import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyP,
  TypographyLarge,
  TypographySmall,
  TypographyCaption
} from '@/components/ui/typography';

// Usage
<TypographyH1>Main Heading</TypographyH1>
<TypographyP>Regular paragraph text</TypographyP>
<TypographyCaption>Small helper text</TypographyCaption>
```

## Responsive Typography

The typography system includes responsive behavior:

- On smaller screens (max-width: 768px), heading sizes are automatically reduced
- Body text sizes remain constant for readability

## Best Practices

1. **Consistency**: Use the predefined typography classes instead of custom combinations of font-size/font-weight
2. **Hierarchy**: Maintain proper hierarchy with headings (H1 → H4)
3. **Readability**: Use appropriate line heights for different text sizes
4. **Responsive**: Test text at different screen sizes to ensure readability

## Accessibility

- Maintain sufficient color contrast for text (4.5:1 for normal text, 3:1 for large text)
- Don't use font sizes smaller than 12px (`.text-caption`)
- Use proper heading hierarchy for screen readers
- Avoid using all caps for long sections of text
