/**
 * Serviço de Armazenamento Local
 * Gerencia favoritos e histórico de buscas recentes usando AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Cartorio} from './cartorioService';

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
        await AsyncStorage.setItem(
          STORAGE_KEYS.FAVORITES,
          JSON.stringify(favorites)
        );
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
      await AsyncStorage.setItem(
        STORAGE_KEYS.FAVORITES,
        JSON.stringify(filtered)
      );
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
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (!data) return [];
      return JSON.parse(data);
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

      await AsyncStorage.setItem(
        STORAGE_KEYS.RECENT_SEARCHES,
        JSON.stringify(limited)
      );
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
      const data = await AsyncStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
      if (!data) return [];
      return JSON.parse(data);
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

