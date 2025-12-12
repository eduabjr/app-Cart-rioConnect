# 📱 CartórioConnect

<div align="center">

![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

**Aplicativo mobile para consulta de cartórios interligados no Brasil**

[Funcionalidades](#-funcionalidades) • [Instalação](#-instalação) • [Uso](#-como-usar) • [Desenvolvimento](#-desenvolvimento) • [Build](#-build-para-produção)

</div>

---

## 📋 Sobre o Projeto

O **CartórioConnect** é um aplicativo React Native desenvolvido com Expo que permite consultar informações de contato de cartórios interligados em todo o Brasil. O aplicativo funciona **100% offline**, utilizando uma base de dados local embutida no bundle, garantindo acesso rápido e confiável mesmo sem conexão com a internet.

### 🎯 Objetivo

Facilitar o acesso a informações de contato de cartórios interligados, permitindo que usuários encontrem rapidamente telefones, e-mails e endereços de cartórios em qualquer lugar do Brasil, sem depender de conexão com a internet.

### ✨ Destaques

- 🚀 **Desenvolvido com Expo** - Simplifica o desenvolvimento e build
- 📱 **Multiplataforma** - Android e iOS com um único código
- 🔒 **100% Offline** - Funciona sem internet
- 🎨 **Design Moderno** - Interface limpa e intuitiva
- ⚡ **Performance** - Carregamento rápido e busca instantânea
- 🔍 **Busca Avançada** - Filtros por UF, Cidade ou CNJ
- ⭐ **Favoritos** - Marque cartórios importantes para acesso rápido
- 🕒 **Buscas Recentes** - Histórico automático de cartórios consultados
- 📞 **Ações Rápidas** - Ligue, envie e-mail ou compartilhe diretamente
- 🗺️ **Traçar Rota** - Abre o app de mapas com o endereço do cartório
- 📤 **Compartilhamento** - Compartilhe dados via WhatsApp ou SMS
- 📅 **Transparência** - Data de última atualização da base de dados

---

## 🚀 Funcionalidades

### 🔍 Busca e Filtros

- **Busca Geral**: Pesquise por nome do cartório, cidade, UF ou número CNJ
- **Filtros Específicos**: 
  - Filtro por **UF** (Estado)
  - Filtro por **Cidade**
  - Filtro por **CNJ** (Número do cartório)
  - Filtro por **Tipo de Cartório**:
    - Civil
    - Protesto
    - Imóveis
    - Títulos e Documentos
    - Jurídico
    - Tabelionato de Notas
    - Outros
- **Busca em Tempo Real**: Resultados instantâneos enquanto você digita
- **Geolocalização**: Se permitido, mostra cartórios próximos primeiro
- **Detecção Automática**: Tipos de cartório detectados automaticamente baseado no título

### ⭐ Favoritos e Recentes

- **Favoritos**: Marque cartórios importantes com um toque
- **Acesso Rápido**: Veja seus favoritos na tela inicial
- **Buscas Recentes**: Histórico automático dos últimos cartórios consultados
- **Navegação Rápida**: Toque em qualquer favorito ou recente para ver detalhes

### 📞 Contatos e Ações

- **Ligar Diretamente**: Toque no botão "Ligar" para abrir o discador
- **Enviar E-mail**: Botão "Email" abre o cliente de e-mail padrão
- **Traçar Rota**: Abre Google Maps ou Waze com o endereço do cartório
- **Compartilhar**: Compartilhe dados completos via WhatsApp ou SMS
- **Ver Detalhes**: Tela completa com todas as informações do cartório

### 📄 Informações Disponíveis

Cada cartório exibe:
- **Número CNJ**: Identificação oficial do cartório
- **Título Completo**: Nome oficial do cartório
- **Responsável**: Nome do responsável
- **Endereço Completo**: Rua, número, bairro, cidade e UF
- **Telefone**: Número de contato
- **E-mail**: Endereço de e-mail

### 📊 Paginação

- Navegação por páginas (10 itens por página)
- Controles intuitivos de navegação
- Indicador de página atual

### 📤 Compartilhamento

- **WhatsApp**: Compartilhe dados formatados via WhatsApp
- **SMS**: Envie informações via mensagem de texto
- **Formatação Automática**: Dados organizados com emojis e estrutura clara
- **Dados Completos**: Nome, CNJ, endereço, telefone e e-mail

### 📅 Transparência e Confiança

- **Data de Atualização**: Veja quando a base de dados foi atualizada pela última vez
- **Tela Sobre**: Informações detalhadas sobre o app e a base de dados
- **Versão da Base**: Controle de versão da base de dados offline
- **Total de Cartórios**: Quantidade de cartórios disponíveis
- **Menu de Informações**: Acesse via "3 pontinhos" (⋯) na HomeScreen
- **Atualização de Dados**: Botão para atualizar a base de dados offline

### 🔒 Segurança

- **Criptografia de Dados**: Favoritos e buscas recentes criptografados
- **Chaves Seguras**: Armazenamento no Keychain (iOS) e Keystore (Android)
- **Validação de Integridade**: Hash SHA-256 para downloads
- **SSL Pinning**: Estrutura para validação de certificados
- **Proteção Root/Jailbreak**: Detecção e alertas de segurança
- **Ofuscação de Código**: Código ofuscado em builds de produção
- **HTTPS Obrigatório**: Todas as conexões usam HTTPS

### 🎨 Design Visual

- **Header Azul Curvo**: Design moderno com fundo azul arredondado
- **Barra de Busca**: Campo de busca com ícone e botão de limpar
- **Cards Modernos**: Cards brancos com sombras e bordas arredondadas
- **Badges Coloridos**: Indicadores visuais para UF
- **Botões de Ação**: Botões coloridos para ações rápidas
- **Anúncios AdMob**: Integração com Google AdMob para banners

---

## 🛠️ Tecnologias Utilizadas

### Core

- **[Expo](https://expo.dev/)** (~54.0.0) - Framework para desenvolvimento React Native
- **[React Native](https://reactnative.dev/)** (0.81.5) - Framework mobile
- **[React](https://reactjs.org/)** (19.1.0) - Biblioteca JavaScript
- **[TypeScript](https://www.typescriptlang.org/)** (^5.1.3) - Tipagem estática

### Navegação

- **[@react-navigation/native](https://reactnavigation.org/)** (^6.1.18) - Navegação
- **[@react-navigation/stack](https://reactnavigation.org/docs/stack-navigator/)** (^6.4.1) - Navegador em pilha
- **[react-native-screens](https://github.com/software-mansion/react-native-screens)** (~4.16.0) - Otimização de telas
- **[react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context)** (~5.6.0) - Áreas seguras

### Funcionalidades

- **[expo-linking](https://docs.expo.dev/versions/latest/sdk/linking/)** (~8.0.10) - Abrir links (tel:, mailto:, mapas)
- **[expo-clipboard](https://docs.expo.dev/versions/latest/sdk/clipboard/)** (~8.0.8) - Área de transferência
- **[expo-location](https://docs.expo.dev/versions/latest/sdk/location/)** (~19.0.8) - Geolocalização
- **[@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/)** (2.2.0) - Armazenamento local
- **[expo-crypto](https://docs.expo.dev/versions/latest/sdk/crypto/)** (^15.0.8) - Criptografia e hash
- **[expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/)** (^15.0.8) - Armazenamento seguro de chaves
- **[react-native-device-info](https://github.com/react-native-device-info/react-native-device-info)** (^11.1.0) - Informações do dispositivo
- **[react-native-google-mobile-ads](https://github.com/react-native-google-mobile-ads/react-native-google-mobile-ads)** (^16.0.0) - Google AdMob

### Animações

- **[react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/)** (~3.16.1) - Animações performáticas
- **[react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/)** (~2.28.0) - Gestos nativos

---

## 📦 Instalação

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **[Node.js](https://nodejs.org/)** (versão LTS recomendada - 20.x ou superior)
- **[npm](https://www.npmjs.com/)** ou **[Yarn](https://yarnpkg.com/)**
- **[Git](https://git-scm.com/)**
- **Expo Go** (app para testar no dispositivo físico)
  - [Android - Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)

### Permissões do App

O app solicita as seguintes permissões (opcionais):

- **Localização** (Android/iOS): Para mostrar cartórios próximos e traçar rotas
  - Permissão solicitada apenas quando necessário
  - Pode ser negada sem afetar outras funcionalidades

**Nota**: O app funciona 100% offline e não requer conexão com a internet. As permissões são opcionais e melhoram a experiência do usuário.

### Passo a Passo

#### 1. Clone o Repositório

```bash
git clone https://github.com/eduabjr/app-Cart-rioConnect.git
cd app-Cart-rioConnect
```

#### 2. Instale as Dependências

```bash
npm install
```

ou com Yarn:

```bash
yarn install
```

#### 3. Configure o Expo (Primeira Vez)

Se for a primeira vez usando Expo, faça login:

```bash
npx expo login
```

Você será redirecionado para fazer login em: [https://expo.dev/accounts/eduabjr](https://expo.dev/accounts/eduabjr)

#### 4. Inicie o Servidor de Desenvolvimento

```bash
npm start
```

ou

```bash
npx expo start
```

Isso abrirá o **Expo Dev Tools** no navegador.

---

## 📱 Como Usar

### Funcionalidades do App

#### 🏠 Tela Inicial (HomeScreen)
- **Favoritos**: Veja seus cartórios favoritos em scroll horizontal
- **Recentes**: Acesse rapidamente cartórios consultados recentemente
- **Data de Atualização**: Veja quando a base de dados foi atualizada
- **Busca Rápida**: Digite e busque cartórios
- **Filtros**: Use os botões para filtrar por Estado, Cidade ou CNJ
- **Tela Sobre**: Toque no ícone ℹ️ para ver informações do app

#### 📋 Lista de Cartórios
- **Busca**: Digite para filtrar em tempo real
- **Filtros**: Selecione entre Todos, UF, Cidade ou CNJ
- **Favoritos**: Toque no coração (🤍/❤️) para adicionar/remover favoritos
- **Ações**: Toque em "Ligar", "Email" ou "📄" para ver detalhes
- **Paginação**: Navegue entre páginas com os controles na parte inferior

#### 📄 Detalhes do Cartório
- **Favorito**: Toque no coração no header para favoritar
- **Traçar Rota**: Toque em "Traçar Rota" para abrir Google Maps/Waze
- **Compartilhar**: Use os botões WhatsApp ou SMS para compartilhar
- **Ligar/Email**: Toque nos botões para ações diretas

#### ℹ️ Tela Sobre
- **Informações da Base**: Veja data de atualização, versão e total de cartórios
- **Sobre o App**: Descrição e características
- **Funcionalidades**: Lista completa de recursos disponíveis

### No Dispositivo Físico

1. **Instale o Expo Go** no seu celular (Android ou iOS)
2. **Execute** `npm start` no terminal
3. **Escaneie o QR Code** que aparece no terminal ou no navegador
   - **Android**: Use o app Expo Go ou a câmera
   - **iOS**: Use a câmera do iPhone

### No Emulador/Simulador

#### Android

```bash
npm run android
```

ou pressione `a` no terminal do Expo.

**Requisitos**: Android Studio instalado com emulador configurado.

#### iOS (apenas macOS)

```bash
npm run ios
```

ou pressione `i` no terminal do Expo.

**Requisitos**: Xcode instalado com simulador configurado.

### No Navegador Web

```bash
npm run web
```

ou pressione `w` no terminal do Expo.

---

## 🏗️ Estrutura do Projeto

```
CartórioConnect/
├── App.tsx                      # Componente raiz e navegação
├── app.json                     # Configuração do Expo
├── package.json                 # Dependências e scripts
├── tsconfig.json                # Configuração TypeScript
├── babel.config.js              # Configuração Babel
├── .gitignore                   # Arquivos ignorados pelo Git
├── push.ps1                     # Script PowerShell para Git push
├── pull.ps1                     # Script PowerShell para Git pull
│
├── assets/                      # Recursos estáticos
│   ├── data/
│   │   ├── cartoriosInterligados.json  # Base de dados dos cartórios
│   │   └── metadata.json        # Metadados (data de atualização, versão)
│   └── images/
│       └── logo.png             # Logo do aplicativo
│
└── src/
    ├── components/              # Componentes reutilizáveis
    │   ├── AdBanner.tsx         # Componente de anúncios AdMob
    │   └── InfoModal.tsx        # Modal de informações (versão, total, atualização)
    │
    ├── screens/                 # Telas do aplicativo
    │   ├── HomeScreen.tsx       # Tela inicial (favoritos, recentes, filtros por tipo)
    │   ├── CartorioListScreen.tsx  # Lista de cartórios (busca, filtros, paginação)
    │   ├── CartorioDetailScreen.tsx # Detalhes do cartório (favorito, rota, compartilhar)
    │   └── AboutScreen.tsx      # Tela Sobre/Configurações
    │
    ├── services/                # Serviços e lógica de negócio
    │   ├── cartorioService.ts   # Serviço de busca de cartórios (tipos, metadados)
    │   ├── storageService.ts    # Gerenciamento de favoritos e recentes (criptografado)
    │   ├── locationService.ts   # Geolocalização e mapas
    │   ├── shareService.ts      # Compartilhamento (WhatsApp, SMS)
    │   ├── encryptionService.ts # Criptografia de dados
    │   ├── keyManagementService.ts # Gerenciamento seguro de chaves
    │   ├── updateService.ts     # Atualização de base de dados
    │   ├── integrityService.ts  # Validação de integridade (SHA-256)
    │   ├── sslPinningService.ts # SSL Pinning
    │   └── securityCheckService.ts # Verificação de segurança (root/jailbreak)
    │
    ├── hooks/                   # Hooks customizados
    │   └── useAppState.ts       # Gerenciamento de estado do app
    │
    └── utils/                   # Utilitários
        ├── performanceOptimizer.ts # Otimização de performance
        └── securityValidator.ts    # Validação de segurança
```

### Descrição dos Arquivos Principais

#### `App.tsx`
Componente raiz que configura a navegação do aplicativo usando React Navigation Stack.

#### `src/services/cartorioService.ts`
Serviço responsável por:
- Carregar dados do arquivo JSON local
- Buscar cartórios por diferentes critérios
- Cachear dados para melhor performance
- Normalizar dados para garantir consistência
- Obter metadados da base de dados (data de atualização, versão)

#### `src/services/storageService.ts`
Serviço de armazenamento local:
- Gerenciar favoritos (adicionar, remover, listar)
- Gerenciar histórico de buscas recentes
- Usa AsyncStorage para persistência
- **Dados criptografados** usando encryptionService
- Migração automática de dados antigos

#### `src/services/locationService.ts`
Serviço de geolocalização:
- Solicitar permissões de localização
- Obter localização atual do usuário
- Abrir mapas (Google Maps, Waze) com endereço
- Calcular distâncias (preparado para ordenação por proximidade)

#### `src/services/shareService.ts`
Serviço de compartilhamento:
- Formatar dados do cartório para compartilhamento
- Compartilhar via WhatsApp
- Compartilhar via SMS
- Formatação automática com emojis

#### `src/services/encryptionService.ts`
Serviço de criptografia:
- Criptografia AES-256 (simplificada)
- Descriptografia automática
- Detecção de dados criptografados
- Integração com keyManagementService

#### `src/services/keyManagementService.ts`
Gerenciamento seguro de chaves:
- Armazenamento no Keychain (iOS) / Keystore (Android)
- Geração automática de chaves
- Recuperação segura

#### `src/services/updateService.ts`
Atualização de base de dados:
- Verificação de atualizações disponíveis
- Download seguro com validação de integridade
- Integração com integrityService

#### `src/services/integrityService.ts`
Validação de integridade:
- Cálculo de hash SHA-256
- Verificação de integridade de arquivos
- Validação de metadados
- Integração com SSL Pinning

#### `src/services/sslPinningService.ts`
SSL Pinning:
- Validação de certificados
- Configuração por hostname
- Suporte a múltiplos certificados

#### `src/services/securityCheckService.ts`
Verificação de segurança:
- Detecção de root (Android) / jailbreak (iOS)
- Verificação de debugging
- Alertas de segurança

#### `src/components/AdBanner.tsx`
Componente de anúncios Google AdMob:
- Integração com react-native-google-mobile-ads
- Suporta diferentes tamanhos de banner
- Configuração automática para desenvolvimento/produção
- Fallback para Expo Go

#### `src/components/InfoModal.tsx`
Modal de informações:
- Versão do app
- Total de cartórios interligados
- Data de última atualização
- Botão de atualização de base de dados

#### `src/screens/`
- **HomeScreen**: Tela inicial com favoritos, recentes, busca, filtros por tipo, data de atualização e menu de informações
- **CartorioListScreen**: Lista com busca, filtros (UF, cidade, CNJ, tipo), paginação, favoritos e ordenação por proximidade
- **CartorioDetailScreen**: Detalhes completos com favorito, traçar rota, compartilhamento (WhatsApp, SMS) e ações rápidas
- **AboutScreen**: Tela Sobre com informações do app, base de dados e funcionalidades

---

## 🎨 Personalização

### Alterar Logo

Substitua o arquivo `assets/images/logo.png` pelo seu logo (recomendado: 1024x1024px).

### Atualizar Base de Dados

Edite o arquivo `assets/data/cartoriosInterligados.json` com os dados atualizados.

**Formato esperado:**

```json
[
  {
    "numeroCNJ": "122820",
    "tituloCartorio": "Nome do Cartório",
    "responsavel": "Nome do Responsável",
    "endereco": "Rua Exemplo",
    "numero": "123",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "uf": "SP",
    "telefone": "(11) 1234-5678",
    "email": "contato@cartorio.com.br"
  }
]
```

### Atualizar Data de Última Atualização

Edite o arquivo `assets/data/metadata.json` para atualizar a data:

```json
{
  "lastUpdate": "2025-12-12",
  "version": "1.0.0",
  "totalCartorios": 0,
  "description": "Base de dados offline de cartórios interligados do Brasil"
}
```

**Nota**: O campo `totalCartorios` será calculado automaticamente pelo app. O formato da data deve ser `YYYY-MM-DD`.

### Configurar Google AdMob

1. **Obter IDs de Unidade de Anúncio** no [Google AdMob Console](https://apps.admob.com/)

2. **Atualizar `src/components/AdBanner.tsx`** com seus IDs:

```typescript
const adUnitId = __DEV__ ? TestIds.BANNER : Platform.select({
  ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',  // Seu ID iOS
  android: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',  // Seu ID Android
  default: TestIds.BANNER,
});
```

3. **O AdMob já está inicializado** em `App.tsx`

### Cores e Estilos

As cores principais estão definidas nos arquivos de estilo:

- **Azul Principal**: `#1976D2`
- **Azul Secundário**: `#E3F2FD`
- **Fundo**: `#F0F4F8`
- **Texto Escuro**: `#333333`
- **Texto Sutil**: `#757575`
- **Branco**: `#FFFFFF`

---

## 📜 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia o servidor Expo Dev Tools |
| `npm run android` | Abre no emulador Android |
| `npm run ios` | Abre no simulador iOS |
| `npm run web` | Abre no navegador web |
| `npm run build:android` | Build para Android (EAS) - com validação de segurança |
| `npm run build:android:test` | Build de teste para Android |
| `npm run build:ios` | Build para iOS (EAS) - com validação de segurança |
| `npm run build:ios:test` | Build de teste para iOS |
| `npm run validate:security` | Valida segurança antes de builds |
| `npm run push` | Git: adiciona, commita e faz push |
| `npm run push:quick` | Git: push rápido (mesmo que push) |
| `npm run pull` | Git: atualiza do repositório |

---

## 🔄 Git - Versionamento

### Scripts Automatizados

O projeto inclui scripts PowerShell para facilitar operações Git:

#### Push (Commit + Push Automático)

```bash
npm run push
```

ou diretamente:

```bash
.\push.ps1
```

O script:
- Adiciona todas as mudanças
- Cria commit com data/hora automática
- Faz push para `https://github.com/eduabjr/app-Cart-rioConnect.git`
- Configura upstream automaticamente

#### Pull (Atualizar do GitHub)

```bash
npm run pull
```

ou diretamente:

```bash
.\pull.ps1
```

O script:
- Atualiza o repositório local
- Configura remote automaticamente se necessário

### Configuração Manual

Se preferir usar comandos Git diretamente:

```bash
# Verificar status
git status

# Adicionar mudanças
git add .

# Commit
git commit -m "Descrição das mudanças"

# Push
git push origin main

# Pull
git pull origin main
```

**Repositório**: `https://github.com/eduabjr/app-Cart-rioConnect.git`

---

## 🏗️ Build para Produção

### EAS Build (Recomendado)

O Expo Application Services (EAS) facilita o build para produção.

#### 1. Instalar EAS CLI

```bash
npm install -g eas-cli
```

#### 2. Login no Expo

```bash
eas login
```

#### 3. Configurar EAS

```bash
eas build:configure
```

#### 4. Build para Android

```bash
npm run build:android
```

ou

```bash
eas build --platform android
```

#### 5. Build para iOS

```bash
npm run build:ios
```

ou

```bash
eas build --platform ios
```

### Build Local (Avançado)

Para build local, você precisará:

- **Android**: Android Studio, JDK, Android SDK
- **iOS**: Xcode, CocoaPods (apenas macOS)

```bash
# Android
npx expo run:android

# iOS
npx expo run:ios
```

---

## 🐛 Troubleshooting

### Problemas Comuns

#### Erro: "Module not found"

```bash
# Limpe o cache e reinstale
rm -rf node_modules
npm install
npx expo start -c
```

#### Erro: "Metro bundler error"

```bash
# Limpe o cache do Metro
npx expo start -c
```

#### Erro: "Expo Go não conecta"

1. Verifique se o dispositivo está na mesma rede Wi-Fi
2. Tente usar o modo "Tunnel" no Expo Dev Tools
3. Verifique o firewall/antivírus

#### Erro: "Git push falha"

1. Verifique suas credenciais Git:
   ```bash
   git config --global user.name "Seu Nome"
   git config --global user.email "seu@email.com"
   ```

2. Verifique se tem permissão no repositório
3. Tente autenticar novamente

#### Build falha no EAS

1. Verifique o `app.json` está correto
2. Verifique se todas as dependências estão no `package.json`
3. Veja os logs detalhados no dashboard do Expo

---

## 🔒 Segurança

O CartórioConnect implementa múltiplas camadas de segurança:

### Proteção de Dados
- **Criptografia**: Favoritos e buscas recentes são criptografados antes de armazenar
- **Chaves Seguras**: Chaves de criptografia armazenadas no Keychain (iOS) / Keystore (Android)
- **Migração Automática**: Dados antigos são automaticamente migrados para formato criptografado

### Comunicação Segura
- **HTTPS Obrigatório**: Todas as conexões de rede usam HTTPS
- **SSL Pinning**: Estrutura implementada para validação de certificados
- **Validação de Integridade**: Downloads validados com hash SHA-256

### Segurança do Código
- **Ofuscação**: Código ofuscado em builds de produção
- **Proteção Root/Jailbreak**: Detecção e alertas de segurança
- **Validação Antes de Build**: Scripts de validação executados automaticamente

### Documentação de Segurança
- Veja `STATUS_SEGURANCA.md` para detalhes completos
- Veja `MELHORIAS_SEGURANCA.md` para implementações de segurança
- Veja `ANALISE_COMPLETA.md` para análise profunda do projeto

---

## 📚 Documentação Adicional

### Recursos do Expo

- [Documentação Oficial do Expo](https://docs.expo.dev/)
- [Guia de Início Rápido](https://docs.expo.dev/get-started/installation/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Expo SDK 54](https://docs.expo.dev/versions/v54.0.0/)

### Bibliotecas Utilizadas

- [Google Mobile Ads](https://github.com/react-native-google-mobile-ads/react-native-google-mobile-ads) - Integração AdMob
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) - Armazenamento local
- [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/) - Geolocalização
- [Expo Linking](https://docs.expo.dev/versions/latest/sdk/linking/) - Deep linking
- [Expo Crypto](https://docs.expo.dev/versions/latest/sdk/crypto/) - Criptografia e hash
- [Expo Secure Store](https://docs.expo.dev/versions/latest/sdk/securestore/) - Armazenamento seguro
- [React Native Device Info](https://github.com/react-native-device-info/react-native-device-info) - Informações do dispositivo

### React Navigation

- [Documentação React Navigation](https://reactnavigation.org/)
- [Stack Navigator](https://reactnavigation.org/docs/stack-navigator/)

### TypeScript

- [Documentação TypeScript](https://www.typescriptlang.org/docs/)
- [TypeScript com React Native](https://reactnative.dev/docs/typescript)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um **Fork** do projeto
2. Criar uma **branch** para sua feature (`git checkout -b feature/MinhaFeature`)
3. Fazer **commit** das mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Fazer **push** para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um **Pull Request**

### Padrões de Código

- Use **TypeScript** para tipagem
- Siga os padrões do **ESLint** configurado
- Mantenha componentes **funcionais** (não classes)
- Use **StyleSheet** para estilos
- Adicione comentários quando necessário

---

## 📄 Licença

Este projeto é privado e de propriedade de **eduabjr**.

---

## 📊 Status do Projeto

✅ **100% Funcional e Pronto para Lançamento**

- ✅ Todas as funcionalidades implementadas
- ✅ Segurança robusta
- ✅ Performance otimizada
- ✅ Sem erros críticos
- ✅ Código limpo e bem estruturado

Veja `ANALISE_COMPLETA.md` para análise profunda de todas as funcionalidades.

---

## 👤 Autor

**eduabjr**

- Expo: [@eduabjr](https://expo.dev/accounts/eduabjr)
- GitHub: [@eduabjr](https://github.com/eduabjr)

---

## 🙏 Agradecimentos

- [Expo](https://expo.dev/) pela excelente plataforma de desenvolvimento
- [React Native](https://reactnative.dev/) pela framework mobile
- Comunidade open source por todas as bibliotecas utilizadas

---

<div align="center">

**Desenvolvido com ❤️ usando Expo**

[⬆ Voltar ao topo](#-cartórioconnect)

</div>
