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
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Colors from '@/constants/colors';
import { Layout } from '@/constants/layout';

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

const FILTERS = ['All', 'General', 'Dental', 'Skin', 'Cardio', 'Pediatric', 'Lab Tests', 'Open Now', 'Wait <30m'];

export default function SearchScreen() {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const filteredClinics = ALL_CLINICS.filter((clinic) => {
        const matchesSearch = clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            clinic.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
            clinic.specialty.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (activeFilter === 'General') return clinic.services.includes('general');
        if (activeFilter === 'Dental') return clinic.services.includes('dental');
        if (activeFilter === 'Skin') return clinic.services.includes('dermatology');
        if (activeFilter === 'Cardio') return clinic.services.includes('cardiology');
        if (activeFilter === 'Pediatric') return clinic.services.includes('pediatrics');
        if (activeFilter === 'Lab Tests') return clinic.services.includes('lab');
        if (activeFilter === 'Open Now') return clinic.tags.includes('Open Now');
        if (activeFilter === 'Wait <30m') return clinic.waitTimeMin < 30;

        return true;
    });

    const getStatusConfig = (mins: number) => {
        if (mins < 15) return { bg: Colors.successBg, text: Colors.success, dot: Colors.success, label: `<15m` };
        if (mins < 60) return { bg: Colors.warningBg, text: Colors.warning, dot: Colors.warning, label: `~${mins}m` };
        return { bg: Colors.dangerBg, text: Colors.danger, dot: Colors.danger, label: `1h+` };
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Explore Clinics</Text>
                <Text style={styles.headerSub}>Find the shortest queue near you</Text>
            </View>

            {/* Search */}
            <View style={styles.searchSection}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={18} color={Colors.textMuted} />
                    <TextInput
                        placeholder="Search clinics, doctors..."
                        placeholderTextColor={Colors.textMuted}
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <Pressable onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={16} color={Colors.textMuted} />
                        </Pressable>
                    )}
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterScroll}
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

            {/* Results count */}
            <View style={styles.resultsRow}>
                <Text style={styles.resultsText}>{filteredClinics.length} clinic{filteredClinics.length !== 1 ? 's' : ''} found</Text>
            </View>

            {/* Clinic List */}
            <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
                {filteredClinics.length > 0 ? (
                    filteredClinics.map((clinic, index) => {
                        const status = getStatusConfig(clinic.waitTimeMin);
                        return (
                            <Animated.View
                                key={clinic.id}
                                entering={FadeInDown.duration(400).delay(index * 80)}
                            >
                                <Link href={`/clinic/${clinic.id}` as any} asChild>
                                    <Pressable style={styles.clinicCard}>
                                        <Image source={{ uri: clinic.image }} style={styles.clinicImage} />

                                        <View style={styles.clinicContent}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <View style={{ flex: 1, marginRight: 8 }}>
                                                    <Text style={styles.clinicName}>{clinic.name}</Text>
                                                    <Text style={styles.clinicSpecialty}>{clinic.specialty} • {clinic.doctor}</Text>
                                                </View>
                                                <View style={styles.ratingBadge}>
                                                    <Ionicons name="star" size={10} color={Colors.smartAmber} />
                                                    <Text style={styles.ratingText}>{clinic.rating}</Text>
                                                </View>
                                            </View>

                                            <View style={styles.clinicFooter}>
                                                <View style={styles.distanceBadge}>
                                                    <Ionicons name="location-outline" size={11} color={Colors.textSecondary} />
                                                    <Text style={styles.distanceText}>{clinic.distance}</Text>
                                                </View>

                                                <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                                                    <View style={[styles.liveDot, { backgroundColor: status.dot }]} />
                                                    <Text style={[styles.statusText, { color: status.text }]}>Wait: {status.label}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </Pressable>
                                </Link>
                            </Animated.View>
                        );
                    })
                ) : (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIconWrap}>
                            <Ionicons name="search-outline" size={32} color={Colors.primary} />
                        </View>
                        <Text style={styles.emptyTitle}>No clinics found</Text>
                        <Text style={styles.emptyText}>Try a different search term or filter.</Text>
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
        paddingHorizontal: Layout.grid.margin,
        paddingTop: 8,
        paddingBottom: 12,
    },
    headerTitle: {
        fontFamily: 'Inter_700Bold',
        fontSize: 26,
        color: Colors.text,
        letterSpacing: -0.5,
    },
    headerSub: {
        fontFamily: 'Inter_400Regular',
        fontSize: 13,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    searchSection: {
        paddingBottom: 10,
        gap: 10,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginHorizontal: Layout.grid.margin,
        borderRadius: 16,
        gap: 10,
        borderWidth: 1.5,
        borderColor: Colors.border,
        ...Colors.shadows.sm,
    },
    searchInput: {
        flex: 1,
        fontFamily: 'Inter_500Medium',
        fontSize: 14,
        color: Colors.text,
    },
    filterScroll: {
        paddingHorizontal: Layout.grid.margin,
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Colors.surface,
        borderWidth: 1.5,
        borderColor: Colors.border,
    },
    activeFilterChip: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    filterText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 12,
        color: Colors.textSecondary,
    },
    activeFilterText: {
        color: '#fff',
    },
    resultsRow: {
        paddingHorizontal: Layout.grid.margin,
        paddingVertical: 8,
    },
    resultsText: {
        fontFamily: 'Inter_500Medium',
        fontSize: 12,
        color: Colors.textMuted,
    },
    listContent: {
        padding: Layout.grid.margin,
        paddingTop: 4,
        gap: 12,
        paddingBottom: 110,
    },
    clinicCard: {
        flexDirection: 'row',
        backgroundColor: Colors.surface,
        borderRadius: 18,
        padding: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        ...Colors.shadows.sm,
    },
    clinicImage: {
        width: 76,
        height: 76,
        borderRadius: 12,
        backgroundColor: Colors.borderLight,
    },
    clinicContent: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    clinicName: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 14,
        color: Colors.text,
        marginBottom: 2,
    },
    clinicSpecialty: {
        fontFamily: 'Inter_500Medium',
        fontSize: 11,
        color: Colors.textSecondary,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.warningBg,
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 6,
        gap: 2,
    },
    ratingText: {
        fontFamily: 'Inter_700Bold',
        fontSize: 10,
        color: Colors.smartAmber,
    },
    clinicFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    distanceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    distanceText: {
        fontFamily: 'Inter_500Medium',
        fontSize: 11,
        color: Colors.textMuted,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        gap: 5,
    },
    liveDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
    },
    statusText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 11,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
        gap: 12,
    },
    emptyIconWrap: {
        width: 60,
        height: 60,
        borderRadius: 20,
        backgroundColor: Colors.primaryBg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyTitle: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 16,
        color: Colors.text,
    },
    emptyText: {
        fontFamily: 'Inter_400Regular',
        fontSize: 13,
        color: Colors.textMuted,
    },
});
