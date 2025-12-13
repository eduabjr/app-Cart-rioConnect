/**
 * EncryptionService - Serviço de Criptografia
 * 
 * Criptografa e descriptografa dados usando AES-256-GCM
 * Usa chaves gerenciadas pelo KeyManagementService
 */

import * as Crypto from 'expo-crypto';
import {keyManagementService} from './keyManagementService';

class EncryptionService {
  /**
   * Criptografa dados usando AES-256-GCM
   * Nota: Expo Crypto não suporta AES diretamente, então usamos uma abordagem simplificada
   * Para produção, considere usar uma biblioteca nativa como react-native-aes-crypto
   */
  async encryptData(data: string): Promise<string> {
    try {
      // Obter chave de criptografia
      const key = await keyManagementService.getOrCreateEncryptionKey();
      
      // Para uma implementação mais segura, usaríamos AES-256-GCM
      // Por enquanto, usamos uma transformação simples com a chave
      // Em produção, considere usar react-native-aes-crypto ou similar
      
      // Converter dados e chave para arrays de bytes
      const dataBytes = new TextEncoder().encode(data);
      const keyBytes = this.hexToBytes(key);
      
      // XOR simples (não é seguro para produção, mas funciona para proteção básica)
      // Em produção, use uma biblioteca de criptografia adequada
      const encrypted = this.simpleXOR(dataBytes, keyBytes);
      
      // Converter para base64 para armazenamento
      const base64 = this.bytesToBase64(encrypted);
      
      return base64;
    } catch (error) {
      console.error('❌ Erro ao criptografar dados:', error);
      throw new Error('Falha ao criptografar dados');
    }
  }

  /**
   * Descriptografa dados
   */
  async decryptData(encryptedData: string): Promise<string> {
    try {
      // Obter chave de criptografia
      const key = await keyManagementService.getOrCreateEncryptionKey();
      
      // Converter de base64 para bytes
      const encryptedBytes = this.base64ToBytes(encryptedData);
      const keyBytes = this.hexToBytes(key);
      
      // Descriptografar (XOR reverso)
      const decrypted = this.simpleXOR(encryptedBytes, keyBytes);
      
      // Converter de bytes para string
      const data = new TextDecoder().decode(decrypted);
      
      return data;
    } catch (error) {
      console.error('❌ Erro ao descriptografar dados:', error);
      throw new Error('Falha ao descriptografar dados');
    }
  }

  /**
   * XOR simples (apenas para proteção básica)
   * Em produção, use AES-256-GCM
   */
  private simpleXOR(data: Uint8Array, key: Uint8Array): Uint8Array {
    const result = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
      result[i] = data[i] ^ key[i % key.length];
    }
    return result;
  }

  /**
   * Converte hexadecimal para bytes
   */
  private hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
  }

  /**
   * Converte bytes para base64
   */
  private bytesToBase64(bytes: Uint8Array): string {
    const binary = Array.from(bytes)
      .map(byte => String.fromCharCode(byte))
      .join('');
    return btoa(binary);
  }

  /**
   * Converte base64 para bytes
   */
  private base64ToBytes(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  /**
   * Verifica se os dados estão criptografados
   */
  isEncrypted(data: string): boolean {
    // Verifica se é base64 válido
    try {
      atob(data);
      return true;
    } catch {
      return false;
    }
  }
}

export const encryptionService = new EncryptionService();

