import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import {useNavigation} from '@react-navigation/native';
import {cartorioService, Cartorio} from '../services/cartorioService';

const CartorioListScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [cartorios, setCartorios] = useState<Cartorio[]>([]);
  const [filteredCartorios, setFilteredCartorios] = useState<Cartorio[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'uf' | 'cidade' | 'cnj'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadCartorios();
  }, []);

  useEffect(() => {
    filterCartorios();
  }, [searchText, cartorios, filterType]);

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

  const filterCartorios = () => {
    if (searchText.trim() === '') {
      setFilteredCartorios(cartorios);
      return;
    }

    let filtered = cartorios;

    switch (filterType) {
      case 'uf':
        filtered = cartorios.filter(c =>
          c.uf?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      case 'cidade':
        filtered = cartorios.filter(c =>
          c.cidade?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      case 'cnj':
        filtered = cartorios.filter(c =>
          c.numeroCNJ?.includes(searchText)
        );
        break;
      default:
        filtered = cartorios.filter(
          c =>
            c.tituloCartorio?.toLowerCase().includes(searchText.toLowerCase()) ||
            c.cidade?.toLowerCase().includes(searchText.toLowerCase()) ||
            c.uf?.toLowerCase().includes(searchText.toLowerCase()) ||
            c.numeroCNJ?.includes(searchText)
        );
    }

    setFilteredCartorios(filtered);
    setCurrentPage(1);
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\D/g, '')}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await Clipboard.setStringAsync(text);
      Alert.alert('Copiado!', `${type} copiado para a área de transferência.`);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível copiar.');
    }
  };

  const totalPages = Math.ceil(filteredCartorios.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCartorios = filteredCartorios.slice(startIndex, endIndex);

  const renderItem = ({item}: {item: Cartorio}) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIconContainer}>
          <Text style={styles.cardIcon}>📋</Text>
        </View>
        <View style={styles.cardHeaderText}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.tituloCartorio}
          </Text>
          {item.uf && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{item.uf}</Text>
            </View>
          )}
        </View>
      </View>

      {item.numeroCNJ && (
        <View style={styles.cnjContainer}>
          <Text style={styles.cnjLabel}>CNJ:</Text>
          <Text style={styles.cnjValue}>{item.numeroCNJ}</Text>
        </View>
      )}

      <View style={styles.divider} />

      <View style={styles.addressContainer}>
        <Text style={styles.addressIcon}>📍</Text>
        <View style={styles.addressTextContainer}>
          <Text style={styles.addressText}>
            {item.endereco}
            {item.numero && `, ${item.numero}`}
            {item.bairro && ` - ${item.bairro}`}
          </Text>
          <Text style={styles.addressText}>
            {item.cidade} - {item.uf}
          </Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        {item.telefone && (
          <>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => handleCall(item.telefone || '')}>
              <Text style={styles.buttonIcon}>📞</Text>
              <Text style={styles.primaryButtonText}>Ligar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => copyToClipboard(item.telefone || '', 'Telefone')}>
              <Text style={styles.buttonIcon}>📋</Text>
              <Text style={styles.secondaryButtonText}>Copiar</Text>
            </TouchableOpacity>
          </>
        )}
        {item.email && (
          <>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => handleEmail(item.email || '')}>
              <Text style={styles.buttonIcon}>✉️</Text>
              <Text style={styles.primaryButtonText}>Email</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => copyToClipboard(item.email || '', 'Email')}>
              <Text style={styles.buttonIcon}>📋</Text>
              <Text style={styles.secondaryButtonText}>Copiar</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() =>
            navigation.navigate('CartorioDetail', {cartorio: item} as never)
          }>
          <Text style={styles.detailsButtonText}>Ver Detalhes</Text>
          <Text style={styles.detailsArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Carregando cartórios...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent" 
        translucent={true}
      />
      {/* Header Moderno */}
      <View style={[styles.header, {paddingTop: insets.top + 16}]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CartórioConnect</Text>
        <View style={styles.headerRight}>
          <Text style={styles.headerIcon}>⚖️</Text>
        </View>
      </View>

      {/* Barra de Busca Moderna */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar cartórios..."
            placeholderTextColor="#a0aec0"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.filterContainer}>
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
            <Text style={styles.emptyIcon}>🔍</Text>
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
    backgroundColor: '#f5f7fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#718096',
    fontWeight: '500',
  },
  header: {
    backgroundColor: '#667eea',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 40,
  },
  headerIcon: {
    fontSize: 22,
  },
  searchContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2d3748',
    padding: 0,
  },
  clearIcon: {
    fontSize: 18,
    color: '#a0aec0',
    padding: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f7fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterButtonActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  filterButtonText: {
    fontSize: 13,
    color: '#718096',
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardIcon: {
    fontSize: 22,
  },
  cardHeaderText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2d3748',
    flex: 1,
    lineHeight: 24,
  },
  badgeContainer: {
    backgroundColor: '#667eea',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  cnjContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 6,
  },
  cnjLabel: {
    fontSize: 13,
    color: '#718096',
    fontWeight: '600',
    marginRight: 6,
  },
  cnjValue: {
    fontSize: 13,
    color: '#2d3748',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 12,
  },
  addressContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  addressIcon: {
    fontSize: 18,
    marginRight: 10,
    marginTop: 2,
  },
  addressTextContainer: {
    flex: 1,
  },
  addressText: {
    fontSize: 14,
    color: '#4a5568',
    lineHeight: 20,
    marginBottom: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#667eea',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#f7fafc',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  secondaryButtonText: {
    color: '#4a5568',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonIcon: {
    fontSize: 16,
  },
  detailsButton: {
    flex: 1,
    backgroundColor: '#f7fafc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minWidth: 120,
  },
  detailsButtonText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  detailsArrow: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 16,
    color: '#a0aec0',
    fontWeight: '500',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 20,
  },
  pageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f7fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  pageButtonDisabled: {
    opacity: 0.4,
  },
  pageButtonText: {
    fontSize: 18,
    color: '#667eea',
    fontWeight: '700',
  },
  pageInfo: {
    fontSize: 14,
    color: '#718096',
    fontWeight: '600',
  },
});

export default CartorioListScreen;
