/**
 * SmartQ Design System v1 — Color Tokens
 *
 * Philosophy: Every color carries meaning. If it doesn't communicate state or
 * guide behavior, it must not be used.
 *
 * Source of truth: SMARTQ_DESIGN_SYSTEM.md
 */
export const Colors = {
  // ── Primary Scale (Brand Blue) ────────────────────────────────────────────
  // Used for: CTAs, highlights, active states, links
  primary100: '#E6F0F6',   // Backgrounds
  primary200: '#C8DAFD',
  primary300: '#93B8FA',
  primary400: '#3A7EA6',
  primary500: '#26658C',   // Main
  primary600: '#21597C',
  primary700: '#1E4F6E',   // Pressed / strong
  primary800: '#0E38A4',
  primary900: '#092481',

  // ── Neutral Scale ─────────────────────────────────────────────────────────
  bgMain:  '#F7F9FB',    // Replaces gray50 logic
  bgCard:  '#FFFFFF',
  gray50:  '#F7F9FB',    // Alias
  gray100: '#F1F5F9',
  gray200: '#E2E8F0',
  gray300: '#CBD5E1',
  gray400: '#94A3B8',
  gray500: '#64748B',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1E293B',
  gray900: '#0F172A',

  // ── Success / Live ────────────────────────────────────────────────────────
  // Used for: live queue status, confirmed actions
  success100: '#E8F7ED',
  success500: '#16A34A',
  success700: '#15803D',

  // ── Warning / Wait ────────────────────────────────────────────────────────
  // Used for: wait time, peak period, booking-open state
  warning100: '#FFF4E5',
  warning500: '#F59E0B',
  warning700: '#B45309',

  // ── Error / Emergency ─────────────────────────────────────────────────────
  // Used for: emergency access ONLY — never decorative
  error100: '#FEECEC',
  error500: '#DC2626',
  error700: '#B91C1C',

  // ── State System ──────────────────────────────────────────────────────────
  // Maps clinic lifecycle states to semantic colors
  state: {
    closed:    '#94A3B8',  // Neutral Gray
    booking:   '#F59E0B',  // Warning Amber
    live:      '#26658C',  // Primary Blue
    emergency: '#DC2626',  // Error Red
  },

  // ── Surface System ────────────────────────────────────────────────────────
  surfacePrimary:   '#FFFFFF',   // Cards, modals
  surfaceSecondary: '#F7F9FB',   // Screen background
  surfaceTertiary:  '#F1F5F9',   // Nested surfaces
  surfaceBrand:     '#EAF1FF',   // Primary-tinted surface

  // ── Text Colors ───────────────────────────────────────────────────────────
  textPrimary:   '#0F172A',   // Headings, key numbers
  textSecondary: '#475569',   // Supporting text
  textTertiary:  '#94A3B8',   // Labels, captions
  textInverse:   '#FFFFFF',   // Text on dark backgrounds
  textOnColor:   '#FFFFFF',   // Text on primary/status bgs
  textOnColorSecondary: 'rgba(255,255,255,0.85)',

  // ── Border ────────────────────────────────────────────────────────────────
  border:      '#E2E8F0',
  borderLight: '#F1F5F9',

  // ── Gradients ─────────────────────────────────────────────────────────────
  gradients: {
    primary:  ['#26658C', '#1E4F6E'] as const,
    hero:     ['#26658C', '#16A34A'] as const,
    dark:     ['#0F172A', '#1E293B'] as const,
    glass:    ['rgba(255,255,255,0.85)', 'rgba(255,255,255,0.55)'] as const,
    danger:   ['#F87171', '#DC2626'] as const,
    green:    ['#16A34A', '#15803D'] as const,
    card:     ['#FFFFFF', '#F7F9FB'] as const,
  },

  // ── Shadows ───────────────────────────────────────────────────────────────
  shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    md: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    lg: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 10,
    },
    // Upward shadow — for sticky footers
    sticky: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 12,
    },
  },

  // ── Legacy Aliases (backward compat — do not use in new code) ─────────────
  primary:     '#26658C',
  background:  '#F7F9FB',
  surface:     '#FFFFFF',
  text:        '#0F172A',
  textMuted:   '#94A3B8',
  medicalRed:  '#DC2626',
  danger:      '#DC2626',
  dangerBg:    '#FEECEC',
  success:     '#16A34A',
  successBg:   '#E8F7ED',
  warning:     '#F59E0B',
  warningBg:   '#FFF4E5',
  smartAmber:  '#F59E0B',
  primaryBg:   '#E6F0F6',
  secondary:   '#64748B',
  secondaryBg: '#F1F5F9',
  accent:      '#26658C',
  primary50:   '#E6F0F6',
  shadowMd: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  status: {
    success: '#16A34A',
    warning: '#F59E0B',
    error:   '#DC2626',
    info:    '#26658C',
  },

  // ── Expo Router theme tokens ───────────────────────────────────────────────
  light: {
    text:            '#0F172A',
    background:      '#F7F9FB',
    tint:            '#26658C',
    tabIconDefault:  '#94A3B8',
    tabIconSelected: '#26658C',
  },
  dark: {
    text:            '#FFFFFF',
    background:      '#0F172A',
    tint:            '#26658C',
    tabIconDefault:  '#475569',
    tabIconSelected: '#26658C',
  },
};

export default Colors;
