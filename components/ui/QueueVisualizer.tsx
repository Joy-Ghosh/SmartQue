import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';

interface QueueVisualizerProps {
    total: number;
    serving: number;
    userToken: number;
    estimatedWait: number;
    compact?: boolean;
}

export function QueueVisualizer({ total, serving, userToken, estimatedWait, compact = false }: QueueVisualizerProps) {
    const progress = Math.min(1, Math.max(0, serving / userToken));
    const progressValue = useSharedValue(0);

    useEffect(() => {
        progressValue.value = withTiming(progress, { duration: 1000 });
    }, [progress]);

    const animatedStyle = useAnimatedStyle(() => ({
        width: `${progressValue.value * 100}%`,
    }));

    const ahead = Math.max(0, userToken - serving);

    if (compact) {
        return (
            <View style={styles.compactContainer}>
                <View style={styles.track}>
                    <Animated.View style={[styles.fill, animatedStyle]} />
                </View>
                <Text style={styles.compactText}>{ahead} people ahead</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Metrics Row */}
            <View style={styles.metricsRow}>
                <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Now Serving</Text>
                    <Text style={styles.metricValue}>#{serving}</Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Your Token</Text>
                    <Text style={[styles.metricValue, { color: Colors.primary }]}>#{userToken}</Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Est. Wait</Text>
                    <Text style={[styles.metricValue, { color: Colors.smartAmber }]}>{estimatedWait}m</Text>
                </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
                <View style={styles.track}>
                    <LinearGradient
                        colors={['#E2E8F0', '#F1F5F9']}
                        style={StyleSheet.absoluteFill}
                    />
                    <Animated.View style={[styles.fill, animatedStyle]}>
                        <LinearGradient
                            colors={Colors.gradients.primary}
                            style={StyleSheet.absoluteFill}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        />
                    </Animated.View>
                </View>
                <View style={styles.progressLabels}>
                    <Text style={styles.progressLabel}>Start</Text>
                    <Text style={styles.progressLabel}>You are here</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 16,
        width: '100%',
    },
    compactContainer: {
        gap: 6,
    },
    compactText: {
        fontSize: 12,
        color: '#fff',
        fontFamily: 'Inter_500Medium',
        textAlign: 'right',
    },
    metricsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    metricItem: {
        alignItems: 'center',
        flex: 1,
    },
    metricDivider: {
        width: 1,
        height: 24,
        backgroundColor: '#E2E8F0',
    },
    metricLabel: {
        fontSize: 11,
        color: Colors.textSecondary,
        fontFamily: 'Inter_500Medium',
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    metricValue: {
        fontSize: 18,
        color: Colors.text,
        fontFamily: 'Inter_700Bold',
    },
    progressBarContainer: {
        gap: 8,
    },
    track: {
        height: 8,
        backgroundColor: '#E2E8F0',
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative',
    },
    fill: {
        height: '100%',
        borderRadius: 4,
    },
    progressLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    progressLabel: {
        fontSize: 11,
        color: Colors.textMuted,
        fontFamily: 'Inter_500Medium',
    },
});
