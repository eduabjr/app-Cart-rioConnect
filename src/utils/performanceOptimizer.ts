/**
 * Utilitários para otimização de performance e gerenciamento de recursos
 * Garante que o app não consuma recursos desnecessários
 */

import {cartorioService} from '../services/cartorioService';

/**
 * Limpa referências e libera memória
 */
export const clearMemoryCache = () => {
  // Limpar cache do serviço de cartórios
  cartorioService.clearCache();
  
  // Forçar garbage collection se disponível (apenas em desenvolvimento)
  if (__DEV__ && global.gc) {
    global.gc();
  }
};

/**
 * Pausa qualquer processamento pesado quando o app vai para background
 * Garante que nenhum recurso seja consumido desnecessariamente
 */
export const pauseHeavyProcessing = () => {
  // Limpar cache para liberar memória
  clearMemoryCache();
  
  // Como o app é 100% offline, não há:
  // - Chamadas de rede para cancelar
  // - Serviços em foreground para parar
  // - Sincronizações para pausar
  // - Localização para desativar
  
  console.log('✅ App em background - Recursos liberados');
};

/**
 * Retoma processamento quando o app volta para primeiro plano
 */
export const resumeProcessing = () => {
  // O cache será recarregado automaticamente quando necessário
  // Não há necessidade de pré-carregar dados
  console.log('✅ App em primeiro plano - Pronto para uso');
};

/**
 * Verifica se o app está em primeiro plano
 */
export const isAppInForeground = (appState: string): boolean => {
  return appState === 'active';
};

