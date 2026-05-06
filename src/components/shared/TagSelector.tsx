import { useState, useEffect, useRef } from 'react';
import { Tag as TagIcon, Plus, X, Search, Loader2 } from 'lucide-react';
import { searchTags, createTag, TAG_CATEGORIES } from '../../lib/tagService';
import type { Tag, TagCategory } from '../../lib/tagService';
import { useAuth } from '../../lib/auth';

interface Props {
  selectedTags: Tag[];
  onChange: (tags: Tag[]) => void;
  label?: string;
  placeholder?: string;
}

const DEFAULT_COLORS = [
  '#2563eb', '#16a34a', '#d97706', '#dc2626', '#0891b2',
  '#7c3aed', '#be185d', '#ea580c', '#65a30d', '#6b7280',
];

export default function TagSelector({ selectedTags, onChange, label, placeholder }: Props) {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Tag[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<TagCategory>('training');
  const [newColor, setNewColor] = useState('#2563eb');
  const [creating, setCreating] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setShowCreate(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!showDropdown) return;
    setSearching(true);
    const timer = setTimeout(async () => {
      const data = await searchTags(query);
      const filteredIds = new Set(selectedTags.map((t) => t.id));
      setResults(data.filter((t) => !filteredIds.has(t.id)));
      setSearching(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [query, showDropdown, selectedTags]);

  const handleSelect = (tag: Tag) => {
    onChange([...selectedTags, tag]);
    setQuery('');
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleRemove = (tagId: string) => {
    onChange(selectedTags.filter((t) => t.id !== tagId));
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    const tag = await createTag(newName.trim(), newCategory, newColor, user?.id);
    if (tag) {
      onChange([...selectedTags, tag]);
    }
    setNewName('');
    setNewCategory('training');
    setNewColor('#2563eb');
    setShowCreate(false);
    setShowDropdown(false);
    setCreating(false);
  };

  const openDropdown = () => {
    setShowDropdown(true);
    setShowCreate(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div ref={ref} className="relative">
      {label && (
        <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
          {label}
        </label>
      )}

      <div
        className="min-h-[42px] flex flex-wrap items-center gap-1.5 px-3 py-2 rounded-xl border-2 cursor-text transition-colors"
        style={{ borderColor: showDropdown ? '#514163' : '#e5e7eb', backgroundColor: '#fff' }}
        onClick={openDropdown}
      >
        {selectedTags.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: tag.color + '22', color: tag.color, border: `1px solid ${tag.color}44` }}
          >
            {tag.name_es || tag.name}
            <button
              onClick={(e) => { e.stopPropagation(); handleRemove(tag.id); }}
              className="ml-0.5 hover:opacity-70 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <div className="flex items-center gap-1 flex-1 min-w-[120px]">
          <TagIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#9ca3af' }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={openDropdown}
            placeholder={selectedTags.length === 0 ? (placeholder ?? 'Add tags...') : ''}
            className="flex-1 outline-none text-sm bg-transparent"
            style={{ color: '#1f2937', minWidth: '80px' }}
          />
          {searching && <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" style={{ color: '#9ca3af' }} />}
        </div>
      </div>

      {showDropdown && (
        <div
          className="absolute top-full left-0 right-0 z-40 mt-1.5 bg-white rounded-xl overflow-hidden"
          style={{ border: '2px solid #e5e7eb', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', maxHeight: '280px', overflowY: 'auto' }}
        >
          {!showCreate ? (
            <>
              {results.length > 0 && (
                <div className="py-1">
                  {results.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => handleSelect(tag)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: tag.color }}
                      />
                      <span className="text-sm font-medium flex-1" style={{ color: '#1f2937' }}>
                        {tag.name_es || tag.name}
                      </span>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: (TAG_CATEGORIES.find((c) => c.value === tag.category)?.color ?? '#6b7280') + '18',
                          color: TAG_CATEGORIES.find((c) => c.value === tag.category)?.color ?? '#6b7280',
                        }}
                      >
                        {tag.category}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {results.length === 0 && !searching && (
                <div className="px-3 py-3 text-center">
                  <p className="text-sm" style={{ color: '#9ca3af' }}>
                    {query ? `No tags matching "${query}"` : 'No tags yet'}
                  </p>
                </div>
              )}

              <div className="border-t" style={{ borderColor: '#f3f4f6' }}>
                <button
                  onClick={() => { setShowCreate(true); setNewName(query); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
                >
                  <Plus className="w-4 h-4" style={{ color: '#514163' }} />
                  <span className="text-sm font-semibold" style={{ color: '#514163' }}>
                    {query ? `Create "${query}"` : 'Create new tag'}
                  </span>
                </button>
              </div>
            </>
          ) : (
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <Plus className="w-4 h-4" style={{ color: '#514163' }} />
                <span className="text-sm font-semibold" style={{ color: '#1f2937' }}>New Tag</span>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6b7280' }}>Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Tag name..."
                  className="input-brand text-sm py-1.5"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setShowCreate(false); }}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6b7280' }}>Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as TagCategory)}
                  className="input-brand text-sm py-1.5"
                >
                  {TAG_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label_es} / {c.label_en}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#6b7280' }}>Color</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {DEFAULT_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setNewColor(c)}
                      className="w-6 h-6 rounded-full transition-all"
                      style={{
                        backgroundColor: c,
                        outline: newColor === c ? `2px solid ${c}` : 'none',
                        outlineOffset: '2px',
                        transform: newColor === c ? 'scale(1.15)' : 'scale(1)',
                      }}
                    />
                  ))}
                  <input
                    type="color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="w-6 h-6 rounded-full border-0 cursor-pointer bg-transparent"
                    title="Custom color"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 py-1.5 rounded-lg border text-xs font-medium transition-all hover:bg-gray-50"
                  style={{ borderColor: '#e5e7eb', color: '#6b7280' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={creating || !newName.trim()}
                  className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-1"
                  style={{ backgroundColor: '#514163', color: '#fdda36' }}
                >
                  {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  Create
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
