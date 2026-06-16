import React, { useState } from 'react';
import { Shield, Sparkles, Scale, Info, CheckCircle2 } from 'lucide-react';

interface RiskGaugeProps {
  score?: number; // 0 to 100
  onScoreChange?: (newScore: number) => void;
}

export default function RiskGauge({ score = 18, onScoreChange }: RiskGaugeProps) {
  const [selectedStrictness, setSelectedStrictness] = useState<'Standard' | 'Enhanced' | 'Paranoid'>('Enhanced');

  // Gauge circular math params
  const radius = 60;
  const strokeWidth = 9;
  const circumference = 2 * Math.PI * radius;
  // Arc represents 270 degrees of a circle
  const dashOffset = circumference - (score / 100) * (3/4 * circumference);

  const getRiskColor = (val: number) => {
    if (val < 25) return 'stroke-emerald-500';
    if (val < 60) return 'stroke-amber-400';
    return 'stroke-orange-500';
  };

  const getRiskLabel = (val: number) => {
    if (val < 25) return { text: 'EXCELLENT', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
    if (val < 60) return { text: 'MODERATE RISK', color: 'text-amber-400', bg: 'bg-amber-500/10' };
    return { text: 'HIGH EXPOSURE', color: 'text-orange-400', bg: 'bg-orange-500/10' };
  };

  const label = getRiskLabel(score);

  return (
    <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800/50 p-6 flex flex-col justify-between h-[340px] relative">
      <div className="absolute top-2 right-2 p-1 text-slate-700 hover:text-slate-500 cursor-pointer transition-colors" title="Computed based on A-Token velocity, geofence, and OFAC status rules across 6 connected corridors.">
        <Info className="h-4 w-4" />
      </div>

      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-orange-500/10 text-orange-400 rounded">
          <Shield className="h-4.5 w-4.5" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-100 text-sm">Regulatory Proof-Score</h3>
          <p className="text-[11px] text-slate-400">Total compliance risk score index</p>
        </div>
      </div>

      {/* Radial Meter visualization */}
      <div className="flex items-center justify-around gap-4 my-2">
        <div className="relative w-[130px] h-[130px] flex items-center justify-center">
          {/* Gauge SVG */}
          <svg className="w-full h-full transform -rotate-225" viewBox="0 0 150 150">
            {/* Background Track Arc */}
            <circle
              cx="75"
              cy="75"
              r={radius}
              fill="none"
              stroke="#1e293b"
              strokeWidth={strokeWidth}
              strokeDasharray={`${3/4 * circumference} ${1/4 * circumference}`}
            />
            {/* Value Indicator Arc */}
            <circle
              cx="75"
              cy="75"
              r={radius}
              fill="none"
              className={`transition-all duration-1000 ease-out ${getRiskColor(score)}`}
              strokeWidth={strokeWidth}
              strokeDasharray={`${3/4 * circumference} ${1/4 * circumference}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
            />
          </svg>

          {/* Center Text inside gauge */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-slate-50 font-mono tracking-tight">{score}</span>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">INDEX VALUE</span>
          </div>
        </div>

        {/* Detailed scoring elements */}
        <div className="flex flex-col gap-2.5">
          <div className={`px-2 py-0.5 rounded text-[10px] font-extrabold text-center tracking-wider max-w-[120px] ${label.bg} ${label.color}`}>
            {label.text}
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-mono text-slate-500">MOCK ASSUMPTIONS</p>
            <p className="text-xs text-slate-300 flex items-center gap-1">
              <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full"></span>
              98% A-Pass Verified
            </p>
            <p className="text-xs text-slate-300 flex items-center gap-1">
              <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full"></span>
              0 Blocklisted entities
            </p>
            <p className="text-xs text-slate-300 flex items-center gap-1">
              <span className="h-1.5 w-1.5 bg-amber-400 rounded-full"></span>
              1 Sanctions review file
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Compliance Gating slider/tabs */}
      <div>
        <p className="text-[11px] font-mono text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
          <Scale className="h-3 w-3 text-orange-400" />
          A-Token Gate Level (Enforcement Mode)
        </p>
        <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {(['Standard', 'Enhanced', 'Paranoid'] as const).map((level) => {
            const isActive = selectedStrictness === level;
            return (
              <button
                key={level}
                onClick={() => {
                  setSelectedStrictness(level);
                  if (onScoreChange) {
                    // Changing strictness levels changes portfolio risk profile mock score
                    if (level === 'Standard') onScoreChange(28);
                    if (level === 'Enhanced') onScoreChange(14);
                    if (level === 'Paranoid') onScoreChange(4);
                  }
                }}
                type="button"
                className={`text-[10px] py-1.5 rounded-md font-medium transition-all ${
                  isActive
                    ? 'bg-orange-500 text-slate-950 font-bold shadow-md shadow-orange-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {level}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
