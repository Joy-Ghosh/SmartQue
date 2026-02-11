import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import Colors from '@/constants/colors';
import { useQueue } from '@/lib/queue-context';

export default function ActiveTokenWidget() {
    const { activeBooking } = useQueue();

    // Pulsing animation for live indicator
    const pulseOpacity = useSharedValue(1);

    useEffect(() => {
        pulseOpacity.value = withRepeat(
            withTiming(0.3, { duration: 1500 }),
            -1,
            true
        );
    }, []);

    const pulseStyle = useAnimatedStyle(() => ({
        opacity: pulseOpacity.value,
    }));

    if (!activeBooking) {
        return null;
    }

    const { tokenNumber, servingToken, clinicName } = activeBooking;
    const tokensAhead = tokenNumber - servingToken;
    const progress = Math.max(0, Math.min(1, servingToken / tokenNumber));

    // Calculate estimated time
    const estimatedMins = tokensAhead * (activeBooking.avgWaitTime || 5);

    return (
        <Pressable onPress={() => router.push('/active-token')}>
            <Animated.View style={styles.container}>
                {/* Live Indicator */}
                <View style={styles.header}>
                    <View style={styles.liveIndicator}>
                        <Animated.View style={[styles.liveDot, pulseStyle]} />
                        <Text style={styles.liveText}>ACTIVE TOKEN</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
                </View>

                {/* Token Info */}
                <View style={styles.tokenRow}>
                    <View style={styles.tokenBlock}>
                        <Text style={styles.tokenLabel}>Your Token</Text>
                        <Text style={styles.tokenNumber}>{tokenNumber}</Text>
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressContainer}>
                        <View style={styles.progressTrack}>
                            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                        </View>
                        <Text style={styles.aheadText}>{tokensAhead} ahead</Text>
                    </View>

                    <View style={styles.tokenBlock}>
                        <Text style={styles.tokenLabel}>Current</Text>
                        <Text style={styles.currentNumber}>{servingToken}</Text>
                    </View>
                </View>

                {/* Status Text */}
                <View style={styles.statusRow}>
                    <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
                    <Text style={styles.statusText}>
                        {estimatedMins < 15
                            ? 'Almost your turn! Get ready.'
                            : `Relax at home. ~${estimatedMins} mins to go`}
                    </Text>
                </View>

                {/* Clinic Name */}
                <Text style={styles.clinicText} numberOfLines={1}>
                    {clinicName}
                </Text>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.surface,
        borderRadius: 20,
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 16,
        gap: 12,
        ...Colors.shadowMd,
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#2EC4B6',
    },
    liveText: {
        fontFamily: 'Inter_700Bold',
        fontSize: 11,
        color: '#2EC4B6',
        letterSpacing: 0.5,
    },
    tokenRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    tokenBlock: {
        alignItems: 'center',
        gap: 4,
    },
    tokenLabel: {
        fontFamily: 'Inter_500Medium',
        fontSize: 11,
        color: Colors.textSecondary,
    },
    tokenNumber: {
        fontFamily: 'Inter_700Bold',
        fontSize: 24,
        color: Colors.primary,
    },
    currentNumber: {
        fontFamily: 'Inter_700Bold',
        fontSize: 24,
        color: Colors.secondary,
    },
    progressContainer: {
        flex: 1,
        gap: 4,
    },
    progressTrack: {
        height: 6,
        backgroundColor: Colors.borderLight,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colors.secondary,
        borderRadius: 3,
    },
    aheadText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 10,
        color: Colors.textMuted,
        textAlign: 'center',
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
    },
    statusText: {
        fontFamily: 'Inter_500Medium',
        fontSize: 13,
        color: Colors.textSecondary,
        flex: 1,
    },
    clinicText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 12,
        color: Colors.text,
    },
});
