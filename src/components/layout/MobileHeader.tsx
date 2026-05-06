import { Trophy } from 'lucide-react';

interface Props {
  title: string;
}

export default function MobileHeader({ title }: Props) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-20 bg-white border-b border-[#e5e7eb] flex items-center justify-center gap-3 px-4 py-3 lg:hidden"
      style={{ boxShadow: '0 1px 8px rgba(81,65,99,0.06)', paddingTop: 'max(12px, env(safe-area-inset-top))' }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: '#fdda36' }}
      >
        <Trophy className="w-4 h-4" style={{ color: '#514163' }} />
      </div>
      <div className="text-center">
        <div className="font-heading text-sm text-[#514163] leading-tight">Asciende</div>
        <div className="font-body text-xs text-[#9ca3af] leading-tight">{title}</div>
      </div>
    </header>
  );
}
