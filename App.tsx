import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StatusBar as ExpoStatusBar} from 'expo-status-bar';
import {AppState, StatusBar, Platform} from 'react-native';
// Importação condicional do AdMob
let mobileAds: any = null;
try {
  mobileAds = require('react-native-google-mobile-ads').default;
} catch (error) {
  console.warn('⚠️ AdMob não disponível (normal no Expo Go)');
}
import HomeScreen from './src/screens/HomeScreen';
import CartorioListScreen from './src/screens/CartorioListScreen';
import CartorioDetailScreen from './src/screens/CartorioDetailScreen';
import AboutScreen from './src/screens/AboutScreen';
import {useAppState} from './src/hooks/useAppState';
import {pauseHeavyProcessing, resumeProcessing} from './src/utils/performanceOptimizer';
import {Cartorio, TipoCartorio} from './src/services/cartorioService';
import {securityCheckService} from './src/services/securityCheckService';
import {Alert} from 'react-native';

export type RootStackParamList = {
  Home: undefined;
  CartorioList: {filterType?: 'uf' | 'cidade' | 'cnj' | 'tipo' | 'all'; tipoFiltro?: TipoCartorio};
  CartorioDetail: {cartorio: Cartorio};
  About: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  // Gerencia o ciclo de vida do app para otimizar recursos
  useAppState();

  useEffect(() => {
    // Verificação de segurança do dispositivo
    const checkSecurity = async () => {
      try {
        const shouldBlock = await securityCheckService.shouldBlockFeatures();
        if (shouldBlock) {
          const status = await securityCheckService.performSecurityCheck();
          const warning = securityCheckService.getSecurityWarningMessage(status);
          
          if (warning) {
            Alert.alert(
              '⚠️ Aviso de Segurança',
              warning + '\n\nO app pode ter funcionalidades limitadas por segurança.',
              [{text: 'Entendi'}]
            );
          }
        }
      } catch (error) {
        console.error('Erro ao verificar segurança:', error);
      }
    };

    // Executar verificação de segurança
    checkSecurity();

    // Inicializar o Google AdMob (apenas se disponível)
    if (mobileAds) {
      mobileAds()
        .initialize()
        .then((adapterStatuses: any) => {
          console.log('✅ Google AdMob inicializado com sucesso');
          console.log('Adapter statuses:', adapterStatuses);
        })
        .catch((error: any) => {
          console.warn('⚠️ Erro ao inicializar AdMob:', error?.message || error);
        });
    }

    // Listener para pausar processos quando o app vai para background
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        // App em background - pausar qualquer processamento
        pauseHeavyProcessing();
      } else if (nextAppState === 'active') {
        // App em primeiro plano - retomar processamento se necessário
        resumeProcessing();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <NavigationContainer>
      {/* StatusBar do React Native para controle fino */}
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent={false}
      />
      {/* StatusBar do Expo para compatibilidade */}
      <ExpoStatusBar style="dark" backgroundColor="transparent" translucent={false} />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#667eea',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'CartórioConnect', headerShown: false}}
        />
        <Stack.Screen
          name="CartorioList"
          component={CartorioListScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CartorioDetail"
          component={CartorioDetailScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
