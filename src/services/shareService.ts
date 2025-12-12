/**
 * Serviço de Compartilhamento
 * Gerencia compartilhamento de dados de cartórios via WhatsApp, SMS e outros métodos
 */

import * as Linking from 'expo-linking';
import * as Clipboard from 'expo-clipboard';
import {Cartorio} from './cartorioService';

class ShareService {
  /**
   * Formata os dados do cartório em uma string legível
   */
  formatCartorioData(cartorio: Cartorio): string {
    let data = `🏢 *${cartorio.tituloCartorio || 'Cartório'}*\n\n`;

    if (cartorio.numeroCNJ) {
      data += `🔢 CNJ: ${cartorio.numeroCNJ}\n`;
    }

    if (cartorio.responsavel) {
      data += `👤 Responsável: ${cartorio.responsavel}\n`;
    }

    if (cartorio.endereco) {
      data += `📍 Endereço: ${cartorio.endereco}`;
      if (cartorio.numero) data += `, ${cartorio.numero}`;
      if (cartorio.bairro) data += ` - ${cartorio.bairro}`;
      data += '\n';
    }

    if (cartorio.cidade && cartorio.uf) {
      data += `   ${cartorio.cidade} - ${cartorio.uf}\n`;
    }

    if (cartorio.telefone) {
      data += `📞 Telefone: ${cartorio.telefone}\n`;
    }

    if (cartorio.email) {
      data += `✉️ E-mail: ${cartorio.email}\n`;
    }

    data += `\n📱 Dados compartilhados via CartórioConnect`;

    return data;
  }

  /**
   * Compartilha via WhatsApp
   */
  async shareViaWhatsApp(cartorio: Cartorio): Promise<void> {
    try {
      const message = this.formatCartorioData(cartorio);
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

      const canOpen = await Linking.canOpenURL(whatsappUrl);
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        // Fallback: tenta abrir WhatsApp Web
        const whatsappWebUrl = `https://web.whatsapp.com/send?text=${encodedMessage}`;
        await Linking.openURL(whatsappWebUrl);
      }
    } catch (error) {
      console.error('Erro ao compartilhar via WhatsApp:', error);
      throw error;
    }
  }

  /**
   * Compartilha via SMS
   */
  async shareViaSMS(cartorio: Cartorio, phoneNumber?: string): Promise<void> {
    try {
      const message = this.formatCartorioData(cartorio);
      const encodedMessage = encodeURIComponent(message);

      let smsUrl: string;
      if (phoneNumber) {
        // Remove caracteres não numéricos do número
        const cleanNumber = phoneNumber.replace(/\D/g, '');
        smsUrl = `sms:${cleanNumber}?body=${encodedMessage}`;
      } else {
        smsUrl = `sms:?body=${encodedMessage}`;
      }

      const canOpen = await Linking.canOpenURL(smsUrl);
      if (canOpen) {
        await Linking.openURL(smsUrl);
      } else {
        throw new Error('Não foi possível abrir o aplicativo de SMS');
      }
    } catch (error) {
      console.error('Erro ao compartilhar via SMS:', error);
      throw error;
    }
  }

  /**
   * Compartilha via método genérico (copia para área de transferência)
   * Nota: Usa expo-clipboard para copiar os dados
   */
  async shareGeneric(cartorio: Cartorio): Promise<void> {
    try {
      const message = this.formatCartorioData(cartorio);
      
      // Usa expo-clipboard para copiar os dados
      await Clipboard.setStringAsync(message);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Erro ao compartilhar genérico:', error);
      throw error;
    }
  }

  /**
   * Mostra opções de compartilhamento (WhatsApp, SMS, Copiar)
   */
  async showShareOptions(cartorio: Cartorio): Promise<'whatsapp' | 'sms' | 'copy' | null> {
    // Esta função pode ser expandida para mostrar um ActionSheet ou Modal
    // Por enquanto, retorna null para indicar que o usuário deve escolher diretamente
    return null;
  }
}

export const shareService = new ShareService();

