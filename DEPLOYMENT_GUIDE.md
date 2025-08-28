# Guía de Despliegue - Tapicería Gaby

## 🚀 Opción 1: Despliegue en Vercel (Recomendado)

### Pasos para desplegar:

1. **Crear cuenta en Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Regístrate con tu cuenta de GitHub, GitLab o email

2. **Subir el código a GitHub**
   - Crea un repositorio en GitHub
   - Sube todos los archivos de la aplicación

3. **Conectar con Vercel**
   - En Vercel, haz clic en "New Project"
   - Conecta tu repositorio de GitHub
   - Vercel detectará automáticamente que es un proyecto Next.js

4. **Configurar el despliegue**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

5. **Desplegar**
   - Haz clic en "Deploy"
   - En 2-3 minutos tendrás tu aplicación en línea

### Resultado:
- URL gratuita como: `https://tapiceria-gaby.vercel.app`
- Funciona perfectamente en móviles
- Actualizaciones automáticas cuando cambies el código
- SSL incluido (https)

---

## 🌐 Opción 2: Netlify (Alternativa gratuita)

### Pasos:
1. Ve a [netlify.com](https://netlify.com)
2. Arrastra la carpeta del proyecto a Netlify
3. Configura build command: `npm run build`
4. Publish directory: `out` o `.next`

---

## 📱 Opción 3: PWA (Progressive Web App)

Para que funcione como una app nativa en el teléfono, puedes convertirla en PWA:

### Agregar al proyecto:
```json
// En package.json, agregar:
"scripts": {
  "build": "next build && next export"
}
```

### Crear manifest.json en public/:
```json
{
  "name": "Tapicería Gaby",
  "short_name": "Tapicería Gaby",
  "description": "App para cotizaciones de tapicería",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

---

## 🔧 Opción 4: Servidor Propio

Si tienes un servidor o hosting:

### Construir para producción:
```bash
npm run build
npm start
```

### Subir archivos:
- Sube toda la carpeta `.next`
- Sube `package.json`
- Instala dependencias en el servidor
- Ejecuta `npm start`

---

## 📲 Cómo usar en el móvil:

### Una vez desplegada:
1. **Abrir en el navegador móvil**
   - Chrome, Safari, Firefox, etc.
   - La app es completamente responsive

2. **Agregar a pantalla de inicio** (PWA):
   - En Chrome: Menú → "Agregar a pantalla de inicio"
   - En Safari: Compartir → "Agregar a pantalla de inicio"
   - Se comportará como una app nativa

3. **Funciona offline** (con PWA):
   - Los datos se guardan localmente
   - No necesita internet para funcionar

---

## ✅ Recomendación Final:

**Para uso inmediato:** Usa Vercel
- Es gratis
- Muy fácil de configurar
- URL profesional
- Funciona perfectamente en móviles

**Para uso profesional:** Considera PWA + dominio propio
- Experiencia de app nativa
- Tu propio dominio (ej: tapiceriagaby.com)
- Funciona offline

---

## 🆘 ¿Necesitas ayuda?

Si necesitas ayuda con cualquiera de estas opciones, puedo:
1. Ayudarte a configurar el despliegue
2. Crear los archivos PWA necesarios
3. Optimizar la app para móviles
4. Configurar un dominio personalizado

¡La aplicación está lista para usar en producción! 🎉
