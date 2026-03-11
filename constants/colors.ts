export const Colors = {
  // ── Canvas ──────────────────────────────────────────────────────────────
  background: '#F7F5F2',     // Warm off-white — feels paper-like, not clinical
  surface: '#FFFFFF',        // Cards / sheets

  // ── Glass layers ────────────────────────────────────────────────────────
  surfaceGlass: 'rgba(255, 255, 255, 0.80)',
  surfaceGlassDark: 'rgba(30, 30, 40, 0.75)',

  // ── Typography ──────────────────────────────────────────────────────────
  text: '#1A1A2E',           // Deep navy-black — warmer than pure black
  textSecondary: '#64748B',  // Slate-600
  textMuted: '#94A3B8',      // Slate-400
  textInverse: '#FFFFFF',

  // ── Brand (Soft Indigo + Mint Teal) ─────────────────────────────────────
  primary: '#5B6EF5',        // Soft indigo — not harsh, but confident
  primaryLight: '#8B9BFF',
  primaryDark: '#3A4ED9',
  primaryBg: '#EEF0FF',      // Very light indigo tint

  secondary: '#2EC4B6',      // Mint teal
  secondaryLight: '#72D9CF',
  secondaryDark: '#1A9E93',
  secondaryBg: '#E6F9F8',

  // ── Accent (single vivid CTA) ────────────────────────────────────────────
  accent: '#5B6EF5',         // Same as primary — this IS the one CTA color

  // ── Borders ─────────────────────────────────────────────────────────────
  border: '#E8E4DF',
  borderLight: '#F0EDE8',

  // ── Status / Emotional triggers ──────────────────────────────────────────
  medicalRed: '#F25C5C',     // Soft coral-red
  danger: '#F25C5C',
  dangerBg: '#FEF0F0',

  success: '#34C48B',        // Mint green
  successBg: '#E8F9F2',
  confidenceGreen: '#34C48B',

  smartAmber: '#F59E0B',     // Warm amber
  warning: '#F59E0B',
  warningBg: '#FEF3C7',

  waitingGrey: '#94A3B8',
  infoBg: '#EEF0FF',

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

  // ── Status configs ──────────────────────────────────────────────────────
  status: {
    success: { bg: '#E8F9F2', text: '#1A9E73', dot: '#34C48B' },
    warning: { bg: '#FEF3C7', text: '#B45309', dot: '#F59E0B' },
    error:   { bg: '#FEF0F0', text: '#C0392B', dot: '#F25C5C' },
    info:    { bg: '#EEF0FF', text: '#3A4ED9', dot: '#5B6EF5' },
  },

  // ── Expo Router theme tokens ─────────────────────────────────────────────
  light: {
    text: '#1A1A2E',
    background: '#F7F5F2',
    tint: '#5B6EF5',
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#5B6EF5',
  },
  dark: {
    text: '#F7F5F2',
    background: '#1A1A2E',
    tint: '#5B6EF5',
    tabIconDefault: '#64748B',
    tabIconSelected: '#5B6EF5',
  },
};

export default Colors;
