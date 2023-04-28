import React, {useState} from 'react';
import { encode } from 'base-64';
import "./Gameboard.css";
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';

const CustomWord = () => {
    const [word, setWord] = useState(''); // State variable to store the custom word
    const [url, setUrl] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();
    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopyLinkClick = () => {
        navigator.clipboard.writeText(url);
        setCopySuccess(true);
    };

    const handleClosePopupClick = () => {
        setShowPopup(false);
        setWord("");
        setCopySuccess(false);
        setUrl("");
    };

    // Function to handle custom word submission
    const handleCustomWordSubmit = () => {
        // Generate a unique URL with the custom word as a parameter
        setUrl(`${window.location.origin}/gameboard?word=${encodeURIComponent(encode(word))}`)
        // Display the URL to the user
        // alert(`Share this link with someone else to play your word: ${url}`);
        setShowPopup(true);
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
                    <div className="Challengeboard">
                        <p>Challenge your friends by sending them puzzled words!!!</p>
                        <input className='challenge-input' type="text" value={word} onChange={(e) => setWord(e.target.value)} placeholder="Enter a custom word"
                            style={{marginBottom: "10px"}}
                        />
                        <button className='challenge-submit' onClick={handleCustomWordSubmit}>Submit</button>
                        {showPopup && (
                            <div className="popup">
                                <div className="popup-content">
                                    <button className="popup-close-btn" onClick={handleClosePopupClick}>X</button>
                                    <div className="popup-header">
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <h2>Copy this link and share it with your friends!</h2>
                                        </div>
                                    </div>
                                    <input type="text" value={url} readOnly/>
                                    <div className="copy-link-container">
                                        <button className="copy-link-btn" onClick={handleCopyLinkClick}>
                                            {copySuccess ? "Copied!" : "Copy Link"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CustomWord;