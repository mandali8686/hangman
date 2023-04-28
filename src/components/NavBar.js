import React, {useState} from 'react';
import './NavBar.css'

const NavBar = ({ navigateToGameBoard, navigateToLeaderBoard, navigateToChallenge, navigateToHome }) => {
    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => setShowModal(!showModal);
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
            <div className="navbar-brand text-center">Hangman Game</div>
            <div className="d-flex align-items-center">
                <button className="btn btn-menu btn-lg" onClick={navigateToGameBoard}>
                    New Game
                </button>
                <button className="btn btn-menu btn-lg" onClick={navigateToLeaderBoard}>
                    Leaderboard
                </button>
                <button className="btn btn-menu btn-lg" onClick={navigateToChallenge}>
                    Challenge
                </button>
                <button className="btn btn-menu btn-lg" onClick={navigateToHome}>
                    <i className="fa fa-bars"></i>
                </button>
                <button onClick={toggleModal}>?</button>
                {showModal && (
                    <div className="info-modal">
                    <div className="info-modal-content">
                        <h2>Scoring Information</h2>
                        <p>Here is some information about how scoring works in this Hangman game:</p>
                        <li>
                            Every correct guess will earn +10 points.
                        </li>
                        <li>
                            Every incorrect guess will earn -10 points (score is atleast zero)
                        </li>
                        <li>
                            Bonus 10 points for every guess saved. 
                        </li>
                        <button onClick={toggleModal}>Close</button>
                    </div>
                    </div>
                )}
            </div>
        </div>
    </nav>
  );
};  

export default NavBar;
