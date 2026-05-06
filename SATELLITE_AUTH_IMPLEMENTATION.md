# Guía de Implementación de Autenticación HUB para Satélites

Esta guía proporciona instrucciones completas para implementar autenticación con el sistema HUB en cualquier satélite, incluyendo la nueva funcionalidad de membresías.

## Tabla de Contenidos

1. [Conceptos Generales](#conceptos-generales)
2. [Tipos de Datos](#tipos-de-datos)
3. [Variables de Entorno](#variables-de-entorno)
4. [Hook de Autenticación del Satélite](#hook-de-autenticación-del-satélite)
5. [Proveedor de Autenticación](#proveedor-de-autenticación)
6. [Base de Datos](#base-de-datos)
7. [Uso en Componentes](#uso-en-componentes)
8. [Flujo de Autenticación](#flujo-de-autenticación)
9. [Manejo de Membresías](#manejo-de-membresías)

---

## Conceptos Generales

El sistema de autenticación funciona con un HUB central que emite tokens JWT. Los satélites (aplicaciones cliente) confían en estos tokens para autenticar usuarios.

**Flujo de alto nivel:**

1. Usuario visita el satélite sin token
2. Satélite redirige a HUB para login
3. HUB autentica al usuario y lo redirige al satélite con un `session_token`
4. Satélite almacena el token en localStorage
5. Satélite usa el token para hacer llamadas a HUB (auth-me)
6. Satélite sincroniza datos del usuario a su propia base de datos

---

## Tipos de Datos

### MembershipSlug

Identificadores técnicos de membresías:

```typescript
type MembershipSlug = 'inicia' | 'intermediate' | 'pro';
```

| Slug | Descripción | Uso |
|------|-------------|-----|
| `inicia` | Nivel gratuito (default) | Plan básico sin restricciones de features |
| `intermediate` | Primer nivel pago | Features avanzadas habilitadas |
| `pro` | Nivel premium | Acceso completo a todas las features |

### HubUser

Estructura del usuario retornada por HUB:

```typescript
export type MembershipSlug = 'inicia' | 'intermediate' | 'pro';

export interface HubUser {
  id: string;                          // UUID único del usuario en HUB
  email: string;                       // Email del usuario
  name?: string;                       // Nombre completo
  role: 'athlete' | 'trainer' | 'admin'; // Rol del usuario
  active_plan?: string[];              // Planes activos (legacy)
  membership_slug?: MembershipSlug;     // Membresía actual (default: 'inicia')
  membership_name?: string;             // Nombre legible de membresía (ej: 'Asciende Pro')
}
```

### UserProfile (en Supabase)

Estructura del perfil sincronizado a la base de datos:

```typescript
export interface UserProfile {
  id: string;                      // UUID auto-generado (PK)
  hub_user_id: string;             // ID del usuario en HUB (unique)
  email: string;
  full_name: string;
  role: 'admin' | 'coach' | 'athlete';
  membership_slug: MembershipSlug; // Sincronizado desde HUB
  membership_name?: string;        // Sincronizado desde HUB
  created_at: timestamptz;
  updated_at: timestamptz;
}
```

---

## Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# HUB API Configuration
VITE_HUB_API_URL=https://hub.asciende.pro

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Dev Mode (opcional, solo para desarrollo)
VITE_FORCE_DEV_MODE=false
```

**Notas:**
- `VITE_HUB_API_URL`: URL del sistema HUB central
- `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`: Credenciales de Supabase
- El prefijo `VITE_` expone variables al lado del cliente (necesario para Vite)

---

## Hook de Autenticación del Satélite

**Archivo:** `src/hooks/useSatelliteAuth.ts`

Este hook maneja la comunicación con HUB y gestiona el token de sesión.

```typescript
import { useState, useEffect } from 'react';

export type MembershipSlug = 'inicia' | 'intermediate' | 'pro';

export interface HubUser {
  id: string;
  email: string;
  name?: string;
  role: 'athlete' | 'trainer' | 'admin';
  active_plan?: string[];
  membership_slug?: MembershipSlug;
  membership_name?: string;
}

const HUB_API_URL = import.meta.env.VITE_HUB_API_URL || 'https://hub.asciende.pro';

export function useSatelliteAuth() {
  const [user, setUser] = useState<HubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // 1. Verificar si hay token en URL (retorno de login)
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get('session_token');

      if (tokenFromUrl) {
        localStorage.setItem('hub_session_token', tokenFromUrl);
        setHasToken(true);
        // Limpiar URL para no exponer token en historial
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }

      // 2. Obtener token almacenado
      const storedToken = localStorage.getItem('hub_session_token');

      if (storedToken) {
        if (!tokenFromUrl) setHasToken(true);

        // 3. Validar token con HUB (auth-me)
        const response = await fetch(`${HUB_API_URL}/functions/v1/auth-me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          // Token inválido o expirado
          localStorage.removeItem('hub_session_token');
          setUser(null);
          setHasToken(false);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('hub_session_token');
      setUser(null);
      setHasToken(false);
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    // Redirigir a HUB para login
    const currentUrl = window.location.href.split('?')[0];
    window.location.href = `${HUB_API_URL}/auth?redirect=${encodeURIComponent(currentUrl)}`;
  };

  const logout = () => {
    const token = localStorage.getItem('hub_session_token');
    if (token) {
      // Notificar a HUB sobre logout
      fetch(`${HUB_API_URL}/functions/v1/auth-logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }).catch(err => console.error('Logout error:', err));
    }
    localStorage.removeItem('hub_session_token');
    setUser(null);
    setHasToken(false);
    login(); // Redirigir a login
  };

  return { user, loading, hasToken, login, logout };
}
```

**Funciones:**

- `checkAuth()`: Verifica token en URL o localStorage y valida con HUB
- `login()`: Redirige a HUB para inicio de sesión
- `logout()`: Invalida sesión y redirige a login
- Retorna: `{ user, loading, hasToken, login, logout }`

---

## Proveedor de Autenticación

**Archivo:** `src/lib/auth.tsx`

Este contexto React centraliza autenticación y sincronización de perfiles con Supabase.

```typescript
import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useSatelliteAuth } from '../hooks/useSatelliteAuth';
import type { HubUser, MembershipSlug } from '../hooks/useSatelliteAuth';
import { supabase } from './supabase';

export type UserRole = 'admin' | 'coach' | 'athlete';
export type { MembershipSlug };

export interface UserProfile {
  id: string;
  hub_user_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  membership_slug: MembershipSlug;
  membership_name?: string;
}

interface AuthContextValue {
  user: HubUser | null;
  profile: UserProfile | null;
  loading: boolean;
  hasToken: boolean;
  isDevMode: boolean;
  membershipSlug: MembershipSlug;
  login: () => void;
  logout: () => void;
  setDevProfile: (profile: UserProfile) => void;
  setUser: (user: HubUser) => void;
  setProfile: (profile: UserProfile) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const IS_DEV_MODE =
  localStorage.getItem('dev_mode') === 'true' ||
  import.meta.env.VITE_FORCE_DEV_MODE === 'true';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const syncedRef = useRef<string | null>(null);

  const { user: hubUser, loading: hubLoading, hasToken, login: hubLogin, logout: hubLogout } = useSatelliteAuth();

  const [devUser, setDevUser] = useState<HubUser | null>(null);
  const [devHasToken, setDevHasToken] = useState(false);

  // Cargar perfil de dev mode desde sessionStorage
  useEffect(() => {
    if (!IS_DEV_MODE) return;
    const stored = sessionStorage.getItem('user_profile');
    if (stored) {
      const parsed = JSON.parse(stored) as UserProfile;
      setProfileState(parsed);
      setDevUser({
        id: parsed.hub_user_id,
        email: parsed.email,
        name: parsed.full_name,
        role: parsed.role === 'coach' ? 'trainer' : parsed.role,
        membership_slug: parsed.membership_slug,
        membership_name: parsed.membership_name,
      });
      setDevHasToken(true);
    }
  }, []);

  // Sincronizar perfil cuando usuario de HUB cambia o membresía se actualiza
  useEffect(() => {
    if (IS_DEV_MODE) return;
    if (hubLoading) return;
    if (!hubUser) return;

    const membershipChanged =
      profile?.membership_slug !== (hubUser.membership_slug ?? 'inicia');

    if (syncedRef.current === hubUser.id && !membershipChanged) return;

    syncedRef.current = hubUser.id;
    syncProfile(hubUser);
  }, [hubUser, hubLoading]);

  const syncProfile = async (hubUser: HubUser) => {
    setProfileLoading(true);
    const membershipSlug: MembershipSlug = hubUser.membership_slug ?? 'inicia';
    const membershipName = hubUser.membership_name ?? null;

    try {
      // Buscar perfil existente
      const { data: existing } = await supabase
        .from('profiles')
        .select('*')
        .eq('hub_user_id', hubUser.id)
        .maybeSingle();

      if (existing) {
        // Actualizar membresía en perfil existente
        const { data: updated } = await supabase
          .from('profiles')
          .update({ membership_slug: membershipSlug, membership_name: membershipName })
          .eq('hub_user_id', hubUser.id)
          .select()
          .single();
        setProfileState((updated ?? existing) as UserProfile);
        return;
      }

      // Crear nuevo perfil
      const normalizedRole: UserRole =
        hubUser.role === 'trainer' ? 'coach' : (hubUser.role as UserRole);

      const { data: created, error } = await supabase
        .from('profiles')
        .insert({
          hub_user_id: hubUser.id,
          email: hubUser.email,
          full_name: hubUser.name || hubUser.email,
          role: normalizedRole,
          membership_slug: membershipSlug,
          membership_name: membershipName,
        })
        .select()
        .single();

      if (error) {
        console.error('Profile insert error:', error);
        return;
      }

      if (created) setProfileState(created as UserProfile);
    } catch (error) {
      console.error('Profile sync failed:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const login = () => {
    if (IS_DEV_MODE) return;
    hubLogin();
  };

  const logout = () => {
    if (IS_DEV_MODE) {
      sessionStorage.removeItem('user_profile');
      setDevUser(null);
      setProfileState(null);
      setDevHasToken(false);
      return;
    }
    hubLogout();
  };

  const setDevProfile = (devProfile: UserProfile) => {
    setProfileState(devProfile);
    sessionStorage.setItem('user_profile', JSON.stringify(devProfile));
    setDevUser({
      id: devProfile.hub_user_id,
      email: devProfile.email,
      name: devProfile.full_name,
      role: devProfile.role === 'coach' ? 'trainer' : devProfile.role,
      membership_slug: devProfile.membership_slug,
      membership_name: devProfile.membership_name,
    });
    setDevHasToken(true);
  };

  const setUser = (newUser: HubUser) => {
    if (IS_DEV_MODE) setDevUser(newUser);
  };

  const setProfile = (newProfile: UserProfile) => {
    setProfileState(newProfile);
  };

  const user = IS_DEV_MODE ? devUser : hubUser;
  const loading = IS_DEV_MODE ? false : (hubLoading || profileLoading);
  const resolvedHasToken = IS_DEV_MODE ? devHasToken : hasToken;

  // Resolver membership_slug con fallback a 'inicia'
  const membershipSlug: MembershipSlug =
    user?.membership_slug ?? profile?.membership_slug ?? 'inicia';

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      hasToken: resolvedHasToken,
      isDevMode: IS_DEV_MODE,
      membershipSlug,
      login,
      logout,
      setDevProfile,
      setUser,
      setProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
```

**Características:**

- Sincroniza automáticamente usuario de HUB a Supabase
- Detecta cambios de membresía y actualiza BD
- Soporta modo dev para testing sin HUB
- Expone `membershipSlug` con fallback seguro a `'inicia'`

---

## Base de Datos

### Setup Inicial

**Archivo:** `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Migrations

Ejecutar estas migraciones en Supabase en orden:

#### 1. Crear tabla profiles

```sql
/*
  # Create profiles table

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `hub_user_id` (text, unique, foreign key to HUB)
      - `email` (text)
      - `full_name` (text)
      - `role` (text)
      - `membership_slug` (text, default 'inicia')
      - `membership_name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `profiles` table
    - Add anon policies for HUB token authentication
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_user_id text UNIQUE NOT NULL,
  email text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'athlete',
  membership_slug text NOT NULL DEFAULT 'inicia',
  membership_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon can select profiles"
  ON profiles FOR SELECT TO anon USING (true);

CREATE POLICY "Anon can insert profiles"
  ON profiles FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anon can update profiles"
  ON profiles FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE INDEX idx_profiles_hub_user_id ON profiles(hub_user_id);
CREATE INDEX idx_profiles_email ON profiles(email);
```

#### 2. Agregar trigger para updated_at

```sql
/*
  # Add update_at trigger to profiles
*/

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## Uso en Componentes

### Acceder a información de autenticación

```typescript
import { useAuth } from './lib/auth';

export function MyComponent() {
  const { user, profile, loading, hasToken, membershipSlug } = useAuth();

  if (loading) return <div>Cargando...</div>;
  if (!hasToken) return <div>No autenticado</div>;

  return (
    <div>
      <h1>Hola, {user?.name}</h1>
      <p>Email: {user?.email}</p>
      <p>Rol: {profile?.role}</p>
      <p>Membresía: {membershipSlug}</p>
    </div>
  );
}
```

### Controlar features por membresía

```typescript
import { useAuth } from './lib/auth';

export function FeatureGate() {
  const { membershipSlug } = useAuth();

  return (
    <div>
      {membershipSlug === 'inicia' && (
        <p>Feature disponible solo en planes pagos</p>
      )}

      {(membershipSlug === 'intermediate' || membershipSlug === 'pro') && (
        <p>Feature avanzada desbloqueada</p>
      )}

      {membershipSlug === 'pro' && (
        <p>Feature exclusiva Pro</p>
      )}
    </div>
  );
}
```

### Login/Logout

```typescript
import { useAuth } from './lib/auth';

export function AuthButtons() {
  const { user, login, logout } = useAuth();

  if (!user) {
    return <button onClick={login}>Iniciar Sesión</button>;
  }

  return <button onClick={logout}>Cerrar Sesión</button>;
}
```

### Proteger rutas

```typescript
import { useAuth } from './lib/auth';

export function ProtectedRoute({ children }) {
  const { loading, hasToken, user } = useAuth();

  if (loading) return <div>Cargando...</div>;
  if (!hasToken || !user) return <Navigate to="/" />;

  return children;
}
```

---

## Flujo de Autenticación

### Flujo de login

```
1. Usuario accede al satélite
   ↓
2. useSatelliteAuth verifica:
   - ¿Hay token en URL (session_token)?
   - ¿Hay token en localStorage?
   ↓
3. Si no hay token → mostrar botón "Iniciar Sesión"
   ↓
4. Usuario hace click → login() redirige a HUB
   ↓
5. HUB autentica usuario (si es necesario)
   ↓
6. HUB redirige a satélite con ?session_token=...
   ↓
7. useSatelliteAuth extrae token de URL
   ↓
8. Guarda en localStorage
   ↓
9. Llama a HUB/auth-me para obtener datos usuario
   ↓
10. AuthProvider sincroniza a Supabase
   ↓
11. setUser() + setProfileState() completan
```

### Respuesta de HUB (/auth-me)

```json
{
  "user": {
    "id": "uuid-del-usuario",
    "email": "usuario@example.com",
    "name": "Nombre del Usuario",
    "role": "athlete",
    "membership_slug": "pro",
    "membership_name": "Asciende Pro",
    "active_plan": ["plan1", "plan2"]
  }
}
```

### Respuesta de login (/auth-login)

Mismo formato que `/auth-me`.

---

## Manejo de Membresías

### Estructura de decisiones

```
Token expirado/inválido
├─ Fallback a 'inicia' (nivel gratuito)
└─ Reintenta login

Membresía en JWT (HubUser.membership_slug)
├─ 'inicia' → Features básicas
├─ 'intermediate' → Features avanzadas
└─ 'pro' → Acceso completo

Sincronización a BD (UserProfile)
├─ Guarda membership_slug
├─ Guarda membership_name
└─ Detecta cambios en próximo sync
```

### Helper para control de features

```typescript
export function hasMembershipAccess(
  membershipSlug: MembershipSlug,
  requiredTier: 'inicia' | 'intermediate' | 'pro'
): boolean {
  const tiers = ['inicia', 'intermediate', 'pro'];
  const currentIndex = tiers.indexOf(membershipSlug);
  const requiredIndex = tiers.indexOf(requiredTier);
  return currentIndex >= requiredIndex;
}

// Uso
const { membershipSlug } = useAuth();
if (!hasMembershipAccess(membershipSlug, 'pro')) {
  return <UpgradePrompt />;
}
```

---

## Verificación de implementación

### Checklist

- [ ] `.env` configurado con `VITE_HUB_API_URL`
- [ ] `useSatelliteAuth.ts` implementado
- [ ] `auth.tsx` implementado
- [ ] `supabase.ts` configurado
- [ ] Tabla `profiles` creada en Supabase
- [ ] RLS políticas aplicadas
- [ ] `AuthProvider` wrapping App en `main.tsx`
- [ ] Componentes importan desde `useAuth()`
- [ ] Features controladas con `membershipSlug`

### Testing

```typescript
// En dev mode:
// 1. localStorage.setItem('dev_mode', 'true')
// 2. sessionStorage.setItem('user_profile', JSON.stringify({...}))
// 3. Recargar página

// En producción:
// 1. Hacer click en "Iniciar Sesión"
// 2. Completar login en HUB
// 3. Verificar token en localStorage
// 4. Verificar perfil en Supabase
```

---

## Cambios Clave Implementados (Prevención de Redirect Loop)

### 1. **Captura INMEDIATA de hasToken**

En `useSatelliteAuth.ts`, cuando se detecta token en URL:

```typescript
if (tokenFromUrl) {
  localStorage.setItem('hub_session_token', tokenFromUrl);
  setHasToken(true);  // ✅ INMEDIATAMENTE - antes de validar
  const cleanUrl = window.location.pathname;
  window.history.replaceState({}, document.title, cleanUrl);
}
```

**Por qué:** Permite que App.tsx detecte `hasToken=true` ANTES de que termine la validación en background. Esto evita que rediriga al HUB nuevamente.

### 2. **Sincronización Robusta de Perfiles**

En `auth.tsx`, la función `syncProfile` es idempotente:

```typescript
const syncProfile = async (hubUser: HubUser) => {
  if (syncedRef.current === hubUser.id) return;  // Evita re-syncs
  syncedRef.current = hubUser.id;
  setProfileLoading(true);

  try {
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('hub_user_id', hubUser.id)
      .maybeSingle();

    if (existingProfile) {
      setProfileState(existingProfile);
    } else {
      // Crear nuevo perfil
      const { data: newProfile } = await supabase
        .from('profiles')
        .insert({...})
        .select()
        .single();
      setProfileState(newProfile);
    }
  } finally {
    setProfileLoading(false);
  }
};
```

**Por qué:**
- No intenta sincronizar el mismo usuario múltiples veces
- Crea perfil si no existe (en lugar de esperar indefinidamente)
- Limpia `profileLoading` para que App.tsx deje de mostrar loader

### 3. **Condiciones de Redirección Correctas**

En `App.tsx`:

```typescript
useEffect(() => {
  if (loading) return;           // Aún cargando
  if (isDevMode) return;         // Dev mode habilitado
  if (user) return;              // Usuario confirmado
  if (hasToken) return;          // Token present (esperando perfil)
  // Si llega aquí: no hay nada, redirigir
  login();
}, [loading, hasToken, isDevMode, user, login]);
```

**Por qué:**
- Si `hasToken=true`, NO redirige aunque no haya usuario (aún sincronizando)
- Solo redirige si REALMENTE no hay nada (loading=false + no token)

### 4. **Restricciones ÚNICA en BD**

En migración:

```sql
ALTER TABLE profiles ALTER COLUMN hub_user_id SET NOT NULL;
ALTER TABLE profiles ADD CONSTRAINT profiles_hub_user_id_unique UNIQUE(hub_user_id);
```

**Por qué:**
- Garantiza que cada HUB user crea exactamente UN perfil
- Inserts duplicados fallan en BD (no en aplicación)

### 5. **Políticas RLS Permisivas**

```sql
CREATE POLICY "Anon can insert profiles" ON profiles
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anon can update profiles" ON profiles
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Anon can delete profiles" ON profiles
  FOR DELETE TO anon USING (true);
```

**Por qué:**
- Sin estas, inserts anónimos fallan silenciosamente en RLS
- La app cree que creó perfil, pero RLS lo bloqueó
- Luego se queda en estado "user pero no profile"

---

## Troubleshooting

### Token no se guarda

- Verificar que `session_token` está en URL
- Verificar que localStorage no está deshabilitado
- Revisar console para errores

### Usuario no sincroniza a BD

- Verificar permisos en Supabase
- Verificar que RLS policies permiten anon writes
- Revisar console para errores de sync

### Membresía siempre es 'inicia'

- Verificar que HUB envía `membership_slug` en JWT
- Verificar que token no es viejo (antes de implementar membresías)
- Hacer logout y login nuevamente

### CORS errors

- Verificar que `VITE_HUB_API_URL` es correcto
- Verificar que HUB tiene CORS habilitado para este dominio

### Redirige infinitamente al HUB después de autenticarse

**CAUSA:** El perfil local no se sincroniza correctamente.

**SÍNTOMAS:**
```
[Auth] Token from URL: found
[Auth] Token found in URL, storing...
[Auth] Stored token found, validating with HUB...
[Auth] Response status: 200
[Auth] Token validated, user data: user@example.com
[App] No user/token, redirecting to HUB login  ← ¡REDIRIGE DE NUEVO!
```

**CHECKLIST DE SOLUCIÓN:**

1. ✅ **Verificar que `hasToken` se establece a `true` INMEDIATAMENTE:**
   ```typescript
   if (tokenFromUrl) {
     setHasToken(true);  // ← Aquí, INMEDIATAMENTE
   }
   ```

2. ✅ **Verificar que App.tsx NO redirige si `hasToken=true`:**
   ```typescript
   if (hasToken) return;  // ← Esta línea previene redirect loop
   ```

3. ✅ **Verificar en DevTools → Console → Storage:**
   - `localStorage.hub_session_token` debe existir
   - No debe estar vacío

4. ✅ **Verificar en Supabase que la tabla `profiles` tenga:**
   - `hub_user_id` NOT NULL
   - `hub_user_id` UNIQUE
   - RLS habilitado
   - Políticas anónimas (INSERT, UPDATE, DELETE con WITH CHECK true)

5. ✅ **Ejecutar este SQL en Supabase SQL Editor:**
   ```sql
   -- Verificar perfiles creados
   SELECT * FROM profiles;

   -- Verificar políticas
   SELECT * FROM pg_policies WHERE tablename = 'profiles';

   -- Verificar constraints
   SELECT constraint_name, constraint_type
   FROM information_schema.table_constraints
   WHERE table_name = 'profiles';
   ```

6. ✅ **Revisar console DevTools para errores de Supabase:**
   - "permission denied for schema public"
   - "relation does not exist"
   - "duplicate key"

7. ✅ **Si los logs muestran:**
   ```
   [Sync] Error creating profile: RLS policy violation
   ```
   → Las políticas anónimas no están correctas, revisar paso 4

---

## Referencia rápida

| Situación | Acceso a datos | Código |
|-----------|---|---|
| Usuario no autenticado | Nada | `const { hasToken } = useAuth()` |
| Usuario autenticado | Datos HUB + BD | `const { user, profile } = useAuth()` |
| Verificar membresía | Direct | `const { membershipSlug } = useAuth()` |
| Feature gate | Condicional | `if (membershipSlug === 'pro') { }` |
| Sincronizar cambios | Manual trigger | Logout + login |

