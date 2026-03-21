# SmartQ Design System v1

> **Philosophy:** Fast clarity under pressure.  
> Every element must answer: Can the user understand instantly? Can they act without thinking?

---

## 1. Color System

### Brand / Primary
| Token | Value | Usage |
|---|---|---|
| `primary-100` | `#EAF1FF` | Active state fills, tinted backgrounds |
| `primary-500` | `#2F6FED` | CTAs, highlights, active states |
| `primary-600` | `#1E5AE0` | Pressed/hover state |
| `primary-700` | `#1347C8` | Dark emphasis |

### Success / Live
| Token | Value | Usage |
|---|---|---|
| `success-100` | `#E8F8EF` | Live status backgrounds |
| `success-500` | `#22C55E` | Live dot, active queue |
| `success-700` | `#15803D` | Live text on light bg |

### Warning / Wait
| Token | Value | Usage |
|---|---|---|
| `warning-100` | `#FFF4E5` | Wait time backgrounds |
| `warning-500` | `#F59E0B` | Wait time, peak indicators |
| `warning-700` | `#B45309` | Warning text on light bg |

### Error / Emergency
| Token | Value | Usage |
|---|---|---|
| `error-100` | `#FEECEC` | Emergency backgrounds |
| `error-500` | `#EF4444` | Emergency actions, alerts |
| `error-700` | `#B91C1C` | Error text on light bg |

### Neutral
| Token | Value | Usage |
|---|---|---|
| `bg` | `#F7F9FC` | Screen background |
| `card` | `#FFFFFF` | Card surfaces |
| `text-primary` | `#0F172A` | Body text, titles |
| `text-secondary` | `#475569` | Supporting text |
| `text-muted` | `#94A3B8` | Labels, captions |
| `border` | `#E2E8F0` | Dividers, card borders |

> **Rule:** If a color does not carry semantic meaning, it must not be used. No decorative colors.

---

## 2. Typography System

**Font:** Inter (via @expo-google-fonts/inter)

| Token | Size | Weight | Usage |
|---|---|---|---|
| H1 | 28px | 800 ExtraBold | Doctor name, screen title |
| H2 | 22px | 700 Bold | Section titles, key values |
| H3 | 18px | 600 SemiBold | Card titles, important data |
| body | 16px | 400 Regular | General body text |
| small | 14px | 400 Regular | Secondary info |
| caption | 12px | 400 Regular | Labels, timestamps |
| overline | 11px | 700 Bold | Uppercase status labels (LIVE) |

### Numbers Rule
> Numbers are ALWAYS larger than their labels.  
> Queue position and times: H1/H2 size, weight 800, letter-spacing -1 to -2px  
> Labels: caption size, text-muted color

```
Estimated Visit   <- 12px, muted, uppercase
6:40 PM           <- 22–80px, ExtraBold, text-primary
```

---

## 3. Spacing (8pt Grid)

| Token | Value | Usage |
|---|---|---|
| xs | 4px | Inline gaps |
| sm | 8px | Between related items |
| md | 16px | Card padding, gutters |
| lg | 24px | Between sections |
| xl | 32px | Breathing room |
| xxl | 40px | Hero areas |
| cardPadding | 20px | All card interiors |
| screenPadding | 20px | Screen edges |

---

## 4. Border Radius

| Token | Value | Usage |
|---|---|---|
| sm | 8px | Tags, chips |
| md | 12px | Secondary cards, inputs |
| lg | 16px | Buttons, standard cards |
| xl | 20px | Feature cards |
| xxl | 24px | Hero / decision blocks |
| full | 9999px | Pills, badges, FABs |

---

## 5. Shadows

| Token | Value | Usage |
|---|---|---|
| sm | 0 2px 8px rgba(0,0,0,0.05) | Subtle lift |
| md | 0 4px 12px rgba(0,0,0,0.08) | Standard cards |
| lg | 0 8px 24px rgba(0,0,0,0.12) | Modals |
| sticky | 0 -4px 16px rgba(0,0,0,0.08) | Sticky footers (upward shadow) |

---

## 6. Component System

### Primary Button
- Height: 52px · Radius: 16px · Background: primary-500 · Text: white 700 16px
- States: Default | Pressed (primary-600, scale 0.97) | Disabled (opacity 40%) | Loading
- **Rule: Only ONE primary button per screen**

### Outline Button  
- Height: 52px · Radius: 16px · Border: 1.5px border · Text: text-primary 600 16px

### Primary Card (Decision)
- Background: white · Padding: 20px · Radius: 20-24px · Shadow: md · No border

### Secondary Card
- Background: gray-50 · Padding: 16px · Radius: 16px · Border: 1px · Shadow: sm

### Status Pill
| Type | Dot | Text | Background |
|---|---|---|---|
| Live | success-500 | success-700 | success-100 |
| Booking | warning-500 | warning-700 | warning-100 |
| Closed | gray-400 | gray-600 | gray-100 |
| Emergency | error-500 | error-700 | error-100 |

### Data Block
```
LABEL        <- 12px, caption, text-muted, UPPERCASE, letter-spacing 1
6:40 PM      <- 20-80px, ExtraBold, text-primary
```

### Decision Block (SmartQ Signature USP)
```
IF YOU JOIN NOW    <- overline, muted
#18                <- 72-80px, ExtraBold, letter-spacing -2
[6:40 PM Visit] | [Leave in 1h 20m]
Consultation Rs600 <- footnote caption, muted
```

### Live Strip
```
[dot LIVE · Serving #12]     [Active 2h · Closes 9PM]
Left border: 3px success-500 · Background: white · Radius: 14px
```

### Collapsible Block
```
[Title ▼]      <- full-width pressable header
[expanded body] <- FadeIn 200ms ease-in
```

---

## 7. Screen Patterns

### Home — Command Center
```
Header (greeting/state)
Active Queue Card  <- if booking exists, replaces search as hero
Search Bar
Nearby Clinics
```

### Clinic Detail
```
Hero (image + dark gradient + doctor identity)
Live Strip
Decision Block      <- HERO, most important
Sticky CTA Bar      <- always visible (Join Queue / Emergency)
─── scroll ───
Queue compact
Pricing collapsible
Timeline strip
Trust badges + reviews
Location
```

### Booking Flow (4 Steps)
```
Step 1: Context entry
Step 2: Patient / emergency select
Step 3: Travel mode + leave calc
Step 4: Confirm (zero-scroll)
  unified summary · decision block · price line · sticky CTA
```

### Queue / Active Token Screen
```
Live bar (serving #N)
Hero position (#N large)
People ahead count
Time intelligence (Visit / Leave)
Action cue (Leave in X)
─── scroll ───
Queue dots
Dynamic events
Emergency (subtle)
```

---

## 8. Icons

- Style: outline icons only (Ionicons -outline suffix)
- Stroke: 2px · Corners: rounded
- Sizes: 14px inline · 18px CTA · 22px feature · 28px hero
- **No emoji — icons only throughout**

---

## 9. Interactions

| Trigger | Behavior |
|---|---|
| Button tap | scale(0.97) · 100ms |
| Live dot | opacity pulse 1→0.3→1 · 800ms repeat |
| Collapsible | FadeIn · 200ms |
| Screen enter | FadeInDown · 350-400ms staggered (+50ms per section) |
| Haptics | Light=select · Heavy=emergency · Success=confirm |

---

## 10. System Rules

1. **No random UI** — every element is a named component
2. **Hierarchy > decoration** — if it doesn't guide action, remove it
3. **Primary action always above fold** — never require scrolling to reach CTA
4. **Reduce cognitive load first**, add features second
5. **Numbers dominate** — position/time always largest text on screen
6. **One primary CTA per screen**
7. **Emergency accessible but never dominant** — subtle red below primary

---

## 11. QA Checklist (Run Before Shipping Any Screen)

- [ ] Primary action visible without scrolling?
- [ ] Purpose understood in 3 seconds?
- [ ] Exactly one primary visual focus?
- [ ] All elements from this system?
- [ ] Numbers larger than their labels?
- [ ] Only one primary button?
- [ ] Status types correctly mapped?
- [ ] Emergency option subtle?
- [ ] All colors using named tokens?

---

## 12. Implementation Files

| System Layer | File |
|---|---|
| Color tokens | `constants/colors.ts` |
| Typography + Spacing + Radius + Shadows | `constants/styles.ts` |
| Booking flow component | `components/booking/SmartBookingSheet.tsx` |
| Button component | `components/ui/GradientButton.tsx` |
| Home screen | `app/(tabs)/index.tsx` |
| Clinic detail | `app/clinic/[id].tsx` |
| Queue screen | `app/active-token.tsx` |
| Success overlay | `components/booking/SuccessOverlay.tsx` |

---

*SmartQ Design System v1 · 2026-03-21*
