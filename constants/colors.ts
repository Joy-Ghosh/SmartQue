export const Colors = {
  // ── Primary Scale ────────────────────────────────────────────────────────
  primary100: '#A7EBF2',
  primary200: '#7FD4DE',
  primary300: '#54ACBF',
  primary400: '#3A87A6',
  primary500: '#26658C',
  primary600: '#1B4E73',
  primary700: '#023859',
  primary800: '#012A47',
  primary900: '#011C40',

  // ── Neutral Scale ────────────────────────────────────────────────────────
  gray50: '#F8FAFC',
  gray100: '#F1F5F9',
  gray200: '#E2E8F0',
  gray300: '#CBD5E1',
  gray400: '#94A3B8',
  gray500: '#64748B',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1E293B',
  gray900: '#0F172A',

  // ── Semantic Colors ──────────────────────────────────────────────────────
  success100: '#DCFCE7',
  success500: '#22C55E',
  success700: '#15803D',

  warning100: '#FEF3C7',
  warning500: '#F59E0B',
  warning700: '#B45309',

  error100: '#FEE2E2',
  error500: '#EF4444',
  error700: '#B91C1C',

  // ── Surface System ───────────────────────────────────────────────────────
  surfacePrimary: '#FFFFFF',
  surfaceSecondary: '#F8FAFC',
  surfaceTertiary: '#F1F5F9',
  surfaceBrand: '#F0F7FA',

  // ── Text Colors ──────────────────────────────────────────────────────────
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  textInverse: '#FFFFFF',

  // ── Legacy Aliases to prevent app breaking ───────────────────────────────
  primary: '#26658C',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#0F172A',
  textMuted: '#94A3B8',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  medicalRed: '#EF4444',
  dangerBg: '#FEE2E2',
  success: '#22C55E',
  successBg: '#DCFCE7',
  smartAmber: '#F59E0B',
  warningBg: '#FEF3C7',
  primaryBg: '#F0F7FA',

  // ── Aliases / Expo Router theme tokens ───────────────────────────────────

  // ── Gradients ────────────────────────────────────────────────────────────
  gradients: {
    primary:  ['#5B6EF5', '#7C8FFF'] as const,
    secondary:['#2EC4B6', '#72D9CF'] as const,
    dark:     ['#1A1A2E', '#2D2D50'] as const,
    glass:    ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.5)'] as const,
    soft:     ['#F7F5F2', '#EEE9E2'] as const,
    card:     ['#FFFFFF', '#F7F5F2'] as const,
    orange:   ['#FB923C', '#F59E0B'] as const,
    green:    ['#34C48B', '#2EC4B6'] as const,
    red:      ['#F87171', '#F25C5C'] as const,
    danger:   ['#F87171', '#F25C5C'] as const,
    hero:     ['#5B6EF5', '#2EC4B6'] as const,
  },

  // ── Shadows (soft, warm-tinted) ──────────────────────────────────────────
  shadows: {
    sm: {
      shadowColor: '#1A1A2E',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#1A1A2E',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.09,
      shadowRadius: 12,
      elevation: 4,
    },
    lg: {
      shadowColor: '#1A1A2E',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.13,
      shadowRadius: 24,
      elevation: 10,
    },
    glow: {
      shadowColor: '#5B6EF5',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 6,
    },
  },

  // Mapping Expo router requirements to our new tokens to prevent breaking
  light: {
    text: '#0F172A',
    background: '#F8FAFC',
    tint: '#26658C',
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#26658C',
  },
  dark: {
    text: '#FFFFFF',
    background: '#0F172A',
    tint: '#26658C',
    tabIconDefault: '#475569',
    tabIconSelected: '#26658C',
  },
};

export default Colors;
