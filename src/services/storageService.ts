/**
 * Serviço de Armazenamento Local
 * Gerencia favoritos e histórico de buscas recentes usando AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Cartorio} from './cartorioService';
import {encryptionService} from './encryptionService';

const STORAGE_KEYS = {
  FAVORITES: '@cartorio_connect:favorites',
  RECENT_SEARCHES: '@cartorio_connect:recent_searches',
  MAX_RECENT_SEARCHES: 20, // Limite de buscas recentes
};

export interface RecentSearch {
  cartorio: Cartorio;
  timestamp: number;
}

class StorageService {
  /**
   * ========== FAVORITOS ==========
   */

  /**
   * Adiciona um cartório aos favoritos
   */
  async addFavorite(cartorio: Cartorio): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const exists = favorites.some(
        fav => fav.numeroCNJ === cartorio.numeroCNJ
      );

      if (!exists) {
        favorites.push(cartorio);
        const jsonData = JSON.stringify(favorites);
        // Criptografar dados antes de armazenar
        const encrypted = await encryptionService.encryptData(jsonData);
        await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, encrypted);
      }
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
      throw error;
    }
  }

  /**
   * Remove um cartório dos favoritos
   */
  async removeFavorite(cartorioCNJ: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const filtered = favorites.filter(
        fav => fav.numeroCNJ !== cartorioCNJ
      );
      const jsonData = JSON.stringify(filtered);
      // Criptografar dados antes de armazenar
      const encrypted = await encryptionService.encryptData(jsonData);
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, encrypted);
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      throw error;
    }
  }

  /**
   * Verifica se um cartório está nos favoritos
   */
  async isFavorite(cartorioCNJ: string): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      return favorites.some(fav => fav.numeroCNJ === cartorioCNJ);
    } catch (error) {
      console.error('Erro ao verificar favorito:', error);
      return false;
    }
  }

  /**
   * Retorna todos os favoritos
   */
  async getFavorites(): Promise<Cartorio[]> {
    try {
      const encryptedData = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (!encryptedData) return [];
      
      // Tentar descriptografar (pode ser dados antigos não criptografados)
      let jsonData: string;
      if (encryptionService.isEncrypted(encryptedData)) {
        jsonData = await encryptionService.decryptData(encryptedData);
      } else {
        // Dados antigos não criptografados - migrar
        jsonData = encryptedData;
        // Recriptografar e salvar
        const encrypted = await encryptionService.encryptData(jsonData);
        await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, encrypted);
      }
      
      return JSON.parse(jsonData);
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
      return [];
    }
  }

  /**
   * ========== BUSCAS RECENTES ==========
   */

  /**
   * Adiciona uma busca recente
   */
  async addRecentSearch(cartorio: Cartorio): Promise<void> {
    try {
      const recentSearches = await this.getRecentSearches();
      
      // Remove se já existe (para atualizar a posição)
      const filtered = recentSearches.filter(
        search => search.cartorio.numeroCNJ !== cartorio.numeroCNJ
      );

      // Adiciona no início
      filtered.unshift({
        cartorio,
        timestamp: Date.now(),
      });

      // Limita o número de buscas recentes
      const limited = filtered.slice(0, STORAGE_KEYS.MAX_RECENT_SEARCHES);

      const jsonData = JSON.stringify(limited);
      // Criptografar dados antes de armazenar
      const encrypted = await encryptionService.encryptData(jsonData);
      await AsyncStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, encrypted);
    } catch (error) {
      console.error('Erro ao adicionar busca recente:', error);
      throw error;
    }
  }

  /**
   * Retorna todas as buscas recentes
   */
  async getRecentSearches(): Promise<RecentSearch[]> {
    try {
      const encryptedData = await AsyncStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
      if (!encryptedData) return [];
      
      // Tentar descriptografar (pode ser dados antigos não criptografados)
      let jsonData: string;
      if (encryptionService.isEncrypted(encryptedData)) {
        jsonData = await encryptionService.decryptData(encryptedData);
      } else {
        // Dados antigos não criptografados - migrar
        jsonData = encryptedData;
        // Recriptografar e salvar
        const encrypted = await encryptionService.encryptData(jsonData);
        await AsyncStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, encrypted);
      }
      
      return JSON.parse(jsonData);
    } catch (error) {
      console.error('Erro ao buscar buscas recentes:', error);
      return [];
    }
  }

  /**
   * Limpa todas as buscas recentes
   */
  async clearRecentSearches(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.RECENT_SEARCHES);
    } catch (error) {
      console.error('Erro ao limpar buscas recentes:', error);
      throw error;
    }
  }

  /**
   * Limpa todos os dados armazenados
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.FAVORITES,
        STORAGE_KEYS.RECENT_SEARCHES,
      ]);
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      throw error;
    }
  }
}

export const storageService = new StorageService();

