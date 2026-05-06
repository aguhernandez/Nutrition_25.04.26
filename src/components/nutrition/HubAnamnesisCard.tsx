import { User, RefreshCw, AlertCircle, Dumbbell, Scale, Calendar, Activity } from 'lucide-react';
import { useHubAthleteProfile } from '../../hooks/useHubData';

interface Props {
  athleteEmail: string;
}

function Field({ label, value }: { label: string; value?: string | number | null }) {
  if (value == null || value === '') return null;
  return (
    <div className="rounded-xl p-3" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
      <div className="text-xs mb-0.5" style={{ color: '#9ca3af' }}>{label}</div>
      <div className="text-sm font-semibold capitalize" style={{ color: '#1f2937' }}>{value}</div>
    </div>
  );
}

export default function HubAnamnesisCard({ athleteEmail }: Props) {
  const { data, loading, error, refetch } = useHubAthleteProfile(athleteEmail);

  return (
    <div className="card-brand p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#eff6ff' }}>
          <User className="w-4 h-4" style={{ color: '#2563eb' }} />
        </div>
        <span className="font-heading text-sm" style={{ color: '#1f2937' }}>
          Perfil del atleta · Hub
        </span>
        <button
          onClick={refetch}
          className="ml-auto p-1.5 rounded-lg transition-colors hover:bg-gray-100"
          title="Actualizar"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} style={{ color: '#9ca3af' }} />
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#fdda36', borderTopColor: 'transparent' }} />
        </div>
      )}

      {!loading && error && (
        <div className="flex items-start gap-3 p-4 rounded-xl" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
          <div>
            <p className="text-sm font-medium" style={{ color: '#dc2626' }}>Sin datos del Hub</p>
            <p className="text-xs mt-0.5" style={{ color: '#ef4444' }}>{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && !data && (
        <div className="text-center py-6">
          <User className="w-8 h-8 mx-auto mb-2" style={{ color: '#d1d5db' }} />
          <p className="text-sm" style={{ color: '#9ca3af' }}>Sin perfil en el Hub</p>
        </div>
      )}

      {!loading && !error && data && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <Field label="Nombre completo" value={data.full_name} />
            <Field label="Fecha de nacimiento" value={data.date_of_birth} />
            <Field label="Género" value={data.gender} />
            <Field label="Deporte principal" value={data.sport_primary} />
            <Field label="Deporte secundario" value={data.sport_secondary} />
          </div>

          {data.body_composition && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Scale className="w-4 h-4" style={{ color: '#6b7280' }} />
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7280' }}>
                  Composición corporal
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {data.body_composition.weight_kg != null && (
                  <div className="rounded-xl p-3 text-center" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                    <div className="text-base font-bold" style={{ color: '#1f2937' }}>{data.body_composition.weight_kg}<span className="text-xs font-normal ml-0.5" style={{ color: '#9ca3af' }}>kg</span></div>
                    <div className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>Peso</div>
                  </div>
                )}
                {data.body_composition.height_cm != null && (
                  <div className="rounded-xl p-3 text-center" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                    <div className="text-base font-bold" style={{ color: '#1f2937' }}>{data.body_composition.height_cm}<span className="text-xs font-normal ml-0.5" style={{ color: '#9ca3af' }}>cm</span></div>
                    <div className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>Talla</div>
                  </div>
                )}
                {data.body_composition.body_fat_pct != null && (
                  <div className="rounded-xl p-3 text-center" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                    <div className="text-base font-bold" style={{ color: '#f59e0b' }}>{data.body_composition.body_fat_pct.toFixed(1)}<span className="text-xs font-normal ml-0.5" style={{ color: '#9ca3af' }}>%</span></div>
                    <div className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>% Grasa</div>
                  </div>
                )}
                {data.body_composition.muscle_mass_kg != null && (
                  <div className="rounded-xl p-3 text-center" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                    <div className="text-base font-bold" style={{ color: '#10b981' }}>{data.body_composition.muscle_mass_kg.toFixed(1)}<span className="text-xs font-normal ml-0.5" style={{ color: '#9ca3af' }}>kg</span></div>
                    <div className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>Masa muscular</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {data.nutrition_targets && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4" style={{ color: '#6b7280' }} />
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7280' }}>
                  Objetivos nutricionales
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Calorías', value: data.nutrition_targets.target_kcal, unit: 'kcal', color: '#f59e0b' },
                  { label: 'CH', value: data.nutrition_targets.target_carbs_g, unit: 'g', color: '#3b82f6' },
                  { label: 'Proteína', value: data.nutrition_targets.target_protein_g, unit: 'g', color: '#10b981' },
                  { label: 'Grasa', value: data.nutrition_targets.target_fat_g, unit: 'g', color: '#f97316' },
                ].map(({ label, value, unit, color }) => value != null ? (
                  <div key={label} className="rounded-xl p-3 text-center" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                    <div className="text-base font-bold" style={{ color }}>{Math.round(value)}<span className="text-xs font-normal ml-0.5" style={{ color: '#9ca3af' }}>{unit}</span></div>
                    <div className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{label}</div>
                  </div>
                ) : null)}
              </div>
            </div>
          )}

          {data.body_composition?.measured_at && (
            <div className="flex items-center gap-1.5 text-xs" style={{ color: '#9ca3af' }}>
              <Calendar className="w-3 h-3" />
              Última medición: {new Date(data.body_composition.measured_at).toLocaleDateString('es')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
