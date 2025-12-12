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
}

export const cartorioService = new CartorioService();
