import React, { useState, useEffect } from 'react';
import Square from './Square';

const Board = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const handleClick = (i) => {
    if (calculateWinner(squares) || squares[i] || !xIsNext) {
      return;
    }
    const newSquares = squares.slice();
    newSquares[i] = 'X';
    setSquares(newSquares);
    setXIsNext(false);
  };

  useEffect(() => {
    if (!xIsNext && !calculateWinner(squares) && squares.some(s => s === null)) {
      const bestMove = findBestMove(squares);
      if (bestMove !== null) {
        const newSquares = squares.slice();
        newSquares[bestMove] = 'O';
        setTimeout(() => {
            setSquares(newSquares);
            setXIsNext(true);
        }, 500); // Delay for realism
      }
    }
  }, [xIsNext, squares]);

  const renderSquare = (i) => {
    return <Square value={squares[i]} onClick={() => handleClick(i)} />;
  };

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (squares.every(Boolean)) {
    status = 'Draw';
  } else {
    status = (xIsNext ? 'Your turn (X)' : 'Computer is thinking... (O)');
  }

  const handleReset = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="reset-button" onClick={handleReset}>Reset</button>
    </div>
  );
};

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const minimax = (newSquares, player, depth) => {
    const availSpots = newSquares.map((s, i) => s === null ? i : null).filter(s => s !== null);

    const winner = calculateWinner(newSquares);
    if (winner === 'X') return { score: depth - 10 };
    if (winner === 'O') return { score: 10 - depth };
    if (availSpots.length === 0) return { score: 0 };

    const moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        const move = {};
        move.index = availSpots[i];
        newSquares[availSpots[i]] = player;

        if (player === 'O') {
            const result = minimax(newSquares, 'X', depth + 1);
            move.score = result.score;
        } else {
            const result = minimax(newSquares, 'O', depth + 1);
            move.score = result.score;
        }

        newSquares[availSpots[i]] = null; // Reset the spot
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

const findBestMove = (squares) => {
    const bestMove = minimax(squares.slice(), 'O', 0);
    return bestMove.index;
}

export default Board;
