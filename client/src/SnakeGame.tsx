import { useState, useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 8, y: 10 },
  { x: 9, y: 10 },
];
const INITIAL_DIRECTION: Point = { x: 1, y: 0 };

function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef<() => void>(() => {});

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current && savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [isRunning, setIsRunning] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    fetch('/api/highscore')
      .then((res) => res.json())
      .then((data) => setHighScore(data.highScore))
      .catch(() => {});

    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [direction]);

  useInterval(
    () => {
      if (!isRunning) return;
      setSnake((prev) => {
        const head = prev[prev.length - 1];
        const newHead = {
          x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
        };
        const newSnake = [...prev.slice(1), newHead];

        // check collision with itself
        if (newSnake.some((p) => p.x === newHead.x && p.y === newHead.y && p !== newHead)) {
          setIsRunning(false);
          return prev;
        }

        // check food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 1);
          newSnake.unshift(prev[0]);
          setFood({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
          });
        }

        return newSnake;
      });
    },
    200,
  );

  useEffect(() => {
    if (!isRunning) {
      fetch('/api/highscore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score }),
      })
        .then((res) => res.json())
        .then((data) => setHighScore(data.highScore))
        .catch(() => {});
    }
  }, [isRunning, score]);

  return (
    <div className="game-container">
      <h1>Snake Game</h1>
      <p>Score: {score}</p>
      <p>High Score: {highScore}</p>
      {!isRunning && <p>Game Over! Refresh to play again.</p>}
      <div
        className="grid"
        style={{
          display: 'grid',
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
          const x = idx % GRID_SIZE;
          const y = Math.floor(idx / GRID_SIZE);
          const isSnake = snake.some((p) => p.x === x && p.y === y);
          const isFood = food.x === x && food.y === y;
          const background = isSnake
            ? `hsl(${(x + y) * 10}, 70%, 50%)`
            : isFood
            ? 'red'
            : 'lightgray';
          return <div key={idx} style={{ width: 20, height: 20, background }} />;
        })}
      </div>
    </div>
  );
}

export default SnakeGame;
