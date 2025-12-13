/**
 * UpdateService - Serviço de Atualização da Base de Dados
 * 
 * Gerencia o download e atualização da base de dados offline
 * com validação de integridade e segurança.
 */

import {integrityService, FileMetadata} from './integrityService';
import {cartorioService} from './cartorioService';

// URL do servidor de atualizações (deve ser configurada via variável de ambiente)
const UPDATE_SERVER_URL = process.env.EXPO_PUBLIC_UPDATE_SERVER_URL || 'https://api.exemplo.com';

class UpdateService {
  /**
   * Verifica se há atualizações disponíveis
   */
  async checkForUpdates(): Promise<{available: boolean; version?: string; metadata?: FileMetadata}> {
    try {
      const metadataUrl = `${UPDATE_SERVER_URL}/api/metadata`;
      const metadata = await integrityService.fetchMetadata(metadataUrl);

      // Comparar com versão atual
      const currentMetadata = await cartorioService.getMetadata();
      const currentVersion = currentMetadata.version || '1.0.0';
      const hasUpdate = metadata.version !== currentVersion;

      return {
        available: hasUpdate,
        version: metadata.version,
        metadata: hasUpdate ? metadata : undefined,
      };
    } catch (error) {
      console.error('❌ Erro ao verificar atualizações:', error);
      return {available: false};
    }
  }

  /**
   * Baixa e instala atualização da base de dados
   */
  async downloadUpdate(metadata: FileMetadata): Promise<void> {
    try {
      console.log('📥 Iniciando download da atualização...');

      // Validar metadados
      if (!integrityService.validateMetadata(metadata)) {
        throw new Error('Metadados inválidos');
      }

      // Baixar e verificar integridade
      const fileData = await integrityService.downloadAndVerify(
        metadata.url,
        metadata.hash
      );

      // Parse do JSON
      let cartoriosData;
      try {
        cartoriosData = JSON.parse(fileData);
      } catch (parseError) {
        throw new Error('Arquivo JSON inválido');
      }

      // Validar estrutura do JSON
      if (!Array.isArray(cartoriosData)) {
        throw new Error('Formato de dados inválido: esperado array');
      }

      // TODO: Salvar arquivo atualizado
      // Por enquanto, apenas valida. A implementação completa requereria:
      // 1. Backup do arquivo atual
      // 2. Salvar novo arquivo
      // 3. Atualizar metadados
      // 4. Limpar cache

      console.log('✅ Atualização baixada e validada com sucesso');
      console.log(`📊 Total de cartórios: ${cartoriosData.length}`);
      
      // Limpar cache para forçar recarregamento
      cartorioService.clearCache();
    } catch (error) {
      console.error('❌ Erro ao baixar atualização:', error);
      throw error;
    }
  }

  /**
   * Verifica e aplica atualização automaticamente (se disponível)
   */
  async autoUpdate(): Promise<{updated: boolean; version?: string}> {
    try {
      const updateCheck = await this.checkForUpdates();
      
      if (!updateCheck.available || !updateCheck.metadata) {
        return {updated: false};
      }

      await this.downloadUpdate(updateCheck.metadata);
      
      return {
        updated: true,
        version: updateCheck.version,
      };
    } catch (error) {
      console.error('❌ Erro na atualização automática:', error);
      return {updated: false};
    }
  }
}

export const updateService = new UpdateService();

