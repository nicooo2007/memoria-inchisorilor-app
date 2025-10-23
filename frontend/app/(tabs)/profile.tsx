import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../src/constants/colors';
import Typography from '../../src/constants/typography';
import Layout from '../../src/constants/layout';
import Card from '../../src/components/ui/Card';
import { useUserStore } from '../../src/store/userStore';

export default function ProfileScreen() {
  const router = useRouter();
  const {
    visitedPrisons,
    scannedQRs,
    readDocuments,
    listenedTestimonies,
    badges,
    loadProgress,
  } = useUserStore();

  useEffect(() => {
    loadProgress();
  }, []);

  const getBadgeInfo = (badgeId: string) => {
    const badgeData: Record<string, { name: string; icon: any; description: string }> = {
      explorer: {
        name: 'Explorator',
        icon: 'map',
        description: 'Vizitează 3+ închisori',
      },
      scholar: {
        name: 'Student de Istorie',
        icon: 'school',
        description: 'Citește 10+ documente',
      },
      qr_master: {
        name: 'Memorialist',
        icon: 'qr-code',
        description: 'Scanează 5+ coduri QR',
      },
    };
    return badgeData[badgeId] || { name: badgeId, icon: 'medal', description: '' };
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={48} color={Colors.communistRed} />
          </View>
          <Text style={styles.headerTitle}>Utilizator</Text>
          <Text style={styles.headerSubtitle}>Explorator Memorial</Text>
        </View>

        {/* Stats Card */}
        <Card style={styles.statsCard}>
          <Text style={styles.sectionTitle}>STATISTICI</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="map" size={24} color={Colors.communistRed} />
              <Text style={styles.statNumber}>{visitedPrisons.length}</Text>
              <Text style={styles.statLabel}>Închisori vizitate</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="qr-code" size={24} color={Colors.communistRed} />
              <Text style={styles.statNumber}>{scannedQRs.length}</Text>
              <Text style={styles.statLabel}>QR-uri scanate</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="documents" size={24} color={Colors.communistRed} />
              <Text style={styles.statNumber}>{readDocuments.length}</Text>
              <Text style={styles.statLabel}>Documente citite</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="headset" size={24} color={Colors.communistRed} />
              <Text style={styles.statNumber}>{listenedTestimonies.length}</Text>
              <Text style={styles.statLabel}>Mărturii ascultate</Text>
            </View>
          </View>
        </Card>

        {/* Badges Section */}
        <Card style={styles.badgesCard}>
          <Text style={styles.sectionTitle}>INSIGNE</Text>
          <Text style={styles.emptyBadgesText}>
            Explorează memorialele și colectează insigne pentru activitățile tale
          </Text>
          <View style={styles.badgesGrid}>
            <View style={styles.lockedBadge}>
              <Ionicons name="medal" size={32} color={Colors.textSecondary} />
              <Text style={styles.lockedBadgeText}>Explorator</Text>
            </View>
            <View style={styles.lockedBadge}>
              <Ionicons name="school" size={32} color={Colors.textSecondary} />
              <Text style={styles.lockedBadgeText}>Student</Text>
            </View>
            <View style={styles.lockedBadge}>
              <Ionicons name="book" size={32} color={Colors.textSecondary} />
              <Text style={styles.lockedBadgeText}>Memorialist</Text>
            </View>
          </View>
        </Card>

        {/* Menu Options */}
        <Card style={styles.menuCard}>
          <Text style={styles.sectionTitle}>SETĂRI</Text>
          <MenuItem
            icon="notifications-outline"
            label="Notificări"
            onPress={() => {}}
          />
          <MenuItem
            icon="language-outline"
            label="Limbă"
            onPress={() => {}}
          />
          <MenuItem
            icon="contrast-outline"
            label="Mod Ecran"
            onPress={() => {}}
          />
          <MenuItem
            icon="text-outline"
            label="Dimensiune Font"
            onPress={() => {}}
          />
        </Card>

        {/* Info Card */}
        <Card style={styles.menuCard}>
          <Text style={styles.sectionTitle}>INFORMAȚII</Text>
          <MenuItem
            icon="information-circle-outline"
            label="Despre Aplicație"
            onPress={() => {}}
          />
          <MenuItem
            icon="shield-checkmark-outline"
            label="Politica de Confidențialitate"
            onPress={() => {}}
          />
          <MenuItem
            icon="help-circle-outline"
            label="Ajutor și Suport"
            onPress={() => {}}
          />
        </Card>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Memorial Gherla v1.0.0
          </Text>
          <Text style={styles.footerSubtext}>
            În memoria victimelor regimului comunist
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <Ionicons name={icon} size={24} color={Colors.textSecondary} />
        <Text style={styles.menuItemText}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: Layout.spacing.xxl,
  },
  header: {
    alignItems: 'center',
    padding: Layout.spacing.xl,
    backgroundColor: Colors.darkGray,
    borderBottomWidth: 2,
    borderBottomColor: Colors.communistRed,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.mediumGray,
    borderWidth: 3,
    borderColor: Colors.communistRed,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  headerTitle: {
    fontSize: Typography.h2,
    fontWeight: 'bold',
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.xs,
  },
  statsCard: {
    margin: Layout.spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.body,
    fontWeight: 'bold',
    color: Colors.white,
    letterSpacing: Typography.letterSpacingWide,
    marginBottom: Layout.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.md,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    backgroundColor: Colors.mediumGray,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.sm,
  },
  statNumber: {
    fontSize: Typography.h2,
    fontWeight: 'bold',
    color: Colors.communistRed,
    marginVertical: Layout.spacing.xs,
  },
  statLabel: {
    fontSize: Typography.small,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  badgesCard: {
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  emptyBadgesText: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Layout.spacing.md,
    lineHeight: Typography.bodySmall * Typography.lineHeightNormal,
  },
  badgesGrid: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
  },
  lockedBadge: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.mediumGray,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.sm,
    opacity: 0.5,
  },
  lockedBadgeText: {
    fontSize: Typography.small,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.xs,
  },
  menuCard: {
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
  },
  menuItemText: {
    fontSize: Typography.body,
    color: Colors.text,
  },
  footer: {
    alignItems: 'center',
    padding: Layout.spacing.xl,
  },
  footerText: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
  },
  footerSubtext: {
    fontSize: Typography.small,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.xs,
    fontStyle: 'italic',
  },
});