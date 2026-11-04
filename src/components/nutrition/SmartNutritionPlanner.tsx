import { useState } from 'react';
import { AlertTriangle, ArrowLeft, CheckCircle2, ClipboardList, Loader2, Sparkles } from 'lucide-react';
import { usePreferences } from '../../lib/preferences';
import { HubApiError } from '../../lib/hubApi';
import {
  createSmartNutritionDraft,
  preflightSmartNutrition,
  type SmartNutritionPreflight,
  type SmartPlanKind,
} from '../../lib/smartNutritionService';

interface Props {
  athleteId: string;
  athleteName?: string;
  planKind: SmartPlanKind;
  onBack: () => void;
  onOpenAssessments?: () => void;
  onDraftCreated?: (planId: string) => void;
}

const MISSING_LABELS: Record<string, { es: string; en: string }> = {
  weight_kg: { es: 'peso corporal vigente', en: 'current body weight' },
  height_cm: { es: 'altura', en: 'height' },
  age_years: { es: 'fecha de nacimiento o edad', en: 'date of birth or age' },
  sex: { es: 'sexo biológico para la ecuación basal', en: 'biological sex for the basal equation' },
  anamnesis: { es: 'anamnesis nutricional completa', en: 'completed nutrition anamnesis' },
  food_diary_24h: { es: 'diario alimentario de 24 horas completado', en: 'completed 24-hour food diary' },
};

export default function SmartNutritionPlanner({
  athleteId,
  athleteName,
  planKind,
  onBack,
  onOpenAssessments,
  onDraftCreated,
}: Props) {
  const { language } = usePreferences();
  const es = language === 'es';
  const [preflight, setPreflight] = useState<SmartNutritionPreflight | null>(null);
  const [justification, setJustification] = useState('');
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<string | null>(null);

  const copy = (esText: string, enText: string) => es ? esText : enText;
  const professional = planKind === 'professional';

  const request = {
    athleteId,
    planKind,
    professionalJustification: professional ? justification.trim() : undefined,
  } as const;

  const runPreflight = async () => {
    if (professional && !justification.trim()) {
      setError(copy('Explica brevemente el motivo clínico o deportivo de esta propuesta.', 'Briefly explain the clinical or sporting reason for this proposal.'));
      return;
    }
    setError(null);
    setCreatedId(null);
    setLoading(true);
    try {
      setPreflight(await preflightSmartNutrition(request));
    } catch (err) {
      setError(err instanceof Error ? err.message : copy('No se pudo validar la información.', 'The information could not be validated.'));
    } finally {
      setLoading(false);
    }
  };

  const createDraft = async () => {
    if (!preflight || preflight.status !== 'ready') return;
    setError(null);
    setCreating(true);
    try {
      const result = await createSmartNutritionDraft(request);
      setCreatedId(result.plan.id);
      onDraftCreated?.(result.plan.id);
    } catch (err) {
      const message = err instanceof HubApiError && err.code === 'QUOTA_EXCEEDED'
        ? copy('Ya alcanzaste el límite mensual para este tipo de generación.', 'The monthly limit for this generation type has been reached.')
        : err instanceof Error ? err.message : copy('No se pudo crear el borrador.', 'The draft could not be created.');
      setError(message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <main className="p-4 lg:p-8 max-w-3xl mx-auto animate-slide-up">
      <div className="flex items-start gap-3 mb-8">
        <button onClick={onBack} className="btn-ghost p-2 rounded-xl border mt-0.5" style={{ borderColor: '#e5e7eb' }} aria-label={copy('Volver', 'Back')}>
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <p className="font-body text-xs tracking-[0.18em] font-bold uppercase" style={{ color: '#756386' }}>
            {copy('Planificación inteligente', 'Smart planning')}
          </p>
          <h1 className="font-heading text-xl mt-1" style={{ color: '#1f2937' }}>
            {professional && athleteName
              ? copy(`Plan para ${athleteName}`, `Plan for ${athleteName}`)
              : copy('Generar plan nutricional', 'Generate nutrition plan')}
          </h1>
          <p className="font-body text-sm mt-2 max-w-2xl" style={{ color: '#6b7280' }}>
            {copy(
              'Primero validamos anamnesis, diario de 24 h y datos corporales. La revisión no crea ni consume un plan.',
              'We first validate the anamnesis, 24-hour diary and body data. This review neither creates nor consumes a plan.'
            )}
          </p>
        </div>
      </div>

      <section className="bg-white border rounded-2xl p-5 sm:p-6" style={{ borderColor: '#e5e7eb', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
        {professional && (
          <label className="block mb-5">
            <span className="font-body text-sm font-semibold" style={{ color: '#374151' }}>
              {copy('Justificación profesional', 'Professional justification')}
            </span>
            <textarea
              value={justification}
              onChange={(event) => { setJustification(event.target.value); setPreflight(null); }}
              rows={3}
              className="input-brand mt-2 resize-y"
              placeholder={copy('Ej. ajustar combustible para el bloque de alto volumen', 'E.g. adjust fueling for the high-volume block')}
            />
          </label>
        )}

        <button
          onClick={runPreflight}
          disabled={loading}
          className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ClipboardList className="w-4 h-4" />}
          {copy('Revisar datos antes de generar', 'Review data before generating')}
        </button>

        {error && (
          <div className="mt-5 rounded-xl p-3 flex gap-2 text-sm" style={{ backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }}>
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {preflight?.status === 'needs_data' && (
          <div className="mt-5 rounded-xl p-4" style={{ backgroundColor: '#fffbeb', border: '1px solid #fcd34d' }}>
            <div className="flex gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#b45309' }} />
              <div>
                <h2 className="font-body text-sm font-bold" style={{ color: '#92400e' }}>{copy('Todavía no podemos generar el borrador', 'The draft cannot be generated yet')}</h2>
                <ul className="font-body text-sm mt-2 list-disc pl-5 space-y-1" style={{ color: '#92400e' }}>
                  {preflight.missing.map((field) => <li key={field}>{MISSING_LABELS[field]?.[es ? 'es' : 'en'] ?? field}</li>)}
                </ul>
              </div>
            </div>
            {onOpenAssessments && (
              <button onClick={onOpenAssessments} className="mt-4 text-sm font-bold underline" style={{ color: '#514163' }}>
                {copy('Completar anamnesis / 24 horas', 'Complete anamnesis / 24 hours')}
              </button>
            )}
          </div>
        )}

        {preflight?.status === 'ready' && preflight.targets && !createdId && (
          <div className="mt-5">
            <div className="rounded-xl p-4" style={{ backgroundColor: '#f8f7fa', border: '1px solid #e4dfea' }}>
              <div className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#15803d' }} />
                <div>
                  <h2 className="font-body text-sm font-bold" style={{ color: '#1f2937' }}>{copy('Datos listos para un borrador', 'Data ready for a draft')}</h2>
                  <p className="font-body text-xs mt-1" style={{ color: '#6b7280' }}>
                    {copy('Objetivos iniciales calculados a partir de los datos actuales. Podrás modificarlos manualmente.', 'Initial targets are calculated from current data. You can edit them manually.')}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-center font-body">
                {[
                  [preflight.targets.calories_goal, 'kcal'],
                  [preflight.targets.carbs_goal, copy('g CHO', 'g CHO')],
                  [preflight.targets.protein_goal, copy('g prot.', 'g protein')],
                  [preflight.targets.fats_goal, copy('g grasa', 'g fat')],
                ].map(([value, label]) => (
                  <div key={String(label)} className="py-2 rounded-lg" style={{ backgroundColor: '#fff' }}>
                    <p className="font-bold tabular-nums" style={{ color: '#514163' }}>{value}</p>
                    <p className="text-[11px]" style={{ color: '#6b7280' }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={createDraft} disabled={creating} className="btn-primary w-full py-3 mt-4 flex items-center justify-center gap-2 disabled:opacity-60">
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {copy('Crear borrador editable', 'Create editable draft')}
            </button>
          </div>
        )}

        {createdId && (
          <div className="mt-5 rounded-xl p-4 flex gap-2" style={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac', color: '#166534' }}>
            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="font-body text-sm">{copy('Borrador creado. Puedes abrir el planificador para editarlo antes de aplicarlo.', 'Draft created. You can open the meal planner to edit it before applying it.')}</p>
          </div>
        )}
      </section>
    </main>
  );
}
