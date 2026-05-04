import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, ListMusic } from 'lucide-react';
import { DUMMY_SONGS } from '../constants';

interface MusicPlayerProps {
  currentSongIndex: number;
  onSongChange: (index: number) => void;
}

export default function MusicPlayer({ currentSongIndex, onSongChange }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentSong = DUMMY_SONGS[currentSongIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentSongIndex]);

  useEffect(() => {
     if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const handleNext = () => { onSongChange((currentSongIndex + 1) % DUMMY_SONGS.length); setIsPlaying(true); };
  const handlePrev = () => { onSongChange((currentSongIndex - 1 + DUMMY_SONGS.length) % DUMMY_SONGS.length); setIsPlaying(true); };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && audioRef.current.duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;
      audioRef.current.currentTime = (x / width) * audioRef.current.duration;
    }
  };

  return (
    <footer className="h-24 bg-[#0c0c0e] border-t border-white/10 px-8 flex items-center shrink-0 relative z-20 overflow-hidden">
      <audio ref={audioRef} src={currentSong.url} onTimeUpdate={handleTimeUpdate} onEnded={handleNext} />

      {/* Now Playing Mini */}
      <div className="w-64 flex items-center gap-4">
        <div className="w-14 h-14 rounded-lg overflow-hidden border border-white/10 shrink-0 shadow-lg">
          <img src={currentSong.cover} alt={currentSong.title} className="w-full h-full object-cover" />
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-bold text-white truncate uppercase tracking-wide">{currentSong.title}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest truncate">{currentSong.artist}</p>
        </div>
      </div>

      {/* Main Player Controls */}
      <div className="flex-1 flex flex-col items-center gap-2">
        <div className="flex items-center gap-8">
          <button onClick={handlePrev} className="text-slate-500 hover:text-white transition-colors">
            <SkipBack size={20} fill="currentColor" />
          </button>
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all"
          >
            {isPlaying ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" className="ml-1" />}
          </button>
          <button onClick={handleNext} className="text-slate-500 hover:text-white transition-colors">
            <SkipForward size={20} fill="currentColor" />
          </button>
        </div>
        <div className="w-full max-w-xl flex items-center gap-3">
          <span className="text-[10px] font-mono text-slate-500 w-8">{formatTime(audioRef.current?.currentTime || 0)}</span>
          <div className="flex-1 h-1 bg-white/10 rounded-full cursor-pointer relative" onClick={handleProgressClick}>
            <motion.div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
            <motion.div 
              className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_8px_white]"
              style={{ left: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-slate-500 w-8">{formatTime(audioRef.current?.duration || 0)}</span>
        </div>
      </div>

      {/* Right Side Tools */}
      <div className="w-64 flex justify-end items-center gap-6">
        <div className="flex items-center gap-3 text-slate-500">
          <Volume2 size={16} />
          <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer relative" onClick={(e) => {
             const rect = e.currentTarget.getBoundingClientRect();
             setVolume(((e.clientX - rect.left) / rect.width) * 100);
          }}>
            <div className="h-full bg-slate-400 rounded-full transition-all" style={{ width: `${volume}%` }} />
          </div>
        </div>
        <button className="text-cyan-500 hover:text-cyan-400">
           <ListMusic size={20} />
        </button>
      </div>
    </footer>
  );
}

function formatTime(seconds: number) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
