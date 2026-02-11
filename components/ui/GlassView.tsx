import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';

interface GlassViewProps {
    children: React.ReactNode;
    style?: ViewStyle;
    intensity?: number;
    tint?: 'light' | 'dark' | 'default';
    gradientColors?: readonly [string, string, ...string[]];
    border?: boolean;
}

export function GlassView({
    children,
    style,
    intensity = 50,
    tint = 'light',
    gradientColors = ['rgba(255,255,255,0.7)', 'rgba(255,255,255,0.3)'],
    border = true,
}: GlassViewProps) {
    // On Android, BlurView can be resource intensive or buggy on some devices.
    // We can fallback to a semi-transparent background if needed, but Expo Blur works well mostly.

    return (
        <View style={[styles.container, border && styles.border, style]}>
            <BlurView intensity={intensity} tint={tint} style={StyleSheet.absoluteFill} />
            <LinearGradient
                colors={gradientColors}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        position: 'relative',
    },
    border: {
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
    },
});
