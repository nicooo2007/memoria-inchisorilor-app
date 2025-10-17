import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../src/constants/colors';
import Typography from '../../src/constants/typography';
import Layout from '../../src/constants/layout';
import Card from '../../src/components/ui/Card';
import Badge from '../../src/components/ui/Badge';
import Button from '../../src/components/ui/Button';
import { fetchPrisonById, fetchVictims, fetchTestimonies } from '../../src/services/api';
import { Prison, Victim, Testimony } from '../../src/types';

const { width } = Dimensions.get('window');

export default function PrisonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [prison, setPrison] = useState<Prison | null>(null);
  const [victims, setVictims] = useState<Victim[]>([]);
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'history' | 'victims' | 'testimonies' | 'visit'>('history');

  useEffect(() => {
    loadPrisonData();
  }, [id]);

  const loadPrisonData = async () => {
    try {
      const [prisonData, victimsData, testimoniesData] = await Promise.all([
        fetchPrisonById(id),
        fetchVictims(id),
        fetchTestimonies(id),
      ]);
      setPrison(prisonData);
      setVictims(victimsData);
      setTestimonies(testimoniesData);
    } catch (error) {
      console.error('Failed to load prison data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      memorial: Colors.successGreen,
      prison: Colors.communistRed,
      camp: Colors.warningYellow,
    };
    return colors[type] || Colors.communistRed;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      memorial: 'Memorial',
      prison: 'Închisoare',
      camp: 'Tabără',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.communistRed} />
        <Text style={styles.loadingText}>Încărcare date...</Text>
      </View>
    );
  }

  if (!prison) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color={Colors.errorRed} />
        <Text style={styles.errorText}>Închisoarea nu a fost găsită</Text>
        <Button title="Înapoi" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Hero Section */}
      <View style={[styles.hero, { borderColor: getTypeColor(prison.type) }]}>
        <View style={[styles.heroIcon, { borderColor: getTypeColor(prison.type) }]}>
          <Ionicons
            name={prison.type === 'memorial' ? 'shield-checkmark' : 'lock-closed'}
            size={48}
            color={getTypeColor(prison.type)}
          />
        </View>
        <Text style={styles.heroTitle}>{prison.name}</Text>
        <Badge label={getTypeLabel(prison.type)} variant="default" />
        
        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{prison.operational_years[0]}-{prison.operational_years[1]}</Text>
            <Text style={styles.statLabel}>Ani Funcționare</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>~{prison.estimated_victims.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Victime</Text>
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.tabActive]}
          onPress={() => setActiveTab('history')}
        >
          <Ionicons name="time" size={20} color={activeTab === 'history' ? Colors.communistRed : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>Istorie</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'victims' && styles.tabActive]}
          onPress={() => setActiveTab('victims')}
        >
          <Ionicons name="people" size={20} color={activeTab === 'victims' ? Colors.communistRed : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'victims' && styles.tabTextActive]}>Victime</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'testimonies' && styles.tabActive]}
          onPress={() => setActiveTab('testimonies')}
        >
          <Ionicons name="chatbox" size={20} color={activeTab === 'testimonies' ? Colors.communistRed : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'testimonies' && styles.tabTextActive]}>Mărturii</Text>
        </TouchableOpacity>
        {prison.visit_info && (
          <TouchableOpacity
            style={[styles.tab, activeTab === 'visit' && styles.tabActive]}
            onPress={() => setActiveTab('visit')}
          >
            <Ionicons name="information-circle" size={20} color={activeTab === 'visit' ? Colors.communistRed : Colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'visit' && styles.tabTextActive]}>Vizită</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {activeTab === 'history' && (
          <View>
            {/* Description */}
            <Card style={styles.descriptionCard}>
              <Text style={styles.description}>{prison.description}</Text>
            </Card>

            {/* Timeline */}
            {prison.history_timeline && prison.history_timeline.length > 0 && (
              <Card style={styles.timelineCard}>
                <Text style={styles.sectionTitle}>CRONOLOGIE</Text>
                {prison.history_timeline.map((event, index) => (
                  <View key={index} style={styles.timelineItem}>
                    <View style={styles.timelineDot} />
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineDate}>{event.date}</Text>
                      <Text style={styles.timelineTitle}>{event.title}</Text>
                      <Text style={styles.timelineDescription}>{event.description}</Text>
                    </View>
                  </View>
                ))}
              </Card>
            )}
          </View>
        )}

        {activeTab === 'victims' && (
          <View>
            {victims.length > 0 ? (
              victims.map((victim) => (
                <TouchableOpacity
                  key={victim.id || victim._id}
                  onPress={() => router.push(`/victim/${victim.id || victim._id}`)}
                  activeOpacity={0.8}
                >
                  <Card style={styles.victimCard}>
                    <View style={styles.victimHeader}>
                      <View style={styles.victimAvatar}>
                        <Ionicons name="person" size={28} color={Colors.communistRed} />
                      </View>
                      <View style={styles.victimInfo}>
                        <Text style={styles.victimName}>{victim.name}</Text>
                        <Text style={styles.victimProfession}>{victim.profession}</Text>
                        {victim.birth_year && victim.death_year && (
                          <Text style={styles.victimYears}>
                            {victim.birth_year} - {victim.death_year}
                          </Text>
                        )}
                      </View>
                      <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
                    </View>
                    <Text style={styles.victimBio} numberOfLines={2}>
                      {victim.biography}
                    </Text>
                  </Card>
                </TouchableOpacity>
              ))
            ) : (
              <Card style={styles.emptyCard}>
                <Ionicons name="people-outline" size={48} color={Colors.textSecondary} />
                <Text style={styles.emptyText}>Nu există victime înregistrate</Text>
              </Card>
            )}
          </View>
        )}

        {activeTab === 'testimonies' && (
          <View>
            {testimonies.length > 0 ? (
              testimonies.map((testimony, index) => (
                <Card key={testimony.id || testimony._id || index} style={styles.testimonyCard}>
                  <View style={styles.quoteIcon}>
                    <Ionicons name="chatbox-ellipses" size={24} color={Colors.communistRed} />
                  </View>
                  <Text style={styles.testimonyText}>"{testimony.text}"</Text>
                  <View style={styles.testimonyFooter}>
                    <Text style={styles.testimonySource}>{testimony.source}</Text>
                    <Text style={styles.testimonyYear}>{testimony.year}</Text>
                  </View>
                </Card>
              ))
            ) : (
              <Card style={styles.emptyCard}>
                <Ionicons name="chatbox-outline" size={48} color={Colors.textSecondary} />
                <Text style={styles.emptyText}>Nu există mărturii disponibile</Text>
              </Card>
            )}
          </View>
        )}

        {activeTab === 'visit' && prison.visit_info && (
          <View>
            <Card style={styles.visitCard}>
              <View style={styles.visitRow}>
                <Ionicons name="location" size={24} color={Colors.communistRed} />
                <View style={styles.visitInfo}>
                  <Text style={styles.visitLabel}>Adresă</Text>
                  <Text style={styles.visitValue}>{prison.visit_info.address}</Text>
                </View>
              </View>
              {prison.visit_info.schedule && (
                <View style={styles.visitRow}>
                  <Ionicons name="time" size={24} color={Colors.communistRed} />
                  <View style={styles.visitInfo}>
                    <Text style={styles.visitLabel}>Program</Text>
                    <Text style={styles.visitValue}>{prison.visit_info.schedule}</Text>
                  </View>
                </View>
              )}
              {prison.visit_info.price && (
                <View style={styles.visitRow}>
                  <Ionicons name="pricetag" size={24} color={Colors.communistRed} />
                  <View style={styles.visitInfo}>
                    <Text style={styles.visitLabel}>Preț</Text>
                    <Text style={styles.visitValue}>{prison.visit_info.price}</Text>
                  </View>
                </View>
              )}
              {prison.visit_info.contact && (
                <>
                  {prison.visit_info.contact.phone && (
                    <View style={styles.visitRow}>
                      <Ionicons name="call" size={24} color={Colors.communistRed} />
                      <View style={styles.visitInfo}>
                        <Text style={styles.visitLabel}>Telefon</Text>
                        <Text style={styles.visitValue}>{prison.visit_info.contact.phone}</Text>
                      </View>
                    </View>
                  )}
                  {prison.visit_info.contact.email && (
                    <View style={styles.visitRow}>
                      <Ionicons name="mail" size={24} color={Colors.communistRed} />
                      <View style={styles.visitInfo}>
                        <Text style={styles.visitLabel}>Email</Text>
                        <Text style={styles.visitValue}>{prison.visit_info.contact.email}</Text>
                      </View>
                    </View>
                  )}
                </>
              )}
            </Card>
          </View>
        )}
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
  hero: {
    padding: Layout.spacing.xl,
    backgroundColor: Colors.darkGray,
    alignItems: 'center',
    borderBottomWidth: 3,
  },
  heroIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.mediumGray,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  heroTitle: {
    fontSize: Typography.h2,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Layout.spacing.sm,
  },
  quickStats: {
    flexDirection: 'row',
    marginTop: Layout.spacing.lg,
    backgroundColor: Colors.mediumGray,
    borderRadius: Layout.borderRadius.sm,
    padding: Layout.spacing.md,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: Typography.h3,
    fontWeight: 'bold',
    color: Colors.communistRed,
  },
  statLabel: {
    fontSize: Typography.small,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.borderLight,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.darkGray,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Layout.spacing.xs,
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.communistRed,
  },
  tabText: {
    fontSize: Typography.small,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: Colors.communistRed,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxl,
  },
  descriptionCard: {
    marginBottom: Layout.spacing.md,
  },
  description: {
    fontSize: Typography.body,
    color: Colors.text,
    lineHeight: Typography.body * Typography.lineHeightRelaxed,
  },
  timelineCard: {
    marginBottom: Layout.spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.body,
    fontWeight: 'bold',
    color: Colors.white,
    letterSpacing: Typography.letterSpacingWide,
    marginBottom: Layout.spacing.md,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.lg,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.communistRed,
    marginTop: 4,
    marginRight: Layout.spacing.md,
  },
  timelineContent: {
    flex: 1,
  },
  timelineDate: {
    fontSize: Typography.h4,
    fontWeight: 'bold',
    color: Colors.communistRed,
    marginBottom: Layout.spacing.xs,
  },
  timelineTitle: {
    fontSize: Typography.body,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: Layout.spacing.xs,
  },
  timelineDescription: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: Typography.bodySmall * Typography.lineHeightNormal,
  },
  victimCard: {
    marginBottom: Layout.spacing.md,
  },
  victimHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  victimAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
  },
  victimProfession: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.xs,
  },
  victimYears: {
    fontSize: Typography.small,
    color: Colors.communistRed,
    marginTop: Layout.spacing.xs,
  },
  victimBio: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: Typography.bodySmall * Typography.lineHeightNormal,
  },
  testimonyCard: {
    marginBottom: Layout.spacing.md,
    backgroundColor: Colors.mediumGray,
  },
  quoteIcon: {
    marginBottom: Layout.spacing.sm,
  },
  testimonyText: {
    fontSize: Typography.body,
    color: Colors.text,
    fontStyle: 'italic',
    lineHeight: Typography.body * Typography.lineHeightRelaxed,
    marginBottom: Layout.spacing.md,
  },
  testimonyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  testimonySource: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
  },
  testimonyYear: {
    fontSize: Typography.bodySmall,
    color: Colors.communistRed,
  },
  visitCard: {
    gap: Layout.spacing.lg,
  },
  visitRow: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
  },
  visitInfo: {
    flex: 1,
  },
  visitLabel: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Layout.spacing.xs,
  },
  visitValue: {
    fontSize: Typography.body,
    color: Colors.white,
  },
  emptyCard: {
    alignItems: 'center',
    padding: Layout.spacing.xl,
  },
  emptyText: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.md,
  },
});