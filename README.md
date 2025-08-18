# 🛠️ NeoArts WebTools

[![Deploy to GitHub Pages](https://github.com/NeoArts/NeoArts-WebTools/actions/workflows/deploy.yml/badge.svg)](https://github.com/NeoArts/NeoArts-WebTools/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live-Demo-blue)](https://neoarts.github.io/NeoArts-WebTools/)

**NeoArts WebTools** es una suite completa de herramientas de gestión empresarial diseñada para automatizar y agilizar las tareas administrativas. Desarrollada con tecnologías modernas como Astro.js, React y TypeScript.

## 🌟 Características Principales

### � **Generación de Documentos**
- **Cuentas de Cobro**: Generación automática de facturas en PDF
- **Cotizaciones**: Sistema de creación y gestión de cotizaciones
- **Plantillas Personalizables**: Documentos adaptables a diferentes necesidades

### 👥 **Gestión de Clientes y Proveedores**
- **Registro de Clientes**: Base de datos organizada de clientes
- **Gestión de Proveedores**: Administración completa de proveedores
- **Historial de Transacciones**: Seguimiento detallado de todas las operaciones

### 💻 **Terminal PowerShell Web**
- **Interfaz de Terminal**: Terminal web simulado con comandos PowerShell
- **Diagnósticos de Red**: Herramientas de ping y conectividad
- **Comandos Personalizados**: Comandos específicos para operaciones NeoArts

### 🎨 **Diseño Moderno**
- **Interfaz Responsive**: Adaptable a dispositivos móviles y desktop
- **Tema Oscuro/Claro**: Soporte para múltiples temas
- **Notificaciones**: Sistema de notificaciones en tiempo real

## 🚀 Demo en Vivo

Visita la aplicación en funcionamiento: **[NeoArts WebTools Demo](https://neoarts.github.io/NeoArts-WebTools/)**

## 🏗️ Estructura del Proyecto

```text
NeoArts-WebTools/
├── public/                     # Archivos estáticos
│   ├── favicon.svg
│   └── icons/                  # Iconos SVG
├── src/
│   ├── features/              # Módulos funcionales
│   │   ├── docs/              # Gestión de documentos
│   │   ├── invoice/           # Sistema de facturación
│   │   ├── pdf/               # Generación de PDFs
│   │   ├── providers/         # Gestión de proveedores
│   │   ├── quote/             # Sistema de cotizaciones
│   │   └── terminal/          # Terminal PowerShell web
│   ├── layouts/               # Layouts de Astro
│   ├── pages/                 # Páginas de la aplicación
│   └── shared/                # Componentes compartidos
├── .github/workflows/         # GitHub Actions
└── package.json
```

## 🛠️ Tecnologías Utilizadas

- **[Astro.js](https://astro.build/)** - Framework de desarrollo web
- **[React](https://reactjs.org/)** - Biblioteca de interfaz de usuario
- **[TypeScript](https://www.typescriptlang.org/)** - Superset tipado de JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework de CSS utilitario
- **[jsPDF](https://github.com/MrRio/jsPDF)** - Generación de PDFs
- **[React Hot Toast](https://react-hot-toast.com/)** - Sistema de notificaciones

## 🚀 Instalación y Desarrollo

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/NeoArts/NeoArts-WebTools.git

# Navegar al directorio
cd NeoArts-WebTools

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

### Scripts Disponibles

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Construir para producción
npm run preview    # Previsualizar build local
npm run deploy     # Desplegar a GitHub Pages
```

## 📦 Despliegue

### GitHub Pages (Automático)

El proyecto está configurado para desplegarse automáticamente en GitHub Pages mediante GitHub Actions cuando se hace push a la rama `main`.

### Despliegue Manual

```bash
# Construir el proyecto
npm run build

# Desplegar a GitHub Pages
npm run deploy
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **NeoArts Team** - *Desarrollo inicial* - [NeoArts](https://github.com/NeoArts)

## 🙏 Agradecimientos

- Astro.js por el excelente framework
- React team por la fantástica biblioteca
- Tailwind CSS por el sistema de diseño
- Todos los contribuidores de código abierto

---

**¿Encontraste un bug?** [Reporta un issue](https://github.com/NeoArts/NeoArts-WebTools/issues)

**¿Tienes una idea?** [Sugiere una nueva feature](https://github.com/NeoArts/NeoArts-WebTools/issues/new?template=feature_request.md)
