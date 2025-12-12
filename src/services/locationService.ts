/**
 * Serviço de Geolocalização
 * Gerencia permissões e obtenção de localização do usuário
 */

import * as Location from 'expo-location';
import * as Linking from 'expo-linking';
import {Cartorio} from './cartorioService';

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface CartorioWithDistance extends Cartorio {
  distance?: number; // Distância em km
}

class LocationService {
  /**
   * Solicita permissão de localização
   */
  async requestPermission(): Promise<boolean> {
    try {
      const {status} = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Erro ao solicitar permissão de localização:', error);
      return false;
    }
  }

  /**
   * Verifica se a permissão de localização foi concedida
   */
  async hasPermission(): Promise<boolean> {
    try {
      const {status} = await Location.getForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Erro ao verificar permissão de localização:', error);
      return false;
    }
  }

  /**
   * Obtém a localização atual do usuário
   */
  async getCurrentLocation(): Promise<UserLocation | null> {
    try {
      const hasPermission = await this.hasPermission();
      if (!hasPermission) {
        const granted = await this.requestPermission();
        if (!granted) {
          return null;
        }
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      return null;
    }
  }

  /**
   * Calcula a distância entre duas coordenadas (Haversine)
   * Retorna a distância em quilômetros
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Converte graus para radianos
   */
  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  /**
   * Ordena cartórios por proximidade da localização do usuário
   * Nota: Isso requer que os cartórios tenham coordenadas (lat/lng)
   * Como o JSON atual não tem coordenadas, esta função é preparada para uso futuro
   * ou pode ser adaptada para usar geocoding
   */
  async sortByProximity(
    cartorios: Cartorio[],
    userLocation: UserLocation
  ): Promise<CartorioWithDistance[]> {
    // Por enquanto, retorna os cartórios sem ordenação
    // Para implementar completamente, seria necessário:
    // 1. Geocodificar os endereços dos cartórios para obter lat/lng
    // 2. Calcular distâncias
    // 3. Ordenar por distância

    return cartorios.map(cartorio => ({
      ...cartorio,
      distance: undefined, // Será calculado quando houver coordenadas
    }));
  }

  /**
   * Abre o aplicativo de mapas com o endereço de destino
   */
  async openMapsWithAddress(
    endereco: string,
    numero?: string,
    cidade?: string,
    uf?: string
  ): Promise<void> {
    try {
      // Monta o endereço completo
      let fullAddress = endereco;
      if (numero) fullAddress += `, ${numero}`;
      if (cidade) fullAddress += `, ${cidade}`;
      if (uf) fullAddress += `, ${uf}`;
      if (fullAddress) fullAddress += ', Brasil';

      // Codifica o endereço para URL
      const encodedAddress = encodeURIComponent(fullAddress);

      // Tenta abrir no Google Maps primeiro, depois Waze
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
      const wazeUrl = `https://waze.com/ul?q=${encodedAddress}`;

      // Linking já está importado no topo do arquivo
      
      // Tenta abrir Google Maps
      const canOpen = await Linking.canOpenURL(googleMapsUrl);
      if (canOpen) {
        await Linking.openURL(googleMapsUrl);
      } else {
        // Fallback para Waze
        const canOpenWaze = await Linking.canOpenURL(wazeUrl);
        if (canOpenWaze) {
          await Linking.openURL(wazeUrl);
        } else {
          // Fallback para URL genérica
          await Linking.openURL(googleMapsUrl);
        }
      }
    } catch (error) {
      console.error('Erro ao abrir mapas:', error);
      throw error;
    }
  }
}

export const locationService = new LocationService();

