import React from 'react';
import GameBoard from './components/gameboard';

function App() {
  window.localStorage.removeItem("hangman-word");
  return (
    <div className="App">
      <h1>Hangman Game</h1>
      <GameBoard word="react" maxGuesses={6} onGameOver={(win) => console.log(win)} />
    </div>
  );
}

export default App;
