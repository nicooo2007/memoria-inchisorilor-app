import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../src/constants/colors';
import Typography from '../src/constants/typography';
import Layout from '../src/constants/layout';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Logo/Title Section */}
        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="lock-closed" size={80} color={Colors.communistRed} />
          </View>
          <Text style={styles.title}>MEMORIAL GHERLA</Text>
          <Text style={styles.subtitle}>Închisori Comuniste din România</Text>
          <View style={styles.divider} />
          <Text style={styles.description}>
            O aplicație educațională dedicată păstrării memoriei victimelor regimului comunist din România
          </Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>10+</Text>
            <Text style={styles.statLabel}>Închisori</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1000+</Text>
            <Text style={styles.statLabel}>Documente</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>15000+</Text>
            <Text style={styles.statLabel}>Victime</Text>
          </View>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <FeatureItem 
            icon="documents" 
            text="Arhivă documente istorice" 
          />
          <FeatureItem 
            icon="map" 
            text="Hartă interactivă închisori" 
          />
          <FeatureItem 
            icon="people" 
            text="Baza de date victime" 
          />
          <FeatureItem 
            icon="qr-code" 
            text="Scanare QR pentru tur audio" 
          />
        </View>

        {/* CTA Button */}
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.replace('/(tabs)/documents')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>INTRĂ ÎN MEMORIAL</Text>
          <Ionicons name="arrow-forward" size={20} color={Colors.white} />
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footer}>
          În memoria celor care au suferit{' \n'}
          pentru libertate și adevăr
        </Text>
      </View>
    </SafeAreaView>
  );
}

function FeatureItem({ icon, text }: { icon: any; text: string }) {
  return (
    <View style={styles.featureItem}>
      <Ionicons name={icon} size={24} color={Colors.communistRed} />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Layout.spacing.lg,
    justifyContent: 'space-between',
  },
  heroSection: {
    alignItems: 'center',
    marginTop: Layout.spacing.xxl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.darkGray,
    borderWidth: 3,
    borderColor: Colors.communistRed,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  title: {
    fontSize: Typography.h1,
    fontWeight: 'bold',
    color: Colors.white,
    letterSpacing: Typography.letterSpacingExtraWide,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.h4,
    color: Colors.communistRed,
    marginTop: Layout.spacing.sm,
    textAlign: 'center',
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: Colors.communistRed,
    marginVertical: Layout.spacing.lg,
  },
  description: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.body * Typography.lineHeightRelaxed,
    paddingHorizontal: Layout.spacing.md,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.darkGray,
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Layout.spacing.lg,
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
    textTransform: 'uppercase',
    letterSpacing: Typography.letterSpacingWide,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.borderLight,
  },
  featuresSection: {
    gap: Layout.spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
  },
  featureText: {
    fontSize: Typography.body,
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.communistRed,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Layout.spacing.sm,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.sm,
    marginVertical: Layout.spacing.lg,
  },
  buttonText: {
    fontSize: Typography.body,
    fontWeight: 'bold',
    color: Colors.white,
    letterSpacing: Typography.letterSpacingWide,
  },
  footer: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: Layout.spacing.md,
    lineHeight: Typography.caption * Typography.lineHeightRelaxed,
  },
});