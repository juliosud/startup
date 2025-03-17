const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const app = express();
const authCookieName = 'token';

// The service port
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// Store users (temporary in-memory storage, can later use a database)
let users = [];

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public')); // Serve frontend files

// Router for service endpoints
const apiRouter = express.Router();
app.use('/api', apiRouter);

// 🔹 Register a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await findUser('email', req.body.email)) {
    res.status(409).send({ msg: 'User already exists' });
  } else {
    const user = await createUser(req.body.email, req.body.password);
    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  }
});

// 🔹 Login user
apiRouter.post('/auth/login', async (req, res) => {
  const user = await findUser('email', req.body.email);
  if (user && await bcrypt.compare(req.body.password, user.password)) {
    user.token = uuid.v4();
    setAuthCookie(res, user.token);
    res.send({ email: user.email });
    return;
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// 🔹 Logout user
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    delete user.token;
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// 🔹 Middleware to protect routes
const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

// 🔹 Example of a protected route (Fetch user profile)
apiRouter.get('/profile', verifyAuth, (req, res) => {
  const user = users.find(u => u.token === req.cookies[authCookieName]);
  res.send({ email: user.email });
});

// 🔹 Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).send({ type: err.name, message: err.message });
});

// 🔹 Serve index.html for unknown routes
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Helper functions
async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { email, password: passwordHash, token: uuid.v4() };
  users.push(user);
  return user;
}

async function findUser(field, value) {
  if (!value) return null;
  return users.find((u) => u[field] === value);
}

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
