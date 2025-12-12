/**
 * AdBanner.tsx - Componente de Banner do Google AdMob
 * 
 * Este componente carrega e exibe um anúncio de banner
 * de forma automática usando a biblioteca react-native-google-mobile-ads.
 */

import React from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import { 
  BannerAd, 
  BannerAdSize, 
  TestIds 
} from 'react-native-google-mobile-ads';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

// Define o ID de anúncio baseado no ambiente:
// - Em desenvolvimento (__DEV__), usa um ID de teste do Google.
// - Em produção, substitua pela sua Unidade de Anúncio real do AdMob.
const adUnitId = __DEV__ 
  ? TestIds.BANNER 
  : Platform.select({
      // Substitua os IDs abaixo pelos seus IDs reais do AdMob (ca-app-pub-...)
      ios: 'YOUR_IOS_BANNER_AD_UNIT_ID', 
      android: 'YOUR_ANDROID_BANNER_AD_UNIT_ID',
      default: TestIds.BANNER,
    });

// ------------------------------------------------------------------------

interface AdBannerProps {
  // Opcional: permite definir um tamanho diferente se necessário
  size?: BannerAdSize; 
  // Opcional: permite usar um ID customizado
  adUnitId?: string;
  // Opcional: altura customizada (para cálculo de layout)
  height?: number;
  // Opcional: posição do banner
  position?: 'top' | 'bottom' | 'center';
  // Opcional: estilo customizado
  containerStyle?: any;
}

const AdBanner: React.FC<AdBannerProps> = ({ 
  size = BannerAdSize.FULL_BANNER,
  adUnitId: customAdUnitId,
  height,
  position = 'center',
  containerStyle,
}) => {
  
  // Função que calcula o tamanho da view para evitar que o banner "pule"
  const getBannerHeight = (adSize: BannerAdSize): number => {
    // Isso é simplificado. Para banners inteligentes (SMART_BANNER),
    // o cálculo é mais complexo e depende da densidade da tela.
    switch (adSize) {
      case BannerAdSize.BANNER:
        return 50; 
      case BannerAdSize.FULL_BANNER:
        return 60;
      case BannerAdSize.LARGE_BANNER:
        return 90;
      case BannerAdSize.LEADERBOARD:
        return 90;
      case BannerAdSize.MEDIUM_RECTANGLE:
        return 250;
      default:
        // Assume o FULL_BANNER para o caso padrão
        return 60;
    }
  };

  const adHeight = height || getBannerHeight(size);
  const finalAdUnitId = customAdUnitId || adUnitId;

  // Estilos de posicionamento
  const positionStyles = {
    top: {alignSelf: 'flex-start', marginTop: 0, marginBottom: 16},
    bottom: {alignSelf: 'flex-end', marginTop: 16, marginBottom: 0},
    center: {alignSelf: 'center', marginTop: 8, marginBottom: 8},
  };

  return (
    <View style={[
      styles.adContainer, 
      { height: adHeight },
      positionStyles[position],
      containerStyle,
    ]}>
      <BannerAd
        unitId={finalAdUnitId}
        size={size}
        // Listener para logar o carregamento automático
        onAdLoaded={() => {
          console.log(`AdMob Banner carregado (${size})`);
        }}
        // Listener para logar falhas (útil para depuração)
        onAdFailedToLoad={(error) => {
          console.error(`Falha no carregamento do AdMob Banner: ${error.message}`);
        }}
      />
    </View>
  );
};

// Estilos de container (apenas para garantir o tamanho)
const styles = StyleSheet.create({
  adContainer: {
    width: SCREEN_WIDTH - 32, // Largura total da tela menos padding
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent', // Garante que o AdMob defina a cor de fundo
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default AdBanner;
