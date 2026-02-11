import React from 'react';
import { Text, StyleSheet, Pressable, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';

interface GradientButtonProps {
    title: string;
    onPress: () => void;
    icon?: keyof typeof Ionicons.glyphMap;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    isLoading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GradientButton({
    title,
    onPress,
    icon,
    variant = 'primary',
    isLoading = false,
    disabled = false,
    style,
    textStyle,
}: GradientButtonProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.97);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    const getGradientColors = () => {
        if (disabled) return ['#94A3B8', '#CBD5E1'] as const;
        switch (variant) {
            case 'secondary':
                return Colors.gradients.glass;
            case 'danger':
                return Colors.gradients.red;
            case 'outline':
                return ['transparent', 'transparent'] as const;
            case 'primary':
            default:
                return Colors.gradients.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return '#F1F5F9';
        if (variant === 'secondary' || variant === 'outline') return Colors.primary;
        return '#FFFFFF';
    };

    return (
        <AnimatedPressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled || isLoading}
            style={[
                styles.container,
                { ...Colors.shadows.sm },
                variant === 'outline' && styles.outline,
                style,
                animatedStyle,
            ]}
        >
            <LinearGradient
                colors={getGradientColors()}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.gradient, variant === 'outline' && styles.outlineGradient]}
            >
                {isLoading ? (
                    <ActivityIndicator color={getTextColor()} />
                ) : (
                    <>
                        {icon && <Ionicons name={icon} size={20} color={getTextColor()} style={{ marginRight: 8 }} />}
                        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{title}</Text>
                    </>
                )}
            </LinearGradient>
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        overflow: 'hidden', // Ensure gradient respects border radius
    },
    gradient: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 16,
        letterSpacing: 0.5,
    },
    outline: {
        borderWidth: 1.5,
        borderColor: Colors.primary,
        backgroundColor: 'transparent',
        shadowOpacity: 0,
        elevation: 0,
    },
    outlineGradient: {
        // Transparent gradient content
    },
});
