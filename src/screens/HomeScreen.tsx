/**
 * HomeScreen - CartórioConnect
 * 
 * Tela inicial do aplicativo com visual idêntico à imagem de referência.
 * Componente React Native completo e funcional.
 * 
 * Para usar: Copie este arquivo para src/screens/HomeScreen.tsx
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {storageService} from '../services/storageService';
import {cartorioService, Cartorio} from '../services/cartorioService';
import AdBanner from '../components/AdBanner';
import FooterBanner from '../components/FooterBanner';
// import {BannerAdSize} from 'react-native-google-mobile-ads'; // Comentado - requer build nativo
// Recomenda-se usar ícones vetoriais (Ex: @expo/vector-icons) para ícones,
// mas vou usar emojis aqui para manter a simplicidade do seu código atual.

// Cores principais do design:
const COLORS = {
  primary: '#273d54', // Azul Escuro Principal
  secondary: '#E3F2FD', // Azul Claro para cards de filtro
  background: '#F0F4F8', // Fundo cinza claro/azul suave
  white: '#FFFFFF',
  textDark: '#333333',
  textSubtle: '#757575',
};

// Altura da tela para o cálculo do fundo curvo
const screenHeight = Dimensions.get('window').height;

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [searchText, setSearchText] = useState('');
  const [favorites, setFavorites] = useState<Cartorio[]>([]);
  const [recentSearches, setRecentSearches] = useState<Cartorio[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  
  // Obter os insets da área segura (status bar, notch, etc.)
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadFavoritesAndRecent();
    loadLastUpdate();
  }, []);

  const loadFavoritesAndRecent = async () => {
    try {
      const [favs, recent] = await Promise.all([
        storageService.getFavorites(),
        storageService.getRecentSearches(),
      ]);
      setFavorites(favs.slice(0, 5)); // Limitar a 5 favoritos
      // Extrair apenas os cartórios das buscas recentes
      const recentCartorios = recent
        .slice(0, 5)
        .map(search => search.cartorio);
      setRecentSearches(recentCartorios);
    } catch (error) {
      console.error('Erro ao carregar favoritos e recentes:', error);
    }
  };

  const loadLastUpdate = async () => {
    try {
      const metadata = await cartorioService.getMetadata();
      const formattedDate = cartorioService.formatLastUpdateDate(metadata.lastUpdate);
      setLastUpdate(formattedDate);
    } catch (error) {
      console.error('Erro ao carregar data de atualização:', error);
    }
  };

  const handleSearch = () => {
    // Implemente a lógica de navegação/busca aqui
    console.log('Buscando por:', searchText);
    // Navegação para a tela de lista sem filtro específico
    navigation.navigate('CartorioList', {filterType: 'all'});
  };

  const handleFilterBy = (type: 'estado' | 'cidade' | 'cnj') => {
    // Mapear 'estado' para 'uf' para corresponder ao filtro da lista
    const filterType = type === 'estado' ? 'uf' : type;
    console.log('Filtrando por:', filterType);
    // Navegação para a tela de lista com o filtro correspondente
    navigation.navigate('CartorioList', {filterType: filterType as 'uf' | 'cidade' | 'cnj'});
  };

  const handleCartorioPress = (cartorio: Cartorio) => {
    navigation.navigate('CartorioDetail', {cartorio});
  };

  const handleViewAllFavorites = () => {
    navigation.navigate('CartorioList', {filterType: 'all'});
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      {/* StatusBar - área de notificação totalmente visível */}
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent={false}
      />
      
      {/* 1. Fundo Curvo Azul (Para a área do Header) - Começa APÓS a área de notificação */}
      <View style={[
        styles.blueBackground, 
        {
          top: insets.top, 
          height: Platform.OS === 'ios' ? 220 : 180,
        }
      ]} />

      {/* 2. Top Bar e Título (Sobrepondo o fundo azul) - Respeita a área segura */}
      <View style={[styles.topBar, {paddingTop: 12, paddingBottom: 12}]}>
        <View style={styles.topBarLeft}>
          {/* Logo do App: Ícone e Título */}
          <View style={styles.topBarIconContainer}>
            <Image
              source={require('../../assets/images/Gemini_Generated_Image_fhlw55fhlw55fhlw-removebg-preview.png')}
              style={styles.topBarIconImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.topBarTitle}>CartórioConnect</Text>
        </View>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.navigate('About')}>
          <Text style={styles.menuIcon}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Card Verde com Informação Offline */}
        <View style={styles.offlineCard}>
          <Text style={styles.offlineTitle}>100% Offline</Text>
          {lastUpdate && (
            <View style={styles.updateInfoContainer}>
              <Text style={styles.updateInfoLabel}>Última atualização</Text>
              <Text style={styles.updateInfoDate}>{lastUpdate}</Text>
            </View>
          )}
        </View>

        {/* Seção de Favoritos */}
        {favorites.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>⭐ Favoritos</Text>
              <TouchableOpacity onPress={handleViewAllFavorites}>
                <Text style={styles.seeAllText}>Ver todos</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}>
              {favorites.map((cartorio, index) => (
                <TouchableOpacity
                  key={cartorio.numeroCNJ || index}
                  style={styles.favoriteCard}
                  onPress={() => handleCartorioPress(cartorio)}>
                  <Text style={styles.favoriteCardIcon}>🏢</Text>
                  <Text style={styles.favoriteCardTitle} numberOfLines={2}>
                    {cartorio.tituloCartorio}
                  </Text>
                  {cartorio.cidade && (
                    <Text style={styles.favoriteCardCity} numberOfLines={1}>
                      {cartorio.cidade} - {cartorio.uf}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Seção de Recentes */}
        {recentSearches.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🕒 Recentes</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}>
              {recentSearches.map((cartorio, index) => (
                <TouchableOpacity
                  key={cartorio.numeroCNJ || index}
                  style={styles.recentCard}
                  onPress={() => handleCartorioPress(cartorio)}>
                  <Text style={styles.recentCardIcon}>📋</Text>
                  <Text style={styles.recentCardTitle} numberOfLines={2}>
                    {cartorio.tituloCartorio}
                  </Text>
                  {cartorio.cidade && (
                    <Text style={styles.recentCardCity} numberOfLines={1}>
                      {cartorio.cidade} - {cartorio.uf}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Container de Filtros por Tipo */}
        <View style={styles.mainContentArea}>
          <Text style={styles.filterTitle}>Filtrar por Tipo</Text>
          
          {/* Grid de Tipos de Cartório */}
          <View style={styles.typeGrid}>
            <TypeButton 
              icon="👤" 
              text="Civil" 
              onPress={() => navigation.navigate('CartorioList', {filterType: 'all', tipo: 'Civil'})} 
            />
            <TypeButton 
              icon="📜" 
              text="Protesto" 
              onPress={() => navigation.navigate('CartorioList', {filterType: 'all', tipo: 'Protesto'})} 
            />
            <TypeButton 
              icon="🏠" 
              text="Imóveis" 
              onPress={() => navigation.navigate('CartorioList', {filterType: 'all', tipo: 'Imóveis'})} 
            />
            <TypeButton 
              icon="📄" 
              text="Títulos e Documentos" 
              onPress={() => navigation.navigate('CartorioList', {filterType: 'all', tipo: 'Títulos e Documentos'})} 
            />
            <TypeButton 
              icon="⚖️" 
              text="Jurídico" 
              onPress={() => navigation.navigate('CartorioList', {filterType: 'all', tipo: 'Jurídico'})} 
            />
            <TypeButton 
              icon="✍️" 
              text="Tabelionato de Notas" 
              onPress={() => navigation.navigate('CartorioList', {filterType: 'all', tipo: 'Tabelionato de Notas'})} 
            />
          </View>
        </View>
      </ScrollView>
      
      {/* Rodapé Fixo para AdMob */}
      <FooterBanner />
    </View>
  );
};

// Componente auxiliar para os botões de tipo
const TypeButton = ({icon, text, onPress}: {icon: string, text: string, onPress: () => void}) => (
  <TouchableOpacity
    style={styles.typeButton}
    activeOpacity={0.7}
    onPress={onPress}>
    <Text style={styles.typeIcon}>{icon}</Text>
    <Text style={styles.typeText}>{text}</Text>
  </TouchableOpacity>
);

// Componente auxiliar para os filtros rápidos
const CategoryButton = ({icon, text, onPress}: {icon: string, text: string, onPress: () => void}) => (
  <TouchableOpacity
    style={styles.categoryButton}
    activeOpacity={0.7}
    onPress={onPress}>
    <Text style={styles.categoryIcon}>{icon}</Text>
    <Text style={styles.categoryText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Fundo Curvo que cria o efeito visual do Header
  blueBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: '100%',
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    // A altura será calculada dinamicamente para incluir a status bar
  },
  // Top Bar (Fica sobreposto ao blueBackground)
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    minHeight: 56,
    zIndex: 10, // Garantir que fique acima do fundo azul
    position: 'relative',
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  topBarIconImage: {
    width: 28,
    height: 28,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 24,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  // ScrollView
  scrollView: {
    flex: 1,
    zIndex: 1, // Garantir que o conteúdo role por cima do fundo azul
  },
  scrollContent: {
    paddingBottom: 100,
    alignItems: 'center',
  },
  // Card Offline Verde (centralizado e com sombra)
  offlineCard: {
    backgroundColor: '#4CAF50',
    width: '90%',
    marginTop: 20,
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: Platform.OS === 'ios' ? '#000' : undefined,
    shadowOffset: Platform.OS === 'ios' ? {width: 0, height: 4} : undefined,
    shadowOpacity: Platform.OS === 'ios' ? 0.2 : undefined,
    shadowRadius: Platform.OS === 'ios' ? 8 : undefined,
    elevation: Platform.OS === 'android' ? 5 : undefined,
  },
  offlineTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  updateInfoContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    width: '100%',
  },
  updateInfoLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  updateInfoDate: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  // Container de Filtros
  mainContentArea: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 16,
  },
  // Grid de Tipos de Cartório
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  typeButton: {
    width: '48%',
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 12,
    minHeight: 120,
  },
  typeIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
  },
  // Botão Principal de Busca
  mainSearchButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
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
  mainSearchIcon: {
    fontSize: 20,
    marginRight: 12,
    color: COLORS.white,
  },
  mainSearchText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  // Botões de Categoria
  categoryButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12, // Usando a propriedade gap (Requer RN 0.71+)
    marginBottom: 30,
  },
  categoryButton: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    minHeight: 100,
  },
  categoryIcon: {
    fontSize: 28, // Ícone maior
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
  },
  // Placeholder de Anúncio
  adPlaceholder: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  adText: {
      color: COLORS.textSubtle,
      fontSize: 14,
  },
  // Seções de Favoritos e Recentes
  sectionContainer: {
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  horizontalScroll: {
    paddingRight: 16,
  },
  favoriteCard: {
    backgroundColor: COLORS.white,
    width: 160,
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  favoriteCardIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  favoriteCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  favoriteCardCity: {
    fontSize: 12,
    color: COLORS.textSubtle,
  },
  recentCard: {
    backgroundColor: COLORS.secondary,
    width: 160,
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  recentCardIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  recentCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  recentCardCity: {
    fontSize: 12,
    color: COLORS.textSubtle,
  },
});

export default HomeScreen;
