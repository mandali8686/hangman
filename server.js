// server.js
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

// Your database connection and query logic here
const getLeaderboardData = async () => {
  // Fetch leaderboard data from your database
};

app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboardData = await getLeaderboardData();
    res.json(leaderboardData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the leaderboard data' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
