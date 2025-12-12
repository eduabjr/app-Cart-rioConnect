/**
 * Script de Validação de Segurança
 * 
 * Valida configurações de segurança antes do build de produção
 * 
 * Uso: node scripts/validate-security.js
 */

const fs = require('fs');
const path = require('path');

const SENSITIVE_PATTERNS = [
  {pattern: /ca-app-pub-\d{16}~\d{10}/g, name: 'AdMob App ID'},
  {pattern: /ca-app-pub-\d{16}\/\d{10}/g, name: 'AdMob Ad Unit ID'},
  {pattern: /AIza[0-9A-Za-z-_]{35}/g, name: 'Google API Key'},
  {pattern: /sk_live_[0-9a-zA-Z]{24,}/g, name: 'Stripe Live Key'},
  {pattern: /AKIA[0-9A-Z]{16}/g, name: 'AWS Access Key'},
  {pattern: /-----BEGIN (RSA )?PRIVATE KEY-----/g, name: 'Private Key'},
];

const FILES_TO_CHECK = [
  'src/**/*.ts',
  'src/**/*.tsx',
  'App.tsx',
  'app.json',
];

function scanFile(filePath) {
  const errors = [];
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    SENSITIVE_PATTERNS.forEach(({pattern, name}) => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          // Ignorar TestIds em desenvolvimento
          if (match.includes('3940256099942544') && process.env.NODE_ENV === 'development') {
            return; // TestIds são permitidos em desenvolvimento
          }
          
          errors.push({
            file: filePath,
            type: name,
            match: match.substring(0, 20) + '...', // Mostrar apenas parte
          });
        });
      }
    });
  } catch (error) {
    // Arquivo não encontrado ou erro de leitura - ignorar
  }
  
  return errors;
}

function validateSecurity() {
  console.log('🔒 Validando segurança do código...\n');
  
  const allErrors = [];
  const filesToCheck = [
    'src/components/AdBanner.tsx',
    'src/services/updateService.ts',
    'App.tsx',
    'app.json',
  ];
  
  filesToCheck.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const errors = scanFile(filePath);
      allErrors.push(...errors);
    }
  });
  
  if (allErrors.length > 0) {
    console.error('❌ ERROS DE SEGURANÇA ENCONTRADOS:\n');
    allErrors.forEach(({file, type, match}) => {
      console.error(`  - ${file}`);
      console.error(`    Tipo: ${type}`);
      console.error(`    Match: ${match}\n`);
    });
    console.error('⚠️  NÃO FAÇA BUILD DE PRODUÇÃO COM ESTES ERROS!');
    process.exit(1);
  }
  
  console.log('✅ Nenhum problema de segurança encontrado!');
  process.exit(0);
}

// Executar validação
validateSecurity();

