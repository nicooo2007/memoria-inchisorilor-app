import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../src/constants/colors';
import Typography from '../../src/constants/typography';
import Layout from '../../src/constants/layout';
import Card from '../../src/components/ui/Card';
import { fetchVictims } from '../../src/services/api';
import { Victim } from '../../src/types';

export default function VictimsScreen() {
  const router = useRouter();
  const [victims, setVictims] = useState<Victim[]>([]);
  const [filteredVictims, setFilteredVictims] = useState<Victim[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadVictims();
  }, []);

  useEffect(() => {
    filterVictims();
  }, [victims, searchQuery]);

  const loadVictims = async () => {
    try {
      const data = await fetchVictims();
      setVictims(data);
    } catch (error) {
      console.error('Failed to load victims:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterVictims = () => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = victims.filter(victim =>
        victim.name.toLowerCase().includes(query) ||
        victim.profession.toLowerCase().includes(query)
      );
      setFilteredVictims(filtered);
    } else {
      setFilteredVictims(victims);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadVictims();
  };

  const renderVictimCard = ({ item }: { item: Victim }) => (
    <TouchableOpacity
      onPress={() => router.push(`/victim/${item.id || item._id}`)}
      activeOpacity={0.8}
    >
      <Card style={styles.victimCard}>
        <View style={styles.victimHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={32} color={Colors.communistRed} />
          </View>
          <View style={styles.victimInfo}>
            <Text style={styles.victimName}>{item.name}</Text>
            <Text style={styles.victimProfession}>{item.profession}</Text>
            {item.birth_year && item.death_year && (
              <Text style={styles.victimYears}>
                {item.birth_year} - {item.death_year}
              </Text>
            )}
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
        </View>

        <Text style={styles.victimBio} numberOfLines={2}>
          {item.biography}
        </Text>

        <View style={styles.victimFooter}>
          <View style={styles.imprisonmentTag}>
            <Ionicons name="lock-closed" size={14} color={Colors.communistRed} />
            <Text style={styles.imprisonmentText}>
              {item.imprisonment_period.start}
              {item.imprisonment_period.end && ` - ${item.imprisonment_period.end}`}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.communistRed} />
        <Text style={styles.loadingText}>Încărcare victime...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BAZĂ DATE VICTIME</Text>
        <Text style={styles.headerSubtitle}>
          Memorial al victimelor regimului comunist
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Caută după nume sau profesie..."
          placeholderTextColor={Colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Stats Card */}
      <Card style={styles.statsCard}>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{victims.length}</Text>
            <Text style={styles.statLabel}>Victime înregistrate</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>15,000+</Text>
            <Text style={styles.statLabel}>Total estimate</Text>
          </View>
        </View>
      </Card>

      {/* Victims List */}
      <FlatList
        data={filteredVictims}
        keyExtractor={item => item.id || item._id || Math.random().toString()}
        renderItem={renderVictimCard}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.communistRed}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>Nicio victimă găsită</Text>
          </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkGray,
    borderRadius: Layout.borderRadius.sm,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    margin: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  searchInput: {
    flex: 1,
    marginLeft: Layout.spacing.sm,
    color: Colors.text,
    fontSize: Typography.body,
  },
  statsCard: {
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
    backgroundColor: Colors.mediumGray,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: Typography.h2,
    fontWeight: 'bold',
    color: Colors.communistRed,
  },
  statLabel: {
    fontSize: Typography.small,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.xs,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.borderLight,
  },
  listContainer: {
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxl,
  },
  victimCard: {
    marginBottom: Layout.spacing.md,
  },
  victimHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.mediumGray,
    borderWidth: 2,
    borderColor: Colors.communistRed,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  victimInfo: {
    flex: 1,
  },
  victimName: {
    fontSize: Typography.body,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: Layout.spacing.xs,
  },
  victimProfession: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Layout.spacing.xs,
  },
  victimYears: {
    fontSize: Typography.small,
    color: Colors.communistRed,
  },
  victimBio: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: Typography.bodySmall * Typography.lineHeightNormal,
    marginBottom: Layout.spacing.md,
  },
  victimFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imprisonmentTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
    backgroundColor: Colors.mediumGray,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
  },
  imprisonmentText: {
    fontSize: Typography.small,
    color: Colors.communistRed,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.spacing.xxl,
  },
  emptyText: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.md,
  },
});