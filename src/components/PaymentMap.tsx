import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Globe, RefreshCw, Radio } from 'lucide-react';
import { MAP_NODES, MAP_CONNECTIONS } from '../data';

export default function PaymentMap() {
  const [activeConnection, setActiveConnection] = useState<string | null>(null);
  const [livePulse, setLivePulse] = useState(true);

  return (
    <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800/50 p-6 relative overflow-hidden h-[340px] flex flex-col justify-between">
      {/* Background glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-orange-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <h3 className="font-semibold text-slate-100 flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-orange-500" />
              Cleanverse Relays & Smart Payouts
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Real-time A-Token routing map and network pulses</p>
        </div>
        <button 
          onClick={() => setLivePulse(!livePulse)}
          type="button"
          className={`px-2.5 py-1 rounded text-[11px] font-mono flex items-center gap-1.5 transition-colors border ${
            livePulse 
              ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' 
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          <Radio className="h-3 w-3" />
          {livePulse ? 'LIVE PULSES' : 'PAUSED'}
        </button>
      </div>

      {/* Map Graphic Stage */}
      <div className="relative flex-1 min-h-[180px] flex items-center justify-center mt-2">
        <svg className="w-full h-[220px]" viewBox="0 0 740 260">
          {/* Subtle Grid Lines in background representing sovereign boundaries */}
          <g stroke="#334155" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3">
            <line x1="20" y1="50" x2="720" y2="50" />
            <line x1="20" y1="130" x2="720" y2="130" />
            <line x1="20" y1="210" x2="720" y2="210" />
            <line x1="180" y1="10" x2="180" y2="250" />
            <line x1="410" y1="10" x2="410" y2="250" />
            <line x1="620" y1="10" x2="620" y2="250" />
          </g>

          {/* Connection Lines with interactive hover */}
          {MAP_CONNECTIONS.map((conn, idx) => {
            const start = MAP_NODES.find(n => n.id === conn.from);
            const end = MAP_NODES.find(n => n.id === conn.to);
            if (!start || !end) return null;
            const isHovered = activeConnection === `${conn.from}-${conn.to}`;

            // Path curvature: quadratic bezier control point
            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2 - 30; // curve upwards

            return (
              <g key={idx} className="cursor-pointer" 
                 onMouseEnter={() => setActiveConnection(`${conn.from}-${conn.to}`)}
                 onMouseLeave={() => setActiveConnection(null)}>
                {/* Backing arc for thick hover target */}
                <path
                  d={`M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="8"
                />
                {/* Visual solid connector */}
                <path
                  d={`M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`}
                  fill="none"
                  stroke={isHovered ? '#F97316' : '#1E293B'}
                  strokeWidth={isHovered ? '2' : '1'}
                  className="transition-all duration-300"
                />
                
                {/* On-Chain Flow Pulse animation along the path */}
                {livePulse && (conn.active || isHovered) && (
                  <path
                    d={`M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`}
                    fill="none"
                    stroke={isHovered ? '#FB923C' : '#38BDF8'}
                    strokeWidth={isHovered ? '2.5' : '1.5'}
                    strokeDasharray="10 40"
                    className="animate-pulse"
                    style={{
                      animation: 'dash 4s linear infinite',
                      strokeDashoffset: idx % 2 === 0 ? 100 : -100
                    }}
                  />
                )}
              </g>
            );
          })}

          {/* Custom CSS for dash offset migration */}
          <style>{`
            @keyframes dash {
              to {
                stroke-dashoffset: -200;
              }
            }
          `}</style>

          {/* Map Nodes (Cities) */}
          {MAP_NODES.map((node) => {
            const isCenterHub = node.id === 'hub';
            return (
              <g key={node.id} className="cursor-pointer group">
                {/* Pulsing Outer Glow ring */}
                {isCenterHub && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="9"
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="1.5"
                    opacity="0.5"
                    className="animate-ping"
                  />
                )}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="7"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="1"
                />
                {/* Interactive Inner circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="5"
                  fill={isCenterHub ? '#F97316' : '#0F172A'}
                  stroke={isCenterHub ? '#FFF' : node.color}
                  strokeWidth="1.5"
                />
                {/* Label tooltips */}
                <text
                  x={node.x}
                  y={node.y - 12}
                  textAnchor="middle"
                  fill="#E2E8F0"
                  fontSize="10"
                  fontWeight={isCenterHub ? 'bold' : 'normal'}
                  className="bg-slate-900 border border-slate-800 rounded px-1"
                >
                  {node.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Stats legend footer */}
      <div className="grid grid-cols-3 border-t border-slate-800/80 pt-3 text-slate-400 z-10 bg-slate-950/40 rounded-lg p-2.5">
        <div className="text-center border-r border-slate-800/80">
          <p className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">A-Pass Relays</p>
          <p className="text-sm font-semibold text-slate-200 mt-0.5">6 Active</p>
        </div>
        <div className="text-center border-r border-slate-800/80">
          <p className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Tx Latency</p>
          <p className="text-sm font-semibold text-emerald-400 mt-0.5">&lt; 1.4s Avg</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Compliance</p>
          <p className="text-sm font-semibold text-orange-400 mt-0.5">Automated</p>
        </div>
      </div>
    </div>
  );
}
