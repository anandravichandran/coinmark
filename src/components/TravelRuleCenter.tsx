import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, BookOpen, Search, Filter, ShieldCheck, CheckCircle2, ChevronRight, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { TravelRuleReport } from '../types';

interface TravelRuleCenterProps {
  reports: TravelRuleReport[];
  onCertifyReport: (id: string) => void;
}

export default function TravelRuleCenter({ reports, onCertifyReport }: TravelRuleCenterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Approved' | 'In_Review' | 'Flagged'>('All');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const getStatusStyle = (status: 'Filed' | 'In_Review' | 'Flagged' | 'Approved') => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'In_Review':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Flagged':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Filed':
        default:
        return 'bg-slate-500/10 text-slate-400 border-slate-700';
    }
  };

  const filteredReports = reports.filter((rep) => {
    const matchesSearch = rep.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          rep.originatorVASP.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rep.beneficiaryVASP.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || rep.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const selectedReportDetails = reports.find(r => r.id === selectedReportId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* List section */}
      <div className="lg:col-span-2 space-y-4">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by report ID or VASP Node..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 focus:border-orange-500 rounded text-xs text-slate-200 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-1.5 self-start">
            {(['All', 'Approved', 'In_Review', 'Flagged'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                type="button"
                className={`text-[10px] px-2.5 py-1.5 rounded transition-all font-mono font-bold ${
                  selectedStatus === st
                    ? 'bg-orange-500 text-slate-950 shadow'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* List of Travel Rule filings */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold text-slate-300">FATF TRAVEL RULE ACTIVE FILINGS</h4>
            <span className="text-[10px] text-slate-500">{filteredReports.length} matches found</span>
          </div>

          <div className="divide-y divide-slate-800/60">
            {filteredReports.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No compliance filings match your query.
              </div>
            ) : (
              filteredReports.map((rep) => (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReportId(rep.id)}
                  className={`p-4 transition-all hover:bg-slate-900/60 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    selectedReportId === rep.id ? 'bg-slate-900 border-l-2 border-orange-500' : ''
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-150">{rep.id}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Tx Ref: {rep.transactionId}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded border font-mono uppercase font-semi tracking-wider ${getStatusStyle(rep.status)}`}>
                        {rep.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Originator &rarr; Beneficiary: {' '}
                      <span className="font-semibold text-slate-100">{rep.originatorVASP}</span> to{' '}
                      <span className="font-semibold text-slate-100">{rep.beneficiaryVASP}</span>
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">Filed on {rep.certifiedAt}</p>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <div className="text-right">
                      <p className="text-xs font-mono font-extrabold text-slate-100">${rep.amountUSD.toLocaleString()} USD</p>
                      <p className="text-[10px] text-emerald-400 font-mono">Compliance OK</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Details pane */}
      <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl flex flex-col justify-between h-[360px] relative overflow-hidden">
        {selectedReportDetails ? (
          <div className="space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-100">{selectedReportDetails.id}</h4>
                  <p className="text-[10px] text-slate-500 font-mono">DECENTRALIZED ATTESTATION PACK</p>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded border font-mono ${getStatusStyle(selectedReportDetails.status)}`}>
                  {selectedReportDetails.status.replace('_', ' ')}
                </span>
              </div>

              {/* Data pairs */}
              <div className="space-y-3 font-sans">
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <p className="text-slate-500 uppercase font-mono">Originator A-Pass</p>
                    <p className="text-slate-300 font-mono font-medium mt-0.5">{selectedReportDetails.originatorAPass}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 uppercase font-mono">Beneficiary A-Pass</p>
                    <p className="text-slate-300 font-mono font-medium mt-0.5">{selectedReportDetails.beneficiaryAPass}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] border-t border-slate-800/60 pt-2.5">
                  <div>
                    <p className="text-slate-500 uppercase font-mono">Sender VASP Endpoint</p>
                    <p className="text-slate-300 font-medium mt-0.5">{selectedReportDetails.originatorVASP}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 uppercase font-mono">Receiver VASP Endpoint</p>
                    <p className="text-slate-300 font-medium mt-0.5">{selectedReportDetails.beneficiaryVASP}</p>
                  </div>
                </div>

                <div className="border-t border-slate-800/60 pt-2.5 flex justify-between items-center text-[11px]">
                  <div>
                    <p className="text-slate-500 uppercase font-mono">Filing Amount Value</p>
                    <p className="text-xs font-mono text-orange-400 font-bold mt-0.5">${selectedReportDetails.amountUSD.toLocaleString()} USD</p>
                  </div>
                  <div>
                    <p className="text-slate-500 uppercase font-mono">FATF Compliance Check</p>
                    <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="h-3.5 w-3.5" /> PASSED
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {selectedReportDetails.status === 'In_Review' ? (
              <button
                onClick={() => onCertifyReport(selectedReportDetails.id)}
                type="button"
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs uppercase rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4" />
                Certify and File At VASP
              </button>
            ) : (
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-[10px] text-center text-slate-400 font-mono">
                ✓ CRYPTOGRAPHICALLY SECURED & ARCHIVED
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-center text-slate-500 p-4">
            <BookOpen className="h-8 w-8 text-slate-700" />
            <div>
              <p className="text-xs font-bold text-slate-400">Select Filing Report</p>
              <p className="text-[11px] text-slate-600 mt-1 max-w-xs mx-auto">Select any active Travel Rule filing payload from the list to view secure VASP handshake credentials, check signatures, or execute filings.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
