# Configuración Rápida - Golden Knight

## Pasos para activar los datos en vivo:

### 1. Obtén una BSCScan API Key (GRATIS - 2 minutos)
- Ve a https://bscscan.com/register
- Crea una cuenta
- Ve a "API-KEYs" en tu perfil
- Crea un nuevo API key
- Copia el key

### 2. Obtén la dirección de tu contrato
- Si ya desplegaste el token, usa esa dirección
- Formato: `0x...` (42 caracteres)

### 3. Crea el archivo .env.local
```bash
# En la raíz del proyecto, crea un archivo llamado .env.local
TOKEN_CONTRACT=0xTuDireccionDelContrato
BSCSCAN_API_KEY=TuApiKeyDeBscScan
```

### 4. Reinicia el servidor
```bash
# Detén el servidor (Ctrl+C)
# Vuelve a iniciar
npm run dev
```

## ¿Qué hace cada dato?

### BNB Price
- **Fuente**: CoinGecko API (ya funciona, sin configuración)
- **Actualización**: Cada 30 segundos
- **Gratis**: Sí, sin límites

### Gold Price (Precio del token)
- **Fuente**: DEX Screener API (detecta automáticamente tu token)
- **Actualización**: Cada 60 segundos
- **Gratis**: Sí
- **Requiere**: Solo la dirección del contrato

### Active Knights (Top 100 holders)
- **Fuente**: BSCScan API
- **Actualización**: Cada 60 segundos
- **Requiere**: BSCScan API Key + dirección del contrato

### The Vault (Top 5 holders)
- **Fuente**: BSCScan API
- **Actualización**: Cada 60 segundos
- **Muestra**: Wallet address acortada + cantidad de tokens

## Alternativa SIN configuración

Si NO tienes el token desplegado aún:
- La página ya funciona con datos de ejemplo
- BNB Price ya está en vivo
- Los demás datos mostrarán placeholders realistas
- Todo se actualizará automáticamente cuando agregues la configuración

## Soporte

Si tienes problemas:
1. Verifica que el archivo `.env.local` esté en la raíz del proyecto
2. Asegúrate de que los valores no tengan espacios ni comillas
3. Reinicia el servidor después de cambiar el .env.local
4. Revisa la consola del navegador (F12) para ver logs de errores
