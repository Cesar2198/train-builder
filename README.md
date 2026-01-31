# Train Builder

Una aplicación moderna construida con las últimas tecnologías web.

## 🚀 Stack Tecnológico

- **Next.js 15** - Framework React con App Router
- **React 19** - Biblioteca UI
- **TypeScript** - Type safety
- **Tailwind CSS** - Estilos utility-first
- **shadcn/ui** - Componentes UI reutilizables

## 📦 Instalación

```bash
# Instalar dependencias
npm install
# o
yarn install
# o
pnpm install
```

## 🛠️ Desarrollo

```bash
# Ejecutar servidor de desarrollo
npm run dev
# o
yarn dev
# o
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

## 📁 Estructura del Proyecto

```
train-builder/
├── app/                # App Router (Next.js 15)
│   ├── layout.tsx     # Layout principal
│   ├── page.tsx       # Página de inicio
│   ├── globals.css    # Estilos globales
│   ├── error.tsx      # Página de error
│   ├── loading.tsx    # Estado de carga
│   └── not-found.tsx  # Página 404
├── components/        # Componentes reutilizables
│   └── ui/           # Componentes shadcn/ui
├── lib/              # Utilidades
│   └── utils.ts      # Funciones de ayuda
├── public/           # Archivos estáticos
└── package.json      # Dependencias
```

## 🎨 shadcn/ui

Para agregar componentes de shadcn/ui:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
# etc.
```

## 🏗️ Build

```bash
# Construir para producción
npm run build
# o
yarn build
# o
pnpm build
```

## 🚀 Deploy

La forma más fácil de desplegar tu aplicación Next.js es usar [Vercel](https://vercel.com).

## 📚 Documentación

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
