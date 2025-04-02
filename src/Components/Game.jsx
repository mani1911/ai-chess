import React, { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { getNextMove } from '../Helpers/Ai';

const Game = () => {
  const [game, setGame] = useState(new Chess());
  const [boardState, setBoardState] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  
  const [selectedSquare, setSelectedSquare] = useState('');

  async function waitSeconds(sec) {
    return new Promise(resolve => {
      setTimeout(resolve, sec * 1000); 
    });
  }
  
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
  
  async function playAI () {
    try {
      do {
        await waitSeconds(3);
        const res = await getNextMove(getBoardState(game));

        if(res === null) {await waitSeconds(10); continue;}
        var s1 = res.substr(0, 2);
        var s2 = res.substr(3, 2);
      } while(!makeAMove(s1, s2));


      // console.log(`${s1}, ${s2}`)
      // while(!makeAMove(s1, s2)) makeAMove(s1, s2);

      // console.log(game.turn())
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    setBoardState(getBoardState(game));
    
    if(game.turn() === 'b') {
      console.log("black tuen")
      playAI();
    } else {
      console.log("white turn")
    }
  }, [game]);
  
  function makeAMove(from, to) {
    try {
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

    catch (e) {
      console.log(e);
    }

    return false;

  }

  function onSquareClick(square) {

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
    window.location.reload();
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

  return (
    <div className="flex flex-col items-center mt-8">
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
    </div>
  );
};

export default Game;