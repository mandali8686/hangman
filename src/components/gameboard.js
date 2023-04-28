import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Gameboard.css";
import hangmanImage from "./hangman.jpeg";

const Gameboard = ({ maxGuesses, onGameOver }) => {
const [word, setWord] = useState(() => window.localStorage.getItem("hangman-word") || "");
  
  const [guesses, setGuesses] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [remainingGuesses, setRemainingGuesses] = useState(maxGuesses);
  const [showAnswer, setShowAnswer] = useState(false);
  const [hangmanDrawing, setHangmanDrawing] = useState(null);

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
        setRemainingGuesses((prevRemainingGuesses) => prevRemainingGuesses - 1);
      }
    }
  
    if (
      remainingGuesses <= 1 ||
      word.split("").every((letter) => guesses.includes(letter))
    ) {
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

  useEffect(() => {
  const renderHangman = () => {
    const incorrectGuesses = guesses.filter((guess) => !word.includes(guess)).length;
  
    return (
      <svg height="10" width="10">
        {/* Base */}
{incorrectGuesses > 0 && <line className="hangman-part" x1="20" y1="230" x2="180" y2="230" strokeWidth="5" />}
{/* Vertical beam */}
{incorrectGuesses > 1 && <line className="hangman-part" x1="40" y1="230" x2="40" y2="30" strokeWidth="5" />}
{/* Horizontal beam */}
{incorrectGuesses > 2 && <line className="hangman-part" x1="40" y1="30" x2="120" y2="30" strokeWidth="5" />}
{/* Rope */}
{incorrectGuesses > 3 && <line className="hangman-part" x1="120" y1="30" x2="120" y2="70" strokeWidth="3" />}
{/* Head */}
{incorrectGuesses > 4 && <circle className="hangman-part" cx="120" cy="85" r="15" strokeWidth="3" stroke="black" fill="none" />}
{/* Body */}
{incorrectGuesses > 5 && <line className="hangman-part" x1="120" y1="100" x2="120" y2="160" strokeWidth="3" />}
{/* Left arm */}
{incorrectGuesses > 6 && <line className="hangman-part" x1="120" y1="120" x2="100" y2="140" strokeWidth="3" />}
{/* Right arm */}
{incorrectGuesses > 7 && <line className="hangman-part" x1="120" y1="120" x2="140" y2="140" strokeWidth="3" />}
{/* Left leg */}
{incorrectGuesses > 8 && <line className="hangman-part" x1="120" y1="160" x2="100" y2="190" strokeWidth="3" />}
{/* Right leg */}
{incorrectGuesses > 9 && <line className="hangman-part" x1="120" y1="160" x2="140" y2="190" strokeWidth="3" />}

      </svg>
    );
  };
  setHangmanDrawing(renderHangman());
}, [guesses, word, gameOver, remainingGuesses]);
  

  return (
    <div className="Gameboard">
    <div className="Gameboard-hangman">{hangmanDrawing}{gameOver && remainingGuesses === 0 && (
        <img src={hangmanImage} width="250" height="250" alt="Hangman" />
      )}</div>
      <div className="Gameboard-word">{renderWord()}</div>
      <div className="Gameboard-guesses">
        {gameOver ? (
          <>
            <p>The word was "{word}".</p>
            <button className="show-answer" onClick={handleReset}>Play Again</button>
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
