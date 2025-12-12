import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {cartorioService, Cartorio, TipoCartorio} from '../services/cartorioService';
import {storageService} from '../services/storageService';
import {locationService, CartorioWithDistance} from '../services/locationService';

// Cores principais do design (igual à HomeScreen):
const COLORS = {
  primary: '#1976D2', // Azul Principal
  secondary: '#E3F2FD', // Azul Claro para cards de filtro
  background: '#F0F4F8', // Fundo cinza claro/azul suave
  white: '#FFFFFF',
  textDark: '#333333',
  textSubtle: '#757575',
};

type CartorioListScreenRouteProp = RouteProp<RootStackParamList, 'CartorioList'>;
type CartorioListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CartorioList'>;

const CartorioListScreen = () => {
  const route = useRoute<CartorioListScreenRouteProp>();
  const navigation = useNavigation<CartorioListScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const [cartorios, setCartorios] = useState<Cartorio[]>([]);
  const [filteredCartorios, setFilteredCartorios] = useState<Cartorio[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [sortByProximity, setSortByProximity] = useState(false);
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>(null);
  // Inicializar o filtro com o valor recebido via navegação, ou 'all' como padrão
  const [filterType, setFilterType] = useState<'all' | 'uf' | 'cidade' | 'cnj' | 'tipo'>(
    route.params?.filterType || 'all'
  );
  const [tipoFiltro, setTipoFiltro] = useState<TipoCartorio | undefined>(
    route.params?.tipoFiltro
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadCartorios();
    loadFavorites();
    requestLocationIfNeeded();
  }, []);

  // Atualizar o filtro quando os parâmetros da rota mudarem
  useEffect(() => {
    if (route.params?.filterType) {
      setFilterType(route.params.filterType);
    }
    if (route.params?.tipoFiltro) {
      setTipoFiltro(route.params.tipoFiltro);
    }
  }, [route.params]);

  useEffect(() => {
    filterCartorios();
  }, [searchText, cartorios, filterType, tipoFiltro, sortByProximity, userLocation]);

  const loadFavorites = async () => {
    try {
      const favs = await storageService.getFavorites();
      const favSet = new Set(favs.map(f => f.numeroCNJ || ''));
      setFavorites(favSet);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    }
  };

  const requestLocationIfNeeded = async () => {
    try {
      const hasPermission = await locationService.hasPermission();
      if (hasPermission) {
        const location = await locationService.getCurrentLocation();
        if (location) {
          setUserLocation(location);
          setSortByProximity(true);
        }
      }
    } catch (error) {
      console.error('Erro ao obter localização:', error);
    }
  };

  const loadCartorios = async () => {
    try {
      setLoading(true);
      const data = await cartorioService.buscarTodosCartorios();
      setCartorios(data);
      setFilteredCartorios(data);
    } catch (error) {
      console.error('Erro ao carregar cartórios:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCartorios = async () => {
    let filtered = cartorios;

    // Aplicar filtro por tipo primeiro (se especificado)
    if (filterType === 'tipo' && tipoFiltro) {
      filtered = await cartorioService.buscarPorTipo(tipoFiltro);
    }

    // Aplicar filtro de busca se houver texto
    if (searchText.trim() !== '') {
      switch (filterType) {
        case 'uf':
          filtered = filtered.filter(c =>
            c.uf?.toLowerCase().includes(searchText.toLowerCase())
          );
          break;
        case 'cidade':
          filtered = filtered.filter(c =>
            c.cidade?.toLowerCase().includes(searchText.toLowerCase())
          );
          break;
        case 'cnj':
          filtered = filtered.filter(c =>
            c.numeroCNJ?.includes(searchText)
          );
          break;
        case 'tipo':
          // Se já filtrou por tipo, apenas busca dentro dos resultados
          filtered = filtered.filter(
            c =>
              c.tituloCartorio?.toLowerCase().includes(searchText.toLowerCase()) ||
              c.cidade?.toLowerCase().includes(searchText.toLowerCase()) ||
              c.uf?.toLowerCase().includes(searchText.toLowerCase()) ||
              c.numeroCNJ?.includes(searchText)
          );
          break;
        default:
          filtered = filtered.filter(
            c =>
              c.tituloCartorio?.toLowerCase().includes(searchText.toLowerCase()) ||
              c.cidade?.toLowerCase().includes(searchText.toLowerCase()) ||
              c.uf?.toLowerCase().includes(searchText.toLowerCase()) ||
              c.numeroCNJ?.includes(searchText)
          );
      }
    }

    // Ordenar por proximidade se a localização estiver disponível
    if (sortByProximity && userLocation) {
      // Por enquanto, apenas marca que está ordenado por proximidade
      // A ordenação real requereria coordenadas dos cartórios (geocoding)
      // Por enquanto, mantém a ordem original
    }

    setFilteredCartorios(filtered);
    setCurrentPage(1);
  };

  const handleToggleFavorite = async (cartorio: Cartorio) => {
    try {
      if (!cartorio.numeroCNJ) return;

      const isFavorite = favorites.has(cartorio.numeroCNJ);
      
      if (isFavorite) {
        await storageService.removeFavorite(cartorio.numeroCNJ);
        const newFavorites = new Set(favorites);
        newFavorites.delete(cartorio.numeroCNJ);
        setFavorites(newFavorites);
      } else {
        await storageService.addFavorite(cartorio);
        const newFavorites = new Set(favorites);
        newFavorites.add(cartorio.numeroCNJ);
        setFavorites(newFavorites);
      }
    } catch (error) {
      console.error('Erro ao alternar favorito:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o favorito.');
    }
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\D/g, '')}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const totalPages = Math.ceil(filteredCartorios.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCartorios = filteredCartorios.slice(startIndex, endIndex);

  const renderItem = ({item}: {item: Cartorio}) => {
    const isFavorite = item.numeroCNJ ? favorites.has(item.numeroCNJ) : false;
    
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.tituloCartorio}
            </Text>
            {item.numeroCNJ && (
              <Text style={styles.cardCNJ}>CNJ: {item.numeroCNJ}</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => handleToggleFavorite(item)}>
            <Text style={styles.favoriteIcon}>
              {isFavorite ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.cardAddress}>
          {item.endereco}
          {item.numero && `, ${item.numero}`}
          {item.bairro && ` - ${item.bairro}`}
        </Text>
        <Text style={styles.cardAddress}>
          {item.cidade} - {item.uf}
        </Text>

        <View style={styles.cardActions}>
          {item.telefone && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleCall(item.telefone || '')}>
              <Text style={styles.actionButtonIcon}>📞</Text>
              <Text style={styles.actionButtonText}>Ligar</Text>
            </TouchableOpacity>
          )}
          {item.email && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEmail(item.email || '')}>
              <Text style={styles.actionButtonIcon}>✉️</Text>
              <Text style={styles.actionButtonText}>Email</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() =>
              navigation.navigate('CartorioDetail', {cartorio: item} as never)
            }>
            <Text style={styles.detailsIcon}>📄</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Carregando cartórios...</Text>
      </View>
    );
  }

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
          <Text style={styles.topBarTitle}>CartórioConnect</Text>
        </View>
        <View style={styles.menuButton}>
          <Text style={styles.menuIcon}>⋮</Text>
        </View>
      </View>

      {/* Barra de Busca */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar cartórios..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === 'all' && styles.filterButtonActive,
            ]}
            onPress={() => setFilterType('all')}>
            <Text
              style={[
                styles.filterButtonText,
                filterType === 'all' && styles.filterButtonTextActive,
              ]}>
              Todos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === 'uf' && styles.filterButtonActive,
            ]}
            onPress={() => setFilterType('uf')}>
            <Text
              style={[
                styles.filterButtonText,
                filterType === 'uf' && styles.filterButtonTextActive,
              ]}>
              UF
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === 'cidade' && styles.filterButtonActive,
            ]}
            onPress={() => setFilterType('cidade')}>
            <Text
              style={[
                styles.filterButtonText,
                filterType === 'cidade' && styles.filterButtonTextActive,
              ]}>
              Cidade
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === 'cnj' && styles.filterButtonActive,
            ]}
            onPress={() => setFilterType('cnj')}>
            <Text
              style={[
                styles.filterButtonText,
                filterType === 'cnj' && styles.filterButtonTextActive,
              ]}>
              CNJ
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista */}
      <FlatList
        data={paginatedCartorios}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item.numeroCNJ || `cartorio-${index}`
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum cartório encontrado</Text>
          </View>
        }
      />

      {/* Paginação */}
      {totalPages > 1 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
            onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}>
            <Text style={styles.pageButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.pageInfo}>
            Página {currentPage} de {totalPages}
          </Text>
          <TouchableOpacity
            style={[
              styles.pageButton,
              currentPage === totalPages && styles.pageButtonDisabled,
            ]}
            onPress={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}>
            <Text style={styles.pageButtonText}>→</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.textSubtle,
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
  },
  menuIcon: {
    fontSize: 24,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  // Barra de Busca
  searchContainer: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 4,
    marginBottom: 12,
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
    paddingVertical: Platform.OS === 'android' ? 10 : 0,
  },
  clearIcon: {
    fontSize: 18,
    color: '#999',
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: COLORS.white,
  },
  // Lista
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  // Cards (estilo similar à HomeScreen)
  card: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardHeaderLeft: {
    flex: 1,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  favoriteButton: {
    padding: 4,
  },
  favoriteIcon: {
    fontSize: 24,
  },
  cardCNJ: {
    fontSize: 14,
    color: COLORS.textSubtle,
    marginBottom: 8,
  },
  cardAddress: {
    fontSize: 14,
    color: COLORS.textSubtle,
    marginBottom: 4,
  },
  cardActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtonIcon: {
    fontSize: 16,
    color: COLORS.white,
  },
  detailsButton: {
    marginLeft: 'auto',
    padding: 8,
  },
  detailsIcon: {
    fontSize: 20,
    color: COLORS.primary,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSubtle,
  },
  // Paginação
  paginationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 16,
  },
  pageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.secondary,
  },
  pageButtonDisabled: {
    opacity: 0.4,
  },
  pageButtonText: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  pageInfo: {
    fontSize: 14,
    color: COLORS.textSubtle,
  },
});

export default CartorioListScreen;
