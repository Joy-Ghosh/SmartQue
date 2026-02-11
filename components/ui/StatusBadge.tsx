import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import Colors from '@/constants/colors';

interface StatusBadgeProps {
    status: 'live' | 'waiting' | 'success' | 'alert';
    text?: string;
}

export function StatusBadge({ status, text }: StatusBadgeProps) {
    const pulseOpacity = useSharedValue(0.4);

    useEffect(() => {
        if (status === 'live') {
            pulseOpacity.value = withRepeat(
                withSequence(
                    withTiming(1, { duration: 1000 }),
                    withTiming(0.4, { duration: 1000 })
                ),
                -1,
                true
            );
        }
    }, [status]);

    const animatedDotStyle = useAnimatedStyle(() => ({
        opacity: pulseOpacity.value,
    }));

    const getConfig = () => {
        switch (status) {
            case 'live':
                return { bg: Colors.status.success.bg, text: Colors.status.success.dot, label: 'Live' };
            case 'alert':
                return { bg: Colors.status.warning.bg, text: Colors.status.warning.dot, label: 'Delayed' };
            case 'success':
                return { bg: Colors.status.success.bg, text: Colors.status.success.dot, label: 'Completed' };
            case 'waiting':
            default:
                return { bg: Colors.status.info.bg, text: Colors.status.info.dot, label: 'Waiting' };
        }
    };

    const config = getConfig();

    return (
        <View style={[styles.container, { backgroundColor: config.bg }]}>
            {status === 'live' ? (
                <Animated.View style={[styles.dot, animatedDotStyle, { backgroundColor: config.text }]} />
            ) : (
                <View style={[styles.dot, { backgroundColor: config.text }]} />
            )}
            <Text style={[styles.text, { color: config.text }]}>{text || config.label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        gap: 6,
        alignSelf: 'flex-start',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    text: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 12,
        letterSpacing: 0.3,
    },
});
