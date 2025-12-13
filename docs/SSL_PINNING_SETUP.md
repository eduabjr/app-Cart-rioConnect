# 🔒 Configuração de SSL Pinning

Este documento explica como configurar SSL Pinning no CartórioConnect.

## 📋 O Que É SSL Pinning?

SSL Pinning (Certificate Pinning) é uma técnica de segurança que fixa o certificado SSL/TLS do servidor no aplicativo. Isso previne ataques Man-in-the-Middle (MITM), onde um atacante intercepta a comunicação entre o app e o servidor.

## ⚙️ Como Configurar

### 1. Obter Hash do Certificado do Servidor

Para obter o hash SHA-256 do certificado público do seu servidor:

```bash
# Método 1: Usando OpenSSL
openssl s_client -connect seu-servidor.com:443 -showcerts | \
  openssl x509 -pubkey -noout | \
  openssl pkey -pubin -outform der | \
  openssl dgst -sha256 -binary | \
  openssl enc -base64

# Método 2: Usando curl
curl -v https://seu-servidor.com 2>&1 | \
  grep -oP 'CN=\K[^,]*' | \
  head -1
```

### 2. Configurar no Código

Edite `src/services/sslPinningService.ts`:

```typescript
const PINNED_CERTIFICATES: Record<string, string[]> = {
  'seu-servidor.com': [
    'SEU_HASH_SHA256_AQUI',
    // Pode adicionar múltiplos hashes para backup
    'HASH_BACKUP_AQUI',
  ],
  'api.exemplo.com': [
    'OUTRO_HASH_AQUI',
  ],
};
```

### 3. Testar

Após configurar, o app validará automaticamente o certificado em todas as conexões HTTPS para os domínios configurados.

## ⚠️ Importante

1. **Backup de Certificados**: Configure múltiplos hashes para permitir rotação de certificados sem quebrar o app.

2. **Renovação de Certificados**: Quando o certificado do servidor for renovado, atualize os hashes no app e faça um novo build.

3. **Desenvolvimento**: Em desenvolvimento (`__DEV__`), o SSL Pinning pode ser mais permissivo para facilitar testes.

## 🔧 Implementação Avançada

Para uma implementação completa de SSL Pinning, considere usar:

- `react-native-ssl-pinning` (requer configuração nativa)
- Implementação nativa customizada

A implementação atual fornece validação básica. Para máxima segurança, expanda com bibliotecas nativas.

