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
  Modal,
  Image,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {cartorioService, Cartorio} from '../services/cartorioService';
import {storageService} from '../services/storageService';
import {locationService} from '../services/locationService';

// Cores principais do design:
const COLORS = {
  primary: '#273d54',
  secondary: '#E3F2FD',
  background: '#F0F4F8',
  white: '#FFFFFF',
  textDark: '#333333',
  textSubtle: '#757575',
  star: '#FFB800',
  starEmpty: '#D0D0D0',
};

// Tipos de cartório disponíveis
const TIPOS_CARTORIO = [
  {id: 'todos', label: 'Todos os Tipos', icon: '🏢'},
  {id: 'Civil', label: 'Civil', icon: '👤'},
  {id: 'Protesto', label: 'Protesto', icon: '📜'},
  {id: 'Imóveis', label: 'Imóveis', icon: '🏠'},
  {id: 'Títulos e Documentos', label: 'Títulos e Documentos', icon: '📄'},
  {id: 'Jurídico', label: 'Jurídico', icon: '⚖️'},
  {id: 'Tabelionato de Notas', label: 'Tabelionato de Notas', icon: '✍️'},
];

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
  
  // Tipo de cartório selecionado
  const [tipoSelecionado, setTipoSelecionado] = useState<string>(
    route.params && route.params.tipo ? route.params.tipo : 'todos'
  );
  
  // Modal de seleção de tipo
  const [showTipoModal, setShowTipoModal] = useState(false);
  
  // Filtros: all, uf, cnj, favoritos
  const [filterType, setFilterType] = useState<'all' | 'uf' | 'cnj' | 'favoritos'>(
    route.params && route.params.filterType === 'uf' ? 'uf' : 
    route.params && route.params.filterType === 'cnj' ? 'cnj' : 'all'
  );
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadCartorios();
    loadFavorites();
  }, [tipoSelecionado]);

  useEffect(() => {
    if (route.params && route.params.tipo) {
      setTipoSelecionado(route.params.tipo);
    }
  }, [route.params]);

  useEffect(() => {
    filterCartorios();
  }, [searchText, cartorios, filterType, favorites]);

  const loadFavorites = async () => {
    try {
      const favs = await storageService.getFavorites();
      const favSet = new Set(favs.map(f => f.numeroCNJ || ''));
      setFavorites(favSet);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    }
  };

  const loadCartorios = async () => {
    try {
      setLoading(true);
      let data: Cartorio[];
      
      if (tipoSelecionado && tipoSelecionado !== 'todos') {
        // Carregar cartórios do tipo específico
        data = await cartorioService.buscarPorTipo(tipoSelecionado);
      } else {
        // Carregar todos os cartórios
        data = await cartorioService.buscarTodosCartorios();
      }
      
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

    // Filtrar por favoritos primeiro
    if (filterType === 'favoritos') {
      filtered = cartorios.filter(c => {
        const cnj = c.numeroCNJ || '';
        return favorites.has(cnj);
      });
    }

    // Aplicar filtro de busca se houver texto
    if (searchText.trim() !== '') {
      const termo = searchText.toLowerCase();
      
      if (filterType === 'uf') {
        filtered = filtered.filter(c => {
          const uf = c.uf ? c.uf.toLowerCase() : '';
          return uf.includes(termo);
        });
      } else if (filterType === 'cnj') {
        filtered = filtered.filter(c => {
          const cnj = c.numeroCNJ || '';
          return cnj.includes(searchText);
        });
      } else {
        // Busca em todos os campos
        filtered = filtered.filter(c => {
          const titulo = c.tituloCartorio ? c.tituloCartorio.toLowerCase() : '';
          const cidade = c.cidade ? c.cidade.toLowerCase() : '';
          const uf = c.uf ? c.uf.toLowerCase() : '';
          const cnj = c.numeroCNJ ? c.numeroCNJ.toLowerCase() : '';
          const endereco = c.endereco ? c.endereco.toLowerCase() : '';
          const bairro = c.bairro ? c.bairro.toLowerCase() : '';
          const responsavel = c.responsavel ? c.responsavel.toLowerCase() : '';
          const telefone = c.telefone ? c.telefone.toLowerCase() : '';
          const email = c.email ? c.email.toLowerCase() : '';
          
          return titulo.includes(termo) ||
                 cidade.includes(termo) ||
                 uf.includes(termo) ||
                 cnj.includes(termo) ||
                 endereco.includes(termo) ||
                 bairro.includes(termo) ||
                 responsavel.includes(termo) ||
                 telefone.includes(termo) ||
                 email.includes(termo);
        });
      }
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
    const cleanPhone = phone.replace(/\D/g, '');
    Linking.openURL('tel:' + cleanPhone);
  };

  const handleEmail = (email: string) => {
    Linking.openURL('mailto:' + email);
  };

  const handleSelectTipo = (tipo: string) => {
    setTipoSelecionado(tipo);
    setShowTipoModal(false);
  };

  const getTipoLabel = () => {
    const tipo = TIPOS_CARTORIO.find(t => t.id === tipoSelecionado);
    return tipo ? tipo.label : 'Selecionar Tipo';
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
            <Text style={[styles.favoriteIcon, isFavorite && styles.favoriteIconActive]}>
              ★
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.cardAddress}>
          {item.endereco}
          {item.numero ? ', ' + item.numero : ''}
          {item.bairro ? ' - ' + item.bairro : ''}
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
            onPress={() => navigation.navigate('CartorioDetail', {cartorio: item})}>
            <Text style={styles.detailsButtonText}>Ver Detalhes</Text>
            <Text style={styles.detailsButtonArrow}>→</Text>
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
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent={false}
      />
      
      <View style={[
        styles.blueBackground, 
        {
          top: insets.top, 
          height: Platform.OS === 'ios' ? 220 : 180,
        }
      ]} />

      <View style={[styles.topBar, {paddingTop: 12, paddingBottom: 12}]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.topBarLeft}>
          <View style={styles.topBarIconContainer}>
            <Image
              source={require('../../assets/images/Gemini_Generated_Image_fhlw55fhlw55fhlw-removebg-preview.png')}
              style={styles.topBarIconImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.topBarTitle}>Cartórios</Text>
        </View>
        <View style={styles.menuButton} />
      </View>

      {/* Barra de Busca e Filtros */}
      <View style={styles.searchContainer}>
        {/* Botão de Tipo */}
        <TouchableOpacity
          style={styles.tipoButton}
          onPress={() => setShowTipoModal(true)}>
          <Text style={styles.tipoButtonLabel}>Tipo:</Text>
          <Text style={styles.tipoButtonValue}>{getTipoLabel()}</Text>
          <Text style={styles.tipoButtonArrow}>▼</Text>
        </TouchableOpacity>

        {/* Campo de Busca */}
        <View style={styles.searchInputWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar em todos os campos..."
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

        {/* Filtros */}
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
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === 'favoritos' && styles.filterButtonActive,
              styles.filterButtonFavoritos,
            ]}
            onPress={() => setFilterType('favoritos')}>
            <Text style={styles.filterButtonStar}>★</Text>
            <Text
              style={[
                styles.filterButtonText,
                filterType === 'favoritos' && styles.filterButtonTextActive,
              ]}>
              Favoritos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contador de resultados */}
        <Text style={styles.resultCount}>
          {filteredCartorios.length} cartório{filteredCartorios.length !== 1 ? 's' : ''} encontrado{filteredCartorios.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Lista */}
      <FlatList
        data={paginatedCartorios}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item.numeroCNJ ? item.numeroCNJ : 'cartorio-' + index
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>Nenhum cartório encontrado</Text>
            <Text style={styles.emptySubtext}>Tente ajustar os filtros ou termo de busca</Text>
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
            onPress={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}>
            <Text style={styles.pageButtonText}>→</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal de Seleção de Tipo */}
      <Modal
        visible={showTipoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTipoModal(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTipoModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecionar Tipo</Text>
            {TIPOS_CARTORIO.map((tipo) => (
              <TouchableOpacity
                key={tipo.id}
                style={[
                  styles.modalOption,
                  tipoSelecionado === tipo.id && styles.modalOptionActive,
                ]}
                onPress={() => handleSelectTipo(tipo.id)}>
                <Text style={styles.modalOptionIcon}>{tipo.icon}</Text>
                <Text style={[
                  styles.modalOptionText,
                  tipoSelecionado === tipo.id && styles.modalOptionTextActive,
                ]}>
                  {tipo.label}
                </Text>
                {tipoSelecionado === tipo.id && (
                  <Text style={styles.modalOptionCheck}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
  blueBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: '100%',
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
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
    width: 40,
  },
  // Barra de Busca
  searchContainer: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  // Botão de Tipo
  tipoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  tipoButtonLabel: {
    fontSize: 14,
    color: COLORS.textSubtle,
    marginRight: 8,
  },
  tipoButtonValue: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  tipoButtonArrow: {
    fontSize: 12,
    color: COLORS.primary,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
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
    flexWrap: 'wrap',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    marginRight: 8,
    marginBottom: 8,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterButtonFavoritos: {
    backgroundColor: '#FFF8E1',
    borderColor: COLORS.star,
  },
  filterButtonStar: {
    fontSize: 14,
    color: COLORS.star,
    marginRight: 4,
  },
  filterButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: COLORS.white,
  },
  resultCount: {
    fontSize: 13,
    color: COLORS.textSubtle,
    marginTop: 8,
    textAlign: 'center',
  },
  // Lista
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  // Cards
  card: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: Platform.OS === 'ios' ? '#000' : undefined,
    shadowOffset: Platform.OS === 'ios' ? {width: 0, height: 2} : undefined,
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : undefined,
    shadowRadius: Platform.OS === 'ios' ? 8 : undefined,
    elevation: Platform.OS === 'android' ? 4 : undefined,
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
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  favoriteButton: {
    padding: 4,
  },
  favoriteIcon: {
    fontSize: 28,
    color: COLORS.starEmpty,
  },
  favoriteIconActive: {
    color: COLORS.star,
  },
  cardCNJ: {
    fontSize: 13,
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
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  actionButtonIcon: {
    fontSize: 16,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 'auto',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: 6,
  },
  detailsButtonArrow: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.textDark,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSubtle,
    textAlign: 'center',
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
  },
  pageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.secondary,
    marginHorizontal: 12,
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
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: COLORS.background,
  },
  modalOptionActive: {
    backgroundColor: COLORS.secondary,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  modalOptionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  modalOptionText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textDark,
    fontWeight: '500',
  },
  modalOptionTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  modalOptionCheck: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default CartorioListScreen;
