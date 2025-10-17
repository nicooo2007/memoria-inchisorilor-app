import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../src/constants/colors';
import Typography from '../../src/constants/typography';
import Layout from '../../src/constants/layout';
import Card from '../../src/components/ui/Card';
import Button from '../../src/components/ui/Button';
import { fetchVictimById } from '../../src/services/api';
import { Victim } from '../../src/types';

export default function VictimDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [victim, setVictim] = useState<Victim | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVictim();
  }, [id]);

  const loadVictim = async () => {
    try {
      const data = await fetchVictimById(id);
      setVictim(data);
    } catch (error) {
      console.error('Failed to load victim:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.communistRed} />
        <Text style={styles.loadingText}>Încărcare date...</Text>
      </View>
    );
  }

  if (!victim) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color={Colors.errorRed} />
        <Text style={styles.errorText}>Victima nu a fost găsită</Text>
        <Button title="Înapoi" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.avatarLarge}>
            <Ionicons name="person" size={64} color={Colors.communistRed} />
          </View>
          <Text style={styles.name}>{victim.name}</Text>
          {victim.birth_year && victim.death_year && (
            <Text style={styles.years}>
              {victim.birth_year} - {victim.death_year} (vârstă: {victim.death_year - victim.birth_year} ani)
            </Text>
          )}
          <Text style={styles.profession}>{victim.profession}</Text>
        </View>

        {/* Imprisonment Period */}
        <Card style={styles.imprisonmentCard}>
          <View style={styles.imprisonmentHeader}>
            <Ionicons name="lock-closed" size={24} color={Colors.communistRed} />
            <Text style={styles.sectionTitle}>PERIOADĂ DE DETENȚIE</Text>
          </View>
          <View style={styles.imprisonmentInfo}>
            <View style={styles.imprisonmentRow}>
              <Text style={styles.imprisonmentLabel}>Început:</Text>
              <Text style={styles.imprisonmentValue}>{victim.imprisonment_period.start}</Text>
            </View>
            {victim.imprisonment_period.end && (
              <View style={styles.imprisonmentRow}>
                <Text style={styles.imprisonmentLabel}>Sfârșit:</Text>
                <Text style={styles.imprisonmentValue}>{victim.imprisonment_period.end}</Text>
              </View>
            )}
            {victim.imprisonment_period.start && victim.imprisonment_period.end && (
              <View style={styles.durationTag}>
                <Text style={styles.durationText}>
                  Durată: {parseInt(victim.imprisonment_period.end) - parseInt(victim.imprisonment_period.start)} ani
                </Text>
              </View>
            )}
          </View>
        </Card>

        {/* Biography */}
        <Card style={styles.biographyCard}>
          <Text style={styles.sectionTitle}>BIOGRAFIE</Text>
          <Text style={styles.biography}>{victim.biography}</Text>
        </Card>

        {/* Legacy Section */}
        <Card style={styles.legacyCard}>
          <View style={styles.legacyHeader}>
            <Ionicons name="heart" size={24} color={Colors.communistRed} />
            <Text style={styles.sectionTitle}>ÎN MEMORIA LUI {victim.name.split(' ')[0].toUpperCase()}</Text>
          </View>
          <Text style={styles.legacyText}>
            {victim.name} rămâne un simbol al rezistenței împotriva dictaturii comuniste.
            Sacrificiul și suferința sa nu trebuie uitate, pentru ca astăzi să putem trăi în libertate.
          </Text>
        </Card>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Ionicons name="calendar" size={32} color={Colors.communistRed} />
            <Text style={styles.statNumber}>
              {victim.birth_year && victim.death_year ? victim.death_year - victim.birth_year : 'N/A'}
            </Text>
            <Text style={styles.statLabel}>Ani de viață</Text>
          </Card>
          <Card style={styles.statCard}>
            <Ionicons name="time" size={32} color={Colors.communistRed} />
            <Text style={styles.statNumber}>
              {victim.imprisonment_period.start && victim.imprisonment_period.end
                ? parseInt(victim.imprisonment_period.end) - parseInt(victim.imprisonment_period.start)
                : 'N/A'}
            </Text>
            <Text style={styles.statLabel}>Ani de detenție</Text>
          </Card>
        </View>
      </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Layout.spacing.xl,
  },
  errorText: {
    fontSize: Typography.body,
    color: Colors.text,
    marginVertical: Layout.spacing.lg,
    textAlign: 'center',
  },
  content: {
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxl,
  },
  hero: {
    alignItems: 'center',
    backgroundColor: Colors.darkGray,
    padding: Layout.spacing.xl,
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.communistRed,
    marginBottom: Layout.spacing.lg,
  },
  avatarLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.mediumGray,
    borderWidth: 3,
    borderColor: Colors.communistRed,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  name: {
    fontSize: Typography.h2,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Layout.spacing.sm,
  },
  years: {
    fontSize: Typography.body,
    color: Colors.communistRed,
    marginBottom: Layout.spacing.xs,
  },
  profession: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  imprisonmentCard: {
    marginBottom: Layout.spacing.lg,
  },
  imprisonmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.body,
    fontWeight: 'bold',
    color: Colors.white,
    letterSpacing: Typography.letterSpacingWide,
  },
  imprisonmentInfo: {
    gap: Layout.spacing.md,
  },
  imprisonmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imprisonmentLabel: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
  },
  imprisonmentValue: {
    fontSize: Typography.body,
    fontWeight: 'bold',
    color: Colors.communistRed,
  },
  durationTag: {
    backgroundColor: Colors.mediumGray,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.sm,
    marginTop: Layout.spacing.sm,
  },
  durationText: {
    fontSize: Typography.body,
    color: Colors.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  biographyCard: {
    marginBottom: Layout.spacing.lg,
  },
  biography: {
    fontSize: Typography.body,
    color: Colors.text,
    lineHeight: Typography.body * Typography.lineHeightRelaxed,
  },
  legacyCard: {
    marginBottom: Layout.spacing.lg,
    backgroundColor: 'rgba(196, 30, 58, 0.1)',
    borderColor: Colors.communistRed,
  },
  legacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.md,
  },
  legacyText: {
    fontSize: Typography.body,
    color: Colors.text,
    lineHeight: Typography.body * Typography.lineHeightRelaxed,
    fontStyle: 'italic',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: Layout.spacing.lg,
  },
  statNumber: {
    fontSize: Typography.h2,
    fontWeight: 'bold',
    color: Colors.communistRed,
    marginVertical: Layout.spacing.sm,
  },
  statLabel: {
    fontSize: Typography.small,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});