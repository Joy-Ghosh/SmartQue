import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Platform, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { GradientButton } from '@/components/ui/GradientButton';

interface Patient {
    id: string;
    name: string;
    relation: string;
}

interface TravelMode {
    id: 'car' | 'bike' | 'walk';
    icon: string;
    label: string;
    eta: number; // in minutes
}

interface SmartBookingSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: {
        patient: Patient;
        travelMode: TravelMode;
    }) => void;
    consultationFee?: number;
    isEmergency?: boolean;
}

const PATIENTS: Patient[] = [
    { id: 'me', name: 'Me', relation: 'Self' },
    { id: 'mom', name: 'Mom', relation: 'Mother' },
    { id: 'dad', name: 'Dad', relation: 'Father' },
];

const TRAVEL_MODES: TravelMode[] = [
    { id: 'car', icon: 'car-sport-outline', label: 'Car', eta: 20 },
    { id: 'bike', icon: 'bicycle-outline', label: 'Bike', eta: 18 },
    { id: 'walk', icon: 'walk-outline', label: 'Walk', eta: 50 },
];

export default function SmartBookingSheet({
    isOpen,
    onClose,
    onConfirm,
    consultationFee = 500,
    isEmergency = false,
}: SmartBookingSheetProps) {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [selectedPatient, setSelectedPatient] = useState<Patient>(PATIENTS[0]);
    const [selectedTravelMode, setSelectedTravelMode] = useState<TravelMode>(TRAVEL_MODES[0]);

    const themeColor = isEmergency ? Colors.medicalRed : Colors.primary;

    const handlePatientSelect = (patient: Patient) => {
        setSelectedPatient(patient);
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleTravelModeSelect = (mode: TravelMode) => {
        setSelectedTravelMode(mode);
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleConfirm = () => {
        if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onConfirm({ patient: selectedPatient, travelMode: selectedTravelMode });
        setStep(1);
    };

    const handleClose = () => {
        setStep(1);
        onClose();
    };

    return (
        <Modal visible={isOpen} animationType="slide" transparent onRequestClose={handleClose}>
            <View style={styles.modalOverlay}>
                <Pressable style={styles.backdrop} onPress={handleClose} />

                <View style={styles.modalContent}>
                    <View style={styles.handleBar} />

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
                        {/* Progress Stepper */}
                        <View style={styles.progressBar}>
                            <View style={[styles.progressDot, step >= 1 && { backgroundColor: themeColor }]} />
                            <View style={[styles.progressLine, step >= 2 && { backgroundColor: themeColor }]} />
                            <View style={[styles.progressDot, step >= 2 && { backgroundColor: themeColor }]} />
                            <View style={[styles.progressLine, step >= 3 && { backgroundColor: themeColor }]} />
                            <View style={[styles.progressDot, step >= 3 && { backgroundColor: themeColor }]} />
                        </View>

                        {/* Step 1: Patient */}
                        {step === 1 && (
                            <View style={styles.stepContainer}>
                                <Text style={styles.stepTitle}>Who is the patient?</Text>
                                <Text style={styles.stepSubtitle}>Select who is visiting the doctor.</Text>

                                <View style={styles.grid}>
                                    {PATIENTS.map((p) => (
                                        <Pressable
                                            key={p.id}
                                            style={[
                                                styles.optionCard,
                                                selectedPatient.id === p.id && { borderColor: themeColor, backgroundColor: isEmergency ? Colors.dangerBg : Colors.primaryBg }
                                            ]}
                                            onPress={() => handlePatientSelect(p)}
                                        >
                                            <Ionicons
                                                name={p.id === 'me' ? 'person' : 'people'}
                                                size={24}
                                                color={selectedPatient.id === p.id ? themeColor : Colors.textSecondary}
                                            />
                                            <Text style={[styles.optionLabel, selectedPatient.id === p.id && { color: themeColor, fontFamily: 'Inter_700Bold' }]}>{p.name}</Text>
                                        </Pressable>
                                    ))}
                                </View>

                                <View style={styles.navRow}>
                                    <GradientButton title="Next" onPress={() => setStep(2)} variant={isEmergency ? 'danger' : 'primary'} style={{ flex: 1 }} />
                                </View>
                            </View>
                        )}

                        {/* Step 2: Transport */}
                        {step === 2 && (
                            <View style={styles.stepContainer}>
                                <Text style={styles.stepTitle}>How are you travelling?</Text>
                                <Text style={styles.stepSubtitle}>We'll calculate when you should leave.</Text>

                                <View style={styles.grid}>
                                    {TRAVEL_MODES.map((m) => (
                                        <Pressable
                                            key={m.id}
                                            style={[
                                                styles.optionCard,
                                                selectedTravelMode.id === m.id && { borderColor: themeColor, backgroundColor: isEmergency ? Colors.dangerBg : Colors.primaryBg }
                                            ]}
                                            onPress={() => handleTravelModeSelect(m)}
                                        >
                                            <Ionicons
                                                name={m.icon as any}
                                                size={28}
                                                color={selectedTravelMode.id === m.id ? themeColor : Colors.textSecondary}
                                            />
                                            <Text style={[styles.optionLabel, selectedTravelMode.id === m.id && { color: themeColor, fontFamily: 'Inter_700Bold' }]}>{m.label}</Text>
                                            <Text style={styles.optionSub}>{m.eta} min</Text>
                                        </Pressable>
                                    ))}
                                </View>

                                <View style={styles.navRow}>
                                    <GradientButton title="Back" onPress={() => setStep(1)} variant="outline" style={{ flex: 0.4 }} />
                                    <GradientButton title="Next" onPress={() => setStep(3)} variant={isEmergency ? 'danger' : 'primary'} style={{ flex: 1 }} />
                                </View>
                            </View>
                        )}

                        {/* Step 3: Confirm */}
                        {step === 3 && (
                            <View style={styles.stepContainer}>
                                <Text style={[styles.stepTitle, isEmergency && { color: Colors.medicalRed }]}>
                                    {isEmergency ? 'Emergency Booking' : 'Confirm Appointment'}
                                </Text>

                                <View style={styles.summaryCard}>
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Patient</Text>
                                        <Text style={styles.summaryVal}>{selectedPatient.name}</Text>
                                    </View>
                                    <View style={styles.divider} />
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Transport</Text>
                                        <Text style={styles.summaryVal}>{selectedTravelMode.label}</Text>
                                    </View>
                                    <View style={styles.divider} />
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Est. Fee</Text>
                                        <Text style={[styles.summaryVal, { color: themeColor }]}>₹{consultationFee}</Text>
                                    </View>
                                </View>

                                <View style={styles.navRow}>
                                    <GradientButton title="Back" onPress={() => setStep(2)} variant="outline" style={{ flex: 0.4 }} />
                                    <GradientButton
                                        title={isEmergency ? "Confirm Priority" : "Confirm Booking"}
                                        onPress={handleConfirm}
                                        variant={isEmergency ? 'danger' : 'primary'}
                                        style={{ flex: 1 }}
                                    />
                                </View>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        maxHeight: '80%',
        paddingBottom: 40,
    },
    handleBar: {
        width: 48,
        height: 5,
        backgroundColor: Colors.borderLight,
        borderRadius: 2.5,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 20,
    },
    contentContainer: {
        paddingHorizontal: 24,
    },
    progressBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        gap: 4,
    },
    progressDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.borderLight,
    },
    progressLine: {
        width: 30,
        height: 2,
        backgroundColor: Colors.borderLight,
    },
    stepContainer: {
        gap: 16,
    },
    stepTitle: {
        fontSize: 22,
        fontFamily: 'Inter_700Bold',
        color: Colors.text,
        textAlign: 'center',
        marginBottom: 4,
    },
    stepSubtitle: {
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 16,
    },
    grid: {
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'center',
    },
    optionCard: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: Colors.borderLight,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#fff',
    },
    optionLabel: {
        fontSize: 14,
        fontFamily: 'Inter_600SemiBold',
        color: Colors.text,
    },
    optionSub: {
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
        color: Colors.textMuted,
    },
    navRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
    },
    summaryCard: {
        padding: 20,
        borderRadius: 20,
        backgroundColor: Colors.background,
        gap: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
        color: Colors.textSecondary,
    },
    summaryVal: {
        fontSize: 16,
        fontFamily: 'Inter_700Bold',
        color: Colors.text,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.borderLight,
    },
});
