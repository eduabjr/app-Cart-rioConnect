/**
 * SecurityCheckService - Verificações de Segurança do Dispositivo
 * 
 * Versão simplificada para Expo Go
 */

import {Platform} from 'react-native';

export interface SecurityStatus {
  isRooted: boolean;
  isJailbroken: boolean;
  isDebuggingEnabled: boolean;
  isSecure: boolean;
  warnings: string[];
}

class SecurityCheckService {
  /**
   * Verifica se o dispositivo está root/jailbreak
   */
  async checkRootJailbreak(): Promise<{isRooted: boolean; isJailbroken: boolean}> {
    // Simplificado para Expo Go - sempre retorna seguro
    return {isRooted: false, isJailbroken: false};
  }

  /**
   * Verifica se o app está sendo debugado
   */
  async checkDebugging(): Promise<boolean> {
    return false;
  }

  /**
   * Executa todas as verificações de segurança
   */
  async performSecurityCheck(): Promise<SecurityStatus> {
    return {
      isRooted: false,
      isJailbroken: false,
      isDebuggingEnabled: false,
      isSecure: true,
      warnings: [],
    };
  }

  /**
   * Verifica se o app deve bloquear funcionalidades
   */
  async shouldBlockFeatures(): Promise<boolean> {
    return false;
  }

  /**
   * Obtém mensagem de aviso para o usuário
   */
  getSecurityWarningMessage(status: SecurityStatus): string | null {
    return null;
  }
}

export const securityCheckService = new SecurityCheckService();
