// Memorial Gherla - Layout Constants
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const Layout = {
  // Screen Dimensions
  window: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  
  // Spacing (8pt grid)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Border Radius
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  
  // Touch Targets
  touchTarget: {
    minHeight: 44,
    minWidth: 44,
  },
  
  // Container
  container: {
    padding: 16,
    maxWidth: 1200,
  },
  
  // Header
  header: {
    height: 60,
  },
  
  // Tab Bar
  tabBar: {
    height: 60,
  },
};

export default Layout;