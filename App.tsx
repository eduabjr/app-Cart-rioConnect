import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StatusBar as ExpoStatusBar} from 'expo-status-bar';
import {AppState, StatusBar, Platform} from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import CartorioListScreen from './src/screens/CartorioListScreen';
import CartorioDetailScreen from './src/screens/CartorioDetailScreen';
import {useAppState} from './src/hooks/useAppState';
import {pauseHeavyProcessing, resumeProcessing} from './src/utils/performanceOptimizer';
import {Cartorio} from './src/services/cartorioService';

export type RootStackParamList = {
  Home: undefined;
  CartorioList: undefined;
  CartorioDetail: {cartorio: Cartorio};
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  // Gerencia o ciclo de vida do app para otimizar recursos
  useAppState();

  useEffect(() => {
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
        barStyle="light-content" 
        backgroundColor="transparent" 
        translucent={true}
      />
      {/* StatusBar do Expo para compatibilidade */}
      <ExpoStatusBar style="light" backgroundColor="transparent" translucent />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
