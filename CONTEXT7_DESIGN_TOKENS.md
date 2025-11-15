# Context7.com Design System - Reverse Engineered Tokens

This document contains the design tokens extracted from context7.com for implementation in Project Dock.

## Typography

| Element | Font Family | Notes |
|---------|-------------|-------|
| Body | `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` | Clean, modern sans-serif |
| Headings (H1-H6) | `Inter, sans-serif` | Same as body, weight variations |
| Code/Monospace | `"JetBrains Mono", "Fira Code", Consolas, monospace` | For code snippets |

### Font Weights
- Regular: `400`
- Medium: `500`
- Semibold: `600`
- Bold: `700`

### Font Sizes (Typographic Scale)
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
```

## Color Palette

### Primary Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--primary-50` | `#f0f9ff` | Lightest blue background |
| `--primary-100` | `#e0f2fe` | Light blue background |
| `--primary-200` | `#bae6fd` | Lighter blue |
| `--primary-300` | `#7dd3fc` | Light blue accent |
| `--primary-400` | `#38bdf8` | Medium blue |
| `--primary-500` | `#0ea5e9` | **Primary brand blue** |
| `--primary-600` | `#0284c7` | Primary hover state |
| `--primary-700` | `#0369a1` | Dark blue |
| `--primary-800` | `#075985` | Darker blue |
| `--primary-900` | `#0c4a6e` | Darkest blue |

### Neutral/Gray Scale
| Token | Value | Usage |
|-------|-------|-------|
| `--gray-50` | `#f8fafc` | Background tint |
| `--gray-100` | `#f1f5f9` | Light background |
| `--gray-200` | `#e2e8f0` | Borders, dividers |
| `--gray-300` | `#cbd5e1` | Disabled states |
| `--gray-400` | `#94a3b8` | Placeholders |
| `--gray-500` | `#64748b` | Secondary text |
| `--gray-600` | `#475569` | Body text (light mode) |
| `--gray-700` | `#334155` | Headings |
| `--gray-800` | `#1e293b` | Dark text |
| `--gray-900` | `#0f172a` | Darkest, primary text |

### Accent Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--success` | `#10b981` | Success states |
| `--warning` | `#f59e0b` | Warning states |
| `--error` | `#ef4444` | Error states |
| `--info` | `#3b82f6` | Informational |

## Gradients

### Hero Section Gradient
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```
*Alternative gradient seen:*
```css
background: linear-gradient(to bottom right, #0ea5e9, #6366f1);
```

### Button Gradient (Premium/CTA)
```css
background: linear-gradient(90deg, #0ea5e9 0%, #3b82f6 100%);
```

### Subtle Background Gradient
```css
background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
```

## Border Radius (Shapes)

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `0.375rem` (6px) | Small elements, tags |
| `--radius-md` | `0.5rem` (8px) | **Buttons, inputs, cards** |
| `--radius-lg` | `0.75rem` (12px) | Large cards |
| `--radius-xl` | `1rem` (16px) | Modal dialogs |
| `--radius-2xl` | `1.5rem` (24px) | Hero sections |
| `--radius-full` | `9999px` | Pills, avatars |

## Spacing Scale

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

## Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
```

## Button Styles

### Primary Button
```css
background: var(--primary-600);
color: #ffffff;
border-radius: var(--radius-md);
padding: 0.625rem 1.25rem;
font-weight: 600;
transition: all 0.15s ease;
box-shadow: var(--shadow-sm);

&:hover {
  background: var(--primary-700);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}
```

### Secondary Button
```css
background: transparent;
color: var(--gray-700);
border: 1px solid var(--gray-300);
border-radius: var(--radius-md);
padding: 0.625rem 1.25rem;
font-weight: 500;

&:hover {
  background: var(--gray-50);
  border-color: var(--gray-400);
}
```

## Card Component

```css
background: #ffffff;
border: 1px solid var(--gray-200);
border-radius: var(--radius-lg);
padding: var(--space-6);
box-shadow: var(--shadow-sm);
transition: all 0.2s ease;

&:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  border-color: var(--gray-300);
}
```

## Animation/Transitions

```css
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;
--transition-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Common Transitions
```css
/* Hover lift effect */
transition: transform 0.2s ease, box-shadow 0.2s ease;

/* Color transitions */
transition: background-color 0.15s ease, color 0.15s ease;

/* All properties */
transition: all 0.2s ease;
```

## Breakpoints

```css
--screen-sm: 640px;   /* Mobile landscape */
--screen-md: 768px;   /* Tablet */
--screen-lg: 1024px;  /* Desktop */
--screen-xl: 1280px;  /* Large desktop */
--screen-2xl: 1536px; /* Extra large */
```

## Implementation Notes

1. **Minimalist Approach**: Context7 uses lots of white space, clean typography, and subtle shadows
2. **Consistent Spacing**: Uses a base-8 spacing system (multiples of 8px)
3. **Limited Color Usage**: Primarily uses blue (primary), grays, and minimal accent colors
4. **Micro-interactions**: Subtle hover states with transform and shadow changes
5. **Typography Hierarchy**: Clear distinction between headings and body text using size and weight
6. **Border Radius**: Consistently uses 8px-12px for most interactive elements

## Recommended Tailwind Config Extension

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
      },
      borderRadius: {
        'context7': '0.5rem',
      },
      boxShadow: {
        'context7': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        'context7-hover': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      },
    },
  },
};
```

---

**Last Updated**: November 2025  
**Source**: https://context7.com (Manual inspection)
