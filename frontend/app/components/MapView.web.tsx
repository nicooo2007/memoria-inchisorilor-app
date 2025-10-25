import { View, Text, StyleSheet } from 'react-native';

export const MapView = ({ children, ...props }: any) => (
  <View style={[styles.container, props.style]}>
    <Text style={styles.text}>
      Map view is only available on mobile devices
    </Text>
  </View>
);

export const Marker = ({ children, ...props }: any) => null;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
});

export type Region = any;
export type MapViewProps = any;
