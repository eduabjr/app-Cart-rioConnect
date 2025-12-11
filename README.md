# 📱 CartórioConnect

Aplicativo React Native desenvolvido com **Expo** para consultar dados de contato de cartórios interligados do Brasil.

**Conta Expo**: [eduabjr](https://expo.dev/accounts/eduabjr)  
**Repositório**: [github.com/eduabjr/cartorio-connect](https://github.com/eduabjr)

## 🚀 Início Rápido

### 1. Configuração Inicial

**Primeira vez?** Veja o guia completo: [SETUP_INICIAL.md](./SETUP_INICIAL.md)

### 2. Instalação

```bash
# Instale as dependências
npm install

# Faça login no Expo (primeira vez)
npx expo login

# Inicie o servidor Expo
npm start
```

### 3. Testando no Dispositivo

1. Instale o app **Expo Go** na App Store ou Google Play
2. Execute `npm start`
3. Escaneie o QR code com o app Expo Go

## ✨ Características

- ✅ **100% Offline** - Todos os dados estão no bundle do app
- ✅ **Expo** - Desenvolvimento simplificado
- ✅ **Design Moderno** - Interface limpa e profissional
- ✅ **Área de Anúncios** - Componente flexível para AdMob, imagens, HTML
- ✅ **TypeScript** - Tipagem estática

## 📦 Scripts

- `npm start` - Inicia o servidor Expo
- `npm run android` - Abre no Android
- `npm run ios` - Abre no iOS
- `npm run web` - Abre no navegador

## 📁 Estrutura

```
CartórioConnect/
├── App.tsx                 # Componente principal
├── app.json                # Configuração do Expo
├── assets/
│   ├── data/
│   │   └── cartoriosInterligados.json
│   └── images/
│       └── logo.png
├── src/
│   ├── components/
│   │   └── AdBanner.tsx
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── CartorioListScreen.tsx
│   │   └── CartorioDetailScreen.tsx
│   └── services/
│       └── cartorioService.ts
```

## 📚 Documentação

- [SETUP_INICIAL.md](./SETUP_INICIAL.md) - **Guia passo a passo de configuração**
- [CONFIGURACAO_EXPO_GIT.md](./CONFIGURACAO_EXPO_GIT.md) - Configuração detalhada Expo e Git
- [README_EXPO.md](./README_EXPO.md) - Guia completo do Expo
- [README_REACT_NATIVE.md](./README_REACT_NATIVE.md) - Documentação técnica
- [DESIGN_VISUAL.md](./DESIGN_VISUAL.md) - Guia de design visual
- [INICIO_RAPIDO.md](./INICIO_RAPIDO.md) - Início rápido

## 🏗️ Build para Produção

```bash
# Instale o EAS CLI
npm install -g eas-cli

# Login no Expo (se ainda não fez)
eas login

# Build para Android
eas build --platform android

# Build para iOS
eas build --platform ios
```

## 🔄 Git - Push e Pull

```bash
# Ver status
git status

# Adicionar mudanças
git add .

# Commit
git commit -m "Descrição das mudanças"

# Push para GitHub
git push

# Pull (atualizar do GitHub)
git pull
```

**Repositório**: `https://github.com/eduabjr/cartorio-connect.git`

---

**Desenvolvido com Expo** 🚀
