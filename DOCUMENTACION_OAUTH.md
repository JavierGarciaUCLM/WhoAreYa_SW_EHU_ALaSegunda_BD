# Documentación OAuth - Google y GitHub

## Resumen

Se implementó autenticación OAuth usando PassportJS para permitir iniciar sesión con cuentas de Google o GitHub en el panel de administración.

---

## Cambios Realizados

### 1. Dependencias Agregadas (`package.json`)

Se agregaron tres paquetes:
- `passport`: Framework de autenticación
- `passport-google-oauth20`: Estrategia para Google OAuth
- `passport-github2`: Estrategia para GitHub OAuth

### 2. Configuración de Passport (`src/config/passport.js`)

**Archivo nuevo creado** que:
- Configura las estrategias OAuth de Google y GitHub
- Solo se inicializan si las credenciales están en `.env` (evita errores si no están configuradas)
- Cuando un usuario se autentica con OAuth:
  - Busca si el usuario ya existe (por email)
  - Si no existe, lo crea automáticamente
  - El primer usuario OAuth será admin automáticamente

### 3. Rutas OAuth (`src/routes/auth.js`)

Se agregaron 4 rutas nuevas:
- `GET /api/auth/google` - Inicia autenticación con Google
- `GET /api/auth/google/callback` - Callback de Google (retorna después de autenticar)
- `GET /api/auth/github` - Inicia autenticación con GitHub
- `GET /api/auth/github/callback` - Callback de GitHub

### 4. Controladores OAuth (`src/controllers/authController.js`)

Se agregaron dos funciones:
- `googleCallback`: Maneja el retorno de Google OAuth
- `githubCallback`: Maneja el retorno de GitHub OAuth

Ambas funciones:
- Verifican que el usuario sea admin
- Crean token JWT
- Guardan en sesión
- Redirigen al dashboard

### 5. Vista de Login (`views/admin/login.ejs`)

Se agregaron botones OAuth:
- Botón "Log in with Google" (azul)
- Botón "Log in with GitHub" (negro)

Los botones solo se muestran si las credenciales están configuradas en `.env`.

### 6. Modelo User (`src/models/User.js`)

Se modificó el campo `password`:
- Antes: `required: true`
- Ahora: `required: false`

**Razón**: Los usuarios OAuth no tienen contraseña (se autentican con Google/GitHub).

### 7. Servidor (`src/server.js`)

Se agregó inicialización de Passport:
- Inicializa Passport
- Configura sesiones de Passport

### 8. Controlador Admin (`src/controllers/adminController.js`)

Se modificó `getLogin` para:
- Pasar información sobre qué OAuth está habilitado a la vista
- Manejar errores de OAuth desde query string

---

## Variables de Entorno Necesarias

En el archivo `.env` se deben agregar:

```env
# OAuth Google
GOOGLE_CLIENT_ID=tu_client_id_de_google
GOOGLE_CLIENT_SECRET=tu_client_secret_de_google

# OAuth GitHub
GITHUB_CLIENT_ID=tu_client_id_de_github
GITHUB_CLIENT_SECRET=tu_client_secret_de_github
```

---

## Cómo Funciona

### Flujo de Autenticación OAuth:

1. Usuario hace clic en "Log in with Google" o "Log in with GitHub"
2. Redirige a la página de autenticación del proveedor (Google/GitHub)
3. Usuario autoriza la aplicación
4. El proveedor redirige de vuelta a `/api/auth/google/callback` (o `/github/callback`)
5. Passport ejecuta la estrategia correspondiente:
   - Busca o crea el usuario en la base de datos
   - Retorna el usuario
6. El callback verifica que sea admin
7. Crea token JWT y guarda en sesión
8. Redirige al dashboard (`/admin`)

---

## Características

- ✅ **Opcional**: Si no configuras OAuth, el servidor funciona igual (solo login normal)
- ✅ **Auto-creación de usuarios**: Si el usuario no existe, se crea automáticamente
- ✅ **Primer usuario admin**: El primer usuario OAuth será admin
- ✅ **Protección**: Solo usuarios admin pueden acceder al panel después de OAuth
- ✅ **Integración**: Funciona junto con el sistema de login normal (email/password)

---

## Archivos Modificados/Creados

**Nuevos:**
- `src/config/passport.js`

**Modificados:**
- `package.json` - Dependencias
- `src/routes/auth.js` - Rutas OAuth
- `src/controllers/authController.js` - Callbacks OAuth
- `src/controllers/adminController.js` - Manejo de OAuth en login
- `src/models/User.js` - Password opcional
- `src/server.js` - Inicialización Passport
- `views/admin/login.ejs` - Botones OAuth

---

## Notas

- Las credenciales OAuth se obtienen desde:
  - **Google**: https://console.cloud.google.com/
  - **GitHub**: https://github.com/settings/developers
- En producción, cambiar las URLs de callback a tu dominio real
- Los Client Secrets solo se muestran una vez, guardarlos bien

