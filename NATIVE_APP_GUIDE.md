# 📱 Guía para Crear App Nativa - Tapicería Gaby

## 🎯 Opciones para App Nativa Descargable

### 🚀 Opción 1: Capacitor (Recomendado - Más Fácil)

Capacitor convierte tu app web en una app nativa real para Android e iOS.

#### Pasos para crear la app:

1. **Instalar Capacitor**
```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios
```

2. **Inicializar Capacitor**
```bash
npx cap init "Tapicería Gaby" "com.tapiceriagaby.app"
```

3. **Construir la app web**
```bash
npm run build
```

4. **Agregar plataformas**
```bash
npx cap add android
npx cap add ios
```

5. **Sincronizar archivos**
```bash
npx cap sync
```

6. **Abrir en Android Studio**
```bash
npx cap open android
```

#### Resultado:
- ✅ App nativa real para Android/iOS
- ✅ Se puede subir a Google Play Store / App Store
- ✅ Funciona offline
- ✅ Acceso a funciones del teléfono (cámara, archivos, etc.)

---

### 🔧 Opción 2: React Native (Más Complejo)

Convertir completamente a React Native para máximo rendimiento.

#### Ventajas:
- Rendimiento nativo completo
- Acceso total a APIs del dispositivo
- Mejor integración con el sistema operativo

#### Desventajas:
- Requiere reescribir gran parte del código
- Más tiempo de desarrollo
- Curva de aprendizaje más alta

---

### 📦 Opción 3: Electron (Para Desktop)

Si también quieres una app de escritorio para Windows/Mac/Linux.

---

## 🛠️ Implementación Paso a Paso - Capacitor

### Paso 1: Preparar el proyecto

```bash
# Instalar dependencias
npm install @capacitor/core @capacitor/cli @capacitor/android

# Inicializar
npx cap init "Tapicería Gaby" "com.tapiceriagaby.app"
```

### Paso 2: Configurar capacitor.config.ts

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tapiceriagaby.app',
  appName: 'Tapicería Gaby',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1f2937",
      showSpinner: false
    }
  }
};

export default config;
```

### Paso 3: Actualizar package.json

```json
{
  "scripts": {
    "build": "next build && next export",
    "cap:build": "npm run build && npx cap sync",
    "cap:android": "npm run cap:build && npx cap open android",
    "cap:ios": "npm run cap:build && npx cap open ios"
  }
}
```

### Paso 4: Crear la app Android

```bash
# Construir y sincronizar
npm run cap:build

# Abrir en Android Studio
npm run cap:android
```

### Paso 5: En Android Studio

1. **Conectar tu teléfono** o usar emulador
2. **Hacer clic en "Run"** (▶️)
3. **La app se instalará** en tu dispositivo

---

## 📋 Requisitos del Sistema

### Para Android:
- **Android Studio** instalado
- **Java JDK 11+**
- **Android SDK** (se instala con Android Studio)
- **Dispositivo Android** o emulador

### Para iOS (solo en Mac):
- **Xcode** instalado
- **Cuenta de desarrollador Apple** (para publicar)
- **Dispositivo iOS** o simulador

---

## 🎨 Personalización de la App

### Icono de la App
```bash
# Generar iconos automáticamente
npm install -g @capacitor/assets
npx capacitor-assets generate --iconBackgroundColor '#1f2937'
```

### Splash Screen
Crear imagen de 2732x2732px y colocar en:
- `resources/splash.png`

### Permisos Android
En `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

---

## 📱 Funciones Nativas Adicionales

### Exportar PDF a archivos del teléfono
```typescript
import { Filesystem, Directory } from '@capacitor/filesystem';

const exportPDF = async (pdfBlob: Blob, filename: string) => {
  const base64Data = await convertBlobToBase64(pdfBlob);
  
  await Filesystem.writeFile({
    path: filename,
    data: base64Data,
    directory: Directory.Documents
  });
};
```

### Compartir cotizaciones
```typescript
import { Share } from '@capacitor/share';

const shareQuote = async (pdfPath: string) => {
  await Share.share({
    title: 'Cotización - Tapicería Gaby',
    text: 'Cotización generada',
    url: pdfPath
  });
};
```

---

## 🚀 Publicación en Tiendas

### Google Play Store:
1. **Generar APK firmado** en Android Studio
2. **Crear cuenta de desarrollador** ($25 USD una vez)
3. **Subir APK** a Google Play Console
4. **Completar información** de la app
5. **Publicar**

### Apple App Store:
1. **Generar IPA** en Xcode
2. **Cuenta de desarrollador Apple** ($99 USD/año)
3. **Subir a App Store Connect**
4. **Revisión de Apple** (1-7 días)
5. **Publicar**

---

## 💡 Ventajas de la App Nativa

✅ **Instalación real** en el teléfono
✅ **Funciona sin internet** (datos guardados localmente)
✅ **Icono en pantalla de inicio**
✅ **Notificaciones push** (si las agregas)
✅ **Acceso a archivos** del dispositivo
✅ **Mejor rendimiento**
✅ **Se puede vender** en las tiendas

---

## 🆘 ¿Necesitas Ayuda?

Puedo ayudarte a:
1. **Configurar Capacitor** paso a paso
2. **Crear los archivos** de configuración necesarios
3. **Agregar funciones nativas** específicas
4. **Preparar para publicación** en las tiendas
5. **Resolver problemas** durante el desarrollo

¿Quieres que empecemos con la configuración de Capacitor? 🚀
