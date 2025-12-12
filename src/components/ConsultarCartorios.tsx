/**
 * Componente principal de consulta de cartórios
 */

import { useState, useEffect, useMemo } from 'react'
import { cartorioService, Cartorio } from '../services/cartorioService'
import './ConsultarCartorios.css'

const ITENS_POR_PAGINA = 20

const UF_OPTIONS = [
  { value: '', label: 'Todos os Estados' },
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
]

export function ConsultarCartorios() {
  const [cartorios, setCartorios] = useState<Cartorio[]>([])
  const [loading, setLoading] = useState(false)
  const [buscaGeral, setBuscaGeral] = useState('')
  const [buscaCNJ, setBuscaCNJ] = useState('')
  const [buscaCidade, setBuscaCidade] = useState('')
  const [ufFiltro, setUfFiltro] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<Date | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [modoEscuro, setModoEscuro] = useState(false)

  // Carregar cartórios ao montar
  useEffect(() => {
    carregarCartorios()
  }, [])

  // Filtrar quando busca ou UF mudarem
  useEffect(() => {
    setPaginaAtual(1)
  }, [buscaGeral, buscaCNJ, buscaCidade, ufFiltro])

  /**
   * Carrega cartórios do arquivo JSON local
   */
  const carregarCartorios = async () => {
    setLoading(true)
    setErro(null)
    
    try {
      console.log('📁 Carregando cartórios do arquivo JSON...')
      const cartoriosData = await cartorioService.buscarTodosCartorios()
      
      setCartorios(cartoriosData)
      setUltimaAtualizacao(new Date())
      console.log('✅', cartoriosData.length, 'cartórios carregados com sucesso!')
    } catch (error: any) {
      console.error('❌ Erro:', error)
      setErro(`Erro ao carregar cartórios: ${error.message || 'Erro desconhecido'}`)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Força atualização dos dados
   */
  const atualizarDados = async () => {
    if (!confirm('Deseja recarregar os dados dos cartórios?')) {
      return
    }

    // Limpar cache do serviço
    await carregarCartorios()
  }

  /**
   * Filtra cartórios com múltiplos critérios
   */
  const cartoriosFiltrados = useMemo(() => {
    let filtrados = [...cartorios]

    // Filtro por UF
    if (ufFiltro) {
      filtrados = filtrados.filter(c => c.uf === ufFiltro)
    }

    // Filtro por CNJ (busca exata ou parcial)
    if (buscaCNJ.trim()) {
      const cnjBusca = buscaCNJ.trim()
      filtrados = filtrados.filter(c => 
        c.numeroCNJ?.toString().includes(cnjBusca) ||
        c.numeroCNJ?.toString() === cnjBusca
      )
    }

    // Filtro por Cidade
    if (buscaCidade.trim()) {
      const cidadeBusca = buscaCidade.toLowerCase().trim()
      filtrados = filtrados.filter(c => 
        c.cidade?.toLowerCase().includes(cidadeBusca)
      )
    }

    // Busca geral (nome, endereço, telefone, email, responsável)
    if (buscaGeral.trim()) {
      const buscaLower = buscaGeral.toLowerCase().trim()
      filtrados = filtrados.filter(c => 
        c.tituloCartorio?.toLowerCase().includes(buscaLower) ||
        c.endereco?.toLowerCase().includes(buscaLower) ||
        c.bairro?.toLowerCase().includes(buscaLower) ||
        c.telefone?.includes(buscaGeral) ||
        c.email?.toLowerCase().includes(buscaLower) ||
        c.responsavel?.toLowerCase().includes(buscaLower) ||
        c.numeroCNJ?.toString().includes(buscaGeral)
      )
    }

    return filtrados
  }, [cartorios, buscaGeral, buscaCNJ, buscaCidade, ufFiltro])

  // Paginação
  const totalPaginas = Math.ceil(cartoriosFiltrados.length / ITENS_POR_PAGINA)
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA
  const fim = inicio + ITENS_POR_PAGINA
  const cartoriosPaginados = cartoriosFiltrados.slice(inicio, fim)

  return (
    <div className={`app-container ${modoEscuro ? 'dark' : ''}`}>
      <div className="header">
        <h1>🏛️ CartórioConnect</h1>
        <button 
          className="theme-toggle"
          onClick={() => setModoEscuro(!modoEscuro)}
          title={modoEscuro ? 'Modo Claro' : 'Modo Escuro'}
        >
          {modoEscuro ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="filtros">
        <div className="filtros-linha">
          <input
            type="text"
            placeholder="🔍 Busca geral (nome, endereço, telefone, email, responsável)..."
            value={buscaGeral}
            onChange={(e) => setBuscaGeral(e.target.value)}
            className="input-busca"
          />
        </div>
        
        <div className="filtros-linha">
          <input
            type="text"
            placeholder="🔢 Buscar por CNJ..."
            value={buscaCNJ}
            onChange={(e) => setBuscaCNJ(e.target.value)}
            className="input-cnj"
          />
          
          <input
            type="text"
            placeholder="🏙️ Buscar por cidade..."
            value={buscaCidade}
            onChange={(e) => setBuscaCidade(e.target.value)}
            className="input-cidade"
          />
          
          <select
            value={ufFiltro}
            onChange={(e) => setUfFiltro(e.target.value)}
            className="select-uf"
          >
            {UF_OPTIONS.map(uf => (
              <option key={uf.value} value={uf.value}>{uf.label}</option>
            ))}
          </select>

          <button
            onClick={atualizarDados}
            className="btn-atualizar"
            disabled={loading}
          >
            {loading ? '⏳ Carregando...' : '🔄 Atualizar'}
          </button>
        </div>
      </div>

      {erro && (
        <div className="erro">
          ⚠️ {erro}
        </div>
      )}

      <div className="info">
        <div>
          <strong>{cartoriosFiltrados.length}</strong> cartório(s) encontrado(s)
          {cartorios.length > 0 && (
            <span className="total"> de {cartorios.length} total</span>
          )}
        </div>
        {ultimaAtualizacao && (
          <div className="timestamp">
            Última atualização: {ultimaAtualizacao.toLocaleString('pt-BR')}
          </div>
        )}
      </div>

      <div className="lista-cartorios">
        {loading && cartorios.length === 0 ? (
          <div className="loading">
            <div className="spinner">⏳</div>
            <div>Carregando cartórios...</div>
          </div>
        ) : cartoriosPaginados.length === 0 ? (
          <div className="vazio">
            <div className="icone">🔍</div>
            <div>Nenhum cartório encontrado com os filtros aplicados.</div>
            {cartorios.length === 0 && (
              <button onClick={carregarCartorios} className="btn-carregar">
                Carregar Cartórios
              </button>
            )}
          </div>
        ) : (
          cartoriosPaginados.map((cartorio, index) => (
            <div key={`${cartorio.numeroCNJ || index}-${index}`} className="card-cartorio">
              <div className="card-header">
                <h3>{cartorio.tituloCartorio || 'Cartório sem nome'}</h3>
                {cartorio.numeroCNJ && (
                  <span className="cnj">CNJ: {cartorio.numeroCNJ}</span>
                )}
              </div>

              <div className="card-body">
                <div className="card-coluna">
                  <div className="info-item">
                    <strong>📍 Endereço:</strong>
                    <div>
                      {cartorio.endereco && `${cartorio.endereco}`}
                      {cartorio.numero && `, ${cartorio.numero}`}
                      {cartorio.bairro && ` - ${cartorio.bairro}`}
                      {cartorio.cidade && ` - ${cartorio.cidade}/${cartorio.uf || ''}`}
                    </div>
                  </div>
                </div>

                <div className="card-coluna">
                  <div className="info-item">
                    <strong>📞 Contato:</strong>
                    <div>
                      {cartorio.telefone && <div>Tel: {cartorio.telefone}</div>}
                      {cartorio.email && <div>Email: {cartorio.email}</div>}
                    </div>
                  </div>
                </div>

                {cartorio.responsavel && (
                  <div className="card-coluna">
                    <div className="info-item">
                      <strong>👤 Responsável:</strong>
                      <div>{cartorio.responsavel}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {totalPaginas > 1 && (
        <div className="paginacao">
          <button
            onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
            disabled={paginaAtual === 1}
            className="btn-pagina"
          >
            ← Anterior
          </button>
          
          <span className="pagina-info">
            Página {paginaAtual} de {totalPaginas}
          </span>
          
          <button
            onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
            disabled={paginaAtual === totalPaginas}
            className="btn-pagina"
          >
            Próxima →
          </button>
        </div>
      )}
    </div>
  )
}

