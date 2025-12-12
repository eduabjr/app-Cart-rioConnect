/**
 * SecurityValidator - Validações de Segurança
 * 
 * Valida configurações de segurança antes do build de produção
 */

const SENSITIVE_PATTERNS = [
  /ca-app-pub-\d{16}~\d{10}/g, // AdMob App IDs
  /ca-app-pub-\d{16}\/\d{10}/g, // AdMob Ad Unit IDs
  /AIza[0-9A-Za-z-_]{35}/g, // Google API Keys
  /sk_live_[0-9a-zA-Z]{24,}/g, // Stripe Live Keys
  /AKIA[0-9A-Z]{16}/g, // AWS Access Keys
  /-----BEGIN (RSA )?PRIVATE KEY-----/g, // Private Keys
];

/**
 * Valida se há informações sensíveis no código
 */
export function validateNoSensitiveData(): {valid: boolean; errors: string[]} {
  const errors: string[] = [];

  // Esta função deve ser executada em um script de pré-build
  // Por enquanto, apenas retorna estrutura
  // Implementação completa requereria análise de arquivos

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Valida se está usando TestIds em desenvolvimento
 */
export function validateAdMobTestIds(isDev: boolean, adUnitId: string): boolean {
  if (!isDev) {
    // Em produção, não deve usar TestIds
    const testIdPattern = /^ca-app-pub-3940256099942544/;
    if (testIdPattern.test(adUnitId)) {
      console.error('❌ ERRO: TestIds do AdMob não devem ser usados em produção!');
      return false;
    }
  }
  return true;
}

/**
 * Valida se URLs usam HTTPS
 */
export function validateHTTPS(url: string): boolean {
  if (url && !url.startsWith('https://') && !url.startsWith('http://localhost')) {
    console.error(`❌ ERRO: URL não usa HTTPS: ${url}`);
    return false;
  }
  return true;
}

