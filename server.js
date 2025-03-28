const express = require('express');
const path = require('path');
const app = express();
const port = 3002;

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'my-app/build')));

// API routes can be defined here
app.get('/api', (req, res) => {
  res.json({ message: 'API is working!' });
});

// For any other request, send back the React app's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'my-app/build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
