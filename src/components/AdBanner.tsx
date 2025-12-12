import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Text,
} from 'react-native';
import {WebView} from 'react-native-webview';
// import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

export type AdType = 'admob' | 'image' | 'html' | 'custom';

export interface AdBannerProps {
  /**
   * Tipo de anúncio a ser exibido
   * - 'admob': Google AdMob Banner
   * - 'image': Imagem estática
   * - 'html': Banner HTML
   * - 'custom': Componente customizado
   */
  adType?: AdType;

  /**
   * ID do anúncio do AdMob (obrigatório se adType='admob')
   * Use TestIds.BANNER para testes
   */
  adMobUnitId?: string;

  /**
   * URI da imagem (obrigatório se adType='image')
   * Pode ser local (require) ou remota (URL)
   */
  imageUri?: any;

  /**
   * HTML do banner (obrigatório se adType='html')
   */
  htmlContent?: string;

  /**
   * Componente customizado (obrigatório se adType='custom')
   */
  customComponent?: React.ReactNode;

  /**
   * Largura do banner (padrão: largura da tela - 32px de margem)
   */
  width?: number;

  /**
   * Altura do banner (padrão: 50 para AdMob, 100 para outros)
   */
  height?: number;

  /**
   * Posição do banner: 'top' | 'bottom' | 'center'
   */
  position?: 'top' | 'bottom' | 'center';

  /**
   * Callback quando o anúncio é clicado
   */
  onAdPress?: () => void;

  /**
   * Callback quando há erro ao carregar o anúncio
   */
  onError?: (error: Error) => void;

  /**
   * Estilo customizado para o container
   */
  containerStyle?: any;

  /**
   * Mostrar indicador de carregamento
   */
  showLoading?: boolean;
}

/**
 * Componente de Área de Anúncios
 * 
 * Suporta múltiplos tipos de anúncios:
 * - Google AdMob Banner
 * - Imagens estáticas
 * - Banners HTML
 * - Componentes customizados
 * 
 * @example
 * // AdMob
 * <AdBanner 
 *   adType="admob" 
 *   adMobUnitId="ca-app-pub-xxxxx/xxxxx" 
 * />
 * 
 * // Imagem
 * <AdBanner 
 *   adType="image" 
 *   imageUri={require('./assets/banner.png')} 
 * />
 * 
 * // HTML
 * <AdBanner 
 *   adType="html" 
 *   htmlContent="<div>...</div>" 
 * />
 */
const AdBanner: React.FC<AdBannerProps> = ({
  adType = 'image',
  adMobUnitId,
  imageUri,
  htmlContent,
  customComponent,
  width = SCREEN_WIDTH - 32,
  height,
  position = 'center',
  onAdPress,
  onError,
  containerStyle,
  showLoading = true,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Determinar altura padrão baseado no tipo
  const defaultHeight = height || (adType === 'admob' ? 50 : 100);
  const finalHeight = height || defaultHeight;

  // Estilos de posicionamento
  const positionStyles = {
    top: {alignSelf: 'flex-start', marginTop: 0, marginBottom: 16},
    bottom: {alignSelf: 'flex-end', marginTop: 16, marginBottom: 0},
    center: {alignSelf: 'center', marginTop: 8, marginBottom: 8},
  };

  const handleError = (err: Error) => {
    setError(err.message);
    setLoading(false);
    if (onError) {
      onError(err);
    }
  };

  const handleLoad = () => {
    setLoading(false);
  };

  const renderAdContent = () => {
    switch (adType) {
      case 'admob':
        if (!adMobUnitId) {
          return (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                AdMob Unit ID não fornecido
              </Text>
            </View>
          );
        }
        // Descomente quando instalar react-native-google-mobile-ads
        // return (
        //   <BannerAd
        //     unitId={adMobUnitId}
        //     size={BannerAdSize.BANNER}
        //     requestOptions={{
        //       requestNonPersonalizedAdsOnly: true,
        //     }}
        //     onAdLoaded={handleLoad}
        //     onAdFailedToLoad={handleError}
        //   />
        // );
        return (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              AdMob Banner (Configure react-native-google-mobile-ads)
            </Text>
            <Text style={styles.placeholderSubtext}>
              Unit ID: {adMobUnitId}
            </Text>
          </View>
        );

      case 'image':
        if (!imageUri) {
          return (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                URI da imagem não fornecida
              </Text>
            </View>
          );
        }
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onAdPress}
            style={styles.imageContainer}>
            <Image
              source={typeof imageUri === 'string' ? {uri: imageUri} : imageUri}
              style={[styles.image, {width, height: finalHeight}]}
              resizeMode="cover"
              onLoad={handleLoad}
              onError={() => handleError(new Error('Erro ao carregar imagem'))}
            />
          </TouchableOpacity>
        );

      case 'html':
        if (!htmlContent) {
          return (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                Conteúdo HTML não fornecido
              </Text>
            </View>
          );
        }
        return (
          <View style={[styles.htmlContainer, {width, height: finalHeight}]}>
            <WebView
              source={{html: htmlContent}}
              style={styles.webview}
              onLoad={handleLoad}
              onError={() => handleError(new Error('Erro ao carregar HTML'))}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        );

      case 'custom':
        if (!customComponent) {
          return (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                Componente customizado não fornecido
              </Text>
            </View>
          );
        }
        return <View style={styles.customContainer}>{customComponent}</View>;

      default:
        return (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Tipo de anúncio inválido: {adType}
            </Text>
          </View>
        );
    }
  };

  if (error) {
    return (
      <View
        style={[
          styles.container,
          positionStyles[position],
          containerStyle,
          {width, minHeight: finalHeight},
        ]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        positionStyles[position],
        containerStyle,
        {width, minHeight: finalHeight},
      ]}>
      {showLoading && loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#1a73e8" />
        </View>
      )}
      {renderAdContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 16,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    zIndex: 1,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  htmlContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  customContainer: {
    width: '100%',
    height: '100%',
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 50,
  },
  errorText: {
    color: '#c62828',
    fontSize: 12,
    textAlign: 'center',
  },
  placeholderContainer: {
    padding: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 50,
  },
  placeholderText: {
    color: '#1976d2',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  placeholderSubtext: {
    color: '#64b5f6',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
});

export default AdBanner;

