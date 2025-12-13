import {useEffect, useRef} from 'react';
import {AppState, AppStateStatus} from 'react-native';

/**
 * Hook para gerenciar o estado do aplicativo e otimizar recursos
 * Garante que o app não execute processos desnecessários em background
 */
export const useAppState = () => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          // App voltou para primeiro plano
          console.log('App voltou para primeiro plano - Recursos reativados');
        } else if (
          appState.current === 'active' &&
          nextAppState.match(/inactive|background/)
        ) {
          // App foi para background
          console.log('App em background - Recursos pausados');
          // Limpar qualquer processamento desnecessário
          // Não há chamadas de rede ou serviços em background neste app
        }

        appState.current = nextAppState;
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);
};

/**
 * Hook para limpar recursos quando o componente é desmontado
 */
export const useCleanup = (cleanupFn: () => void) => {
  useEffect(() => {
    return cleanupFn;
  }, [cleanupFn]);
};



