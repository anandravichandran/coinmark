import React, { useState } from 'react';
import { 
  Bell, FileText, CheckCircle, AlertTriangle, Fingerprint, 
  HelpCircle, Trash2, ShieldCheck, Mail, ShieldAlert, Sparkles, Clock, Globe, ArrowRight 
} from 'lucide-react';

interface NotificationItem {
  id: string;
  category: 'KYC' | 'Payout' | 'Compliance' | 'TravelRule';
  title: string;
  desc: string;
  timestamp: string;
  unread: boolean;
  severity: 'Info' | 'Warning' | 'Success' | 'Alert';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOT-001',
    category: 'KYC',
    title: 'A-Pass Identity Onboarded',
    desc: 'Holder Alex Rivera has generated an active soulbound DID under standard level 2 validation benchmarks.',
    timestamp: '2026-06-14 06:15:30',
    unread: true,
    severity: 'Success'
  },
  {
    id: 'NOT-002',
    category: 'Payout',
    title: 'High Volume Stablecoin payment Emitted',
    desc: 'Corporate transfer of 15,000 EURa signed to target freelancer your_name Varga. Pre-flight checks passed successfully.',
    timestamp: '2026-06-14 04:30:15',
    unread: true,
    severity: 'Info'
  },
  {
    id: 'NOT-003',
    category: 'TravelRule',
    title: 'Travel Rule report compiled & Filed',
    desc: 'FATF compliance document TR-4921 has been generated. Cryptographic hash bound to Block transaction TX-9022.',
    timestamp: '2026-06-14 02:11:45',
    unread: false,
    severity: 'Success'
  },
  {
    id: 'NOT-004',
    category: 'Compliance',
    title: 'A-Token rule change assertion logged',
    desc: 'Risk rule limits on South American corridors updated. Daily transfer frequency velocity cap increased to $10,000 USDa.',
    timestamp: '2026-06-13 18:00:00',
    unread: false,
    severity: 'Warning'
  },
  {
    id: 'NOT-005',
    category: 'KYC',
    title: 'Identity credential inspection mandated',
    desc: 'Beneficiary Liam Sterling has uploaded new address proofs for OFAC sanctions screening validation checking.',
    timestamp: '2026-06-13 12:44:10',
    unread: false,
    severity: 'Alert'
  }
];

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<string>('All');

  const filtered = notifications.filter(n => {
    if (filter === 'All') return true;
    return n.category === filter;
  });

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Success':
        return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      case 'Warning':
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case 'Alert':
        return <ShieldAlert className="h-4 w-4 text-rose-400" />;
      default:
        return <Clock className="h-4 w-4 text-sky-400" />;
    }
  };

  return (
    <div id="notification-center-root" className="bg-slate-905 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 max-w-3xl mx-auto font-sans">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <span className="text-[10px] text-orange-500 font-mono font-bold tracking-widest uppercase">System Triggers</span>
          <h3 className="text-xl font-bold text-white flex items-center gap-1.5 font-display">
            <Bell className="h-5 w-5 text-orange-500" />
            Compliance &amp; Operational Alerts
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Track audit updates, dynamic KYC handshakes, velocity threshold flags, and Travel Rule actions.</p>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={markAllRead}
              className="text-[11px] p-1 px-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold tracking-wide rounded border border-slate-800 transition-colors cursor-pointer font-sans"
            >
              Mark all as Checked
            </button>
            <button
              onClick={clearAll}
              className="text-[11px] p-1 px-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 font-bold text-rose-455 text-rose-400 rounded transition-all cursor-pointer font-sans"
            >
              Clear Logs
            </button>
          </div>
        )}
      </div>

      {/* FILTER BUTTONS ROW */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'All', label: 'All Alerts' },
          { key: 'KYC', label: 'KYC verification' },
          { key: 'Payout', label: 'Payment filings' },
          { key: 'Compliance', label: 'Rule checks' },
          { key: 'TravelRule', label: 'Travel Rule' }
        ].map(item => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            className={`text-xs px-3.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 border ${
              filter === item.key
                ? 'bg-orange-500/10 text-orange-400 border-orange-500/20 font-bold'
                : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* NOTIFICATIONS LIST OR EMPTY STATE */}
      {filtered.length === 0 ? (
        
        /* PROFESSIONAL EMPTY STATE: NO NOTIFICATIONS */
        <div className="bg-slate-950/60 p-16 rounded-xl border border-slate-850 border-dashed text-center space-y-3">
          <div className="h-12 w-12 bg-slate-900 rounded-full border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
            <Bell className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-400 tracking-tight">System Logs Clear</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            There are no active {filter === 'All' ? 'operational' : filter} alerts matching your search. Compliance is currently verified.
          </p>
        </div>

      ) : (

        <div className="divide-y divide-slate-850/80 bg-slate-950 border border-slate-850 rounded-xl overflow-hidden shadow-2xl">
          {filtered.map((item) => (
            <div 
              key={item.id} 
              className={`p-4 flex gap-4 transition-colors hover:bg-slate-900/30 ${
                item.unread ? 'bg-orange-500/5' : ''
              }`}
            >
              
              {/* Category Icon */}
              <div className="shrink-0 mt-0.5">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center border ${
                  item.unread ? 'bg-orange-500/10 border-orange-500/20' : 'bg-slate-900 border-slate-800'
                }`}>
                  {getSeverityIcon(item.severity)}
                </div>
              </div>

              {/* Text Area */}
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200">{item.title}</span>
                    {item.unread && (
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse shrink-0" />
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">{item.timestamp}</span>
                </div>

                <p className="text-xs text-slate-450 leading-relaxed text-slate-400">{item.desc}</p>
                
                {/* Meta details sub line */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-0.5">
                  <span>LOG ID: {item.id}</span>
                  <span className="text-slate-500 tracking-wide uppercase font-bold text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-900">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Action columns */}
              <div className="shrink-0 flex items-start">
                <button
                  onClick={() => deleteNotification(item.id)}
                  className="p-1 text-slate-600 hover:text-rose-455 hover:text-rose-400 transition-colors cursor-pointer rounded"
                  title="Remove alert"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      )}

    </div>
  );
}
