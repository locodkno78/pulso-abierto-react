# Pulso Abierto

Aplicacion web para consultar criptomonedas, filtrar resultados y ver el detalle de cada moneda. Esta construida con React, TypeScript y Vite.

## Requisitos

- Node.js 20.19+ o 22.12+
- npm

## Instalacion y ejecucion

Desde la carpeta del proyecto, instala las dependencias definidas en `package-lock.json`:

```bash
npm ci
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Abre en el navegador la URL que muestra Vite en la terminal.

## Comandos disponibles

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Verifica TypeScript y genera la version de produccion
npm run lint     # Ejecuta ESLint
npm run preview  # Sirve localmente la version de produccion
```

Para probar la version de produccion:

```bash
npm run build
npm run preview
```
