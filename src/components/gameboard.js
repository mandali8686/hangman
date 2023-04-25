import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Gameboard.css";

const Gameboard = ({ maxGuesses, onGameOver }) => {
const [word, setWord] = useState(() => window.localStorage.getItem("hangman-word") || "");
  
  const [guesses, setGuesses] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [remainingGuesses, setRemainingGuesses] = useState(maxGuesses);
  const [showAnswer, setShowAnswer] = useState(true);

  useEffect(() => {
    if (!word) {
      fetch("https://random-word-api.herokuapp.com/word?number=1")
        .then((response) => response.json())
        .then((data) => setWord(data[0].toLowerCase()))
        .catch((error) => console.log(error));
    }
  }, [word]);

  useEffect(() => {
    window.localStorage.setItem("hangman-word", word);
  }, [word]);


  const handleGuess = (event) => {
    const guess = event.target.value.toLowerCase();

    if (!guesses.includes(guess)) {
      setGuesses([...guesses, guess]);

      if (!word.includes(guess)) {
        setRemainingGuesses(remainingGuesses - 1);
      }
    }

    if (remainingGuesses === 1 || word.split("").every((letter) => guesses.includes(letter))) {
      setGameOver(true);
      setShowAnswer(false);
      onGameOver(word.split("").every((letter) => guesses.includes(letter)));
    } else if (remainingGuesses === 0 && !gameOver) {
      setShowAnswer(false);
    }
  };


  const handleShowAnswer = () => {
    setShowAnswer(false);
    setGameOver(true);
    onGameOver(false);
    if (remainingGuesses === 0) {
        setRemainingGuesses(1);}
  };

  const handleReset = () => {
    setWord("");
    setGuesses([]);
    setGameOver(false);
    setRemainingGuesses(maxGuesses);
    //setShowAnswer(true);
    onGameOver(false);
  };

  const renderWord = () => {
    return word
      .split("")
      .map((letter) =>
        guesses.includes(letter) || showAnswer ? (
          <span className="Gameboard-letter">{letter}</span>
        ) : (
          <span className="Gameboard-letter">_</span>
        )
      );
  };

  return (
    <div className="Gameboard">
      <div className="Gameboard-word">{renderWord()}</div>
      <div className="Gameboard-guesses">
        {gameOver ? (
          <>
            <p>The word was "{word}".</p>
            <button onClick={handleReset}>Play Again</button>
          </>
        ) : (
          <>
            <p>Guesses left: {remainingGuesses}</p>
            <div className="Gameboard-buttons">
              {Array.from({ length: 26 }, (_, index) => String.fromCharCode(97 + index)).map((letter) => (
                <button key={letter} value={letter} onClick={handleGuess} disabled={guesses.includes(letter) || gameOver}>
                  {letter}
                </button>
              ))}
            </div>
            { (
              <button className="show-answer" onClick={handleShowAnswer}>Show Answer</button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

Gameboard.propTypes = {
  word: PropTypes.string.isRequired,
  maxGuesses: PropTypes.number.isRequired,
  onGameOver: PropTypes.func.isRequired,
};

export default Gameboard;
