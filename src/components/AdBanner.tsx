/**
 * AdBanner.tsx - Componente de Banner do Google AdMob
 * 
 * Este componente carrega e exibe um anúncio de banner
 * de forma automática usando a biblioteca react-native-google-mobile-ads.
 */

import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Platform, Dimensions, Text } from 'react-native';

// Importação condicional do AdMob
let BannerAd: any;
let BannerAdSize: any;
let TestIds: any;
let isAdMobAvailable = false;

try {
  const admob = require('react-native-google-mobile-ads');
  BannerAd = admob.BannerAd;
  BannerAdSize = admob.BannerAdSize;
  TestIds = admob.TestIds;
  isAdMobAvailable = true;
} catch (error) {
  console.warn('AdMob não disponível (provavelmente no Expo Go):', error);
  isAdMobAvailable = false;
}

const {width: SCREEN_WIDTH} = Dimensions.get('window');

// ------------------------------------------------------------------------

interface AdBannerProps {
  // Opcional: permite definir um tamanho diferente se necessário
  size?: any; // BannerAdSize (pode não estar disponível no Expo Go)
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
  size,
  adUnitId: customAdUnitId,
  height,
  position = 'center',
  containerStyle,
}) => {
  const [adMobReady, setAdMobReady] = useState(false);

  useEffect(() => {
    // Verifica se o AdMob está disponível
    if (isAdMobAvailable && BannerAdSize) {
      setAdMobReady(true);
    }
  }, []);

  // Função que calcula o tamanho da view para evitar que o banner "pule"
  const getBannerHeight = (adSize: any): number => {
    if (!BannerAdSize) return 60;
    
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
        return 60;
    }
  };

  // Se AdMob não estiver disponível (Expo Go), mostra placeholder
  if (!isAdMobAvailable || !adMobReady) {
    const adHeight = height || 60;
    return (
      <View style={[
        styles.adContainer, 
        styles.placeholderContainer,
        { height: adHeight },
        containerStyle,
      ]}>
        <Text style={styles.placeholderText}>
          📱 AdMob (requer build nativo)
        </Text>
      </View>
    );
  }

  const defaultSize = size || BannerAdSize.FULL_BANNER;
  const adHeight = height || getBannerHeight(defaultSize);
  
  // Obter Ad Unit ID de variáveis de ambiente ou usar TestIds em desenvolvimento
  const getAdUnitId = (): string => {
    if (customAdUnitId) {
      return customAdUnitId;
    }
    
    if (__DEV__) {
      // Em desenvolvimento, sempre usar TestIds
      return TestIds?.BANNER || 'ca-app-pub-3940256099942544/6300978111';
    }
    
    // Em produção, usar IDs de variáveis de ambiente
    // Estes devem ser configurados via app.json ou eas.json
    const envAdUnitId = Platform.select({
      ios: process.env.EXPO_PUBLIC_ADMOB_IOS_BANNER_ID,
      android: process.env.EXPO_PUBLIC_ADMOB_ANDROID_BANNER_ID,
      default: undefined,
    });
    
    if (envAdUnitId) {
      return envAdUnitId;
    }
    
    // Fallback: usar TestIds se não houver configuração (não recomendado em produção)
    console.warn('⚠️ AdMob Ad Unit ID não configurado. Usando TestId (não recomendado em produção)');
    return TestIds?.BANNER || 'ca-app-pub-3940256099942544/6300978111';
  };
  
  const finalAdUnitId = getAdUnitId();

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
        size={defaultSize}
        // Listener para logar o carregamento automático
        onAdLoaded={() => {
          console.log(`✅ AdMob Banner carregado (${defaultSize})`);
        }}
        // Listener para logar falhas (útil para depuração)
        onAdFailedToLoad={(error) => {
          console.error(`❌ Falha no carregamento do AdMob Banner: ${error.message}`);
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
  placeholderContainer: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default AdBanner;
