import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useSatelliteAuth } from '../hooks/useSatelliteAuth';
import type { HubUser, MembershipSlug, LoginResult } from '../hooks/useSatelliteAuth';
import { supabase } from './supabase';

export type UserRole = 'admin' | 'coach' | 'athlete';

const SATELLITE_ALLOWED_ROLES = new Set(['nutritionist', 'head_coach']);
export type { MembershipSlug };

export interface UserProfile {
  id: string;
  hub_user_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  membership_slug: MembershipSlug;
  membership_name: string;
}

export type { LoginResult };

interface AuthContextValue {
  user: HubUser | null;
  profile: UserProfile | null;
  loading: boolean;
  hasToken: boolean;
  isDevMode: boolean;
  membershipSlug: MembershipSlug;
  authError: string | null;
  blocked: boolean;
  blockedMessageEs: string;
  blockedMessageEn: string;
  login: () => void;
  loginWithCredentials: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  setDevProfile: (profile: UserProfile) => void;
  setUser: (user: HubUser) => void;
  setProfile: (profile: UserProfile) => void;
  toggleDevMode: (enabled: boolean) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEV_MODE_KEY = 'nutrition_dev_mode';

function resolveDevMode(): boolean {
  const local = localStorage.getItem(DEV_MODE_KEY);
  if (local !== null) return local === 'true';
  return import.meta.env.VITE_FORCE_DEV_MODE === 'true';
}

const IS_DEV_MODE = resolveDevMode();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const syncedRef = useRef<string | null>(null);

  const { user: hubUser, loading: hubLoading, hasToken, authError: hubAuthError, blocked: hubBlocked, blockedMessageEs, blockedMessageEn, login: hubLogin, loginWithCredentials: hubLoginWithCredentials, logout: hubLogout } = useSatelliteAuth();

  const [devUser, setDevUser] = useState<HubUser | null>(null);
  const [devHasToken, setDevHasToken] = useState(false);

  useEffect(() => {
    if (!IS_DEV_MODE) return;
    const stored = sessionStorage.getItem('user_profile');
    if (!stored) return;

    const parsed = JSON.parse(stored) as UserProfile;
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(parsed.id);
    if (!isValidUUID) {
      sessionStorage.removeItem('user_profile');
      return;
    }

    supabase.from('profiles').select('*').eq('id', parsed.id).maybeSingle().then(({ data: freshProfile }) => {
      if (!freshProfile) {
        sessionStorage.removeItem('user_profile');
        return;
      }
      setProfileState(freshProfile as UserProfile);
      setDevUser({
        id: freshProfile.hub_user_id,
        email: freshProfile.email,
        name: freshProfile.full_name,
        role: (freshProfile.role as string) === 'nutritionist' || (freshProfile.role as string) === 'head_coach' ? 'coach' : freshProfile.role,
        membership_slug: freshProfile.membership_slug,
        membership_name: freshProfile.membership_name,
      });
      setDevHasToken(true);
    });
  }, []);

  useEffect(() => {
    if (IS_DEV_MODE) return;
    if (hubLoading) return;
    if (!hubUser) return;
    if (syncedRef.current === hubUser.id) return;

    syncProfile(hubUser);
  }, [hubUser, hubLoading, IS_DEV_MODE]);

  const syncProfile = async (hubUser: HubUser) => {
    try {
      console.log('[Sync] Starting profile sync for user:', hubUser.id);
      syncedRef.current = hubUser.id;
      setProfileLoading(true);

      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('hub_user_id', hubUser.id)
        .maybeSingle();

      if (fetchError) {
        console.error('[Sync] Error fetching profile:', fetchError);
        setProfileLoading(false);
        return;
      }

      if (existingProfile) {
        console.log('[Sync] Profile found:', existingProfile.id);
        const normalizedProfile: UserProfile = {
          ...existingProfile,
          membership_slug: (existingProfile.membership_slug ?? hubUser.membership_slug ?? 'inicia') as MembershipSlug,
          membership_name: existingProfile.membership_name ?? hubUser.membership_name ?? 'Asciende Inicia',
        };
        setProfileState(normalizedProfile);
      } else {
        console.log('[Sync] Creating new profile for:', hubUser.email);
        const normalizedRole = (hubUser.role === 'trainer' || hubUser.role === 'nutritionist' || hubUser.role === 'head_coach') ? 'coach' : hubUser.role;
        const newProfileData = {
          hub_user_id: hubUser.id,
          email: hubUser.email,
          full_name: hubUser.name || hubUser.email,
          role: normalizedRole as UserRole,
          membership_slug: hubUser.membership_slug ?? 'inicia',
          membership_name: hubUser.membership_name ?? 'Asciende Inicia',
        };

        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfileData)
          .select()
          .single();

        if (createError) {
          console.error('[Sync] Error creating profile:', createError);
          setProfileLoading(false);
          return;
        }

        console.log('[Sync] Profile created:', newProfile.id);
        const normalizedProfile: UserProfile = {
          ...newProfile,
          membership_slug: (newProfile.membership_slug ?? hubUser.membership_slug ?? 'inicia') as MembershipSlug,
          membership_name: newProfile.membership_name ?? hubUser.membership_name ?? 'Asciende Inicia',
        };
        setProfileState(normalizedProfile);
      }

      setProfileLoading(false);
    } catch (error) {
      console.error('[Sync] Unexpected error:', error);
      setProfileLoading(false);
    }
  };


  const login = () => {
    if (IS_DEV_MODE) return;
    hubLogin();
  };

  const loginWithCredentials = async (email: string, password: string): Promise<LoginResult> => {
    if (IS_DEV_MODE) return { success: false, error: 'Dev mode active' };
    return hubLoginWithCredentials(email, password);
  };

  const logout = () => {
    if (IS_DEV_MODE) {
      sessionStorage.removeItem('user_profile');
      setDevUser(null);
      setProfileState(null);
      setDevHasToken(false);
      return;
    }
    setProfileState(null);
    hubLogout();
  };

  const setDevProfile = (devProfile: UserProfile) => {
    setProfileState(devProfile);
    sessionStorage.setItem('user_profile', JSON.stringify(devProfile));
    setDevUser({
      id: devProfile.hub_user_id,
      email: devProfile.email,
      name: devProfile.full_name,
      role: devProfile.role === 'coach' ? 'coach' : devProfile.role,
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

  const toggleDevMode = (enabled: boolean) => {
    localStorage.setItem(DEV_MODE_KEY, String(enabled));
    window.location.reload();
  };

  const user = IS_DEV_MODE ? devUser : hubUser;
  const loading = IS_DEV_MODE ? false : (hubLoading || profileLoading);
  const resolvedHasToken = IS_DEV_MODE ? devHasToken : hasToken;

  const membershipSlug: MembershipSlug =
    user?.membership_slug ?? profile?.membership_slug ?? 'inicia';

  const authError = IS_DEV_MODE ? null : (hubAuthError ?? null);
  const blocked = IS_DEV_MODE ? false : hubBlocked;

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      hasToken: resolvedHasToken,
      isDevMode: IS_DEV_MODE,
      membershipSlug,
      authError,
      blocked,
      blockedMessageEs: blockedMessageEs ?? '',
      blockedMessageEn: blockedMessageEn ?? '',
      login,
      loginWithCredentials,
      logout,
      setDevProfile,
      setUser,
      setProfile,
      toggleDevMode,
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
