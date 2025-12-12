/**
 * Serviço de carregamento de Cartórios Interligados
 * 
 * Carrega dados do arquivo JSON local: cartoriosInterligados.json
 */

export type TipoCartorio = 
  | 'Civil' 
  | 'Protesto' 
  | 'Imóveis' 
  | 'Títulos e Documentos' 
  | 'Jurídico' 
  | 'Tabelionato de Notas'
  | 'Outros';

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
  tipo?: TipoCartorio;
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
      const cartoriosNormalizados = cartorios.map((cart: any) => {
        const titulo = (cart.tituloCartorio || '').toUpperCase();
        let tipo: TipoCartorio = cart.tipo || this.detectarTipoCartorio(titulo);
        
        return {
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
          tipo: tipo,
        };
      });
      
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
   * Busca cartórios por tipo
   */
  async buscarPorTipo(tipo: TipoCartorio): Promise<Cartorio[]> {
    const cartorios = await this.buscarTodosCartorios();
    return cartorios.filter(c => c.tipo === tipo);
  }

  /**
   * Detecta o tipo de cartório baseado no título
   */
  private detectarTipoCartorio(titulo: string): TipoCartorio {
    const tituloUpper = titulo.toUpperCase();
    
    // Tabelionato de Notas
    if (tituloUpper.includes('TABELIÃO') && tituloUpper.includes('NOTAS')) {
      return 'Tabelionato de Notas';
    }
    if (tituloUpper.includes('TABELIONATO DE NOTAS')) {
      return 'Tabelionato de Notas';
    }
    
    // Registro Civil
    if (tituloUpper.includes('REGISTRO CIVIL')) {
      return 'Civil';
    }
    if (tituloUpper.includes('CIVIL') && tituloUpper.includes('PESSOAS NATURAIS')) {
      return 'Civil';
    }
    
    // Protesto
    if (tituloUpper.includes('PROTESTO')) {
      return 'Protesto';
    }
    
    // Imóveis
    if (tituloUpper.includes('IMÓVEIS') || tituloUpper.includes('IMOveis')) {
      return 'Imóveis';
    }
    if (tituloUpper.includes('REGISTRO DE IMÓVEIS')) {
      return 'Imóveis';
    }
    
    // Títulos e Documentos
    if (tituloUpper.includes('TÍTULOS') || tituloUpper.includes('TITULOS')) {
      return 'Títulos e Documentos';
    }
    if (tituloUpper.includes('TÍTULOS E DOCUMENTOS') || tituloUpper.includes('TITULOS E DOCUMENTOS')) {
      return 'Títulos e Documentos';
    }
    
    // Jurídico
    if (tituloUpper.includes('JURÍDICO') || tituloUpper.includes('JURIDICO')) {
      return 'Jurídico';
    }
    
    // Se não encontrar, retorna "Outros"
    return 'Outros';
  }

  /**
   * Obtém todos os tipos disponíveis
   */
  async getTiposDisponiveis(): Promise<TipoCartorio[]> {
    const cartorios = await this.buscarTodosCartorios();
    const tipos = new Set<TipoCartorio>();
    cartorios.forEach(c => {
      if (c.tipo) {
        tipos.add(c.tipo);
      }
    });
    return Array.from(tipos).sort();
  }

  /**
   * Conta cartórios por tipo
   */
  async contarPorTipo(): Promise<Record<TipoCartorio, number>> {
    const cartorios = await this.buscarTodosCartorios();
    const contagem: Record<string, number> = {};
    
    cartorios.forEach(c => {
      const tipo = c.tipo || 'Outros';
      contagem[tipo] = (contagem[tipo] || 0) + 1;
    });
    
    return contagem as Record<TipoCartorio, number>;
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
