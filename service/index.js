const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());

// Serve static frontend files (React build will be placed in ../public)
app.use(express.static(path.join(__dirname, '../public')));

// Default test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Startup backend is running!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
