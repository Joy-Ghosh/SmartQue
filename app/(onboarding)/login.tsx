import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { GradientButton } from '@/components/ui/GradientButton';
import { GlassView } from '@/components/ui/GlassView';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState('');

    const isValid = phoneNumber.length === 10;

    const handleGetOTP = () => {
        if (isValid) {
            router.push({ pathname: '/(onboarding)/otp', params: { phone: phoneNumber } });
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Colors.background, '#F0F9FF']}
                style={StyleSheet.absoluteFill}
            />
            {/* Background Blob */}
            <View style={styles.blob} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={styles.iconWrap}>
                            <Ionicons name="log-in-outline" size={32} color={Colors.primary} />
                        </View>
                        <Text style={styles.welcomeText}>Welcome to SmartQ</Text>
                        <Text style={styles.subText}>Enter your mobile number to get started.</Text>
                    </View>

                    <GlassView intensity={60} style={styles.inputCard} border>
                        <Text style={styles.label}>Mobile Number</Text>
                        <View style={styles.inputRow}>
                            <View style={styles.prefixContainer}>
                                <Text style={styles.flag}>🇮🇳</Text>
                                <Text style={styles.prefix}>+91</Text>
                            </View>
                            <View style={styles.divider} />
                            <TextInput
                                style={styles.input}
                                placeholder="00000 00000"
                                placeholderTextColor={Colors.textMuted}
                                keyboardType="number-pad"
                                maxLength={10}
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                autoFocus
                            />
                        </View>
                    </GlassView>

                    <GradientButton
                        title="Get OTP"
                        onPress={handleGetOTP}
                        disabled={!isValid}
                        icon="arrow-forward"
                        style={{ marginTop: 24 }}
                    />

                    <Text style={styles.footerText}>
                        By continuing, you agree to our <Text style={styles.link}>Terms</Text> & <Text style={styles.link}>Privacy Policy</Text>.
                    </Text>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    blob: {
        position: 'absolute',
        top: -100,
        right: -100,
        width: 400,
        height: 400,
        borderRadius: 200,
        backgroundColor: Colors.primary + '10',
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 40,
        alignItems: 'center',
    },
    iconWrap: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        ...Colors.shadows.md,
    },
    welcomeText: {
        fontFamily: 'Inter_700Bold',
        fontSize: 28,
        color: Colors.text,
        marginBottom: 8,
    },
    subText: {
        fontFamily: 'Inter_500Medium',
        fontSize: 15,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    inputCard: {
        padding: 20,
        borderRadius: 20,
        backgroundColor: '#fff',
    },
    label: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 13,
        color: Colors.textSecondary,
        marginBottom: 12,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    prefixContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    flag: {
        fontSize: 20,
    },
    prefix: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 16,
        color: Colors.text,
    },
    divider: {
        width: 1,
        height: 24,
        backgroundColor: Colors.borderLight,
        marginHorizontal: 16,
    },
    input: {
        flex: 1,
        fontFamily: 'Inter_600SemiBold',
        fontSize: 18,
        color: Colors.text,
        letterSpacing: 1,
    },
    footerText: {
        textAlign: 'center',
        fontFamily: 'Inter_400Regular',
        fontSize: 13,
        color: Colors.textMuted,
        marginTop: 32,
    },
    link: {
        color: Colors.primary,
        fontFamily: 'Inter_600SemiBold',
    },
});
