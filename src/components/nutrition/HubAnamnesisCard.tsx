import { User, RefreshCw, AlertCircle, Dumbbell, Scale, Calendar, Activity, Droplets, Moon, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useHubAthleteProfile, useHubNutritionAnamnesis } from '../../hooks/useHubData';

interface Props {
  athleteEmail: string;
}

function Field({ label, value }: { label: string; value?: string | number | null }) {
  if (value == null || value === '') return null;
  return (
    <div className="rounded-xl p-3" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
      <div className="text-xs mb-0.5" style={{ color: '#9ca3af' }}>{label}</div>
      <div className="text-sm font-semibold capitalize" style={{ color: '#1f2937' }}>{String(value)}</div>
    </div>
  );
}

function MacroTile({ label, value, unit, color }: { label: string; value?: number | null; unit: string; color: string }) {
  if (value == null) return null;
  return (
    <div className="rounded-xl p-3 text-center" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
      <div className="text-base font-bold" style={{ color }}>
        {Math.round(value)}<span className="text-xs font-normal ml-0.5" style={{ color: '#9ca3af' }}>{unit}</span>
      </div>
      <div className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{label}</div>
    </div>
  );
}

export default function HubAnamnesisCard({ athleteEmail }: Props) {
  const { data: profile, loading: loadingProfile, error: errorProfile, refetch: refetchProfile } = useHubAthleteProfile(athleteEmail);
  const { data: anamnesis, loading: loadingAnamnesis, error: errorAnamnesis, refetch: refetchAnamnesis } = useHubNutritionAnamnesis(athleteEmail);
  const [showAnamnesis, setShowAnamnesis] = useState(true);

  const loading = loadingProfile || loadingAnamnesis;
  const error = errorProfile && errorAnamnesis ? (errorProfile || errorAnamnesis) : null;

  const refetch = () => { refetchProfile(); refetchAnamnesis(); };

  const kcal = anamnesis?.target_calories_kcal ?? anamnesis?.target_kcal;
  const protein = anamnesis?.target_protein_g;
  const carbs = anamnesis?.target_carbs_g;
  const fat = anamnesis?.target_fat_g;
  const hasNutritionTargets = kcal != null || protein != null || carbs != null || fat != null;

  const weeklyHours = anamnesis?.weekly_training_hours ?? anamnesis?.training_hours_per_week;
  const dietType = anamnesis?.dietary_pattern ?? anamnesis?.diet_type;
  const sport = anamnesis?.primary_sport ?? anamnesis?.sport_primary ?? profile?.sport_primary;
  const sleepHours = anamnesis?.sleep_hours;
  const hydration = anamnesis?.hydration_liters_daily ?? anamnesis?.hydration_daily;
  const restrictions = anamnesis?.food_restrictions ?? anamnesis?.food_allergies ?? anamnesis?.intolerances;
  const supplements = anamnesis?.supplements;

  const hasProfile = !!profile;
  const hasAnamnesis = !!anamnesis && Object.keys(anamnesis).length > 0;
  const hasAnything = hasProfile || hasAnamnesis;

  return (
    <div className="card-brand p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#eff6ff' }}>
          <User className="w-4 h-4" style={{ color: '#2563eb' }} />
        </div>
        <span className="font-heading text-sm" style={{ color: '#1f2937' }}>
          Perfil · Anamnesis · Hub
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

      {!loading && !hasAnything && !error && (
        <div className="text-center py-6">
          <User className="w-8 h-8 mx-auto mb-2" style={{ color: '#d1d5db' }} />
          <p className="text-sm" style={{ color: '#9ca3af' }}>Sin perfil en el Hub</p>
        </div>
      )}

      {!loading && hasAnything && (
        <div className="space-y-4">

          {/* ── Basic profile ── */}
          {hasProfile && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Field label="Nombre completo" value={profile.full_name} />
              <Field label="Fecha de nacimiento" value={profile.date_of_birth} />
              <Field label="Género" value={profile.gender} />
              <Field label="Deporte principal" value={profile.sport_primary} />
              <Field label="Deporte secundario" value={profile.sport_secondary} />
            </div>
          )}

          {/* ── Body composition from profile ── */}
          {profile?.body_composition && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Scale className="w-4 h-4" style={{ color: '#6b7280' }} />
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7280' }}>
                  Composición corporal
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {profile.body_composition.weight_kg != null && (
                  <div className="rounded-xl p-3 text-center" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                    <div className="text-base font-bold" style={{ color: '#1f2937' }}>{profile.body_composition.weight_kg}<span className="text-xs font-normal ml-0.5" style={{ color: '#9ca3af' }}>kg</span></div>
                    <div className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>Peso</div>
                  </div>
                )}
                {profile.body_composition.height_cm != null && (
                  <div className="rounded-xl p-3 text-center" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                    <div className="text-base font-bold" style={{ color: '#1f2937' }}>{profile.body_composition.height_cm}<span className="text-xs font-normal ml-0.5" style={{ color: '#9ca3af' }}>cm</span></div>
                    <div className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>Talla</div>
                  </div>
                )}
                {profile.body_composition.body_fat_pct != null && (
                  <div className="rounded-xl p-3 text-center" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                    <div className="text-base font-bold" style={{ color: '#f59e0b' }}>{profile.body_composition.body_fat_pct.toFixed(1)}<span className="text-xs font-normal ml-0.5" style={{ color: '#9ca3af' }}>%</span></div>
                    <div className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>% Grasa</div>
                  </div>
                )}
                {profile.body_composition.muscle_mass_kg != null && (
                  <div className="rounded-xl p-3 text-center" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                    <div className="text-base font-bold" style={{ color: '#10b981' }}>{profile.body_composition.muscle_mass_kg.toFixed(1)}<span className="text-xs font-normal ml-0.5" style={{ color: '#9ca3af' }}>kg</span></div>
                    <div className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>Masa muscular</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Nutrition anamnesis section ── */}
          {hasAnamnesis && (
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #e5e7eb' }}>
              <button
                onClick={() => setShowAnamnesis(!showAnamnesis)}
                className="w-full flex items-center gap-2 px-4 py-3"
                style={{ backgroundColor: '#f9fafb' }}
              >
                <Activity className="w-4 h-4 flex-shrink-0" style={{ color: '#2563eb' }} />
                <span className="text-xs font-semibold uppercase tracking-wide flex-1 text-left" style={{ color: '#6b7280' }}>
                  Anamnesis nutricional
                </span>
                {showAnamnesis
                  ? <ChevronUp className="w-3.5 h-3.5" style={{ color: '#9ca3af' }} />
                  : <ChevronDown className="w-3.5 h-3.5" style={{ color: '#9ca3af' }} />}
              </button>

              {showAnamnesis && (
                <div className="p-4 space-y-4">
                  {/* Training & diet overview */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <Field label="Deporte" value={sport} />
                    <Field label="Hrs entrenamiento/sem" value={weeklyHours != null ? `${weeklyHours}h` : null} />
                    <Field label="Patrón alimentario" value={dietType} />
                    <Field label="Comidas/día" value={anamnesis.meal_frequency ?? anamnesis.meals_per_day} />
                    <Field label="Peso objetivo" value={anamnesis.target_weight_kg != null || anamnesis.goal_weight_kg != null ? `${anamnesis.target_weight_kg ?? anamnesis.goal_weight_kg} kg` : null} />
                    <Field label="Objetivo de peso" value={anamnesis.weight_goal} />
                  </div>

                  {/* Recovery metrics */}
                  {(sleepHours != null || hydration != null) && (
                    <div className="grid grid-cols-2 gap-2">
                      {sleepHours != null && (
                        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                          <Moon className="w-4 h-4 flex-shrink-0" style={{ color: '#8b5cf6' }} />
                          <div>
                            <div className="text-sm font-bold" style={{ color: '#1f2937' }}>{sleepHours}h</div>
                            <div className="text-xs" style={{ color: '#9ca3af' }}>Sueño</div>
                          </div>
                        </div>
                      )}
                      {hydration != null && (
                        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                          <Droplets className="w-4 h-4 flex-shrink-0" style={{ color: '#06b6d4' }} />
                          <div>
                            <div className="text-sm font-bold" style={{ color: '#1f2937' }}>{hydration}L</div>
                            <div className="text-xs" style={{ color: '#9ca3af' }}>Hidratación</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Restrictions / Supplements */}
                  {(restrictions && restrictions.length > 0) && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#6b7280' }}>Restricciones / Intolerancias</p>
                      <div className="flex flex-wrap gap-1.5">
                        {restrictions.map((r, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#fef2f2', color: '#b91c1c' }}>{r}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {(supplements && supplements.length > 0) && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#6b7280' }}>Suplementos</p>
                      <div className="flex flex-wrap gap-1.5">
                        {supplements.map((s, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#f0fdf4', color: '#15803d' }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Nutrition targets */}
                  {hasNutritionTargets && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Dumbbell className="w-4 h-4" style={{ color: '#6b7280' }} />
                        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7280' }}>
                          Objetivos nutricionales
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <MacroTile label="Calorías" value={kcal} unit="kcal" color="#f59e0b" />
                        <MacroTile label="CH" value={carbs} unit="g" color="#3b82f6" />
                        <MacroTile label="Proteína" value={protein} unit="g" color="#10b981" />
                        <MacroTile label="Grasa" value={fat} unit="g" color="#f97316" />
                      </div>
                    </div>
                  )}

                  {/* Targets from athlete-profile as fallback */}
                  {!hasNutritionTargets && profile?.nutrition_targets && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4" style={{ color: '#6b7280' }} />
                        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7280' }}>
                          Objetivos nutricionales
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <MacroTile label="Calorías" value={profile.nutrition_targets.target_kcal} unit="kcal" color="#f59e0b" />
                        <MacroTile label="CH" value={profile.nutrition_targets.target_carbs_g} unit="g" color="#3b82f6" />
                        <MacroTile label="Proteína" value={profile.nutrition_targets.target_protein_g} unit="g" color="#10b981" />
                        <MacroTile label="Grasa" value={profile.nutrition_targets.target_fat_g} unit="g" color="#f97316" />
                      </div>
                    </div>
                  )}

                  {anamnesis.notes && (
                    <p className="text-xs rounded-xl px-3 py-2" style={{ color: '#6b7280', backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                      {anamnesis.notes}
                    </p>
                  )}

                  {(anamnesis.created_at ?? anamnesis.updated_at) && (
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: '#d1d5db' }}>
                      <Calendar className="w-3 h-3" />
                      Registrada: {new Date((anamnesis.updated_at ?? anamnesis.created_at)!).toLocaleDateString('es')}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Coach notes */}
          {(anamnesis?.coach_notes) && (
            <div className="rounded-xl px-4 py-3" style={{ backgroundColor: '#fef9c3', border: '1px solid #fde68a' }}>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#b45309' }}>Notas del entrenador</p>
              <p className="text-sm" style={{ color: '#92400e' }}>{anamnesis.coach_notes}</p>
            </div>
          )}

          {profile?.body_composition?.measured_at && (
            <div className="flex items-center gap-1.5 text-xs" style={{ color: '#9ca3af' }}>
              <Calendar className="w-3 h-3" />
              Última medición: {new Date(profile.body_composition.measured_at).toLocaleDateString('es')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
