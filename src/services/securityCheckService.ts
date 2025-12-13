/**
 * SecurityCheckService - Verificações de Segurança do Dispositivo
 * 
 * Detecta dispositivos root/jailbreak e outras ameaças de segurança
 */

import {Platform} from 'react-native';

// Importação condicional do react-native-device-info
let DeviceInfo: any = null;
try {
  DeviceInfo = require('react-native-device-info');
} catch (error) {
  console.warn('react-native-device-info não disponível');
}

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
    try {
      if (!DeviceInfo) {
        // Se DeviceInfo não estiver disponível, retornar false (não detectado)
        return {isRooted: false, isJailbroken: false};
      }

      const isEmulator = await DeviceInfo.isEmulator();
      const [isRooted, isJailbroken] = await Promise.all([
        isEmulator ? Promise.resolve(false) : DeviceInfo.isRooted(),
        Platform.OS === 'ios' ? DeviceInfo.isJailBroken() : Promise.resolve(false),
      ]);

      return {isRooted: isRooted || false, isJailbroken: isJailbroken || false};
    } catch (error) {
      console.error('❌ Erro ao verificar root/jailbreak:', error);
      // Em caso de erro, assumir que não está root/jailbreak para não bloquear usuários legítimos
      return {isRooted: false, isJailbroken: false};
    }
  }

  /**
   * Verifica se o app está sendo debugado
   */
  async checkDebugging(): Promise<boolean> {
    try {
      if (!DeviceInfo) {
        return false;
      }

      // Verificar se está rodando em modo debug
      const isDebug = __DEV__;
      
      // Verificar se é emulador/simulador (mais permissivo em desenvolvimento)
      const isEmulator = await DeviceInfo.isEmulator();

      // Em desenvolvimento, permitir debugging
      if (isDebug && isEmulator) {
        return false; // Não considerar como ameaça em dev
      }

      // Em produção, verificar se está sendo debugado
      // Nota: Detecção completa de debugging requer implementação nativa adicional
      return false; // Por enquanto, não detecta (pode ser expandido)
    } catch (error) {
      console.error('❌ Erro ao verificar debugging:', error);
      return false;
    }
  }

  /**
   * Executa todas as verificações de segurança
   */
  async performSecurityCheck(): Promise<SecurityStatus> {
    const warnings: string[] = [];
    
    try {
      const {isRooted, isJailbroken} = await this.checkRootJailbreak();
      const isDebuggingEnabled = await this.checkDebugging();

      if (isRooted) {
        warnings.push('Dispositivo Android está com root ativo. Isso pode comprometer a segurança.');
      }

      if (isJailbroken) {
        warnings.push('Dispositivo iOS está com jailbreak ativo. Isso pode comprometer a segurança.');
      }

      if (isDebuggingEnabled && !__DEV__) {
        warnings.push('App está sendo debugado em modo de produção. Isso pode indicar engenharia reversa.');
      }

      const isSecure = !isRooted && !isJailbroken && !isDebuggingEnabled;

      return {
        isRooted,
        isJailbroken,
        isDebuggingEnabled,
        isSecure,
        warnings,
      };
    } catch (error) {
      console.error('❌ Erro ao executar verificação de segurança:', error);
      return {
        isRooted: false,
        isJailbroken: false,
        isDebuggingEnabled: false,
        isSecure: true, // Assumir seguro em caso de erro
        warnings: [],
      };
    }
  }

  /**
   * Verifica se o app deve bloquear funcionalidades devido a problemas de segurança
   */
  async shouldBlockFeatures(): Promise<boolean> {
    const status = await this.performSecurityCheck();
    
    // Bloquear apenas se estiver root/jailbreak E não estiver em desenvolvimento
    if (!__DEV__ && (status.isRooted || status.isJailbroken)) {
      return true;
    }

    return false;
  }

  /**
   * Obtém mensagem de aviso para o usuário
   */
  getSecurityWarningMessage(status: SecurityStatus): string | null {
    if (status.warnings.length === 0) {
      return null;
    }

    return status.warnings.join('\n\n');
  }
}

export const securityCheckService = new SecurityCheckService();

