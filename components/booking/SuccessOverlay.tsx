import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    withDelay,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { router } from 'expo-router';
import { GradientButton } from '@/components/ui/GradientButton';

const { width, height } = Dimensions.get('window');

interface SuccessOverlayProps {
    visible: boolean;
    tokenNumber: number;
    doctorName: string;
    clinicName: string;
    estimatedTime: string;
    onClose: () => void;
}

export default function SuccessOverlay({
    visible,
    tokenNumber,
    doctorName,
    clinicName,
    estimatedTime,
    onClose,
}: SuccessOverlayProps) {
    const scale = useSharedValue(0);
    const ticketTranslateY = useSharedValue(height);
    const contentOpacity = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            scale.value = withSpring(1, { damping: 12 });
            ticketTranslateY.value = withDelay(400, withSpring(0, { damping: 15 }));
            contentOpacity.value = withDelay(800, withTiming(1, { duration: 500 }));
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            scale.value = 0;
            ticketTranslateY.value = height;
            contentOpacity.value = 0;
        }
    }, [visible]);

    const checkmarkStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
    const ticketStyle = useAnimatedStyle(() => ({ transform: [{ translateY: ticketTranslateY.value }] }));
    const fadeStyle = useAnimatedStyle(() => ({ opacity: contentOpacity.value }));

    const handleGoHome = () => {
        onClose();
        router.replace('/(tabs)');
    };

    if (!visible) return null;

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.container}>
                <BlurView intensity={90} tint="light" style={StyleSheet.absoluteFill} />

                <View style={styles.content}>
                    <Animated.View style={[styles.successCircle, checkmarkStyle]}>
                        <Ionicons name="checkmark" size={48} color="#fff" />
                    </Animated.View>

                    <Animated.View style={[styles.textContainer, fadeStyle]}>
                        <Text style={styles.title}>Booking Confirmed!</Text>
                        <Text style={styles.subtitle}>You have successfully joined the queue.</Text>
                    </Animated.View>

                    {/* Ticket */}
                    <Animated.View style={[styles.ticketContainer, ticketStyle]}>
                        <View style={styles.ticketHeader}>
                            <View style={styles.holeLeft} />
                            <View style={styles.holeRight} />
                            <Text style={styles.clinicName}>{clinicName}</Text>
                        </View>
                        <View style={styles.ticketBody}>
                            <Text style={styles.doctorName}>{doctorName}</Text>
                            <View style={styles.tokenDisplay}>
                                <Text style={styles.tokenLabel}>YOUR TOKEN</Text>
                                <Text style={styles.tokenValue}>#{tokenNumber}</Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.qrContainer}>
                                <Ionicons name="qr-code-outline" size={60} color={Colors.text} />
                                <Text style={styles.scanText}>Scan at reception</Text>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Actions */}
                    <Animated.View style={[styles.actionsContainer, fadeStyle]}>
                        <View style={styles.smartNote}>
                            <Ionicons name="information-circle" size={20} color={Colors.primary} />
                            <Text style={styles.noteText}>
                                We will notify you at <Text style={{ fontWeight: '700' }}>{estimatedTime}</Text>.
                            </Text>
                        </View>

                        <GradientButton
                            title="Go to Home"
                            onPress={handleGoHome}
                            icon="home"
                            style={{ width: '100%' }}
                        />

                        <Pressable onPress={onClose} style={styles.secondaryBtn}>
                            <Text style={styles.secondaryBtnText}>View Token</Text>
                        </Pressable>
                    </Animated.View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)', // translucent base for blur
    },
    content: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    successCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.confidenceGreen,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        ...Colors.shadows.lg,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontFamily: 'Inter_700Bold',
        fontSize: 24,
        color: Colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontFamily: 'Inter_500Medium',
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    ticketContainer: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 32,
        ...Colors.shadows.md,
    },
    ticketHeader: {
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        alignItems: 'center',
        position: 'relative',
    },
    holeLeft: {
        position: 'absolute',
        bottom: -10,
        left: -10,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(240,240,245,1)', // approximate blurry bg color
    },
    holeRight: {
        position: 'absolute',
        bottom: -10,
        right: -10,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(240,240,245,1)',
    },
    clinicName: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 14,
        color: '#fff',
        letterSpacing: 0.5,
    },
    ticketBody: {
        padding: 24,
        alignItems: 'center',
    },
    doctorName: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 18,
        color: Colors.text,
        marginBottom: 16,
    },
    tokenDisplay: {
        alignItems: 'center',
        marginBottom: 20,
    },
    tokenLabel: {
        fontFamily: 'Inter_700Bold',
        fontSize: 12,
        color: Colors.textMuted,
        letterSpacing: 1,
        marginBottom: 4,
    },
    tokenValue: {
        fontFamily: 'Inter_700Bold',
        fontSize: 48,
        color: Colors.primary,
    },
    divider: {
        width: '100%',
        height: 1,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: Colors.borderLight,
        marginBottom: 20,
    },
    qrContainer: {
        alignItems: 'center',
        gap: 8,
    },
    scanText: {
        fontFamily: 'Inter_500Medium',
        fontSize: 12,
        color: Colors.textMuted,
    },
    actionsContainer: {
        width: '100%',
        gap: 16,
        alignItems: 'center',
    },
    smartNote: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.secondaryBg,
        padding: 12,
        borderRadius: 12,
        gap: 10,
        width: '100%',
    },
    noteText: {
        fontFamily: 'Inter_400Regular',
        fontSize: 13,
        color: Colors.text,
        flex: 1,
    },
    secondaryBtn: {
        paddingVertical: 12,
    },
    secondaryBtnText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 15,
        color: Colors.textSecondary,
    },
});
