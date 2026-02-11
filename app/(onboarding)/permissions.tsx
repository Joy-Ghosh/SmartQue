import React from 'react';
import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/styles';

export default function PermissionsScreen() {
    const router = useRouter();

    const handleEnableLocation = async () => {
        // In a real app, this would trigger: await Location.requestForegroundPermissionsAsync();
        // For now, we simulate the flow
        router.replace('/(tabs)');
    };

    const handleSkip = () => {
        router.replace('/(tabs)');
    };

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <View style={styles.circle}>
                    <Ionicons name="location" size={48} color={Colors.primary} />
                </View>
                {/* Decorative pulse rings could go here */}
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Help us save your time</Text>
                <Text style={styles.description}>
                    To calculate the perfect time for you to leave home, SmartQ needs to know your distance from the clinic.
                </Text>

                <View style={styles.infoBox}>
                    <Ionicons name="car-outline" size={24} color={Colors.textSecondary} />
                    <Text style={styles.infoText}>
                        We only access location when you have an active booking to provide live travel updates.
                    </Text>
                </View>
            </View>

            <View style={styles.footer}>
                <Pressable style={styles.primaryButton} onPress={handleEnableLocation}>
                    <Text style={styles.primaryButtonText}>Enable Location</Text>
                </Pressable>

                <Pressable style={styles.secondaryButton} onPress={handleSkip}>
                    <Text style={styles.secondaryButtonText}>Not Now</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: Spacing.screenPadding,
        justifyContent: 'space-between',
        paddingVertical: 60,
    },
    iconContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    circle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.primary + '15', // Light indigo bg
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
    },
    title: {
        fontFamily: Typography.fontFamily.bold,
        fontSize: 24,
        color: Colors.text,
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontFamily: Typography.fontFamily.regular,
        fontSize: Typography.size.base,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: Colors.surface,
        padding: 16,
        borderRadius: Radius.lg,
        gap: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    infoText: {
        flex: 1,
        fontFamily: Typography.fontFamily.regular,
        fontSize: Typography.size.sm,
        color: Colors.textMuted,
        lineHeight: 20,
    },
    footer: {
        gap: 16,
    },
    primaryButton: {
        backgroundColor: Colors.primary,
        height: 56,
        borderRadius: Radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonText: {
        fontFamily: Typography.fontFamily.bold,
        fontSize: Typography.size.md,
        color: '#fff',
    },
    secondaryButton: {
        height: 56,
        borderRadius: Radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButtonText: {
        fontFamily: Typography.fontFamily.semiBold,
        fontSize: Typography.size.md,
        color: Colors.textSecondary,
    },
});
