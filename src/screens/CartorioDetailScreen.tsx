import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Cartorio} from '../services/cartorioService';
import {storageService} from '../services/storageService';
import {locationService} from '../services/locationService';
import {shareService} from '../services/shareService';
import AdBanner from '../components/AdBanner';
import {RootStackParamList} from '../../App';
// import {BannerAdSize} from 'react-native-google-mobile-ads'; // Comentado - requer build nativo

// Cores principais do design (igual à HomeScreen):
const COLORS = {
  primary: '#273d54', // Azul Escuro Principal
  secondary: '#E3F2FD', // Azul Claro para cards de filtro
  background: '#F0F4F8', // Fundo cinza claro/azul suave
  white: '#FFFFFF',
  textDark: '#333333',
  textSubtle: '#757575',
  star: '#FFB800',
  starEmpty: '#D0D0D0',
};

type CartorioDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'CartorioDetail'
>;

type CartorioDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CartorioDetail'
>;

const CartorioDetailScreen = () => {
  const route = useRoute<CartorioDetailScreenRouteProp>();
  const navigation = useNavigation<CartorioDetailScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const {cartorio} = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  // Carregar status de favorito e registrar busca recente ao montar
  useEffect(() => {
    const loadFavoriteStatus = async () => {
      if (cartorio.numeroCNJ) {
        const favorite = await storageService.isFavorite(cartorio.numeroCNJ);
        setIsFavorite(favorite);
      }
    };

    const registerRecentSearch = async () => {
      await storageService.addRecentSearch(cartorio);
    };

    loadFavoriteStatus();
    registerRecentSearch();
  }, [cartorio]);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\D/g, '')}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleToggleFavorite = async () => {
    try {
      if (!cartorio.numeroCNJ) return;

      if (isFavorite) {
        await storageService.removeFavorite(cartorio.numeroCNJ);
        setIsFavorite(false);
      } else {
        await storageService.addFavorite(cartorio);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Erro ao alternar favorito:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o favorito.');
    }
  };

  const handleOpenMaps = async () => {
    try {
      await locationService.openMapsWithAddress(
        cartorio.endereco || '',
        cartorio.numero,
        cartorio.cidade,
        cartorio.uf
      );
    } catch (error) {
      console.error('Erro ao abrir mapas:', error);
      Alert.alert('Erro', 'Não foi possível abrir o aplicativo de mapas.');
    }
  };

  const handleShareWhatsApp = async () => {
    try {
      await shareService.shareViaWhatsApp(cartorio);
    } catch (error) {
      console.error('Erro ao compartilhar via WhatsApp:', error);
      Alert.alert('Erro', 'Não foi possível compartilhar via WhatsApp.');
    }
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      {/* StatusBar - área de notificação totalmente visível */}
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent={false}
      />
      
      {/* Fundo Curvo Azul (igual à HomeScreen) */}
      <View style={[
        styles.blueBackground, 
        {
          top: insets.top, 
          height: Platform.OS === 'ios' ? 220 : 180,
        }
      ]} />

      {/* Top Bar (igual à HomeScreen) */}
      <View style={[styles.topBar, {paddingTop: 12, paddingBottom: 12}]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.topBarLeft}>
          <View style={styles.topBarIconContainer}>
            <Text style={styles.topBarIcon}>🏢</Text>
          </View>
          <Text style={styles.topBarTitle}>Detalhes</Text>
        </View>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleToggleFavorite}>
          <Text style={[styles.favoriteIcon, isFavorite && styles.favoriteIconActive]}>
            ★
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.iconContainer}>
              <Text style={styles.headerIcon}>📋</Text>
            </View>
            <Text style={styles.title}>{cartorio.tituloCartorio}</Text>
            {cartorio.uf && (
              <View style={styles.ufBadge}>
                <Text style={styles.ufBadgeText}>{cartorio.uf}</Text>
              </View>
            )}
          </View>

          {/* CNJ Section */}
          {cartorio.numeroCNJ && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Text style={styles.sectionIcon}>🔢</Text>
                </View>
                <Text style={styles.sectionLabel}>Número CNJ</Text>
              </View>
              <View style={styles.valueContainer}>
                <Text style={styles.value}>{cartorio.numeroCNJ}</Text>
              </View>
            </View>
          )}

          {/* Responsável Section */}
          {cartorio.responsavel && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Text style={styles.sectionIcon}>👤</Text>
                </View>
                <Text style={styles.sectionLabel}>Responsável</Text>
              </View>
              <View style={styles.valueContainer}>
                <Text style={styles.value}>{cartorio.responsavel}</Text>
              </View>
            </View>
          )}

          {/* Endereço Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Text style={styles.sectionIcon}>📍</Text>
              </View>
              <Text style={styles.sectionLabel}>Endereço</Text>
            </View>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>
                {cartorio.endereco}
                {cartorio.numero && `, ${cartorio.numero}`}
                {cartorio.bairro && ` - ${cartorio.bairro}`}
              </Text>
              <Text style={styles.value}>
                {cartorio.cidade} - {cartorio.uf}
              </Text>
            </View>
            {/* Botão Traçar Rota */}
            {(cartorio.endereco || cartorio.cidade) && (
              <TouchableOpacity
                style={styles.routeButton}
                activeOpacity={0.8}
                onPress={handleOpenMaps}>
                <Text style={styles.routeButtonIcon}>🗺️</Text>
                <Text style={styles.routeButtonText}>Traçar Rota</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Telefone Section */}
          {cartorio.telefone && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Text style={styles.sectionIcon}>📞</Text>
                </View>
                <Text style={styles.sectionLabel}>Telefone</Text>
              </View>
              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.8}
                onPress={() => handleCall(cartorio.telefone || '')}>
                <Text style={styles.actionButtonText}>{cartorio.telefone}</Text>
                <Text style={styles.actionButtonIcon}>📞</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Email Section */}
          {cartorio.email && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Text style={styles.sectionIcon}>✉️</Text>
                </View>
                <Text style={styles.sectionLabel}>E-mail</Text>
              </View>
              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.8}
                onPress={() => handleEmail(cartorio.email || '')}>
                <Text style={styles.actionButtonText} numberOfLines={1}>
                  {cartorio.email}
                </Text>
                <Text style={styles.actionButtonIcon}>✉️</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Compartilhar Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Text style={styles.sectionIcon}>📤</Text>
              </View>
              <Text style={styles.sectionLabel}>Compartilhar</Text>
            </View>
            <View style={styles.shareButtonsContainer}>
              <TouchableOpacity
                style={styles.shareButton}
                activeOpacity={0.8}
                onPress={handleShareWhatsApp}>
                <Text style={styles.shareButtonIcon}>💬</Text>
                <Text style={styles.shareButtonText}>WhatsApp</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.shareButton}
                activeOpacity={0.8}
                onPress={handleOpenMaps}>
                <Text style={styles.shareButtonIcon}>🗺️</Text>
                <Text style={styles.shareButtonText}>Traçar Rota</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Banner do Google AdMob - Comentado: requer build nativo */}
        {/* <View style={styles.adContainer}>
          <AdBanner
            size={BannerAdSize.FULL_BANNER}
            position="center"
          />
        </View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Fundo Curvo Azul (igual à HomeScreen)
  blueBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: '100%',
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  // Top Bar (igual à HomeScreen)
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    minHeight: 56,
    zIndex: 10,
    position: 'relative',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  topBarIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  topBarIcon: {
    fontSize: 18,
    color: COLORS.white,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
  menuButton: {
    padding: 8,
    width: 40,
  },
  favoriteButton: {
    padding: 8,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteIcon: {
    fontSize: 28,
    color: COLORS.starEmpty,
  },
  favoriteIconActive: {
    color: COLORS.star,
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    padding: 20,
    backgroundColor: COLORS.white,
    margin: 16,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#f0f0f0',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 12,
  },
  ufBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  ufBadgeText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionIcon: {
    fontSize: 18,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textSubtle,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  valueContainer: {
    backgroundColor: COLORS.secondary,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  value: {
    fontSize: 16,
    color: COLORS.textDark,
    lineHeight: 24,
    marginBottom: 4,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  actionButtonText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '600',
    flex: 1,
  },
  actionButtonIcon: {
    fontSize: 20,
    marginLeft: 12,
    color: COLORS.white,
  },
  routeButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  routeButtonIcon: {
    fontSize: 20,
    marginRight: 8,
    color: COLORS.white,
  },
  routeButtonText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '600',
  },
  shareButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  shareButton: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  shareButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  shareButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  adContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
});

export default CartorioDetailScreen;
