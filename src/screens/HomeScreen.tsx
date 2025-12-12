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
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {storageService} from '../services/storageService';
import {cartorioService, Cartorio} from '../services/cartorioService';
import AdBanner from '../components/AdBanner';
import {BannerAdSize} from 'react-native-google-mobile-ads';
// Recomenda-se usar ícones vetoriais (Ex: @expo/vector-icons) para ícones,
// mas vou usar emojis aqui para manter a simplicidade do seu código atual.

// Cores principais do design:
const COLORS = {
  primary: '#1976D2', // Azul Principal
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
            <Text style={styles.topBarIcon}>🏢</Text>
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
        
        {/* Card Branco com Informação Offline */}
        <View style={styles.offlineCard}>
          <View style={styles.offlineIconWrapper}>
            {/* Ícone de Globo riscado (Acesso Offline) */}
            <Text style={styles.offlineIcon}>🌐</Text>
            <View style={styles.offlineIconLine} />
          </View>
          <Text style={styles.offlineTitle}>Acesso 100% Offline</Text>
          <Text style={styles.offlineSubtitle}>
            Sua base de dados sempre com você.
          </Text>
          {lastUpdate && (
            <View style={styles.updateInfoContainer}>
              <Text style={styles.updateInfoLabel}>Última atualização:</Text>
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

        {/* Container de Busca e Filtros */}
        <View style={styles.mainContentArea}>
          {/* Campo de Busca Branco */}
          <View style={styles.searchInputWrapper}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Digite nome, cidade ou CNJ..."
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchText('')}
                style={styles.clearButton}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Botão Principal Azul de Busca */}
          <TouchableOpacity
            style={styles.mainSearchButton}
            activeOpacity={0.8}
            onPress={handleSearch}
            disabled={!searchText.length}>
            <Text style={styles.mainSearchIcon}>📞</Text>
            <Text style={styles.mainSearchText}>Buscar Cartório no Brasil</Text>
          </TouchableOpacity>

          {/* Três Botões de Categoria Azuis Claros */}
          <View style={styles.categoryButtonsContainer}>
            <CategoryButton 
              icon="📍" 
              text="Por Estado" 
              onPress={() => handleFilterBy('estado')} 
            />
            <CategoryButton 
              icon="🏢" 
              text="Por Cidade" 
              onPress={() => handleFilterBy('cidade')} 
            />
            <CategoryButton 
              icon="🆔" 
              text="Por CNJ" 
              onPress={() => handleFilterBy('cnj')} 
            />
          </View>

          {/* Banner do Google AdMob */}
          <AdBanner 
            size={BannerAdSize.FULL_BANNER}
            position="center"
          />
        </View>
      </ScrollView>
    </View>
  );
};

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
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Branco Transparente
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
    paddingBottom: 40,
    alignItems: 'center',
  },
  // Card Offline Branco (centralizado e com sombra)
  offlineCard: {
    backgroundColor: COLORS.white,
    width: '90%',
    marginTop: 20, // Distância do topo
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
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
  offlineIconWrapper: {
    position: 'relative',
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  offlineIcon: {
    // Usando uma cor azul mais escura para o globo
    fontSize: 56,
    color: COLORS.primary, 
    position: 'absolute',
    zIndex: 1,
  },
  offlineIconLine: {
    // Linha de "proibido" (deixei na cor do globo para simplificar)
    position: 'absolute',
    width: 70,
    height: 5,
    backgroundColor: COLORS.primary, 
    borderRadius: 3,
    zIndex: 2,
    transform: [{rotate: '-45deg'}],
    opacity: 0.8,
  },
  offlineTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 8,
    textAlign: 'center',
  },
  offlineSubtitle: {
    fontSize: 14,
    color: COLORS.textSubtle,
    textAlign: 'center',
    marginBottom: 12,
  },
  updateInfoContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
    width: '100%',
  },
  updateInfoLabel: {
    fontSize: 12,
    color: COLORS.textSubtle,
    marginBottom: 4,
  },
  updateInfoDate: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  // Container de Busca
  mainContentArea: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  // Campo de Busca
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 4, // Ajuste para Android/iOS
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
    color: '#999',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textDark,
    paddingVertical: Platform.OS === 'android' ? 10 : 0, // Ajuste vertical no Android
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearIcon: {
    fontSize: 18,
    color: '#999',
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
