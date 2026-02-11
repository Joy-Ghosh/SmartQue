export const Colors = {
  // 🌌 Core Brand Colors (Identity Layer)
  primary: '#1E2A5E', // Deep Intelligent Indigo - trustworthy, modern, intelligent
  primaryLight: '#3A4B8A', // Lighter into for hover/gradients
  primaryDark: '#0F1635', // Darker indigo for depth/pressed
  primaryBg: '#E8EAF6', // Indigo tint for backgrounds

  secondary: '#1FB6A6', // Digital Teal - tech + healthcare fusion
  secondaryLight: '#5FE0D3', // Lighter teal/glow
  secondaryDark: '#127066', // Darker teal
  secondaryBg: '#E0F2F1', // Teal tint for backgrounds

  // ☁️ Neutral & Surface Colors
  background: '#F8FAFC', // Ultra-light cool grey/white
  surface: '#FFFFFF', // Pure White
  surfaceGlass: 'rgba(255, 255, 255, 0.7)', // For GlassView
  surfaceGlassDark: 'rgba(15, 23, 42, 0.6)', // Dark mode glass

  text: '#0F172A', // Slate 900 - Primary text (sharp, readable)
  textSecondary: '#475569', // Slate 600 - Secondary text
  textMuted: '#94A3B8', // Slate 400 - Muted/Placeholder
  textInverse: '#FFFFFF', // White text on dark backgrounds

  border: '#E2E8F0', // Slate 200
  borderLight: '#F1F5F9', // Slate 100

  // ⚡ Action & Emotional Trigger Colors
  smartAmber: '#FB923C', // Orange 400 - "Leave Now", Attention
  confidenceGreen: '#10B981', // Emerald 500 - Success, Go
  medicalRed: '#EF4444', // Red 500 - Emergency, Error
  danger: '#EF4444', // Alias for medicalRed
  dangerBg: '#FEF2F2', // Light red background
  successBg: '#ECFDF5', // Light green background
  waitingGrey: '#64748B', // Slate 500 - Neutral status
  success: '#10B981', // Alias for confidenceGreen
  infoBg: '#F0F9FF', // Light blue background

  // 🎨 Gradients
  gradients: {
    primary: ['#1E2A5E', '#1FB6A6'] as const, // Indigo -> Teal
    dark: ['#0F172A', '#1E2A5E'] as const, // Slate -> Indigo
    glass: ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.4)'] as const, // Frost effect
    soft: ['#F8FAFC', '#E2E8F0'] as const, // Subtle background
    orange: ['#FB923C', '#F59E0B'] as const, // Amber -> Yellow
    green: ['#34D399', '#10B981'] as const, // Green -> Emerald
    red: ['#F87171', '#EF4444'] as const, // Red -> Dark Red
    danger: ['#F87171', '#EF4444'] as const, // Alias for red
  },

  // 🌑 Shadows & Elevation
  shadows: {
    sm: {
      shadowColor: '#1E2A5E',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: '#1E2A5E',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#1E2A5E',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
      elevation: 10,
    },
    glow: {
      shadowColor: '#1FB6A6',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 5,
    },
  },

  // 🚦 Computed Semantic Colors (for backward capability if needed, or structured usage)
  status: {
    success: { bg: '#ECFDF5', text: '#059669', dot: '#10B981' },
    warning: { bg: '#FFF7ED', text: '#EA580C', dot: '#F97316' },
    error: { bg: '#FEF2F2', text: '#DC2626', dot: '#EF4444' },
    info: { bg: '#F0F9FF', text: '#0284C7', dot: '#0EA5E9' },
  },

  // Expo Router standard theme tokens
  light: {
    text: '#0F172A',
    background: '#F8FAFC',
    tint: '#1E2A5E',
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#1E2A5E',
  },
  dark: {
    text: '#FFFFFF',
    background: '#0F172A',
    tint: '#1FB6A6',
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#1FB6A6',
  },
};

export default Colors;
