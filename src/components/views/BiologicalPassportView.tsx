import { Fingerprint } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { usePreferences } from '../../lib/preferences';
import HubBiologicalPassport from '../nutrition/HubBiologicalPassport';
import TrainingSneakPeek from './TrainingSneakPeek';

export default function BiologicalPassportView() {
  const { user, profile } = useAuth();
  const { language } = usePreferences();
  const es = language === 'es';

  const hubTarget = profile?.hub_user_id ?? user?.email ?? null;
  const athleteId = profile?.id ?? user?.id ?? '';

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#514163' }}
        >
          <Fingerprint className="w-6 h-6" style={{ color: '#fdda36' }} />
        </div>
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold" style={{ color: '#1f2937' }}>
            {es ? 'Pasaporte Biológico' : 'Biological Passport'}
          </h1>
          <p className="font-body text-sm mt-1" style={{ color: '#6b7280' }}>
            {es
              ? 'Tus datos fisiológicos, zonas de entrenamiento y gasto calórico desde el Hub'
              : 'Your physiological data, training zones, and caloric expenditure from the Hub'}
          </p>
        </div>
      </div>

      {hubTarget ? (
        <>
          <HubBiologicalPassport athleteEmail={hubTarget} athleteName={profile?.full_name} />
          <TrainingSneakPeek athleteId={athleteId} athleteEmail={hubTarget} />
        </>
      ) : (
        <div className="card-brand p-8 text-center">
          <Fingerprint className="w-12 h-12 mx-auto mb-3" style={{ color: '#d1d5db' }} />
          <p className="text-sm" style={{ color: '#9ca3af' }}>
            {es
              ? 'No hay conexión con el Hub. Inicia sesión para ver tus datos.'
              : 'No Hub connection. Sign in to view your data.'}
          </p>
        </div>
      )}
    </div>
  );
}
