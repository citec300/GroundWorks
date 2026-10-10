# GroundWorks Corp - Official Website

Plataforma web oficial de **GroundWorks Corp**, especializada en servicios profesionales de excavación masiva, demolición técnica, nivelación de terrenos y alquiler de maquinaria pesada.

---

## 🚀 Características y Tecnologías

- **Tecnología**: HTML5, Vanilla JavaScript, CSS3 moderno con estética industrial y arquitectura responsive.
- **Bundler & Dev Server**: [Vite](https://vitejs.dev/)
- **Optimización**: SEO técnico, metadatos estructurados OpenGraph y Schema.org, sitemap y robots.txt.
- **Rendimiento**: Carga rápida sin dependencias pesadas innecesarias.

---

## 🛠️ Instalación y Uso

### Prerrequisitos
- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)

### Pasos

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/citec300/GroundWorks.git
   cd GroundWorks
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Compilar para producción:
   ```bash
   npm run build
   ```

5. Iniciar servidor de producción (Node.js):
   ```bash
   npm start
   ```

---

## 🌐 Despliegue en Hostinger (App Web de Node.js)

1. En **Hostinger hPanel**, dirígete a **Avanzado** -> **App Web de Node.js**.
2. Conecta tu repositorio de GitHub: `https://github.com/citec300/GroundWorks.git` en la rama `main`.
3. Configuración en Hostinger:
   - **Versión de Node.js:** 18.x o 20.x
   - **Directorio raíz de la aplicación:** `./`
   - **Archivo de inicio:** `server.js`
   - **Comando de compilación:** `npm run build`
   - **Comando de inicio:** `npm start`
4. En la sección **Variables de entorno**, añade las variables de correo (ver `.env.example`):
   - `HOSTINGER_SMTP_HOST`: `smtp.hostinger.com`
   - `HOSTINGER_SMTP_PORT`: `465`
   - `HOSTINGER_SMTP_SECURE`: `true`
   - `HOSTINGER_SMTP_USER`: Tu correo en Hostinger (ej: `info@groundworkscorp.com`)
   - `HOSTINGER_SMTP_PASS`: Tu contraseña de dicho correo
   - `CONTACT_RECIPIENT_EMAIL`: Correo donde recibirás las cotizaciones (ej: `info@groundworkscorp.com`)
   - `PORT`: `3000` (o el asignado por Hostinger)

---

## 📁 Estructura del Proyecto

```text
GroundWorks/
├── assets/           # Recursos visuales e imágenes maestras
├── public/           # Archivos estáticos públicos (logos, favicon, robots, sitemap)
├── index.html        # Estructura principal de la aplicación
├── styles.css        # Sistema de estilos y diseño industrial
├── main.js           # Lógica interactiva y componentes
├── package.json      # Dependencias y scripts de Vite
└── README.md         # Documentación del proyecto
```

---

## 📄 Licencia

© 2026 GroundWorks Corp. Todos los derechos reservados.
