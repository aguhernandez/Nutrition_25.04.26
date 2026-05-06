import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { UserProfile } from '../../lib/auth';
import { User, Award, Shield, RefreshCw } from 'lucide-react';

interface Props {
  onProfileSelected: (profile: UserProfile) => void;
}

export default function LocalDevMode({ onProfileSelected }: Props) {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    sessionStorage.removeItem('user_profile');
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*').order('role');
    if (data) setProfiles(data as UserProfile[]);
    setLoading(false);
  };

  const createDevProfile = async (role: 'athlete' | 'coach' | 'admin') => {
    setCreating(true);
    setError(null);
    try {
      const devEmail = `dev-${role}@local.dev`;
      const devName = role === 'athlete' ? 'Dev Athlete' : role === 'coach' ? 'Dev Coach' : 'Dev Admin';

      const { data: existing } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', devEmail)
        .maybeSingle();

      if (existing) {
        onProfileSelected(existing as UserProfile);
        return;
      }

      const { data: created, error: insertError } = await supabase
        .from('profiles')
        .insert({
          hub_user_id: `dev-${role}-${Date.now()}`,
          email: devEmail,
          full_name: devName,
          role,
          membership_slug: 'pro',
          membership_name: 'Asciende Pro (Dev)',
        })
        .select()
        .single();

      if (insertError) throw insertError;
      onProfileSelected(created as UserProfile);
    } catch (err) {
      console.error('Error creating dev profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to create profile');
    } finally {
      setCreating(false);
    }
  };

  const roleColors: Record<string, string> = {
    admin: 'bg-red-100 text-red-700',
    coach: 'bg-blue-100 text-blue-700',
    athlete: 'bg-green-100 text-green-700',
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-amber-400 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">DEV MODE</h1>
            <p className="text-sm text-gray-700">Select or create a profile to continue</p>
          </div>
          <span className="text-xs bg-amber-600 text-white px-2 py-1 rounded font-mono">
            LOCAL DEV
          </span>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Quick Create
            </p>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => createDevProfile('athlete')}
                disabled={creating}
                className="group flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-xs font-semibold text-gray-700">Athlete</span>
              </button>

              <button
                onClick={() => createDevProfile('coach')}
                disabled={creating}
                className="group flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition">
                  <Award className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs font-semibold text-gray-700">Coach</span>
              </button>

              <button
                onClick={() => createDevProfile('admin')}
                disabled={creating}
                className="group flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-xs font-semibold text-gray-700">Admin</span>
              </button>
            </div>
          </div>

          {profiles.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Existing Profiles
              </p>
              {loading ? (
                <div className="flex items-center justify-center py-8 text-gray-400">
                  <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                  <span className="text-sm">Loading...</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {profiles.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => onProfileSelected(profile)}
                      className="w-full flex items-center gap-4 p-3 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
                    >
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                        <User className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{profile.full_name}</p>
                        <p className="text-xs text-gray-500 truncate">{profile.email}</p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${roleColors[profile.role] ?? 'bg-gray-100 text-gray-600'}`}>
                        {profile.role}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <button
            onClick={loadProfiles}
            className="mt-4 w-full flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors py-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh profiles
          </button>
        </div>
      </div>
    </div>
  );
}
