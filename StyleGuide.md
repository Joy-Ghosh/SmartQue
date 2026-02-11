# SmartQ Design System & Style Guide

## 1. Color Palette

### Core Brand Identity
| Name | Hex | Usage |
|------|-----|-------|
| **Primary** | `#1E2A5E` | Main actions, Headers, Branding (Deep Indigo) |
| **Primary Light** | `#2E3A7E` | Hover states, Accents |
| **Secondary** | `#1FB6A6` | Success states, Highlights (Digital Teal) |
| **Accent** | `#FF9F1C` | Warnings, Important Actions (Smart Amber) |
| **Danger** | `#E63946` | Errors, Emergency Mode (Medical Red) |

### Neutrals
| Name | Hex | Usage |
|------|-----|-------|
| **Background** | `#F4F6FA` | App Background (Cool Grey) |
| **Surface** | `#FFFFFF` | Cards, Modals, Sheets |
| **Text** | `#0B132B` | Primary Text (Graphite Navy) |
| **Text Secondary** | `#475569` | Subtitles, Captions (Slate 600) |
| **Border** | `#E2E8F0` | Dividers, Borders |

---

## 2. Typography

**Font Family**: Inter (Google Font)

| Scale | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| **Display** | 32-48px | Bold (700) | 1.2 | Hero Sections, Big Numbers |
| **H1** | 24px | Bold (700) | 1.3 | Screen Titles |
| **H2** | 20px | SemiBold (600) | 1.4 | Section Headers |
| **Body LG** | 18px | Regular/Med | 1.5 | Featured Text |
| **Body Base** | 16px | Regular/Med | 1.5 | Standard Paragraphs |
| **Body SM** | 14px | Medium (500) | 1.5 | Secondary Info, List Items |
| **Caption** | 12px | Medium (500) | 1.5 | Labels, Metadata |
| **Tiny** | 10px | Bold (700) | 1.5 | Badges, Tags |

---

## 3. Spacing System

Based on an **8pt grid**.

- **xs**: 4px
- **sm**: 8px (Small gaps)
- **md**: 16px (Standard gutter)
- **lg**: 24px (Section spacing)
- **xl**: 32px (Large layout separation)
- **xxl**: 48px+

**Standard Screen Padding**: 20px

---

## 4. Components

### Cards (`ComponentStyles.card`)
- **Background**: White (`#FFFFFF`)
- **Border Radius**: 24px (`Radius.xl`)
- **Shadow**: Medium Indigio Shadow (`Shadows.md`)
- **Padding**: 20px

### Buttons (`ComponentStyles.button`)
- **Primary Height**: 50-56px
- **Border Radius**: 16px (`Radius.lg`)
- **Text**: Semibold/Bold 16px

### Inputs (`ComponentStyles.input`)
- **Background**: Light Grey (`#F4F6FA`)
- **Border Radius**: 16px
- **Height**: 50px
- **Padding**: 16px

---

## 5. Shadows

We use colored shadows based on our primary indigo to create depth avoiding muddy grey shadows.

- **Small**: Elevation 2, subtle lift
- **Medium**: Elevation 4, standard card lift
- **Large**: Elevation 10, floating elements (modals, bottom sheets)

---

## Usage in Code

Import the style guide from:
```typescript
import AppTheme, { Colors, Typography, Spacing } from '@/constants/styles';
```

Example:
```tsx
<View style={{ 
  padding: Spacing.md, 
  backgroundColor: Colors.background 
}}>
  <Text style={{ 
    fontFamily: Typography.fontFamily.bold, 
    fontSize: Typography.size.xl,
    color: Colors.primary 
  }}>
    Hello World
  </Text>
</View>
```
