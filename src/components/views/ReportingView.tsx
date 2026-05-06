import { BarChart2 } from 'lucide-react';

export default function ReportingView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{ backgroundColor: 'rgba(253,218,54,0.15)', border: '2px solid rgba(253,218,54,0.4)' }}
      >
        <BarChart2 className="w-8 h-8" style={{ color: '#514163' }} />
      </div>
      <h2 className="font-heading text-xl text-[#1f2937] mb-2">Reporting & Analytics</h2>
      <p className="font-body text-sm text-[#9ca3af] max-w-sm">
        Aggregate performance data, race outcomes, and nutrition compliance across all athletes and events.
      </p>
      <div
        className="mt-8 px-5 py-3 rounded-xl font-body text-sm font-medium"
        style={{ backgroundColor: 'rgba(253,218,54,0.15)', color: '#514163', border: '1.5px solid rgba(253,218,54,0.4)' }}
      >
        Coming soon
      </div>
    </div>
  );
}
