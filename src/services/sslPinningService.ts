/**
 * SSLPinningService - Serviço de SSL Pinning
 * 
 * Implementa Certificate Pinning para prevenir ataques Man-in-the-Middle (MITM)
 * 
 * Nota: SSL Pinning completo requer bibliotecas nativas. Esta implementação
 * fornece validação básica de certificados e pode ser expandida com
 * react-native-ssl-pinning ou similar.
 */

// Hash SHA-256 dos certificados públicos do servidor
// Substitua pelos hashes reais do seu servidor
const PINNED_CERTIFICATES: Record<string, string[]> = {
  // Exemplo: domínio do servidor de atualizações
  'api.exemplo.com': [
    // Hash SHA-256 do certificado público (formato base64)
    // Obtenha com: openssl s_client -connect api.exemplo.com:443 -showcerts | openssl x509 -pubkey -noout | openssl pkey -pubin -outform der | openssl dgst -sha256 -binary | openssl enc -base64
    'YOUR_CERTIFICATE_HASH_HERE',
  ],
};

class SSLPinningService {
  /**
   * Valida se o certificado do servidor corresponde aos certificados fixados
   * 
   * Nota: Esta é uma implementação simplificada. Para produção completa,
   * considere usar react-native-ssl-pinning ou implementação nativa.
   */
  async validateCertificate(hostname: string, certificateHash: string): Promise<boolean> {
    try {
      const pinnedHashes = PINNED_CERTIFICATES[hostname];
      
      if (!pinnedHashes || pinnedHashes.length === 0) {
        // Se não houver certificados fixados para este hostname,
        // permitir conexão (modo de desenvolvimento ou servidor não configurado)
        console.warn(`⚠️ SSL Pinning não configurado para ${hostname}`);
        return true; // Permitir em desenvolvimento
      }

      // Verificar se o hash do certificado corresponde a algum dos hashes fixados
      const isValid = pinnedHashes.some(
        pinnedHash => pinnedHash.toLowerCase() === certificateHash.toLowerCase()
      );

      if (!isValid) {
        console.error(`❌ SSL Pinning falhou para ${hostname}`);
        console.error(`Hash recebido: ${certificateHash}`);
        console.error(`Hashes esperados: ${pinnedHashes.join(', ')}`);
      }

      return isValid;
    } catch (error) {
      console.error('❌ Erro ao validar certificado:', error);
      return false;
    }
  }

  /**
   * Verifica se SSL Pinning está configurado para um hostname
   */
  isPinningConfigured(hostname: string): boolean {
    return PINNED_CERTIFICATES[hostname] !== undefined && 
           PINNED_CERTIFICATES[hostname].length > 0;
  }

  /**
   * Adiciona um certificado fixado para um hostname (runtime)
   */
  addPinnedCertificate(hostname: string, certificateHash: string): void {
    if (!PINNED_CERTIFICATES[hostname]) {
      PINNED_CERTIFICATES[hostname] = [];
    }
    PINNED_CERTIFICATES[hostname].push(certificateHash);
  }

  /**
   * Obtém todos os certificados fixados
   */
  getPinnedCertificates(): Record<string, string[]> {
    return {...PINNED_CERTIFICATES};
  }
}

export const sslPinningService = new SSLPinningService();

