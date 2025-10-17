import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../src/constants/colors';
import Typography from '../../src/constants/typography';
import Layout from '../../src/constants/layout';
import Card from '../../src/components/ui/Card';
import Badge from '../../src/components/ui/Badge';
import { fetchHistoricalTimeline } from '../../src/services/api';
import { HistoricalEvent } from '../../src/types';
import { format } from 'date-fns';

export default function HistoryScreen() {
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { key: null, label: 'Toate', icon: 'time' },
    { key: 'political', label: 'Politic', icon: 'flag' },
    { key: 'resistance', label: 'Rezistență', icon: 'shield' },
    { key: 'repression', label: 'Represiune', icon: 'warning' },
  ];

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await fetchHistoricalTimeline();
      setEvents(data);
    } catch (error) {
      console.error('Failed to load timeline:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadEvents();
  };

  const filteredEvents = selectedCategory
    ? events.filter(e => e.category === selectedCategory)
    : events;

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      political: Colors.communistRed,
      resistance: Colors.successGreen,
      repression: Colors.errorRed,
      commemoration: Colors.warningYellow,
    };
    return colors[category] || Colors.communistRed;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      political: 'Politic',
      resistance: 'Rezistență',
      repression: 'Represiune',
      commemoration: 'Comemorare',
    };
    return labels[category] || category;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.communistRed} />
        <Text style={styles.loadingText}>Încărcare cronologie...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CRONOLOGIE ISTORICĂ</Text>
        <Text style={styles.headerSubtitle}>
          1945-1989: Regimul Comunist în România
        </Text>
      </View>

      {/* Category Filters */}
      <View style={styles.categoryContainer}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.key || 'all'}
            style={[
              styles.categoryButton,
              selectedCategory === cat.key && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(cat.key)}
          >
            <Ionicons
              name={cat.icon as any}
              size={20}
              color={
                selectedCategory === cat.key ? Colors.white : Colors.textSecondary
              }
            />
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat.key && styles.categoryTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Timeline */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.timelineContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.communistRed}
          />
        }
      >
        {/* Context Section */}
        <Card style={styles.contextCard}>
          <View style={styles.contextHeader}>
            <Ionicons name="information-circle" size={24} color={Colors.communistRed} />
            <Text style={styles.contextTitle}>Context Istoric</Text>
          </View>
          <Text style={styles.contextText}>
            Între 1945 și 1989, România a fost guvernată de un regim comunist totalitar
            care a suprimat libertățile fundamentale și a persecutat opozanții politici.
            Zeci de mii de români au fost împrimați, torturați și uciși pentru convingerile
            lor politice, religioase sau pentru simpla disidență.
          </Text>
        </Card>

        {/* Timeline Events */}
        {filteredEvents.map((event, index) => (
          <View key={event.id || event._id || index} style={styles.timelineItem}>
            {/* Timeline Line */}
            <View style={styles.timelineLine}>
              <View
                style={[
                  styles.timelineDot,
                  { backgroundColor: getCategoryColor(event.category) },
                ]}
              />
              {index < filteredEvents.length - 1 && (
                <View style={styles.timelineConnector} />
              )}
            </View>

            {/* Event Card */}
            <Card style={styles.eventCard}>
              <View style={styles.eventHeader}>
                <Text style={styles.eventDate}>
                  {event.date}
                </Text>
                <Badge
                  label={getCategoryLabel(event.category)}
                  variant="default"
                />
              </View>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDescription}>{event.description}</Text>
            </Card>
          </View>
        ))}

        {/* Revolution Section */}
        <Card style={styles.revolutionCard}>
          <View style={styles.revolutionHeader}>
            <Ionicons name="flag" size={32} color={Colors.successGreen} />
            <Text style={styles.revolutionTitle}>REVOLUȚIA DIN 1989</Text>
          </View>
          <Text style={styles.revolutionText}>
            După 44 de ani de dictatură comunistă, poporul român s-a răsculat în decembrie
            1989, ducând la căderea regimului lui Nicolae Ceaușescu. Revoluția a marcat
            sfârșitul comunismului în România și începutul democraticării țării.
          </Text>
        </Card>
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
  categoryContainer: {
    flexDirection: 'row',
    padding: Layout.spacing.md,
    gap: Layout.spacing.sm,
    flexWrap: 'wrap',
  },
  categoryButton: {
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
  categoryButtonActive: {
    backgroundColor: Colors.communistRed,
    borderColor: Colors.communistRed,
  },
  categoryText: {
    fontSize: Typography.small,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  timelineContainer: {
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxl,
  },
  contextCard: {
    marginBottom: Layout.spacing.xl,
    backgroundColor: Colors.mediumGray,
  },
  contextHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.md,
  },
  contextTitle: {
    fontSize: Typography.h4,
    fontWeight: 'bold',
    color: Colors.white,
  },
  contextText: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: Typography.bodySmall * Typography.lineHeightRelaxed,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.lg,
  },
  timelineLine: {
    width: 40,
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: Colors.background,
  },
  timelineConnector: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.borderLight,
    marginTop: Layout.spacing.xs,
  },
  eventCard: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  eventDate: {
    fontSize: Typography.h4,
    fontWeight: 'bold',
    color: Colors.communistRed,
  },
  eventTitle: {
    fontSize: Typography.body,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: Layout.spacing.sm,
  },
  eventDescription: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: Typography.bodySmall * Typography.lineHeightNormal,
  },
  revolutionCard: {
    marginTop: Layout.spacing.xl,
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    borderColor: Colors.successGreen,
  },
  revolutionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
  },
  revolutionTitle: {
    fontSize: Typography.h3,
    fontWeight: 'bold',
    color: Colors.successGreen,
    letterSpacing: Typography.letterSpacingWide,
  },
  revolutionText: {
    fontSize: Typography.body,
    color: Colors.text,
    lineHeight: Typography.body * Typography.lineHeightRelaxed,
  },
});