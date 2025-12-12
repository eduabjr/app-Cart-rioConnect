/**
 * Serviço de carregamento de Cartórios Interligados
 * 
 * Carrega dados do arquivo JSON local: cartoriosInterligados.json
 */

export interface Cartorio {
  numeroCNJ?: string;
  tituloCartorio?: string;
  responsavel?: string;
  endereco?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  telefone?: string;
  email?: string;
}

export interface DatabaseMetadata {
  lastUpdate: string;
  version: string;
  totalCartorios: number;
  description: string;
}

class CartorioService {
  private cartoriosCache: Cartorio[] | null = null;

  /**
   * Busca todos os cartórios do arquivo JSON local
   * Carrega dados completamente offline, sem necessidade de conexão
   */
  async buscarTodosCartorios(): Promise<Cartorio[]> {
    try {
      // Se já tem cache, retornar
      if (this.cartoriosCache) {
        return this.cartoriosCache;
      }

      // Carregar do arquivo JSON local (sem acesso à rede)
      // O arquivo está embutido no bundle do app
      const cartorios = require('../../assets/data/cartoriosInterligados.json');
      
      if (!Array.isArray(cartorios)) {
        throw new Error('Formato de dados inválido');
      }
      
      // Normalizar dados
      const cartoriosNormalizados = cartorios.map((cart: any) => ({
        numeroCNJ: cart.numeroCNJ || cart.numeroCnj || '',
        tituloCartorio: cart.tituloCartorio || '',
        responsavel: cart.responsavel || '',
        endereco: cart.endereco || '',
        numero: cart.numero || '',
        bairro: cart.bairro || '',
        cidade: cart.cidade || '',
        uf: cart.uf || '',
        telefone: cart.telefone || '',
        email: cart.email || '',
      }));
      
      // Salvar no cache em memória
      this.cartoriosCache = cartoriosNormalizados;
      
      return cartoriosNormalizados;
    } catch (error) {
      console.error('❌ Erro ao carregar cartórios:', error);
      throw error;
    }
  }

  /**
   * Limpa o cache quando o app vai para background
   * Otimiza o uso de memória
   */
  clearCache(): void {
    this.cartoriosCache = null;
  }

  /**
   * Busca cartório por número CNJ
   */
  async buscarPorCNJ(numeroCNJ: string): Promise<Cartorio | null> {
    const cartorios = await this.buscarTodosCartorios();
    const cartorio = cartorios.find(
      c =>
        c.numeroCNJ?.toString() === numeroCNJ.toString() ||
        c.numeroCNJ?.includes(numeroCNJ),
    );
    return cartorio || null;
  }

  /**
   * Busca cartórios por cidade
   */
  async buscarPorCidade(cidade: string): Promise<Cartorio[]> {
    const cartorios = await this.buscarTodosCartorios();
    return cartorios.filter(
      c =>
        c.cidade?.toLowerCase().includes(cidade.toLowerCase()) ||
        false,
    );
  }

  /**
   * Busca cartórios por UF
   */
  async buscarPorUF(uf: string): Promise<Cartorio[]> {
    const cartorios = await this.buscarTodosCartorios();
    return cartorios.filter(
      c => c.uf?.toUpperCase() === uf.toUpperCase(),
    );
  }

  /**
   * Busca cartórios por termo (busca em título, cidade, responsável)
   */
  async buscarPorTermo(termo: string): Promise<Cartorio[]> {
    const cartorios = await this.buscarTodosCartorios();
    const termoLower = termo.toLowerCase();
    return cartorios.filter(
      c =>
        c.tituloCartorio?.toLowerCase().includes(termoLower) ||
        c.cidade?.toLowerCase().includes(termoLower) ||
        c.responsavel?.toLowerCase().includes(termoLower) ||
        false,
    );
  }

  /**
   * Obtém metadados da base de dados (data de última atualização, versão, etc.)
   */
  async getMetadata(): Promise<DatabaseMetadata> {
    try {
      const metadata = require('../../assets/data/metadata.json');
      
      // Se não tiver totalCartorios, calcular
      if (!metadata.totalCartorios || metadata.totalCartorios === 0) {
        const cartorios = await this.buscarTodosCartorios();
        metadata.totalCartorios = cartorios.length;
      }

      return {
        lastUpdate: metadata.lastUpdate || 'Data não disponível',
        version: metadata.version || '1.0.0',
        totalCartorios: metadata.totalCartorios || 0,
        description: metadata.description || 'Base de dados offline de cartórios interligados do Brasil',
      };
    } catch (error) {
      console.error('Erro ao carregar metadados:', error);
      // Retorna valores padrão em caso de erro
      return {
        lastUpdate: 'Data não disponível',
        version: '1.0.0',
        totalCartorios: 0,
        description: 'Base de dados offline de cartórios interligados do Brasil',
      };
    }
  }

  /**
   * Formata a data de última atualização para exibição
   */
  formatLastUpdateDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Retorna a string original se não for uma data válida
      }
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch (error) {
      return dateString;
    }
  }
}

export const cartorioService = new CartorioService();
