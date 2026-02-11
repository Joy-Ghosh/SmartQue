import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { useQueue } from '@/lib/queue-context';
import { GlassView } from '@/components/ui/GlassView';
import { StatusBadge } from '@/components/ui/StatusBadge';

const SegmentedControl = ({ activeTab, onChange }: { activeTab: string, onChange: (tab: string) => void }) => {
    return (
        <View style={styles.segmentContainer}>
            <View style={styles.segmentTrack}>
                <Pressable
                    style={[styles.segmentBtn, activeTab === 'upcoming' && styles.segmentBtnActive]}
                    onPress={() => onChange('upcoming')}
                >
                    <Text style={[styles.segmentText, activeTab === 'upcoming' && styles.segmentTextActive]}>Upcoming</Text>
                </Pressable>
                <Pressable
                    style={[styles.segmentBtn, activeTab === 'history' && styles.segmentBtnActive]}
                    onPress={() => onChange('history')}
                >
                    <Text style={[styles.segmentText, activeTab === 'history' && styles.segmentTextActive]}>History</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default function AppointmentsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { activeBooking, pastBookings } = useQueue();
    const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </Pressable>
                <Text style={styles.headerTitle}>My Appointments</Text>
                <View style={{ width: 40 }} />
            </View>

            <SegmentedControl activeTab={activeTab} onChange={(t) => setActiveTab(t as any)} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {activeTab === 'upcoming' ? (
                    <View style={styles.listContainer}>
                        {activeBooking ? (
                            <Pressable onPress={() => router.push('/active-token')}>
                                <LinearGradient
                                    colors={activeBooking.isEmergency ? Colors.gradients.danger : Colors.gradients.primary}
                                    style={styles.activeCard}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <View style={styles.activeCardHeader}>
                                        <View style={styles.activeTag}>
                                            <View style={[styles.activeDot, activeBooking.isEmergency && { backgroundColor: Colors.danger }]} />
                                            <Text style={[styles.activeTagText, activeBooking.isEmergency && { color: Colors.danger }]}>
                                                {activeBooking.isEmergency ? 'EMERGENCY' : 'LIVE NOW'}
                                            </Text>
                                        </View>
                                        <Ionicons name="chevron-forward" size={20} color="#fff" />
                                    </View>

                                    <View>
                                        <Text style={styles.activeClinic}>{activeBooking.clinicName}</Text>
                                        <Text style={styles.activeDoctor}>{activeBooking.doctorName}</Text>
                                    </View>

                                    <View style={styles.tokenRow}>
                                        <View>
                                            <Text style={styles.tokenLabel}>YOUR TOKEN</Text>
                                            <Text style={styles.tokenValue}>#{activeBooking.tokenNumber}</Text>
                                        </View>
                                        <View style={styles.servingInfo}>
                                            <Text style={styles.servingLabel}>Serving Now</Text>
                                            <Text style={styles.servingValue}>#{activeBooking.servingToken}</Text>
                                        </View>
                                    </View>
                                </LinearGradient>
                            </Pressable>
                        ) : (
                            <View style={styles.emptyState}>
                                <View style={styles.emptyIcon}>
                                    <Ionicons name="calendar-outline" size={32} color={Colors.primary} />
                                </View>
                                <Text style={styles.emptyTitle}>No Upcoming Appointments</Text>
                                <Text style={styles.emptySub}>Book a token to skip the queue.</Text>
                            </View>
                        )}
                    </View>
                ) : (
                    <View style={styles.listContainer}>
                        {pastBookings.length > 0 ? (
                            pastBookings.map((booking, index) => (
                                <GlassView key={index} style={styles.historyCard} intensity={40} border>
                                    <View style={styles.cardLeft}>
                                        <View style={[styles.historyIcon, booking.isEmergency && { backgroundColor: Colors.dangerBg }]}>
                                            <Ionicons
                                                name={booking.isEmergency ? "medical" : "checkmark"}
                                                size={18}
                                                color={booking.isEmergency ? Colors.danger : Colors.success}
                                            />
                                        </View>
                                        <View>
                                            <Text style={styles.historyClinic}>{booking.clinicName}</Text>
                                            <Text style={styles.historyDoc}>{booking.doctorName}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.cardRight}>
                                        <Text style={styles.historyDate}>
                                            {new Date(booking.bookedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </Text>
                                        <Text style={styles.historyToken}>#{booking.tokenNumber}</Text>
                                    </View>
                                </GlassView>
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyText}>No history found</Text>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.borderLight,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'Inter_700Bold',
        color: Colors.text,
    },
    segmentContainer: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    segmentTrack: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 4,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.borderLight,
    },
    segmentBtn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 12,
    },
    segmentBtnActive: {
        backgroundColor: Colors.background,
        ...Colors.shadows.sm,
    },
    segmentText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 14,
        color: Colors.textSecondary,
    },
    segmentTextActive: {
        color: Colors.text,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    listContainer: {
        gap: 16,
    },
    // Active Card
    activeCard: {
        borderRadius: 24,
        padding: 24,
        ...Colors.shadows.md,
    },
    activeCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    activeTag: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    activeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.primary,
    },
    activeTagText: {
        fontSize: 10,
        fontFamily: 'Inter_700Bold',
        color: Colors.primary,
    },
    activeClinic: {
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 4,
    },
    activeDoctor: {
        fontSize: 20,
        fontFamily: 'Inter_700Bold',
        color: '#fff',
        marginBottom: 24,
    },
    tokenRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.2)',
    },
    tokenLabel: {
        fontSize: 10,
        fontFamily: 'Inter_600SemiBold',
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: 1,
        marginBottom: 2,
    },
    tokenValue: {
        fontSize: 24,
        fontFamily: 'Inter_700Bold',
        color: '#fff',
    },
    servingInfo: {
        alignItems: 'flex-end',
    },
    servingLabel: {
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 2,
    },
    servingValue: {
        fontSize: 18,
        fontFamily: 'Inter_600SemiBold',
        color: '#fff',
    },
    // History Card
    historyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#fff',
    },
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    historyIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: Colors.successBg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    historyClinic: {
        fontSize: 14,
        fontFamily: 'Inter_600SemiBold',
        color: Colors.text,
    },
    historyDoc: {
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
        color: Colors.textSecondary,
    },
    cardRight: {
        alignItems: 'flex-end',
    },
    historyDate: {
        fontSize: 11,
        fontFamily: 'Inter_500Medium',
        color: Colors.textMuted,
        marginBottom: 2,
    },
    historyToken: {
        fontSize: 16,
        fontFamily: 'Inter_700Bold',
        color: Colors.text,
    },
    // Empty
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
        gap: 12,
    },
    emptyIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.primaryBg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyTitle: {
        fontSize: 16,
        fontFamily: 'Inter_600SemiBold',
        color: Colors.text,
    },
    emptySub: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    emptyText: {
        textAlign: 'center',
        color: Colors.textMuted,
    },
});
