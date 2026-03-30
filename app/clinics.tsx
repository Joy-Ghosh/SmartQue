import React, { useState, useMemo } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Pressable,
    Image,
    TextInput,
    StatusBar,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, router, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, Layout as ReanimatedLayout } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { GlassView } from '@/components/ui/GlassView';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { clinics, getClinicDoctor } from '@/lib/data';

const FILTERS = ['All', 'General', 'Dental', 'Skin', 'Cardio', 'Pediatric', 'Lab Tests', 'Open Now', 'Wait < 30m'];
const SORT_OPTIONS = [
    { id: 'distance', label: 'Nearest', icon: 'location' },
    { id: 'wait', label: 'Shortest Queue', icon: 'time' },
    { id: 'rating', label: 'Top Rated', icon: 'star' },
];

const getStatus = (mins: number) => {
    if (mins < 15) return 'success';
    if (mins < 60) return 'live';
    return 'alert';
};

const getWaitLabel = (mins: number) => {
    if (mins < 15) return `<15m`;
    if (mins < 60) return `~${mins}m`;
    return `1h+`;
};

export default function ClinicsScreen() {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [sortBy, setSortBy] = useState('distance');

    // Filter & Sort Logic
    const processedClinics = useMemo(() => {
        let result = clinics.filter((clinic) => {
            const docName = getClinicDoctor(clinic.id)?.name || '';
            const matchesSearch = clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                docName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                clinic.type.toLowerCase().includes(searchQuery.toLowerCase());

            if (!matchesSearch) return false;

            // Service-based filters
            if (activeFilter === 'General') return clinic.type.includes('general');
            if (activeFilter === 'Dental') return clinic.type.includes('dental');
            if (activeFilter === 'Skin') return clinic.type.includes('dermatology') || clinic.type.includes('skin');
            if (activeFilter === 'Cardio') return clinic.type.includes('cardio');
            if (activeFilter === 'Pediatric') return clinic.type.includes('pediatric');
            if (activeFilter === 'Lab Tests') return clinic.type.includes('lab');

            // Tag/State based filters
            if (activeFilter === 'Open Now') return clinic.state === 'live' || clinic.state === 'booking_open';
            
            const waitTime = clinic.currentQueueLength * clinic.avgWaitTimePerPatient;
            if (activeFilter === 'Wait < 30m') return waitTime < 30;

            return true; // 'All' filter
        });

        // Sorting
        result.sort((a, b) => {
            if (sortBy === 'distance') return a.distance - b.distance;
            if (sortBy === 'wait') {
                const waitA = a.currentQueueLength * a.avgWaitTimePerPatient;
                const waitB = b.currentQueueLength * b.avgWaitTimePerPatient;
                return waitA - waitB;
            }
            if (sortBy === 'rating') return b.rating - a.rating;
            return 0;
        });

        return result;
    }, [searchQuery, activeFilter, sortBy]);

    const handleSortChange = (id: string) => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSortBy(id);
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle="dark-content" />

            {/* Header Background */}
            <View style={[styles.headerBg, { height: 210 + insets.top }]}>
                <LinearGradient
                    colors={['#E0F7F6', '#F8FAFC']}
                    style={StyleSheet.absoluteFill}
                />
            </View>

            <View style={[styles.headerContent, { paddingTop: insets.top }]}>
                {/* Nav Header */}
                <View style={styles.navBar}>
                    <Pressable onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color={Colors.text} />
                    </Pressable>
                    <Text style={styles.headerTitle}>Find Care</Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* Search Input */}
                <GlassView style={styles.searchBar} intensity={40} border>
                    <Ionicons name="search" size={20} color={Colors.textMuted} />
                    <TextInput
                        placeholder="Search clinics, doctors..."
                        placeholderTextColor={Colors.textMuted}
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <Pressable onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
                        </Pressable>
                    )}
                </GlassView>

                {/* Categories */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterScroll}
                    style={{ maxHeight: 44, marginBottom: 12 }}
                >
                    {FILTERS.map((filter) => (
                        <Pressable
                            key={filter}
                            style={[
                                styles.filterChip,
                                activeFilter === filter && styles.activeFilterChip,
                            ]}
                            onPress={() => setActiveFilter(filter)}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    activeFilter === filter && styles.activeFilterText,
                                ]}
                            >
                                {filter}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>

                {/* Sort Bar */}
                <View style={styles.sortContainer}>
                    <Text style={styles.sortLabel}>Sort:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortScroll}>
                        {SORT_OPTIONS.map((opt) => (
                            <Pressable 
                                key={opt.id} 
                                style={[styles.sortChip, sortBy === opt.id && styles.activeSortChip]}
                                onPress={() => handleSortChange(opt.id)}
                            >
                                <Ionicons name={opt.icon as any} size={11} color={sortBy === opt.id ? '#fff' : Colors.textSecondary} />
                                <Text style={[styles.sortText, sortBy === opt.id && styles.activeSortText]}>{opt.label}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
            </View>

            {/* Clinic List */}
            <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
                {processedClinics.length > 0 ? (
                    processedClinics.map((clinic, index) => {
                        const waitTime = clinic.currentQueueLength * clinic.avgWaitTimePerPatient;
                        const docName = getClinicDoctor(clinic.id)?.name || 'Unknown Doctor';
                        return (
                            <Animated.View
                                key={clinic.id}
                                layout={ReanimatedLayout.springify()}
                                entering={FadeInDown.duration(500).delay((index % 5) * 80)}
                            >
                                <Link href={`/clinic/${clinic.id}`} asChild>
                                    <Pressable>
                                        <GlassView style={styles.clinicCard} border intensity={80}>
                                            <Image source={{ uri: clinic.image }} style={styles.clinicImage} />

                                            <View style={styles.clinicContent}>
                                                <View style={styles.rowBetween}>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={styles.clinicName}>{clinic.name}</Text>
                                                        <Text style={styles.doctorName}>{docName}</Text>
                                                    </View>
                                                    <View style={styles.ratingBadge}>
                                                        <Ionicons name="star" size={10} color="#F59E0B" />
                                                        <Text style={styles.ratingText}>{clinic.rating}</Text>
                                                    </View>
                                                </View>

                                                <View style={styles.clinicFooter}>
                                                    <View style={styles.infoRow}>
                                                        <Text style={[styles.detailText, {textTransform: 'capitalize'}]}>{clinic.type}</Text>
                                                        <View style={styles.dot} />
                                                        <Text style={styles.detailText}>{clinic.distance} km</Text>
                                                    </View>

                                                    <StatusBadge
                                                        status={getStatus(waitTime) as any}
                                                        text={getWaitLabel(waitTime)}
                                                    />
                                                </View>
                                            </View>
                                        </GlassView>
                                    </Pressable>
                                </Link>
                            </Animated.View>
                        );
                    })
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="search-outline" size={48} color={Colors.textMuted} />
                        <Text style={styles.emptyText}>No clinics found</Text>
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
    headerBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        overflow: 'hidden',
        ...Colors.shadows.sm,
    },
    headerContent: {
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        marginTop: 10,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        ...Colors.shadows.sm,
    },
    headerTitle: {
        fontFamily: 'Inter_700Bold',
        fontSize: 18,
        color: Colors.text,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 16,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontFamily: 'Inter_500Medium',
        fontSize: 15,
        color: Colors.text,
    },
    filterScroll: {
        gap: 8,
        paddingRight: 20,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderWidth: 1,
        borderColor: Colors.borderLight,
    },
    activeFilterChip: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    filterText: {
        fontFamily: 'Inter_500Medium',
        fontSize: 13,
        color: Colors.textSecondary,
    },
    activeFilterText: {
        color: '#fff',
    },
    sortContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    sortLabel: {
        fontFamily: 'Inter_700Bold',
        fontSize: 11,
        color: Colors.textTertiary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sortScroll: {
        gap: 8,
        paddingRight: 20,
    },
    sortChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: Colors.gray100,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    activeSortChip: {
        backgroundColor: Colors.primary500,
        borderColor: Colors.primary600,
    },
    sortText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 11,
        color: Colors.textSecondary,
    },
    activeSortText: {
        color: '#fff',
    },
    listContent: {
        padding: 20,
        gap: 16,
        paddingBottom: 40,
    },
    clinicCard: {
        flexDirection: 'row',
        borderRadius: 20,
        padding: 12,
        backgroundColor: '#fff',
        ...Colors.shadows.sm,
    },
    clinicImage: {
        width: 80,
        height: 80,
        borderRadius: 14,
        backgroundColor: Colors.borderLight,
    },
    clinicContent: {
        flex: 1,
        marginLeft: 14,
        justifyContent: 'space-between',
        paddingVertical: 2,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    clinicName: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 16,
        color: Colors.text,
        marginBottom: 2,
    },
    doctorName: {
        fontFamily: 'Inter_500Medium',
        fontSize: 13,
        color: Colors.textSecondary,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFBEB',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        gap: 2,
    },
    ratingText: {
        fontFamily: 'Inter_700Bold',
        fontSize: 10,
        color: '#D97706',
    },
    clinicFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 6,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        fontFamily: 'Inter_500Medium',
        fontSize: 12,
        color: Colors.textMuted,
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: Colors.textMuted,
        marginHorizontal: 6,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
        gap: 12,
    },
    emptyText: {
        fontFamily: 'Inter_500Medium',
        fontSize: 16,
        color: Colors.textMuted,
    },
});
