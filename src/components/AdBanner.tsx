/**
 * AdBanner.tsx - Componente de Banner do Google AdMob
 * 
 * NOTA: O módulo react-native-google-mobile-ads requer um build nativo.
 * No Expo Go, este componente retorna null (não exibe nada).
 * Para usar AdMob, faça um build com EAS Build.
 */

import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

interface AdBannerProps {
  size?: any;
  adUnitId?: string;
  height?: number;
  position?: 'top' | 'bottom' | 'center';
  containerStyle?: any;
}

const AdBanner: React.FC<AdBannerProps> = ({ 
  height = 60,
  position = 'center',
  containerStyle,
}) => {
  // No Expo Go, retorna null ou um placeholder
  // Para ativar AdMob, faça build com EAS Build
  
  return null; // Não renderiza nada no Expo Go
};

export default AdBanner;
