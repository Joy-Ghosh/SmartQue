/**
 * SmartQ Design System v1 — Styles Tokens
 *
 * Covers: Typography, Spacing, Border Radius, Shadows, Component Presets
 * Source of truth: SMARTQ_DESIGN_SYSTEM.md
 */
import Colors from './colors';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// ── TYPOGRAPHY ────────────────────────────────────────────────────────────────
// Rule: Numbers > Text. Queue position and times are always the dominant
// visual element — bigger than any label or supporting copy.
export const Typography = {
  fontFamily: {
    regular:   'Inter_400Regular',
    medium:    'Inter_500Medium',
    semiBold:  'Inter_600SemiBold',
    bold:      'Inter_700Bold',
    extraBold: 'Inter_800ExtraBold',
  },
  // Named scale matching the design system specification
  size: {
    overline: 11,   // Uppercase status labels
    caption:  12,   // Labels, timestamps
    sm:       12,   // alias
    small:    12,   // alias
    body:     14,   // General body text
    base:     14,   // alias
    H3:       16,   // Card titles, important data
    md:       16,   // alias
    H2:       20,   // Section titles, key values
    lg:       20,   // alias
    H1:       28,   // Doctor name, screen titles
    xl:       24,   // H1 alt
    xxl:      28,   // alias
    xxxl:     32,
    display:  48,   // Queue positions, times
    huge:     64,
    massive:  80,
  },
  // For queue positions and times — always tight tracking
  // NOTE: Do NOT spread lineHeight here — set per component based on fontSize
  numbers: {
    fontFamily:    'Inter_800ExtraBold',
    letterSpacing: -2,
  },
  lineHeight: {
    tight:   1.15,
    normal:  1.5,
    relaxed: 1.75,
  },
  letterSpacing: {
    tight:    -1,
    tighter:  -2,
    normal:    0,
    wide:      0.5,
    wider:     1,
    widest:    1.5,
  },
};

// ── SPACING (8pt Grid) ────────────────────────────────────────────────────────
export const Spacing = {
  xs:            4,
  sm:            8,
  md:           16,
  cardPadding:  20,
  screenPadding:20,
  lg:           24,
  xl:           32,
  xxl:          40,
  xxxl:         64,
  // Semantic aliases
  gutter:       16,
  sectionGap:   24,
  // Urgency modes — tighter spacing for urgent states, more for calm
  modes: {
    relax:  40,
    normal: 20,
    urgent: 12,
  },
};

// ── LAYOUT ────────────────────────────────────────────────────────────────────
export const Layout = {
  window:        { width, height },
  screen:        { paddingHorizontal: Spacing.screenPadding },
  isSmallDevice: width < 375,
};

// ── BORDER RADIUS ────────────────────────────────────────────────────────────
export const Radius = {
  sm:   8,     // Tags, chips
  md:  12,     // Secondary cards, inputs
  lg:  16,     // Standard cards, buttons
  xl:  20,     // Feature cards
  xxl: 24,     // Hero/decision blocks
  full: 9999,  // Pills, badges, FABs
};

// ── SHADOWS ───────────────────────────────────────────────────────────────────
export const Shadows = {
  none:   Colors.shadows.none,
  sm:     Colors.shadows.sm,
  md:     Colors.shadows.md,
  lg:     Colors.shadows.lg,
  sticky: Colors.shadows.sticky,
};

// ── COMPONENT PRESETS ─────────────────────────────────────────────────────────
// Pre-built style objects for common components. Import and spread directly.
export const ComponentStyles = {
  // PRIMARY CARD — white, elevated, prominent (decision blocks)
  card: {
    backgroundColor: Colors.surfacePrimary,
    borderRadius:     Radius.xl,
    padding:          Spacing.cardPadding,
    ...Colors.shadows.md,
  },
  // SECONDARY CARD — tinted, bordered, supporting info
  cardSecondary: {
    backgroundColor: Colors.gray50,
    borderRadius:     Radius.lg,
    padding:          Spacing.md,
    borderWidth:      1,
    borderColor:      Colors.border,
    // explicitly shadow-less per design rules
  },
  // GLASS LAYER — for overlays on images
  glassLayer: {
    backgroundColor: 'rgba(255,255,255,0.80)',
  },
  // PRIMARY BUTTON — ONE per screen, always visible
  button: {
    primary: {
      backgroundColor:  Colors.primary500,
      paddingVertical:  16,
      borderRadius:     Radius.lg,
      alignItems:       'center' as const,
      justifyContent:   'center' as const,
      minHeight:        52,
    },
    // OUTLINE BUTTON — secondary actions
    outline: {
      backgroundColor:  'transparent',
      borderWidth:      1.5,
      borderColor:      Colors.border,
      paddingVertical:  16,
      borderRadius:     Radius.lg,
      alignItems:       'center' as const,
      justifyContent:   'center' as const,
      minHeight:        52,
    },
    // DANGER BUTTON — emergency only
    danger: {
      backgroundColor:  Colors.error500,
      paddingVertical:  16,
      borderRadius:     Radius.lg,
      alignItems:       'center' as const,
      justifyContent:   'center' as const,
      minHeight:        52,
    },
  },
  // INPUT
  input: {
    height:          52,
    backgroundColor: Colors.surfacePrimary,
    borderRadius:    Radius.md,
    paddingHorizontal: Spacing.md,
    fontFamily:      Typography.fontFamily.medium,
    fontSize:        Typography.size.body,
    color:           Colors.textPrimary,
    borderWidth:     1.5,
    borderColor:     Colors.border,
  },
  // STATUS PILL — maps state to color set
  statusPill: {
    live: {
      backgroundColor: Colors.success100,
      dotColor:        Colors.success500,
      textColor:       Colors.success700,
    },
    booking: {
      backgroundColor: Colors.warning100,
      dotColor:        Colors.warning500,
      textColor:       Colors.warning700,
    },
    closed: {
      backgroundColor: Colors.gray100,
      dotColor:        Colors.gray400,
      textColor:       Colors.gray600,
    },
    emergency: {
      backgroundColor: Colors.error100,
      dotColor:        Colors.error500,
      textColor:       Colors.error700,
    },
  },
  // STICKY FOOTER BAR
  stickyBar: {
    position:         'absolute' as const,
    bottom:            0,
    left:              0,
    right:             0,
    backgroundColor:  Colors.surfacePrimary,
    paddingHorizontal: Spacing.screenPadding,
    paddingTop:        Spacing.md,
    borderTopWidth:    1,
    borderTopColor:    Colors.border,
    ...Colors.shadows.sticky,
  },
};

import Motion from './motion';

// ── GLOBAL THEME EXPORT ───────────────────────────────────────────────────────
const AppTheme = {
  Colors,
  Typography,
  Spacing,
  Layout,
  Radius,
  Shadows,
  ComponentStyles,
  Motion,
};

export { Motion };
export default AppTheme;
