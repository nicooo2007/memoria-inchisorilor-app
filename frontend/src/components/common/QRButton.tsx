import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '../../constants/colors';
import Layout from '../../constants/layout';

export default function QRButton() {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={() => router.push('/qr-scanner')}
      activeOpacity={0.8}
    >
      <Ionicons name="qr-code" size={28} color={Colors.white} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: Layout.spacing.lg,
    bottom: Layout.spacing.xxl + 60, // Above tab bar
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.communistRed,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: Colors.darkRed,
  },
});