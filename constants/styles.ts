import Colors from './colors';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

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
        tight: 1.15,
        normal: 1.5,
        relaxed: 1.75,
    },
    letterSpacing: {
        tight: -0.5,
        normal: 0,
        wide: 0.5,
    },
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
    screenPadding: 20,
    gutter: 16,
    cardPadding: 20,
};

export const Layout = {
    window: { width, height },
    screen: { paddingHorizontal: Spacing.screenPadding },
    isSmallDevice: width < 375,
};

export const Radius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    full: 9999,
};

export const Shadows = {
    none: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    sm: Colors.shadows.sm,
    md: Colors.shadows.md,
    lg: Colors.shadows.lg,
};

export const ComponentStyles = {
    card: {
        backgroundColor: Colors.surface,
        borderRadius: Radius.xl,
        padding: Spacing.cardPadding,
        ...Colors.shadows.md,
    },
    glassLayer: {
        backgroundColor: Colors.surfaceGlass,
    },
    button: {
        primary: {
            backgroundColor: Colors.primary,
            paddingVertical: 16,
            borderRadius: Radius.full,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
        },
        secondary: {
            backgroundColor: Colors.surface,
            borderWidth: 1.5,
            borderColor: Colors.border,
            paddingVertical: 16,
            borderRadius: Radius.full,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
        },
    },
    input: {
        height: 52,
        backgroundColor: Colors.surface,
        borderRadius: Radius.lg,
        paddingHorizontal: Spacing.md,
        fontFamily: Typography.fontFamily.medium,
        fontSize: Typography.size.base,
        color: Colors.text,
        borderWidth: 1.5,
        borderColor: Colors.border,
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
