import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../src/constants/colors';
import Typography from '../src/constants/typography';
import Layout from '../src/constants/layout';
import Button from '../src/components/ui/Button';
import { validateQRCode } from '../src/services/api';

export default function QRScannerScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Se solicită permisiunea pentru cameră...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={64} color={Colors.communistRed} />
          <Text style={styles.permissionTitle}>Acces la Cameră Necesar</Text>
          <Text style={styles.permissionText}>
            Această aplicație necesită acces la cameră pentru a scana codurile QR de pe plăcile memorialului.
          </Text>
          <Button title="Permite Accesul" onPress={requestPermission} />
          <Button
            title="Înapoi"
            onPress={() => router.back()}
            variant="secondary"
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    
    try {
      const result = await validateQRCode(data);
      
      if (result.valid) {
        Alert.alert(
          'Cod QR Valid',
          `Locație: ${result.location_name}`,
          [
            {
              text: 'Vizualizează Conținut',
              onPress: () => {
                // Navigate to content based on type
                router.back();
              },
            },
            {
              text: 'Scanează Altul',
              onPress: () => setScanned(false),
            },
          ]
        );
      } else {
        Alert.alert(
          'Cod QR Invalid',
          'Acest cod QR nu aparține aplicației Memorial Gherla.',
          [
            {
              text: 'Încearcă Din Nou',
              onPress: () => setScanned(false),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        'Eroare',
        'Nu s-a putut valida codul QR. Verificați conexiunea la internet.',
        [
          {
            text: 'Încearcă Din Nou',
            onPress: () => setScanned(false),
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <Ionicons name="close" size={32} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.flashButton}
            onPress={() => setFlashOn(!flashOn)}
          >
            <Ionicons
              name={flashOn ? 'flash' : 'flash-off'}
              size={28}
              color={Colors.white}
            />
          </TouchableOpacity>
        </View>

        {/* Scanning Frame */}
        <View style={styles.scanArea}>
          <View style={styles.viewfinder}>
            {/* Corners */}
            <View style={[styles.corner, styles.cornerTopLeft]} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />
            
            {/* Scanning Line Animation */}
            {!scanned && <View style={styles.scanLine} />}
          </View>
          
          <Text style={styles.instruction}>
            Poziționează codul QR în cadru
          </Text>
          
          {scanned && (
            <View style={styles.scannedIndicator}>
              <Ionicons name="checkmark-circle" size={48} color={Colors.successGreen} />
              <Text style={styles.scannedText}>Scanat!</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color={Colors.communistRed} />
            <Text style={styles.infoText}>
              Scanează codurile QR de pe plăcile din memorial pentru a accesa conținut exclusiv
            </Text>
          </View>
        </View>
      </CameraView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.xl,
    backgroundColor: Colors.background,
  },
  permissionTitle: {
    fontSize: Typography.h2,
    fontWeight: 'bold',
    color: Colors.white,
    marginTop: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.body * Typography.lineHeightRelaxed,
    marginBottom: Layout.spacing.xl,
  },
  backButton: {
    marginTop: Layout.spacing.md,
  },
  text: {
    color: Colors.white,
    fontSize: Typography.body,
  },
  camera: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Layout.spacing.lg,
  },
  closeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewfinder: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: Colors.communistRed,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  scanLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.communistRed,
  },
  instruction: {
    marginTop: Layout.spacing.xl,
    fontSize: Typography.body,
    color: Colors.white,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.sm,
  },
  scannedIndicator: {
    position: 'absolute',
    alignItems: 'center',
  },
  scannedText: {
    fontSize: Typography.h3,
    color: Colors.successGreen,
    fontWeight: 'bold',
    marginTop: Layout.spacing.sm,
  },
  footer: {
    padding: Layout.spacing.lg,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.communistRed,
  },
  infoText: {
    flex: 1,
    fontSize: Typography.bodySmall,
    color: Colors.white,
    lineHeight: Typography.bodySmall * Typography.lineHeightNormal,
  },
});