import React, { useState, useEffect } from 'react';
import { db } from '../base';
import { collection, query, getDocs } from 'firebase/firestore';
import {useNavigate} from 'react-router-dom'
import NavBar from './NavBar';
import "./Gameboard.css"

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const navigate = useNavigate();

  const fetchLeaderBoard = async () => {
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);

    let currentLeaderBoard = leaderboard
    querySnapshot.forEach((doc) => {
      currentLeaderBoard = [...currentLeaderBoard, doc.data()];
    });

    setLeaderboard(currentLeaderBoard);

  }
  useEffect(() => {
    fetchLeaderBoard();
  }, []);

  return (
    <>
      <div className="GameBoard-Container">
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <NavBar 
            navigateToGameBoard={() => {navigate("/gameboard")}}
            navigateToLeaderBoard={() => {navigate("/leaderboard")}}
            navigateToChallenge={() => {navigate("/challenge")}}
            navigateToHome={() => {navigate("/")}}/>
          <div className="Gameboard">
            <h2>Leaderboard</h2>
            <table style={{borderCollapse: "separate", borderSpacing: "10px"}}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player Name</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard
                .sort((a,b) => {
                  return a.score < b.score;
                })
                .map((player, index) => (
                  <tr key={player.name}>
                    <td>{index + 1}</td>
                    <td>{player.name}</td>
                    <td>{player.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
