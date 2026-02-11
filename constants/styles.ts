import Colors from './colors';
import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Typography System
export const Typography = {
    fontFamily: {
        regular: 'Inter_400Regular',
        medium: 'Inter_500Medium',
        semiBold: 'Inter_600SemiBold',
        bold: 'Inter_700Bold',
    },
    size: {
        xs: 10,
        sm: 12,
        base: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
        xxxl: 32,
        display: 48,
    },
    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
    },
};

// Spacing System (8pt grid basis)
export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
    // Specific usages based on layout
    screenPadding: 20,
    gutter: 16,
    cardPadding: 20,
};

// Layout & Dimensions
export const Layout = {
    window: {
        width,
        height,
    },
    screen: {
        paddingHorizontal: Spacing.screenPadding,
    },
    isSmallDevice: width < 375,
};

// Radius System
export const Radius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    full: 9999,
};

// Shadow System
export const Shadows = {
    none: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    sm: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    md: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    lg: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
};

// Component Specific Styles
export const ComponentStyles = {
    card: {
        backgroundColor: Colors.surface,
        borderRadius: Radius.xl,
        padding: Spacing.cardPadding,
        ...Shadows.md,
    },
    button: {
        primary: {
            backgroundColor: Colors.primary,
            paddingVertical: 16,
            borderRadius: Radius.lg,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
        },
        text: {
            color: '#fff',
            fontFamily: Typography.fontFamily.bold,
            fontSize: Typography.size.md,
        },
    },
    input: {
        height: 50,
        backgroundColor: Colors.background,
        borderRadius: Radius.lg,
        paddingHorizontal: Spacing.md,
        fontFamily: Typography.fontFamily.medium,
        fontSize: Typography.size.base,
        color: Colors.text,
    },
};

const AppTheme = {
    Colors,
    Typography,
    Spacing,
    Layout,
    Radius,
    Shadows,
    ComponentStyles,
};

export default AppTheme;
