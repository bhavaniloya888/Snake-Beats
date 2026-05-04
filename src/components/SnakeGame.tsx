import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Play } from 'lucide-react';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onScoreUpdate: (score: number) => void;
  accentColor: string;
}

export default function SnakeGame({ onScoreUpdate, accentColor }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextDirection = useRef<Point>(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    nextDirection.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    onScoreUpdate(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'w':
        case 'ArrowUp':
          if (direction.y === 0) nextDirection.current = { x: 0, y: -1 };
          break;
        case 's':
        case 'ArrowDown':
          if (direction.y === 0) nextDirection.current = { x: 0, y: 1 };
          break;
        case 'a':
        case 'ArrowLeft':
          if (direction.x === 0) nextDirection.current = { x: -1, y: 0 };
          break;
        case 'd':
        case 'ArrowRight':
          if (direction.x === 0) nextDirection.current = { x: 1, y: 0 };
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: (head.x + nextDirection.current.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + nextDirection.current.y + GRID_SIZE) % GRID_SIZE,
        };

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreUpdate(newScore);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        setDirection(nextDirection.current);
        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [food, score, isGameOver, isPaused, generateFood, onScoreUpdate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;

    ctx.fillStyle = '#070708';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * size, 0); ctx.lineTo(i * size, canvas.height); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * size); ctx.lineTo(canvas.width, i * size); ctx.stroke();
    }

    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#22d3ee' : `rgba(34, 211, 238, ${0.8 - (index / snake.length) * 0.6})`;
      
      if (isHead) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#22d3ee';
      } else {
          ctx.shadowBlur = 0;
      }
      
      const x = segment.x * size + 1;
      const y = segment.y * size + 1;
      const r = size - 2;
      
      ctx.beginPath();
      ctx.roundRect(x, y, r, r, 2);
      ctx.fill();
    });

    ctx.fillStyle = '#f472b6';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#f472b6';
    const fx = food.x * size + size/2;
    const fy = food.y * size + size/2;
    ctx.beginPath();
    ctx.arc(fx, fy, size/3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="relative border border-white/5 bg-black/40 shadow-2xl rounded-sm overflow-hidden aspect-square">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="w-full h-full"
        />
        
        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20"
            >
              {isGameOver ? (
                <div className="text-center">
                  <h2 className="text-4xl font-black text-white italic tracking-tighter mb-4 uppercase">Crashed</h2>
                  <button
                    onClick={resetGame}
                    className="px-8 py-3 bg-cyan-500 text-black font-bold uppercase tracking-widest text-sm hover:bg-cyan-400 transition-all flex items-center gap-2 mx-auto"
                  >
                    <RotateCcw size={16} />
                    Restart Engine
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <h2 className="text-4xl font-black text-white italic tracking-tighter mb-8 uppercase">Paused</h2>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="px-8 py-3 bg-cyan-500 text-black font-bold uppercase tracking-widest text-sm hover:bg-cyan-400 transition-all flex items-center gap-2 mx-auto"
                  >
                    <Play size={16} fill="currentColor" />
                    Resume
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}
