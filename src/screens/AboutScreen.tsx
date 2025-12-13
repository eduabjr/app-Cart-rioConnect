/**
 * Tela Sobre / Configurações
 * Exibe informações sobre o app e a base de dados
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {cartorioService, DatabaseMetadata} from '../services/cartorioService';

// Cores principais do design (igual à HomeScreen):
const COLORS = {
  primary: '#273d54', // Azul Escuro Principal
  secondary: '#E3F2FD', // Azul Claro para cards de filtro
  background: '#F0F4F8', // Fundo cinza claro/azul suave
  white: '#FFFFFF',
  textDark: '#333333',
  textSubtle: '#757575',
};

type AboutScreenNavigationProp = StackNavigationProp<RootStackParamList, 'About'>;

const AboutScreen = () => {
  const navigation = useNavigation<AboutScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const [metadata, setMetadata] = useState<DatabaseMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updateStats, setUpdateStats] = useState<{[key: string]: number} | null>(null);

  useEffect(() => {
    loadMetadata();
  }, []);

  const loadMetadata = async () => {
    try {
      const data = await cartorioService.getMetadata();
      setMetadata(data);
    } catch (error) {
      console.error('Erro ao carregar metadados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecarregarDados = async () => {
    setUpdating(true);
    setUpdateStats(null);
    
    try {
      const resultado = await cartorioService.recarregarTodosArquivos();
      
      if (resultado.sucesso) {
        setUpdateStats(resultado.porTipo);
        
        // Atualizar metadata com novo total
        setMetadata(prev => prev ? {
          ...prev,
          totalCartorios: resultado.total,
          lastUpdate: new Date().toISOString(),
        } : null);

        Alert.alert(
          '✅ Sucesso',
          resultado.mensagem,
          [{text: 'OK'}]
        );
      } else {
        Alert.alert(
          '❌ Erro',
          resultado.mensagem,
          [{text: 'OK'}]
        );
      }
    } catch (error) {
      console.error('Erro ao recarregar dados:', error);
      Alert.alert(
        '❌ Erro',
        'Ocorreu um erro ao recarregar os dados.',
        [{text: 'OK'}]
      );
    } finally {
      setUpdating(false);
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
            <Text style={styles.topBarIcon}>ℹ️</Text>
          </View>
          <Text style={styles.topBarTitle}>Sobre</Text>
        </View>
        <View style={styles.menuButton} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.iconContainer}>
              <Text style={styles.headerIcon}>🏢</Text>
            </View>
            <Text style={styles.title}>CartórioConnect</Text>
            <Text style={styles.subtitle}>Versão {metadata?.version || '1.0.0'}</Text>
          </View>

          {/* Informações da Base de Dados */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Text style={styles.sectionIcon}>📊</Text>
              </View>
              <Text style={styles.sectionLabel}>Base de Dados</Text>
            </View>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={COLORS.primary} />
              </View>
            ) : (
              <View style={styles.infoContainer}>
                <InfoRow 
                  label="Última Atualização" 
                  value={metadata ? cartorioService.formatLastUpdateDate(metadata.lastUpdate) : 'Carregando...'}
                  highlight={true}
                />
                <InfoRow 
                  label="Total de Cartórios" 
                  value={metadata && metadata.totalCartorios ? metadata.totalCartorios.toString() : '0'}
                />
                <InfoRow 
                  label="Versão da Base" 
                  value={metadata && metadata.version ? metadata.version : '1.0.0'}
                />
              </View>
            )}
            
            {/* Botão de Atualização */}
            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleRecarregarDados}
              disabled={updating}
              activeOpacity={0.8}>
              {updating ? (
                <View style={styles.updateButtonContent}>
                  <ActivityIndicator size="small" color={COLORS.white} />
                  <Text style={styles.updateButtonText}>Recarregando...</Text>
                </View>
              ) : (
                <View style={styles.updateButtonContent}>
                  <Text style={styles.updateButtonIcon}>🔄</Text>
                  <Text style={styles.updateButtonText}>Recarregar Dados</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          
          {/* Estatísticas por Tipo (exibido após atualização) */}
          {updateStats && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Text style={styles.sectionIcon}>📈</Text>
                </View>
                <Text style={styles.sectionLabel}>Cartórios por Tipo</Text>
              </View>
              <View style={styles.statsContainer}>
                {Object.entries(updateStats).map(([tipo, quantidade]) => (
                  <View key={tipo} style={styles.statRow}>
                    <Text style={styles.statLabel}>{tipo}</Text>
                    <Text style={styles.statValue}>{quantidade}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Descrição */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Text style={styles.sectionIcon}>📝</Text>
              </View>
              <Text style={styles.sectionLabel}>Sobre o Aplicativo</Text>
            </View>
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText}>
                O CartórioConnect é um aplicativo 100% offline que permite consultar informações de contato de cartórios interligados em todo o Brasil.
              </Text>
              <Text style={styles.descriptionText}>
                Todos os dados são armazenados localmente no dispositivo, garantindo acesso rápido e confiável mesmo sem conexão com a internet.
              </Text>
            </View>
          </View>

          {/* Características */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Text style={styles.sectionIcon}>✨</Text>
              </View>
              <Text style={styles.sectionLabel}>Funcionalidades</Text>
            </View>
            <View style={styles.featuresContainer}>
              <FeatureItem icon="🔍" text="Busca rápida e eficiente" />
              <FeatureItem icon="⭐" text="Favoritos para acesso rápido" />
              <FeatureItem icon="🕒" text="Histórico de buscas recentes" />
              <FeatureItem icon="🗺️" text="Traçar rota para o cartório" />
              <FeatureItem icon="📤" text="Compartilhar dados facilmente" />
              <FeatureItem icon="🌐" text="100% offline - sem internet" />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// Componente auxiliar para linha de informação
const InfoRow = ({label, value, highlight = false}: {label: string; value: string; highlight?: boolean}) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={[styles.infoValue, highlight && styles.infoValueHighlight]}>
      {value}
    </Text>
  </View>
);

// Componente auxiliar para item de funcionalidade
const FeatureItem = ({icon, text}: {icon: string; text: string}) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

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
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSubtle,
    textAlign: 'center',
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
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  infoContainer: {
    backgroundColor: COLORS.secondary,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.textSubtle,
    fontWeight: '500',
  },
  infoValueHighlight: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '700',
  },
  descriptionContainer: {
    backgroundColor: COLORS.secondary,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.textDark,
    lineHeight: 22,
    marginBottom: 12,
  },
  featuresContainer: {
    backgroundColor: COLORS.secondary,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: COLORS.textDark,
    flex: 1,
  },
  // Botão de Atualização
  updateButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 16,
    shadowColor: Platform.OS === 'ios' ? COLORS.primary : undefined,
    shadowOffset: Platform.OS === 'ios' ? {width: 0, height: 4} : undefined,
    shadowOpacity: Platform.OS === 'ios' ? 0.3 : undefined,
    shadowRadius: Platform.OS === 'ios' ? 8 : undefined,
    elevation: Platform.OS === 'android' ? 6 : undefined,
  },
  updateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButtonIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  // Estatísticas por Tipo
  statsContainer: {
    backgroundColor: COLORS.secondary,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '700',
  },
});

export default AboutScreen;

