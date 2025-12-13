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
- 📤 **Compartilhamento** - Compartilhe dados via WhatsApp
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

### ⭐ Favoritos e Recentes

- **Favoritos**: Marque cartórios importantes com um toque
- **Acesso Rápido**: Veja seus favoritos na tela inicial
- **Buscas Recentes**: Histórico automático dos últimos cartórios consultados
- **Navegação Rápida**: Toque em qualquer favorito ou recente para ver detalhes

### 📞 Contatos e Ações

- **Ligar Diretamente**: Toque no botão "Ligar" para abrir o discador
- **Enviar E-mail**: Botão "Email" abre o cliente de e-mail padrão
- **Traçar Rota**: Abre Google Maps ou Waze com o endereço do cartório
- **Compartilhar**: Compartilhe dados completos via WhatsApp
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

### 🔒 Segurança

- **Criptografia de Dados**: Favoritos e buscas recentes criptografados
- **Chaves Seguras**: Armazenamento no Keychain (iOS) e Keystore (Android)
- **Validação de Integridade**: Hash SHA-256 para downloads
- **SSL Pinning**: Estrutura para validação de certificados
- **Proteção Root/Jailbreak**: Detecção e alertas de segurança

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
- **[react-native-google-mobile-ads](https://github.com/react-native-google-mobile-ads/react-native-google-mobile-ads)** (^16.0.0) - Google AdMob

---

## 📦 Instalação

### Pré-requisitos

- **[Node.js](https://nodejs.org/)** (versão LTS recomendada - 20.x ou superior)
- **[npm](https://www.npmjs.com/)** ou **[Yarn](https://yarnpkg.com/)**
- **[Git](https://git-scm.com/)**
- **Expo Go** (app para testar no dispositivo físico)
  - [Android - Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)

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

#### 3. Inicie o Servidor de Desenvolvimento

```bash
npm start
```

ou

```bash
npx expo start
```

---

## 📱 Como Usar

### No Dispositivo Físico

1. **Instale o Expo Go** no seu celular (Android ou iOS)
2. **Execute** `npm start` no terminal
3. **Escaneie o QR Code** que aparece no terminal
   - **Android**: Use o app Expo Go ou a câmera
   - **iOS**: Use a câmera do iPhone

### No Emulador/Simulador

#### Android

```bash
npm run android
```

**Requisitos**: Android Studio instalado com emulador configurado.

#### iOS (apenas macOS)

```bash
npm run ios
```

**Requisitos**: Xcode instalado com simulador configurado.

---

## 🏗️ Estrutura do Projeto

```
CartórioConnect/
├── App.tsx                      # Componente raiz e navegação
├── app.json                     # Configuração do Expo
├── package.json                 # Dependências e scripts
├── tsconfig.json                # Configuração TypeScript
├── babel.config.js              # Configuração Babel
├── metro.config.js              # Configuração Metro bundler
├── eas.json                     # Configuração EAS Build
├── push.ps1                     # Script PowerShell para Git push
├── pull.ps1                     # Script PowerShell para Git pull
│
├── assets/                      # Recursos estáticos
│   ├── data/
│   │   ├── cartoriosInterligados.json      # Base principal
│   │   ├── cartoriosInterligadoscivil.json # Cartórios civis
│   │   ├── cartoriosInterligadosprotesto.json
│   │   ├── cartoriosInterligadosimoveis.json
│   │   ├── cartoriosInterligadostitulos.json
│   │   ├── cartoriosInterligadosjuridico.json
│   │   ├── cartoriosInterligadostabelionato.json
│   │   └── metadata.json        # Metadados (data, versão)
│   └── images/
│       └── logo.png             # Logo do aplicativo
│
├── docs/                        # Documentação
│   └── SSL_PINNING_SETUP.md
│
├── scripts/                     # Scripts de automação
│   ├── generate-tipo-files.js
│   └── validate-security.js
│
└── src/
    ├── components/              # Componentes reutilizáveis
    │   ├── AdBanner.tsx         # Componente de anúncios AdMob
    │   └── FooterBanner.tsx     # Banner do rodapé
    │
    ├── screens/                 # Telas do aplicativo
    │   ├── HomeScreen.tsx       # Tela inicial
    │   ├── CartorioListScreen.tsx  # Lista de cartórios
    │   ├── CartorioDetailScreen.tsx # Detalhes do cartório
    │   └── AboutScreen.tsx      # Tela Sobre
    │
    ├── services/                # Serviços e lógica de negócio
    │   ├── cartorioService.ts   # Busca de cartórios
    │   ├── storageService.ts    # Favoritos e recentes
    │   ├── locationService.ts   # Geolocalização e mapas
    │   ├── shareService.ts      # Compartilhamento WhatsApp
    │   ├── encryptionService.ts # Criptografia
    │   ├── keyManagementService.ts # Gerenciamento de chaves
    │   ├── updateService.ts     # Atualização de dados
    │   ├── integrityService.ts  # Validação SHA-256
    │   ├── sslPinningService.ts # SSL Pinning
    │   └── securityCheckService.ts # Verificação root/jailbreak
    │
    ├── hooks/                   # Hooks customizados
    │   └── useAppState.ts       # Estado do app
    │
    └── utils/                   # Utilitários
        ├── performanceOptimizer.ts
        └── securityValidator.ts
```

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

### Atualizar Metadados

Edite `assets/data/metadata.json`:

```json
{
  "lastUpdate": "2025-12-13",
  "version": "1.0.0",
  "totalCartorios": 0,
  "description": "Base de dados offline de cartórios interligados do Brasil"
}
```

---

## 📜 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia o servidor Expo |
| `npm run android` | Abre no emulador Android |
| `npm run ios` | Abre no simulador iOS |
| `npm run build:android` | Build para Android (EAS) |
| `npm run build:ios` | Build para iOS (EAS) |
| `npm run push` | Git: adiciona, commita e faz push |
| `npm run pull` | Git: atualiza do repositório |

---

## 🏗️ Build para Produção

### EAS Build (Recomendado)

#### 1. Instalar EAS CLI

```bash
npm install -g eas-cli
```

#### 2. Login no Expo

```bash
eas login
```

#### 3. Build para Android

```bash
eas build --platform android
```

#### 4. Build para iOS

```bash
eas build --platform ios
```

---

## 🐛 Troubleshooting

### Erro: "Module not found"

```bash
rm -rf node_modules
npm install
npx expo start -c
```

### Erro: "Expo Go não conecta"

1. Verifique se o dispositivo está na mesma rede Wi-Fi
2. Tente usar o modo "Tunnel" no Expo Dev Tools

### Erro: "Git push falha"

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

---

## 📊 Status do Projeto

✅ **100% Funcional e Pronto para Lançamento**

- ✅ Todas as funcionalidades implementadas
- ✅ Segurança robusta
- ✅ Performance otimizada
- ✅ Código limpo e bem estruturado

---

## 👤 Autor

**eduabjr**

- Expo: [@eduabjr](https://expo.dev/accounts/eduabjr)
- GitHub: [@eduabjr](https://github.com/eduabjr)

---

<div align="center">

**Desenvolvido com ❤️ usando Expo**

[⬆ Voltar ao topo](#-cartórioconnect)

</div>
