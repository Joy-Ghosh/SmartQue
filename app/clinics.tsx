import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Pressable,
    Image,
    TextInput,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, router, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { GlassView } from '@/components/ui/GlassView';
import { StatusBadge } from '@/components/ui/StatusBadge';

// Extended Data for All Clinics
const ALL_CLINICS = [
    {
        id: '1',
        name: 'Jay Dental Clinic',
        doctor: 'Dr. John Doe',
        specialty: 'Dentist',
        rating: 4.8,
        distance: '1.2 km',
        waitTimeMin: 10,
        services: ['dental', 'general'],
        image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=60',
        tags: ['Open Now'],
    },
    {
        id: '2',
        name: 'City Health Center',
        doctor: 'Dr. Sarah Smith',
        specialty: 'General',
        rating: 4.5,
        distance: '2.5 km',
        waitTimeMin: 45,
        services: ['general'],
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=60',
        tags: ['Open Now'],
    },
    {
        id: '3',
        name: 'Life Care Polyclinic',
        doctor: 'Dr. Michael Brown',
        specialty: 'Skin',
        rating: 4.2,
        distance: '3.8 km',
        waitTimeMin: 75,
        services: ['dermatology', 'general'],
        image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop&q=60',
        tags: ['Closed Soon'],
    },
    {
        id: '4',
        name: 'Sunrise Heart Clinic',
        doctor: 'Dr. Emily Chen',
        specialty: 'Cardio',
        rating: 4.9,
        distance: '5.0 km',
        waitTimeMin: 20,
        services: ['cardiology', 'general'],
        image: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=800&auto=format&fit=crop&q=60',
        tags: ['Open Now'],
    },
    {
        id: '5',
        name: 'Kids Care Pediatric',
        doctor: 'Dr. David Wilson',
        specialty: 'Pediatrician',
        rating: 4.7,
        distance: '4.2 km',
        waitTimeMin: 5,
        services: ['pediatrics', 'general'],
        image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&auto=format&fit=crop&q=60',
        tags: ['Open Now'],
    },
];

const FILTERS = ['All', 'General', 'Dental', 'Skin', 'Cardio', 'Pediatric', 'Lab Tests', 'Orthopedic', 'Open Now', 'Wait < 30m'];

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

    // Filter Logic
    const filteredClinics = ALL_CLINICS.filter((clinic) => {
        const matchesSearch = clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            clinic.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
            clinic.specialty.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        // Service-based filters
        if (activeFilter === 'General') return clinic.services.includes('general');
        if (activeFilter === 'Dental') return clinic.services.includes('dental');
        if (activeFilter === 'Skin') return clinic.services.includes('dermatology');
        if (activeFilter === 'Cardio') return clinic.services.includes('cardiology');
        if (activeFilter === 'Pediatric') return clinic.services.includes('pediatrics');
        if (activeFilter === 'Lab Tests') return clinic.services.includes('lab');
        if (activeFilter === 'Orthopedic') return clinic.services.includes('orthopedics');

        // Tag-based filters
        if (activeFilter === 'Open Now') return clinic.tags.includes('Open Now');
        if (activeFilter === 'Wait < 30m') return clinic.waitTimeMin < 30;

        return true; // 'All' filter
    });

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle="dark-content" />

            {/* Header Background */}
            <View style={[styles.headerBg, { height: 180 + insets.top }]}>
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
                    <Pressable style={styles.filterToggleBtn}>
                        <Ionicons name="options-outline" size={22} color={Colors.primary} />
                    </Pressable>
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

                {/* Filters */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterScroll}
                    style={{ maxHeight: 50, marginBottom: 10 }}
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
            </View>

            {/* Clinic List */}
            <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
                {filteredClinics.length > 0 ? (
                    filteredClinics.map((clinic, index) => (
                        <Animated.View
                            key={clinic.id}
                            entering={FadeInDown.duration(500).delay(index * 100)}
                        >
                            <Link href={`/clinic/${clinic.id}`} asChild>
                                <Pressable>
                                    <GlassView style={styles.clinicCard} border intensity={80}>
                                        <Image source={{ uri: clinic.image }} style={styles.clinicImage} />

                                        <View style={styles.clinicContent}>
                                            <View style={styles.rowBetween}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.clinicName}>{clinic.name}</Text>
                                                    <Text style={styles.doctorName}>{clinic.doctor}</Text>
                                                </View>
                                                <View style={styles.ratingBadge}>
                                                    <Ionicons name="star" size={10} color="#F59E0B" />
                                                    <Text style={styles.ratingText}>{clinic.rating}</Text>
                                                </View>
                                            </View>

                                            <View style={styles.clinicFooter}>
                                                <View style={styles.infoRow}>
                                                    <Text style={styles.detailText}>{clinic.specialty}</Text>
                                                    <View style={styles.dot} />
                                                    <Text style={styles.detailText}>{clinic.distance}</Text>
                                                </View>

                                                <StatusBadge
                                                    status={getStatus(clinic.waitTimeMin) as any}
                                                    text={getWaitLabel(clinic.waitTimeMin)}
                                                />
                                            </View>
                                        </View>
                                    </GlassView>
                                </Pressable>
                            </Link>
                        </Animated.View>
                    ))
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
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
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
    filterToggleBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
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
