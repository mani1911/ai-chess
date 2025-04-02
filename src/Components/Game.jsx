import React, { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

const Game = () => {
  const [game, setGame] = useState(new Chess());
  const [boardState, setBoardState] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  

  const [selectedSquare, setSelectedSquare] = useState('');
  
  const getBoardState = (chessInstance) => {
    const board = [];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    
    for (let i = 0; i < 8; i++) {
      const row = [];
      for (let j = 0; j < 8; j++) {
        const square = files[j] + ranks[i];
        const piece = chessInstance.get(square);
        row.push({
          square,
          piece: piece ? {
            type: piece.type,
            color: piece.color
          } : null
        });
      }
      board.push(row);
    }
    
    return board;
  };
  
  useEffect(() => {
    setBoardState(getBoardState(game));
  }, [game]);
  
  function makeAMove(from, to) {
    const gameCopy = new Chess(game.fen());
  
    const result = gameCopy.move({
      from,
      to,
      promotion: 'q',
    });
    
  
    if (result === null) return false;
    
    
    setGame(gameCopy);
    
    if (gameCopy.isGameOver()) {
      setGameOver(true);
      if (gameCopy.isCheckmate()) {
        alert(`Checkmate! ${gameCopy.turn() === 'w' ? 'Black' : 'White'} wins!`);
      } else if (gameCopy.isDraw()) {
        alert("Draw!");
      }
    }
    
    return true;
  }

  function onSquareClick(square) {

    console.log(boardState)

    const piece = game.get(square);
    
    if (!selectedSquare) {

      if (piece && piece.color === (game.turn() === 'w' ? 'w' : 'b')) {
        setSelectedSquare(square);
      }
    } 
    
    else {
   
      if (square === selectedSquare) {
        setSelectedSquare('');
      } 
      
      else {
        const moveSuccess = makeAMove(selectedSquare, square);
        
        setSelectedSquare('');
        
        
        if (!moveSuccess) {
          // Optional: Add some visual feedback for invalid moves
        }
      }
    }
  }
  
  function resetGame() {
    const newGame = new Chess();
    setGame(newGame);
    setBoardState(getBoardState(newGame));
    setGameOver(false);
    setSelectedSquare('');
  }
  
  const customSquareStyles = {};

  if (selectedSquare) {
    customSquareStyles[selectedSquare] = {
      background: 'rgba(255, 255, 0, 0.4)',
    };
    

    const moves = game.moves({
      square: selectedSquare,
      verbose: true
    });
    
    moves.forEach((move) => {
      customSquareStyles[move.to] = {
        background: 'rgba(0, 255, 0, 0.2)',
        borderRadius: '50%',
      };
    });
  }
  

  const renderBoardState = () => {
    return (
      <div className="mt-6 p-4 bg-gray-100 rounded overflow-auto max-h-64 w-full">
        <h3 className="font-bold mb-2">Current Board State:</h3>
        <pre className="text-xs">
          {JSON.stringify(boardState, null, 2)}
        </pre>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col items-center mt-8">
      <h1 className="text-2xl font-bold mb-4">React Chess Game</h1>
      
      <div className="w-96 h-96">
        <Chessboard 
          position={game.fen()}
          onSquareClick={onSquareClick}
          boardWidth={384}
          customSquareStyles={customSquareStyles}
          customBoardStyle={{
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
          }}
        />
      </div>
      
      <div className="mt-4 flex gap-4">
        <button 
          onClick={resetGame}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reset Game
        </button>
        
        <div className="px-4 py-2 bg-gray-100 rounded">
          Turn: {game.turn() === 'w' ? 'White' : 'Black'}
        </div>
        
        {gameOver && (
          <div className="px-4 py-2 bg-red-100 text-red-700 rounded">
            Game Over
          </div>
        )}
      </div>
      
      {renderBoardState()}
    </div>
  );
};

export default Game;