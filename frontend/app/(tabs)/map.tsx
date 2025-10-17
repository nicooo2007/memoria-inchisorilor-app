import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../src/constants/colors';
import Typography from '../../src/constants/typography';
import Layout from '../../src/constants/layout';
import Card from '../../src/components/ui/Card';
import Badge from '../../src/components/ui/Badge';
import { fetchPrisons } from '../../src/services/api';
import { Prison } from '../../src/types';

export default function MapScreen() {
  const router = useRouter();
  const [prisons, setPrisons] = useState<Prison[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const prisonTypes = [
    { key: null, label: 'Toate', icon: 'apps' },
    { key: 'memorial', label: 'Memorialuri', icon: 'shield-checkmark' },
    { key: 'prison', label: 'Închisori', icon: 'lock-closed' },
    { key: 'camp', label: 'Tabere', icon: 'warning' },
  ];

  useEffect(() => {
    loadPrisons();
  }, []);

  const loadPrisons = async () => {
    try {
      const data = await fetchPrisons();
      setPrisons(data);
    } catch (error) {
      console.error('Failed to load prisons:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPrisons();
  };

  const filteredPrisons = selectedType
    ? prisons.filter(p => p.type === selectedType)
    : prisons;

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      memorial: 'Memorial',
      prison: 'Închisoare',
      camp: 'Tabere',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      memorial: Colors.successGreen,
      prison: Colors.communistRed,
      camp: Colors.warningYellow,
    };
    return colors[type] || Colors.communistRed;
  };

  const renderPrisonCard = ({ item }: { item: Prison }) => (
    <TouchableOpacity
      onPress={() => router.push(`/prison/${item.id || item._id}`)}
      activeOpacity={0.8}
    >
      <Card style={styles.prisonCard}>
        <View style={styles.prisonHeader}>
          <View
            style={[
              styles.iconContainer,
              { borderColor: getTypeColor(item.type) },
            ]}
          >
            <Ionicons
              name={item.type === 'memorial' ? 'shield-checkmark' : 'lock-closed'}
              size={28}
              color={getTypeColor(item.type)}
            />
          </View>
          <View style={styles.prisonInfo}>
            <Text style={styles.prisonName} numberOfLines={2}>
              {item.name}
            </Text>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={14} color={Colors.textSecondary} />
              <Text style={styles.locationText}>
                {item.coordinates.latitude.toFixed(2)}°N,{' '}
                {item.coordinates.longitude.toFixed(2)}°E
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.prisonDescription} numberOfLines={3}>
          {item.description}
        </Text>

        <View style={styles.prisonFooter}>
          <Badge label={getTypeLabel(item.type)} variant="default" />
          <View style={styles.victimsTag}>
            <Ionicons name="people" size={14} color={Colors.textSecondary} />
            <Text style={styles.victimsText}>
              ~{item.estimated_victims.toLocaleString()} victime
            </Text>
          </View>
        </View>

        {item.visit_info && (
          <View style={styles.visitBanner}>
            <Ionicons name="information-circle" size={16} color={Colors.successGreen} />
            <Text style={styles.visitText}>Deschis vizitatorilor</Text>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.communistRed} />
        <Text style={styles.loadingText}>Încărcare locații...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>HARTĂ ÎNCHISORI</Text>
        <Text style={styles.headerSubtitle}>
          Locuri de detenție din perioada comunistă
        </Text>
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapPlaceholder}>
        <Ionicons name="map" size={48} color={Colors.textSecondary} />
        <Text style={styles.mapPlaceholderText}>
          Hartă interactivă va fi disponibilă în curând
        </Text>
        <Text style={styles.mapPlaceholderSubtext}>
          Momentan puteți vedea lista închisorilor mai jos
        </Text>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        {prisonTypes.map(type => (
          <TouchableOpacity
            key={type.key || 'all'}
            style={[
              styles.filterChip,
              selectedType === type.key && styles.filterChipActive,
            ]}
            onPress={() => setSelectedType(type.key)}
          >
            <Ionicons
              name={type.icon as any}
              size={16}
              color={
                selectedType === type.key ? Colors.white : Colors.textSecondary
              }
            />
            <Text
              style={[
                styles.filterChipText,
                selectedType === type.key && styles.filterChipTextActive,
              ]}
            >
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Prisons List */}
      <FlatList
        data={filteredPrisons}
        keyExtractor={item => item.id || item._id || Math.random().toString()}
        renderItem={renderPrisonCard}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.communistRed}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: Layout.spacing.md,
    color: Colors.textSecondary,
    fontSize: Typography.body,
  },
  header: {
    padding: Layout.spacing.lg,
    backgroundColor: Colors.darkGray,
    borderBottomWidth: 2,
    borderBottomColor: Colors.communistRed,
  },
  headerTitle: {
    fontSize: Typography.h2,
    fontWeight: 'bold',
    color: Colors.white,
    letterSpacing: Typography.letterSpacingWide,
  },
  headerSubtitle: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.xs,
  },
  mapPlaceholder: {
    backgroundColor: Colors.darkGray,
    padding: Layout.spacing.xl,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  mapPlaceholderText: {
    fontSize: Typography.body,
    color: Colors.text,
    marginTop: Layout.spacing.md,
    textAlign: 'center',
  },
  mapPlaceholderSubtext: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.xs,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: Layout.spacing.md,
    gap: Layout.spacing.sm,
    flexWrap: 'wrap',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.full,
    backgroundColor: Colors.darkGray,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  filterChipActive: {
    backgroundColor: Colors.communistRed,
    borderColor: Colors.communistRed,
  },
  filterChipText: {
    fontSize: Typography.small,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: Colors.white,
  },
  listContainer: {
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxl,
  },
  prisonCard: {
    marginBottom: Layout.spacing.md,
  },
  prisonHeader: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.md,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: Layout.borderRadius.sm,
    backgroundColor: Colors.mediumGray,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  prisonInfo: {
    flex: 1,
  },
  prisonName: {
    fontSize: Typography.body,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: Layout.spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  locationText: {
    fontSize: Typography.small,
    color: Colors.textSecondary,
  },
  prisonDescription: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: Typography.bodySmall * Typography.lineHeightNormal,
    marginBottom: Layout.spacing.md,
  },
  prisonFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  victimsTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  victimsText: {
    fontSize: Typography.small,
    color: Colors.textSecondary,
  },
  visitBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
    marginTop: Layout.spacing.md,
    paddingTop: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  visitText: {
    fontSize: Typography.bodySmall,
    color: Colors.successGreen,
    fontWeight: '600',
  },
});