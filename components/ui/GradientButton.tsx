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

    const handlePressIn = () => { scale.value = withSpring(0.97, { damping: 15 }); };
    const handlePressOut = () => { scale.value = withSpring(1, { damping: 15 }); };

    const getGradientColors = (): readonly [string, string] => {
        if (disabled) return ['#C4C9E0', '#C4C9E0'];
        switch (variant) {
            case 'secondary': return ['#FFFFFF', '#F7F5F2'];
            case 'danger': return Colors.gradients.danger;
            case 'outline': return ['transparent', 'transparent'];
            case 'primary':
            default: return Colors.gradients.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return '#8A8FA8';
        if (variant === 'secondary') return Colors.primary500;
        if (variant === 'outline') return Colors.primary500;
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
                variant === 'outline' && styles.outline,
                variant === 'secondary' && styles.secondary,
                style,
                animatedStyle,
            ]}
        >
            <LinearGradient
                colors={getGradientColors()}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
            >
                {isLoading ? (
                    <ActivityIndicator color={getTextColor()} />
                ) : (
                    <>
                        {icon && <Ionicons name={icon} size={18} color={getTextColor()} style={{ marginRight: 6 }} />}
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
        overflow: 'hidden',
        ...Colors.shadows.md,
    },
    gradient: {
        paddingVertical: 15,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 15,
        letterSpacing: 0.2,
    },
    outline: {
        borderWidth: 1.5,
        borderColor: Colors.primary,
        backgroundColor: 'transparent',
        shadowOpacity: 0,
        elevation: 0,
    },
    secondary: {
        borderWidth: 1.5,
        borderColor: Colors.border,
        shadowOpacity: 0,
        elevation: 0,
    },
});
