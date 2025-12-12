# 📊 Status do Google AdMob

## ✅ O que está funcionando

1. **Biblioteca instalada**: `react-native-google-mobile-ads` (v16.0.0) ✅
2. **Inicialização**: O AdMob está sendo inicializado no `App.tsx` ✅
3. **Componente AdBanner**: Criado e configurado ✅
4. **IDs de Teste**: Configurados para desenvolvimento (`TestIds.BANNER`) ✅

## ⚠️ O que precisa ser configurado

### 1. App ID do AdMob no `app.json`

O **App ID** do AdMob precisa ser adicionado ao `app.json` para funcionar corretamente, especialmente em builds de produção.

**Como obter o App ID:**
1. Acesse [Google AdMob Console](https://apps.admob.com/)
2. Crie um novo app ou selecione um existente
3. Copie o **App ID** (formato: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`)

**Adicionar ao `app.json`:**

```json
{
  "expo": {
    // ... outras configurações
    "plugins": [
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX",
          "iosAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"
        }
      ]
    ],
    "android": {
      // ... outras configurações
      "googleServicesFile": "./google-services.json"  // Para Android
    },
    "ios": {
      // ... outras configurações
      "googleServicesFile": "./GoogleService-Info.plist"  // Para iOS
    }
  }
}
```

### 2. Ad Unit IDs no `AdBanner.tsx`

Atualmente, o componente está usando IDs de teste. Para produção, você precisa:

1. **Criar Ad Units no AdMob Console:**
   - Acesse [AdMob Console](https://apps.admob.com/)
   - Vá em "Apps" > Seu App > "Ad units"
   - Crie um novo "Banner" ad unit
   - Copie o **Ad Unit ID** (formato: `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX`)

2. **Atualizar `src/components/AdBanner.tsx`:**

```typescript
const adUnitId = __DEV__ 
  ? TestIds.BANNER 
  : Platform.select({
      ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',  // Seu ID iOS
      android: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',  // Seu ID Android
      default: TestIds.BANNER,
    });
```

## 🧪 Testando em Desenvolvimento

### Status Atual

- ✅ **IDs de Teste**: Funcionam automaticamente em desenvolvimento
- ✅ **Banners de Teste**: Devem aparecer quando o app está rodando
- ⚠️ **Expo Go**: Pode ter limitações com módulos nativos

### Como Testar

1. **Execute o app:**
   ```bash
   npm start
   ```

2. **Verifique os logs:**
   - Procure por: `✅ Google AdMob inicializado com sucesso`
   - Procure por: `AdMob Banner carregado`
   - Se houver erro: `❌ Erro ao inicializar Google AdMob` ou `Falha no carregamento do AdMob Banner`

3. **Em desenvolvimento:**
   - Os banners de teste devem aparecer automaticamente
   - Eles mostram "Test Ad" ou similar

## 🚨 Problemas Comuns

### 1. AdMob não inicializa

**Sintomas:**
- Erro no console: `❌ Erro ao inicializar Google AdMob`
- Banners não aparecem

**Soluções:**
- Verifique se está usando Expo Go (pode não suportar módulos nativos)
- Faça um build nativo: `npx expo run:android` ou `npx expo run:ios`
- Verifique se o App ID está configurado no `app.json`

### 2. Banners não aparecem

**Sintomas:**
- App carrega normalmente
- Mas não vê banners

**Soluções:**
- Verifique os logs do console
- Certifique-se de que o componente `<AdBanner />` está sendo renderizado
- Em desenvolvimento, os IDs de teste devem funcionar automaticamente
- Em produção, verifique se os Ad Unit IDs estão corretos

### 3. Erro: "Ad failed to load"

**Sintomas:**
- Log: `Falha no carregamento do AdMob Banner`

**Soluções:**
- Verifique se o Ad Unit ID está correto
- Verifique se o App ID está configurado
- Certifique-se de que o app está publicado no AdMob
- Aguarde alguns minutos após criar o Ad Unit (pode levar tempo para ativar)

## 📱 Build para Produção

Para o AdMob funcionar em produção, você precisa:

1. **Configurar App IDs** no `app.json` (como mostrado acima)
2. **Configurar Ad Unit IDs** no `AdBanner.tsx`
3. **Fazer build nativo** (não funciona no Expo Go):
   ```bash
   npm run build:android
   # ou
   npm run build:ios
   ```

## 🔍 Verificação Rápida

Execute este comando para verificar se há erros:

```bash
npm start
```

Depois, verifique o console por:
- ✅ `Google AdMob inicializado com sucesso`
- ✅ `AdMob Banner carregado`
- ❌ Qualquer mensagem de erro

## 📝 Próximos Passos

1. **Criar conta no AdMob** (se ainda não tiver): [https://apps.admob.com/](https://apps.admob.com/)
2. **Criar um app** no AdMob Console
3. **Obter App IDs** (Android e iOS)
4. **Adicionar App IDs** ao `app.json`
5. **Criar Ad Units** (Banner)
6. **Atualizar Ad Unit IDs** no `AdBanner.tsx`
7. **Fazer build nativo** para testar

---

**Status Atual**: ⚠️ Configurado para desenvolvimento (IDs de teste). Precisa configurar App IDs e Ad Unit IDs para produção.

