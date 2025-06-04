const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// In-memory high score
let highScore = 0;

app.use(express.json());

// API endpoint to get high score
app.get('/api/highscore', (req, res) => {
  res.json({ highScore });
});

// API endpoint to set high score
app.post('/api/highscore', (req, res) => {
  const { score } = req.body;
  if (typeof score === 'number' && score > highScore) {
    highScore = score;
  }
  res.json({ highScore });
});

// Serve static files from the React app
const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientBuildPath));

// All remaining requests return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
