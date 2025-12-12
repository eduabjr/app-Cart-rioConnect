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
- 📞 **Ações Rápidas** - Ligue ou envie e-mail diretamente do app
- 📋 **Copiar Contatos** - Copie informações para área de transferência

---

## 🚀 Funcionalidades

### 🔍 Busca e Filtros

- **Busca Geral**: Pesquise por nome do cartório, cidade, UF ou número CNJ
- **Filtros Específicos**: 
  - Filtro por **UF** (Estado)
  - Filtro por **Cidade**
  - Filtro por **CNJ** (Número do cartório)
- **Busca em Tempo Real**: Resultados instantâneos enquanto você digita

### 📞 Contatos e Ações

- **Ligar Diretamente**: Toque no botão "Ligar" para abrir o discador
- **Enviar E-mail**: Botão "Email" abre o cliente de e-mail padrão
- **Copiar Informações**: Copie telefone ou e-mail para área de transferência
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

### 🎨 Design Visual

- **Header Escuro**: Barra superior com menu e título
- **Barra de Busca**: Campo de busca com ícone e botão de limpar
- **Cards Modernos**: Cards brancos com sombras e bordas arredondadas
- **Badges Coloridos**: Indicadores visuais para UF
- **Botões de Ação**: Botões coloridos para ações rápidas
- **Anúncios Flexíveis**: Área dedicada para exibição de anúncios

---

## 🛠️ Tecnologias Utilizadas

### Core

- **[Expo](https://expo.dev/)** (~49.0.15) - Framework para desenvolvimento React Native
- **[React Native](https://reactnative.dev/)** (0.72.6) - Framework mobile
- **[React](https://reactjs.org/)** (18.2.0) - Biblioteca JavaScript
- **[TypeScript](https://www.typescriptlang.org/)** (^5.1.3) - Tipagem estática

### Navegação

- **[@react-navigation/native](https://reactnavigation.org/)** (^6.1.9) - Navegação
- **[@react-navigation/stack](https://reactnavigation.org/docs/stack-navigator/)** (^6.3.20) - Navegador em pilha
- **[react-native-screens](https://github.com/software-mansion/react-native-screens)** (~3.22.0) - Otimização de telas

### Funcionalidades

- **[expo-linking](https://docs.expo.dev/versions/latest/sdk/linking/)** (~5.0.2) - Abrir links (tel:, mailto:)
- **[expo-clipboard](https://docs.expo.dev/versions/latest/sdk/clipboard/)** (~5.0.0) - Área de transferência
- **[react-native-webview](https://github.com/react-native-webview/react-native-webview)** (13.2.2) - WebView para anúncios HTML

### Animações

- **[react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/)** (~3.3.0) - Animações performáticas
- **[react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/)** (~2.12.0) - Gestos nativos

---

## 📦 Instalação

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **[Node.js](https://nodejs.org/)** (versão LTS recomendada - 18.x ou superior)
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
│   │   └── cartoriosInterligados.json  # Base de dados dos cartórios
│   └── images/
│       └── logo.png             # Logo do aplicativo
│
└── src/
    ├── components/              # Componentes reutilizáveis
    │   └── AdBanner.tsx         # Componente de anúncios flexível
    │
    ├── screens/                 # Telas do aplicativo
    │   ├── HomeScreen.tsx       # Tela inicial
    │   ├── CartorioListScreen.tsx  # Lista de cartórios
    │   └── CartorioDetailScreen.tsx # Detalhes do cartório
    │
    └── services/                # Serviços e lógica de negócio
        └── cartorioService.ts   # Serviço de busca de cartórios
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

#### `src/components/AdBanner.tsx`
Componente flexível para exibição de anúncios:
- Suporta AdMob, imagens, HTML e conteúdo customizado
- Responsivo e configurável
- Não interfere na navegação

#### `src/screens/`
- **HomeScreen**: Tela inicial com logo e botão de acesso
- **CartorioListScreen**: Lista com busca, filtros e paginação
- **CartorioDetailScreen**: Detalhes completos do cartório selecionado

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

### Configurar Anúncios

Edite os componentes `AdBanner` nas telas para configurar:

```typescript
<AdBanner
  adType="image"  // ou 'admob', 'html', 'custom'
  imageUri={require('../../assets/images/banner.png')}
  position="bottom"
  height={100}
  onAdPress={() => console.log('Anúncio clicado')}
/>
```

### Cores e Estilos

As cores principais estão definidas nos arquivos de estilo:

- **Azul Principal**: `#1a73e8`
- **Azul Secundário**: `#4a90e2`
- **Cinza Escuro**: `#2c2c2c`
- **Cinza Claro**: `#e5e5e5`
- **Fundo**: `#f8f9fa`

---

## 📜 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia o servidor Expo Dev Tools |
| `npm run android` | Abre no emulador Android |
| `npm run ios` | Abre no simulador iOS |
| `npm run web` | Abre no navegador web |
| `npm run build:android` | Build para Android (EAS) |
| `npm run build:ios` | Build para iOS (EAS) |
| `npm run push` | Git: adiciona, commita e faz push |
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

## 📚 Documentação Adicional

### Recursos do Expo

- [Documentação Oficial do Expo](https://docs.expo.dev/)
- [Guia de Início Rápido](https://docs.expo.dev/get-started/installation/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Expo SDK 49](https://docs.expo.dev/versions/v49.0.0/)

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
