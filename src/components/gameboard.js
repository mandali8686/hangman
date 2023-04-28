import React, { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom'
import UsernameForm from "./UsernameForm";
import PropTypes from "prop-types";
import "./Gameboard.css";
import {db} from '../base';
import {collection, addDoc} from 'firebase/firestore'
import NavBar from "./NavBar";
import { decode } from "base-64";

const Gameboard = ({ maxGuesses, onGameOver }) => {
  const [word, setWord] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [correctGuesses, setCorrectGuesses] = useState([]);
  const [incorrectGuesses, setInCorrectGuesses] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState(false); // initially game is not won
  const [isComplete, setIsComplete] = useState(false);
  const [remainingGuesses, setRemainingGuesses] = useState(maxGuesses);
  const [username,  setUsername] = useState("");
  const [gameStatus, setGameStatus] = useState("NotStarted");
  const [fromUrl, setFromUrl] = useState(false);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  const [hangmanImages, setHangmanImages] = useState([  "/images/0.jpg",  "/images/1.jpg",  "/images/2.jpg",  "/images/3.jpg",  "/images/4.jpg",  "/images/5.jpg",  "/images/6.jpg",]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const url_word = urlParams.get('word');
    if (url_word) {
      setWord(decode(url_word).toLowerCase());
      setFromUrl(true);
    }
    else if (!word) {
      fetch("https://random-word-api.herokuapp.com/word?number=1")
        .then((response) => response.json())
        .then((data) => setWord(data[0].toLowerCase()))
        .catch((error) => console.log(error));
    }

    if(remainingGuesses === 0) {
      setGameResult(false);
      setGameOver(true);
    }
    else if(remainingGuesses >= 1 && isComplete) {
      setGameResult(true);
      setScore(score + remainingGuesses * 10);
    }
  }, [guesses, isComplete]);

  useEffect(() => {

  }, [])

  const handleGuess = (event) => {
    const guess = event.target.value.toLowerCase();
    const button = event.target;

    if (!guess) {
      return;
    }

    let updatedGuesses = guesses;
    let updatedCorrectGuesses = correctGuesses;
    let updatedIncorrectGuesses = incorrectGuesses;
    let updatedRemainingGuesses = remainingGuesses;
    // let updatedHangmanImages = hangmanImages;

    if (!guesses.includes(guess)) {
      updatedGuesses = [...updatedGuesses, guess];
      setGuesses(updatedGuesses);

      if (!word.includes(guess)) {
        updatedIncorrectGuesses = [...updatedIncorrectGuesses, guess];
        updatedRemainingGuesses = updatedRemainingGuesses - 1;
        setInCorrectGuesses(updatedIncorrectGuesses);
        setRemainingGuesses(updatedRemainingGuesses);
        score - 10 < 0 ? setScore(0) : setScore(score-10);
      }
      else {
        updatedCorrectGuesses = [...updatedCorrectGuesses, guess];
        setCorrectGuesses(updatedCorrectGuesses);
        setScore(score + 10);
      }
    }

    // checkWordComplete();
    let isComplete = word.split("").every((letter) => updatedCorrectGuesses.includes(letter));

    if(updatedRemainingGuesses === 0 && !isComplete) {
      setGameOver(true);
      return;
    }

    if(updatedRemainingGuesses >= 1 && isComplete) {
      setIsComplete(true);
      return;
    }

    button.classList.add("disabled");
  };

  const handleReset = () => {
    setWord("");
    setGuesses([]);
    setCorrectGuesses([]);
    setInCorrectGuesses([]);
    setGameOver(false);
    setGameResult(false);
    setIsComplete(false);
    setRemainingGuesses(maxGuesses);
    onGameOver(false);
    const buttons = document.querySelectorAll("button");
    buttons.forEach((button) => {
      button.classList.remove("disabled"); // re-enable the buttons
    });
    if (fromUrl) {
      navigate("/gameboard");
      window.location.reload();
    }
  };

  const renderWord = () => {
    return word.split("").map((letter, index) => (
      <div key={index} className="Gameboard-letter-box">
        {guesses.includes(letter) ? (
          <span className="Gameboard-letter">{letter}</span>
        ) : (
          <span className="Gameboard-letter">_</span>
        )}
      </div>
    ));
  };

  const handleUsernameSubmit = async () => {
    if (username.trim() === "") {
      alert("Please enter a valid username");
      return;
    }
    
    await addDoc(collection(db, "users"), {
      name: username,
      score: score
    });

    navigate("/leaderboard");
  };

  return (
    <>
      <div className="GameBoard-Container">
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <NavBar 
          navigateToGameBoard={() => {navigate("/gameboard")}}
          navigateToLeaderBoard={() => {navigate("/leaderboard")}}
          navigateToChallenge={() => {navigate("/challenge")}}
          navigateToHome={() => {navigate("/")}}/>
          <div className="GameBoardInfo d-flex justify-content-center align-items-center">
            <div className="d-flex flex-grow-1 justify-content-center">
              <span className="px-3 gameboard-info-box" style={{color: "darkgray", marginRight: "10px"}}>Chances left: {remainingGuesses}</span>
              <span className="px-3 gameboard-info-box" style={{color: "darkgray"}}>Score: {score}</span>
            </div>
          </div>
          <div className="Gameboard">
            <div className="Hangman">
              <img src={hangmanImages[6 - remainingGuesses]} alt="Hangman" style={{backgroundColor: "black", borderRadius: "10px"}}/>
            </div>
            <div className="Gameboard-word">{renderWord()}</div>
            <div className="Gameboard-guesses">
              {gameOver ? (
                <>
                  <p>Game Lost !!!!!!</p>
                  <p>The word was "{word}".</p>
                  <p>Score: {score}</p>
                  <button className="btn btn-primary" onClick={handleReset}>Try Again</button>
                </>
              ) : (
                <>
                  <div className="Gameboard-buttons">
                    {Array.from({ length: 26 }, (_, index) => String.fromCharCode(97 + index)).map((letter) => (
                      <button key={letter} value={letter} onClick={handleGuess} disabled={guesses.includes(letter)}>
                        {letter}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            {gameResult && 
              <div className="popup">
                <div className="popup-content">
                  <h2>Congratulations!</h2>
                  <p>You have guessed the word "{word}".</p>
                  <p>Score: {score}</p>
                  <span>
                    <input 
                      type="text" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      placeholder="Enter Name for leaderboard" 
                      className="username-input" // Add a class name for styling
                    />
                    <button onClick={handleUsernameSubmit} className="submit-btn">Save Score</button>
                  </span>
                  {fromUrl ?
                    <button className="btn btn-primary" onClick={handleReset}>Play New Game</button>
                    :                
                    <button className="btn btn-primary" onClick={handleReset}>Play Again</button>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
};

Gameboard.propTypes = {
  maxGuesses: PropTypes.number.isRequired,
  onGameOver: PropTypes.func.isRequired,
};

export default Gameboard;
