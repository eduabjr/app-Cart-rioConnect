import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AdBanner from './AdBanner';
// import {BannerAdSize} from 'react-native-google-mobile-ads'; // Comentado - requer build customizado

const COLORS = {
  primary: '#273d54',
  white: '#FFFFFF',
  textSubtle: '#757575',
};

const FooterBanner = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, {paddingBottom: Math.max(insets.bottom, 0)}]}>
      {/* Espaço para o Banner AdMob */}
      <View style={styles.adContainer}>
        {/* AdMob Banner - Descomente quando fizer build customizado */}
        {/* <AdBanner 
          size={BannerAdSize.FULL_BANNER}
          position="center"
        /> */}
        
        {/* Placeholder visual enquanto AdMob não está ativo */}
        <View style={styles.placeholder}>
          <View style={styles.placeholderContent}>
            <Text style={styles.placeholderIcon}>📱</Text>
            <Text style={styles.placeholderText}>AdMob (requer build nativo)</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    zIndex: 1000,
    shadowColor: Platform.OS === 'ios' ? '#000' : undefined,
    shadowOffset: Platform.OS === 'ios' ? {width: 0, height: -2} : undefined,
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : undefined,
    shadowRadius: Platform.OS === 'ios' ? 4 : undefined,
    elevation: Platform.OS === 'android' ? 8 : undefined,
  },
  adContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    minHeight: 60,
  },
  placeholder: {
    width: '100%',
    height: 60,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#d0d0d0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  placeholderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: COLORS.textSubtle,
    fontWeight: '500',
  },
});

export default FooterBanner;


