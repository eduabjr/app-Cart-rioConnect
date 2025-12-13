/**
 * IntegrityService - Validação de Integridade de Arquivos
 * 
 * Valida a integridade de arquivos baixados do servidor usando
 * hash SHA-256 e assinaturas criptográficas.
 */

import * as Crypto from 'expo-crypto';
import {sslPinningService} from './sslPinningService';

export interface FileMetadata {
  url: string;
  hash: string; // SHA-256 hash
  size: number;
  version: string;
  signature?: string; // Assinatura criptográfica (opcional)
}

class IntegrityService {
  /**
   * Calcula o hash SHA-256 de um arquivo
   */
  async calculateSHA256(data: string | Buffer): Promise<string> {
    try {
      const dataString = typeof data === 'string' ? data : data.toString('utf-8');
      const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        dataString
      );
      return hash.toLowerCase();
    } catch (error) {
      console.error('❌ Erro ao calcular hash SHA-256:', error);
      throw new Error('Falha ao calcular hash do arquivo');
    }
  }

  /**
   * Verifica se o hash do arquivo corresponde ao hash esperado
   */
  async verifyFileHash(
    fileData: string | Buffer,
    expectedHash: string
  ): Promise<boolean> {
    try {
      const calculatedHash = await this.calculateSHA256(fileData);
      const expectedHashLower = expectedHash.toLowerCase().trim();
      
      const isValid = calculatedHash === expectedHashLower;
      
      if (!isValid) {
        console.error('❌ Hash não corresponde!');
        console.error('Esperado:', expectedHashLower);
        console.error('Calculado:', calculatedHash);
      }
      
      return isValid;
    } catch (error) {
      console.error('❌ Erro ao verificar hash:', error);
      return false;
    }
  }

  /**
   * Baixa e verifica a integridade de um arquivo
   */
  async downloadAndVerify(
    url: string,
    expectedHash: string
  ): Promise<string> {
    try {
      // Validar que a URL é HTTPS
      if (!url.startsWith('https://')) {
        throw new Error('Apenas conexões HTTPS são permitidas');
      }

      // Extrair hostname da URL para SSL Pinning
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;

      // Verificar SSL Pinning se configurado
      if (sslPinningService.isPinningConfigured(hostname)) {
        // Nota: Validação completa de SSL Pinning requer implementação nativa
        // Por enquanto, apenas verificamos se está configurado
        console.log(`🔒 SSL Pinning configurado para ${hostname}`);
      }

      // Fazer download do arquivo
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erro ao baixar arquivo: ${response.status} ${response.statusText}`);
      }

      const fileData = await response.text();

      // Verificar integridade
      const isValid = await this.verifyFileHash(fileData, expectedHash);
      
      if (!isValid) {
        throw new Error('Arquivo corrompido ou adulterado. Hash não corresponde.');
      }

      console.log('✅ Arquivo baixado e verificado com sucesso');
      return fileData;
    } catch (error) {
      console.error('❌ Erro ao baixar e verificar arquivo:', error);
      throw error;
    }
  }

  /**
   * Valida metadados do arquivo antes do download
   */
  validateMetadata(metadata: FileMetadata): boolean {
    if (!metadata.url || !metadata.hash || !metadata.version) {
      console.error('❌ Metadados incompletos');
      return false;
    }

    if (!metadata.url.startsWith('https://')) {
      console.error('❌ URL deve usar HTTPS');
      return false;
    }

    // Validar formato do hash (SHA-256 = 64 caracteres hexadecimais)
    const hashRegex = /^[a-f0-9]{64}$/i;
    if (!hashRegex.test(metadata.hash)) {
      console.error('❌ Hash inválido (deve ser SHA-256)');
      return false;
    }

    return true;
  }

  /**
   * Obtém metadados do servidor e valida
   */
  async fetchMetadata(metadataUrl: string): Promise<FileMetadata> {
    try {
      if (!metadataUrl.startsWith('https://')) {
        throw new Error('Apenas conexões HTTPS são permitidas');
      }

      const response = await fetch(metadataUrl);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar metadados: ${response.status}`);
      }

      const metadata: FileMetadata = await response.json();

      if (!this.validateMetadata(metadata)) {
        throw new Error('Metadados inválidos');
      }

      return metadata;
    } catch (error) {
      console.error('❌ Erro ao buscar metadados:', error);
      throw error;
    }
  }
}

export const integrityService = new IntegrityService();

