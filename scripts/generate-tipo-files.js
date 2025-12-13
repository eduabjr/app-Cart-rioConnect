/**
 * Script para gerar arquivos JSON separados por tipo de cartório
 * Baseado na lógica de detecção do cartorioService.ts
 */

const fs = require('fs');
const path = require('path');

// Tipos de cartório
const TIPOS = {
  'Civil': 'cartoriosInterligadoscivil.json',
  'Protesto': 'cartoriosInterligadosprotesto.json',
  'Imóveis': 'cartoriosInterligadosimoveis.json',
  'Títulos e Documentos': 'cartoriosInterligadostitulos.json',
  'Jurídico': 'cartoriosInterligadosjuridico.json',
  'Tabelionato de Notas': 'cartoriosInterligadostabelionato.json'
};

/**
 * Detecta o tipo de cartório baseado no título
 * Mesma lógica do cartorioService.ts
 */
function detectarTipoCartorio(titulo) {
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
  
  // Se não encontrar, retorna "Civil" como padrão
  return 'Civil';
}

// Caminhos dos arquivos
const inputFile = path.join(__dirname, '../assets/data/cartoriosInterligados.json');
const outputDir = path.join(__dirname, '../public/extra');

// Garantir que o diretório de saída existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Ler o arquivo principal
console.log('📖 Lendo arquivo principal...');
const cartorios = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

console.log(`✅ Total de cartórios encontrados: ${cartorios.length}`);

// Agrupar por tipo
const cartoriosPorTipo = {};

// Inicializar arrays vazios para cada tipo
Object.keys(TIPOS).forEach(tipo => {
  cartoriosPorTipo[tipo] = [];
});

// Classificar cada cartório
cartorios.forEach(cartorio => {
  const titulo = (cartorio.tituloCartorio || '').toUpperCase();
  const tipo = cartorio.tipo || detectarTipoCartorio(titulo);
  
  if (cartoriosPorTipo[tipo]) {
    cartoriosPorTipo[tipo].push(cartorio);
  } else {
    // Se o tipo não for reconhecido, colocar em "Civil" como padrão
    cartoriosPorTipo['Civil'].push(cartorio);
  }
});

// Gerar arquivos para cada tipo
console.log('\n📝 Gerando arquivos por tipo...\n');

Object.keys(TIPOS).forEach(tipo => {
  const filename = TIPOS[tipo];
  const outputPath = path.join(outputDir, filename);
  const cartoriosDoTipo = cartoriosPorTipo[tipo];
  
  // Ordenar por cidade e UF
  cartoriosDoTipo.sort((a, b) => {
    const cidadeA = (a.cidade || '').toLowerCase();
    const cidadeB = (b.cidade || '').toLowerCase();
    if (cidadeA !== cidadeB) {
      return cidadeA.localeCompare(cidadeB);
    }
    return (a.uf || '').localeCompare(b.uf || '');
  });
  
  // Escrever arquivo
  fs.writeFileSync(
    outputPath,
    JSON.stringify(cartoriosDoTipo, null, 2),
    'utf8'
  );
  
  console.log(`✅ ${filename}: ${cartoriosDoTipo.length} cartórios`);
});

// Resumo
console.log('\n📊 Resumo:');
Object.keys(TIPOS).forEach(tipo => {
  const count = cartoriosPorTipo[tipo].length;
  const percentage = ((count / cartorios.length) * 100).toFixed(1);
  console.log(`   ${tipo}: ${count} (${percentage}%)`);
});

console.log(`\n✨ Arquivos gerados com sucesso em: ${outputDir}`);

