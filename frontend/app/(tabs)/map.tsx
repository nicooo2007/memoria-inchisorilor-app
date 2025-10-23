import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../src/constants/colors';
import Typography from '../../src/constants/typography';
import Layout from '../../src/constants/layout';
import Card from '../../src/components/ui/Card';
import Badge from '../../src/components/ui/Badge';
import Button from '../../src/components/ui/Button';
import { fetchPrisons } from '../../src/services/api';
import { Prison } from '../../src/types';
import { calculateDistance, formatDistance } from '../../src/utils/helpers';

const ROMANIA_REGION = {
  latitude: 45.9432,
  longitude: 24.9668,
  latitudeDelta: 6,
  longitudeDelta: 6,
};

export default function MapScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const [prisons, setPrisons] = useState<Prison[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrison, setSelectedPrison] = useState<Prison | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
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
    getUserLocation();
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

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    } catch (error) {
      console.log('Location permission denied');
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
    
    // Center map on selected prison
    mapRef.current?.animateToRegion({
      latitude: prison.coordinates.latitude,
      longitude: prison.coordinates.longitude,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5,
    }, 500);
  };

  const resetMapView = () => {
    mapRef.current?.animateToRegion(ROMANIA_REGION, 1000);
  };

  const centerOnUserLocation = () => {
    if (userLocation) {
      mapRef.current?.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      }, 1000);
    }
  };

  const openInMaps = (prison: Prison) => {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${prison.coordinates.latitude},${prison.coordinates.longitude}`;
    const label = prison.name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    if (url) {
      Linking.openURL(url);
    }
  };

  const customMapStyle = [
    {
      "elementType": "geometry",
      "stylers": [{ "color": "#1a1a1a" }]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#8b8b8b" }]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#000000" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#333333" }]
    }
  ];

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
      {/* Map */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={ROMANIA_REGION}
        customMapStyle={customMapStyle}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {filteredPrisons.map((prison) => (
          <Marker
            key={prison.id || prison._id}
            coordinate={{
              latitude: prison.coordinates.latitude,
              longitude: prison.coordinates.longitude,
            }}
            onPress={() => handleMarkerPress(prison)}
          >
            <View style={[styles.marker, { backgroundColor: getTypeColor(prison.type) }]}>
              <Ionicons
                name={prison.type === 'memorial' ? 'shield-checkmark' : 'lock-closed'}
                size={20}
                color={Colors.white}
              />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>HARTĂ ÎNCHISORI</Text>
          <Text style={styles.headerSubtitle}>{filteredPrisons.length} locații</Text>
        </View>
      </View>

      {/* Filter Chips */}
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

      {/* Control Buttons */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={resetMapView}>
          <Ionicons name="locate" size={24} color={Colors.white} />
        </TouchableOpacity>
        {userLocation && (
          <TouchableOpacity style={styles.controlButton} onPress={centerOnUserLocation}>
            <Ionicons name="navigate" size={24} color={Colors.white} />
          </TouchableOpacity>
        )}
      </View>

      {/* Prison Detail Modal */}
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
                  <Card style={styles.statsCard}>
                    <View style={styles.statsRow}>
                      <View style={styles.statItem}>
                        <Text style={styles.statNumber}>
                          {selectedPrison.operational_years[0]}-{selectedPrison.operational_years[1]}
                        </Text>
                        <Text style={styles.statLabel}>Ani Funcționare</Text>
                      </View>
                      <View style={styles.statDivider} />
                      <View style={styles.statItem}>
                        <Text style={styles.statNumber}>
                          ~{selectedPrison.estimated_victims.toLocaleString()}
                        </Text>
                        <Text style={styles.statLabel}>Victime</Text>
                      </View>
                    </View>
                  </Card>

                  <Text style={styles.description}>{selectedPrison.description}</Text>

                  {userLocation && (
                    <Card style={styles.distanceCard}>
                      <View style={styles.distanceRow}>
                        <Ionicons name="navigate-circle" size={24} color={Colors.communistRed} />
                        <Text style={styles.distanceText}>
                          Distanță: {formatDistance(calculateDistance(
                            userLocation.latitude,
                            userLocation.longitude,
                            selectedPrison.coordinates.latitude,
                            selectedPrison.coordinates.longitude
                          ))}
                        </Text>
                      </View>
                    </Card>
                  )}

                  {selectedPrison.visit_info && (
                    <Card style={styles.visitCard}>
                      <Text style={styles.sectionTitle}>INFORMAȚII VIZITĂ</Text>
                      <View style={styles.visitRow}>
                        <Ionicons name="location" size={20} color={Colors.communistRed} />
                        <Text style={styles.visitText}>{selectedPrison.visit_info.address}</Text>
                      </View>
                      {selectedPrison.visit_info.schedule && (
                        <View style={styles.visitRow}>
                          <Ionicons name="time" size={20} color={Colors.communistRed} />
                          <Text style={styles.visitText}>{selectedPrison.visit_info.schedule}</Text>
                        </View>
                      )}
                    </Card>
                  )}
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
                  <Button
                    title="NAVIGARE"
                    onPress={() => openInMaps(selectedPrison)}
                    variant="secondary"
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