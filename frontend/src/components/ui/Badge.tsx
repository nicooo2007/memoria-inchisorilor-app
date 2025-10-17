import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Layout from '../../constants/layout';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export default function Badge({ label, variant = 'default', style }: BadgeProps) {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'success':
        return Colors.successGreen;
      case 'warning':
        return Colors.warningYellow;
      case 'error':
        return Colors.errorRed;
      default:
        return Colors.communistRed;
    }
  };

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: getBackgroundColor() + '33' },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: getBackgroundColor() },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: Typography.small,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: Typography.letterSpacingWide,
  },
});