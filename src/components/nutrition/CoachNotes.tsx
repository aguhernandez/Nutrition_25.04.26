import { useState, useEffect } from 'react';
import { ChevronLeft, MessageSquare, Plus, Trash2, Pin, Loader2, X, Check, AlertTriangle, Pill, TrendingUp, Trophy } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import { usePreferences } from '../../lib/preferences';

interface CoachNote {
  id: string;
  coach_id: string;
  athlete_id: string;
  title: string;
  content: string;
  note_type: NoteType;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  coach_name?: string;
}

type NoteType = 'general' | 'race_protocol' | 'macro_adjustment' | 'supplement' | 'warning';

interface Props {
  onBack: () => void;
  athleteId?: string;
}

function getNoteTypes(es: boolean): { value: NoteType; label: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; color: string; bg: string; border: string }[] {
  return [
    { value: 'general', label: 'General', icon: MessageSquare, color: '#374151', bg: '#f9fafb', border: '#e5e7eb' },
    { value: 'race_protocol', label: es ? 'Protocolo' : 'Race', icon: Trophy, color: '#be185d', bg: '#fdf2f8', border: '#f9a8d4' },
    { value: 'macro_adjustment', label: es ? 'Macros' : 'Macro Adj.', icon: TrendingUp, color: '#0369a1', bg: '#e0f2fe', border: '#7dd3fc' },
    { value: 'supplement', label: es ? 'Suplementos' : 'Supplements', icon: Pill, color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd' },
    { value: 'warning', label: es ? 'Alerta' : 'Alert', icon: AlertTriangle, color: '#b45309', bg: '#fef3c7', border: '#fcd34d' },
  ];
}

function timeAgo(dateStr: string, es: boolean) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return es ? 'ahora' : 'just now';
  if (diff < 3600) return es ? `hace ${Math.floor(diff / 60)}m` : `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return es ? `hace ${Math.floor(diff / 3600)}h` : `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString(es ? 'es' : 'en', { day: 'numeric', month: 'short' });
}

export default function CoachNotes({ onBack, athleteId }: Props) {
  const { user, profile } = useAuth();
  const { language } = usePreferences();
  const es = language === 'es';
  const NOTE_TYPES = getNoteTypes(es);

  function noteTypeInfo(type: NoteType) {
    return NOTE_TYPES.find((n) => n.value === type) ?? NOTE_TYPES[0];
  }

  const isCoach = profile?.role === 'admin' || profile?.role === 'coach';
  const targetId = athleteId ?? user?.id;

  const [notes, setNotes] = useState<CoachNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', note_type: 'general' as NoteType, is_pinned: false });

  useEffect(() => {
    if (!targetId) { setLoading(false); return; }
    (async () => {
      const { data } = await supabase
        .from('coach_athlete_notes')
        .select('*')
        .eq('athlete_id', targetId)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });
      setNotes((data ?? []) as CoachNote[]);
      setLoading(false);
    })();
  }, [targetId]);

  const handleSave = async () => {
    if (!user?.id || !targetId || !form.content.trim()) return;
    setSaving(true);
    const { data } = await supabase
      .from('coach_athlete_notes')
      .insert({
        coach_id: user.id,
        athlete_id: targetId,
        title: form.title.trim() || noteTypeInfo(form.note_type).label,
        content: form.content.trim(),
        note_type: form.note_type,
        is_pinned: form.is_pinned,
      })
      .select()
      .maybeSingle();
    if (data) setNotes((prev) => [data as CoachNote, ...prev]);
    setSaving(false);
    setShowForm(false);
    setForm({ title: '', content: '', note_type: 'general', is_pinned: false });
  };

  const handlePin = async (note: CoachNote) => {
    const updated = { ...note, is_pinned: !note.is_pinned };
    await supabase.from('coach_athlete_notes').update({ is_pinned: updated.is_pinned }).eq('id', note.id);
    setNotes((prev) =>
      [...prev.map((n) => (n.id === note.id ? updated : n))].sort((a, b) =>
        b.is_pinned === a.is_pinned ? 0 : b.is_pinned ? 1 : -1
      )
    );
  };

  const handleDelete = async (id: string) => {
    await supabase.from('coach_athlete_notes').delete().eq('id', id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#514163' }} />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-xl border hover:bg-gray-50 transition-all" style={{ borderColor: '#e5e7eb' }}>
          <ChevronLeft className="w-4 h-4" style={{ color: '#6b7280' }} />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f0fdf4' }}>
            <MessageSquare className="w-4 h-4" style={{ color: '#15803d' }} />
          </div>
          <div>
            <h1 className="font-heading text-xl" style={{ color: '#1f2937' }}>{es ? 'Notas del Coach' : 'Coach Notes'}</h1>
            <p className="text-xs" style={{ color: '#9ca3af' }}>{notes.length} {es ? `nota${notes.length !== 1 ? 's' : ''}` : `note${notes.length !== 1 ? 's' : ''}`}</p>
          </div>
        </div>
        {isCoach && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all"
            style={{ backgroundColor: '#fdda36', color: '#3b2a50' }}
          >
            <Plus className="w-4 h-4" /> {es ? 'Agregar' : 'Add'}
          </button>
        )}
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl" style={{ border: '2px solid #e5e7eb' }}>
          <MessageSquare className="w-12 h-12 mx-auto mb-3" style={{ color: '#d1d5db' }} />
          <h3 className="font-semibold mb-1" style={{ color: '#1f2937' }}>{es ? 'Sin notas' : 'No notes yet'}</h3>
          <p className="text-sm" style={{ color: '#9ca3af' }}>
            {isCoach
              ? (es ? 'Agrega notas nutricionales para este atleta.' : 'Add nutrition notes for this athlete.')
              : (es ? 'Tu coach aún no ha dejado notas.' : 'Your coach has not left any notes yet.')}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => {
            const typeInfo = noteTypeInfo(note.note_type as NoteType);
            const NoteIcon = typeInfo.icon;
            const canEdit = isCoach || note.coach_id === user?.id;
            return (
              <div
                key={note.id}
                className="bg-white rounded-2xl overflow-hidden transition-all hover:shadow-sm"
                style={{ border: `2px solid ${note.is_pinned ? typeInfo.border : '#e5e7eb'}` }}
              >
                <div
                  className="flex items-center gap-3 px-4 py-3"
                  style={{ backgroundColor: note.is_pinned ? typeInfo.bg : '#fff' }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: typeInfo.bg, border: `1px solid ${typeInfo.border}` }}
                  >
                    <NoteIcon className="w-4 h-4" style={{ color: typeInfo.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm truncate" style={{ color: '#1f2937' }}>{note.title}</span>
                      {note.is_pinned && (
                        <Pin className="w-3 h-3 flex-shrink-0" style={{ color: typeInfo.color }} />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#9ca3af' }}>
                      <span className="px-1.5 py-0.5 rounded-full" style={{ backgroundColor: typeInfo.bg, color: typeInfo.color }}>
                        {typeInfo.label}
                      </span>
                      <span>{timeAgo(note.updated_at, es)}</span>
                    </div>
                  </div>
                  {canEdit && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handlePin(note)}
                        className="p-1.5 rounded-lg transition-all hover:bg-gray-100"
                        title={note.is_pinned ? (es ? 'Desanclar' : 'Unpin') : (es ? 'Anclar' : 'Pin')}
                      >
                        <Pin className="w-3.5 h-3.5" style={{ color: note.is_pinned ? typeInfo.color : '#d1d5db' }} />
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="p-1.5 rounded-lg transition-all hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="px-4 pb-4 pt-2">
                  <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#374151' }}>{note.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" style={{ border: '2px solid #e5e7eb' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0 bg-white" style={{ borderColor: '#f3f4f6' }}>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" style={{ color: '#514163' }} />
                <h3 className="font-semibold" style={{ color: '#1f2937' }}>{es ? 'Nueva nota' : 'New note'}</h3>
              </div>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="w-4 h-4" style={{ color: '#6b7280' }} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>{es ? 'Tipo' : 'Note type'}</label>
                <div className="grid grid-cols-2 gap-2">
                  {NOTE_TYPES.map((nt) => {
                    const NtIcon = nt.icon;
                    return (
                      <button
                        key={nt.value}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, note_type: nt.value }))}
                        className="flex items-center gap-2 p-2.5 rounded-xl border text-sm font-medium transition-all"
                        style={{
                          borderColor: form.note_type === nt.value ? nt.color : '#e5e7eb',
                          backgroundColor: form.note_type === nt.value ? nt.bg : '#fff',
                          color: form.note_type === nt.value ? nt.color : '#374151',
                        }}
                      >
                        <NtIcon className="w-4 h-4" /> {nt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>{es ? 'Título (opcional)' : 'Title (optional)'}</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder={es ? 'Título de la nota...' : 'Note title...'}
                  className="input-brand"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>{es ? 'Contenido *' : 'Content *'}</label>
                <textarea
                  rows={5}
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  placeholder={es ? 'Escribe las indicaciones...' : 'Write nutrition notes...'}
                  className="input-brand resize-none"
                  autoFocus
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinNote"
                  checked={form.is_pinned}
                  onChange={(e) => setForm((f) => ({ ...f, is_pinned: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="pinNote" className="text-sm" style={{ color: '#374151' }}>
                  {es ? 'Anclar nota (aparecerá primero)' : 'Pin note (will appear first)'}
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-xl border font-medium text-sm"
                  style={{ borderColor: '#e5e7eb', color: '#6b7280' }}
                >
                  {es ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !form.content.trim()}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                  style={{ backgroundColor: '#fdda36', color: '#3b2a50' }}
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {es ? 'Guardar' : 'Save note'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
