import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../src/constants/colors';
import Typography from '../../src/constants/typography';
import Layout from '../../src/constants/layout';
import Card from '../../src/components/ui/Card';
import Badge from '../../src/components/ui/Badge';
import Button from '../../src/components/ui/Button';
import { fetchPrisons } from '../../src/services/api';
import { Prison } from '../../src/types';

export default function MapScreen() {
  const router = useRouter();
  const [prisons, setPrisons] = useState<Prison[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrison, setSelectedPrison] = useState<Prison | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

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
    }
  };

  const filteredPrisons = selectedType
    ? prisons.filter(p => p.type === selectedType)
    : prisons;

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

  const handleMarkerPress = (prison: Prison) => {
    setSelectedPrison(prison);
    setShowModal(true);
  };

  const renderPrisonListItem = ({ item }: { item: Prison }) => (
    <TouchableOpacity
      onPress={() => handleMarkerPress(item)}
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
        <View style={styles.prisonFooter}>
          <Badge label={getTypeLabel(item.type)} variant="default" />
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.communistRed} />
        <Text style={styles.loadingText}>Încărcare hartă...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={filteredPrisons}
        keyExtractor={item => item.id || item._id || Math.random().toString()}
        renderItem={renderPrisonListItem}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <View style={styles.webHeader}>
            <Ionicons name="map" size={48} color={Colors.communistRed} />
            <Text style={styles.webHeaderText}>
              Listă Închisori
            </Text>
            <Text style={styles.webHeaderSubtext}>
              Harta interactivă este disponibilă în aplicația mobilă
            </Text>
          </View>
        }
      />

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>HARTĂ ÎNCHISORI</Text>
          <Text style={styles.headerSubtitle}>{filteredPrisons.length} locații</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                color={selectedType === type.key ? Colors.white : Colors.textSecondary}
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
        </ScrollView>
      </View>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedPrison && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleContainer}>
                    <View style={[styles.modalIcon, { borderColor: getTypeColor(selectedPrison.type) }]}>
                      <Ionicons
                        name={selectedPrison.type === 'memorial' ? 'shield-checkmark' : 'lock-closed'}
                        size={32}
                        color={getTypeColor(selectedPrison.type)}
                      />
                    </View>
                    <View style={styles.modalTitleText}>
                      <Text style={styles.modalTitle}>{selectedPrison.name}</Text>
                      <Badge label={getTypeLabel(selectedPrison.type)} variant="default" />
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => setShowModal(false)}
                    style={styles.closeButton}
                  >
                    <Ionicons name="close" size={28} color={Colors.white} />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody}>
                  <Text style={styles.description}>{selectedPrison.description}</Text>
                </ScrollView>

                <View style={styles.modalFooter}>
                  <Button
                    title="DETALII COMPLETE"
                    onPress={() => {
                      setShowModal(false);
                      router.push(`/prison/${selectedPrison.id || selectedPrison._id}`);
                    }}
                    style={styles.footerButton}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    borderBottomWidth: 2,
    borderBottomColor: Colors.communistRed,
  },
  headerContent: {
    padding: Layout.spacing.md,
  },
  headerTitle: {
    fontSize: Typography.h3,
    fontWeight: 'bold',
    color: Colors.white,
    letterSpacing: Typography.letterSpacingWide,
  },
  headerSubtitle: {
    fontSize: Typography.small,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.xs,
  },
  filterContainer: {
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.full,
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginRight: Layout.spacing.sm,
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
    paddingTop: 160,
  },
  webHeader: {
    alignItems: 'center',
    padding: Layout.spacing.xl,
    marginBottom: Layout.spacing.lg,
  },
  webHeaderText: {
    fontSize: Typography.h2,
    fontWeight: 'bold',
    color: Colors.white,
    marginTop: Layout.spacing.md,
  },
  webHeaderSubtext: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Layout.spacing.sm,
  },
  prisonCard: {
    marginBottom: Layout.spacing.md,
  },
  prisonHeader: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.sm,
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
  prisonFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.darkGray,
    borderTopLeftRadius: Layout.borderRadius.lg,
    borderTopRightRadius: Layout.borderRadius.lg,
    maxHeight: '80%',
    borderTopWidth: 3,
    borderTopColor: Colors.communistRed,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: Layout.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    flex: 1,
    gap: Layout.spacing.md,
  },
  modalIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.mediumGray,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitleText: {
    flex: 1,
    gap: Layout.spacing.sm,
  },
  modalTitle: {
    fontSize: Typography.h3,
    fontWeight: 'bold',
    color: Colors.white,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    padding: Layout.spacing.lg,
  },
  description: {
    fontSize: Typography.body,
    color: Colors.text,
    lineHeight: Typography.body * Typography.lineHeightRelaxed,
    marginBottom: Layout.spacing.md,
  },
  modalFooter: {
    padding: Layout.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  footerButton: {
    width: '100%',
  },
});
