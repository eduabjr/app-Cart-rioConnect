/**
 * KeyManagementService - Gerenciamento Seguro de Chaves
 * 
 * Gerencia chaves de criptografia usando Keychain (iOS) e Keystore (Android)
 */

import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

const ENCRYPTION_KEY_NAME = 'cartorio_encryption_key';
const KEY_LENGTH = 32; // 256 bits para AES-256

class KeyManagementService {
  /**
   * Gera uma chave de criptografia aleatória
   */
  async generateKey(): Promise<string> {
    try {
      // Gerar bytes aleatórios
      const randomBytes = await Crypto.getRandomBytesAsync(KEY_LENGTH);
      // Converter para string hexadecimal
      const key = Array.from(randomBytes)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
      return key;
    } catch (error) {
      console.error('❌ Erro ao gerar chave:', error);
      throw new Error('Falha ao gerar chave de criptografia');
    }
  }

  /**
   * Obtém ou cria a chave de criptografia do dispositivo
   */
  async getOrCreateEncryptionKey(): Promise<string> {
    try {
      // Tentar recuperar chave existente
      let key = await SecureStore.getItemAsync(ENCRYPTION_KEY_NAME);
      
      if (!key) {
        // Se não existir, gerar nova chave
        console.log('🔑 Gerando nova chave de criptografia...');
        key = await this.generateKey();
        await this.storeKey(key);
      }
      
      return key;
    } catch (error) {
      console.error('❌ Erro ao obter/criar chave:', error);
      throw error;
    }
  }

  /**
   * Armazena a chave no Keychain/Keystore
   */
  async storeKey(key: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(ENCRYPTION_KEY_NAME, key, {
        requireAuthentication: false, // Não requer biometria por padrão
        keychainAccessible: SecureStore.WHEN_UNLOCKED, // Acessível quando desbloqueado
      });
      console.log('✅ Chave armazenada com sucesso');
    } catch (error) {
      console.error('❌ Erro ao armazenar chave:', error);
      throw new Error('Falha ao armazenar chave de criptografia');
    }
  }

  /**
   * Recupera a chave do Keychain/Keystore
   */
  async retrieveKey(): Promise<string | null> {
    try {
      const key = await SecureStore.getItemAsync(ENCRYPTION_KEY_NAME);
      return key;
    } catch (error) {
      console.error('❌ Erro ao recuperar chave:', error);
      return null;
    }
  }

  /**
   * Remove a chave do Keychain/Keystore
   */
  async deleteKey(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(ENCRYPTION_KEY_NAME);
      console.log('✅ Chave removida com sucesso');
    } catch (error) {
      console.error('❌ Erro ao remover chave:', error);
      throw new Error('Falha ao remover chave de criptografia');
    }
  }

  /**
   * Verifica se a chave existe
   */
  async hasKey(): Promise<boolean> {
    try {
      const key = await SecureStore.getItemAsync(ENCRYPTION_KEY_NAME);
      return key !== null;
    } catch (error) {
      return false;
    }
  }
}

export const keyManagementService = new KeyManagementService();

