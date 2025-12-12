import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import {RouteProp, useRoute} from '@react-navigation/native';
import {StackNavigationProp, useNavigation} from '@react-navigation/stack';
import {Cartorio} from '../services/cartorioService';
import AdBanner from '../components/AdBanner';
import {RootStackParamList} from '../../App';

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

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\D/g, '')}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent" 
        translucent={true}
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, {paddingTop: insets.top + 16}]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes</Text>
        <View style={styles.headerRight} />
      </View>

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
      </View>

      {/* Área de Anúncio */}
      <AdBanner
        adType="image"
        imageUri={require('../../assets/images/logo.png')}
        position="center"
        height={100}
        onAdPress={() => console.log('Anúncio clicado')}
      />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  scrollView: {
    flex: 1,
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
    width: 40,
  },
  content: {
    padding: 24,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#e2e8f0',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2d3748',
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 12,
  },
  ufBadge: {
    backgroundColor: '#667eea',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  ufBadgeText: {
    color: '#ffffff',
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
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionIcon: {
    fontSize: 18,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#718096',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  valueContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  value: {
    fontSize: 16,
    color: '#2d3748',
    lineHeight: 24,
    marginBottom: 4,
  },
  actionButton: {
    backgroundColor: '#667eea',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#667eea',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    flex: 1,
  },
  actionButtonIcon: {
    fontSize: 20,
    marginLeft: 12,
  },
});

export default CartorioDetailScreen;
