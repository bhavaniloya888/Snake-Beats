/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Music, Gamepad2, Settings, Zap, History, LayoutGrid, Volume2, ListMusic } from 'lucide-react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { DUMMY_SONGS } from './constants';

export default function App() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snake-high-score');
    return saved ? parseInt(saved, 10) : 0;
  });

  const currentSong = DUMMY_SONGS[currentSongIndex];

  const handleScoreUpdate = (score: number) => {
    setCurrentScore(score);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snake-high-score', score.toString());
    }
  };

  return (
    <div className="h-screen bg-[#09090b] text-slate-200 font-sans flex flex-col overflow-hidden selection:bg-cyan-500 selection:text-black">
      {/* Header Section */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#0c0c0e] relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.5)] flex items-center justify-center">
             <Zap size={18} fill="black" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase sm:block hidden">Synth<span className="text-cyan-400">Snake</span></h1>
        </div>

        <div className="flex items-center gap-6 md:gap-12 font-mono">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest leading-none mb-1">Current Score</span>
            <span className="text-2xl text-pink-500 drop-shadow-[0_0_8px_rgba(244,114,182,0.6)] font-bold">{currentScore.toString().padStart(6, '0')}</span>
          </div>
          <div className="hidden sm:flex flex-col items-end border-l border-white/10 pl-8 md:pl-12">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest leading-none mb-1">Best Streak</span>
            <span className="text-2xl text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] font-bold">{highScore.toString().padStart(6, '0')}</span>
          </div>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar: Music Library & Tools */}
        <aside className="w-72 border-r border-white/10 p-6 flex flex-col gap-8 bg-[#0c0c0e] hidden lg:flex">
          <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Frequency List</h3>
            <div className="space-y-2">
              {DUMMY_SONGS.map((song, i) => (
                <button
                  key={song.id}
                  onClick={() => setCurrentSongIndex(i)}
                  className={`w-full p-3 rounded-md transition-all flex items-center gap-3 border ${
                    i === currentSongIndex 
                    ? 'bg-white/5 border-cyan-500/30' 
                    : 'hover:bg-white/5 border-transparent'
                  }`}
                >
                  <div className={`w-10 h-10 rounded flex items-center justify-center ${i === currentSongIndex ? 'bg-slate-800 text-cyan-400' : 'bg-slate-800/50 text-slate-500'}`}>
                    <Music size={18} className={i === currentSongIndex ? 'animate-pulse' : ''} />
                  </div>
                  <div className="flex-1 overflow-hidden text-left">
                    <p className={`text-sm font-medium truncate ${i === currentSongIndex ? 'text-white' : 'text-slate-400'}`}>{song.title}</p>
                    <p className="text-[10px] text-slate-500 truncate">{song.artist}</p>
                  </div>
                  {i === currentSongIndex && (
                    <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_5px_#22d3ee]"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Controls</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                <LayoutGrid size={16} className="text-slate-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Skins</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                <History size={16} className="text-slate-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">History</span>
              </button>
            </div>
          </div>

          <div className="mt-auto p-4 bg-pink-500/5 rounded-xl border border-pink-500/20">
            <p className="text-[10px] text-pink-400 font-bold uppercase tracking-wider mb-2 text-center">Difficulty</p>
            <div className="grid grid-cols-3 gap-2">
              <button className="py-2 text-[10px] bg-white/5 rounded border border-white/10 text-slate-400 hover:text-white transition-colors">Low</button>
              <button className="py-2 text-[10px] bg-pink-500 text-black font-bold rounded shadow-[0_0_10px_rgba(244,114,182,0.4)]">High</button>
              <button className="py-2 text-[10px] bg-white/5 rounded border border-white/10 text-slate-400 hover:text-white transition-colors">Ultra</button>
            </div>
          </div>
        </aside>

        {/* Game Engine View */}
        <section className="flex-1 relative bg-[#070708] flex items-center justify-center p-4 md:p-8 overflow-hidden">
          {/* Decorative Grid Overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
          
          <div className="relative z-10 w-full max-w-[500px]">
            <SnakeGame 
              onScoreUpdate={handleScoreUpdate} 
              accentColor={currentSong.color}
            />
          </div>

          {/* Controls Legend */}
          <div className="absolute bottom-8 right-8 hidden md:flex gap-4 opacity-40 hover:opacity-80 transition-opacity">
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 border border-white/20 rounded flex items-center justify-center text-xs font-bold">W</div>
              <div className="flex gap-1">
                <div className="w-8 h-8 border border-white/20 rounded flex items-center justify-center text-xs font-bold">A</div>
                <div className="w-8 h-8 border border-white/20 rounded flex items-center justify-center text-xs font-bold">S</div>
                <div className="w-8 h-8 border border-white/20 rounded flex items-center justify-center text-xs font-bold">D</div>
              </div>
              <span className="text-[10px] uppercase font-bold mt-2 tracking-widest text-slate-400">Movement</span>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Media Bar */}
      <MusicPlayer 
        currentSongIndex={currentSongIndex}
        onSongChange={setCurrentSongIndex}
      />
    </div>
  );
}

function StatCard({ label, value }: { label: string, value: string }) {
  return (
    <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800/50 flex flex-col gap-1 shadow-lg">
      <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider">{label}</span>
      <span className="text-xl font-black italic tracking-tighter text-white">{value}</span>
    </div>
  );
}

