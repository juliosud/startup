const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const app = express();
const authCookieName = 'token';

// The service port
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// Store users
let users = [];
let meals = [];

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// Router for service endpoints
const apiRouter = express.Router();
app.use('/api', apiRouter);

// ________________________________MIDDLEWARE___________________________________

// Middleware to verify that the user is authorized to call an endpoint
const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};


// ________________________________END POINTS___________________________________

//USER ENDPOINTS

// Register a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await findUser('email', req.body.email)) {
    res.status(409).send({ msg: 'User already exists' });
  } else {
    const user = await createUser(req.body.email, req.body.password);
    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  }
});

// Login user
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

// Logout user
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    delete user.token;
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});


//MEAL ENDPOINTS

// Get all meals
apiRouter.get('/meals', verifyAuth, (req, res) => {
  const userMeals = meals.filter(meal => meal.userId === req.cookies[authCookieName]);
  res.send(userMeals);
});

// Add meal
apiRouter.post('/meals', verifyAuth, (req, res) => {
  const meal = {
    id: uuid.v4(),
    userId: req.cookies[authCookieName], 
    food: req.body.food,
    calories: req.body.calories,
    protein: req.body.protein,
    carbs: req.body.carbs,
    fat: req.body.fat,
    date: new Date().toISOString()
  };
  meals.push(meal);
  res.send(meal);
});

// Edit meal
apiRouter.put('/meals/:id', verifyAuth, (req, res) => {
  const meal = meals.find(m => m.id === req.params.id && m.userId === req.cookies[authCookieName]);
  if (!meal) {
    return res.status(404).send({ msg: 'Meal not found' });
  }
  meal.food = req.body.food || meal.food;
  meal.calories = req.body.calories || meal.calories;
  meal.protein = req.body.protein || meal.protein;
  meal.carbs = req.body.carbs || meal.carbs;
  meal.fat = req.body.fat || meal.fat;
  res.send(meal);
});

// Delete meal
apiRouter.delete('/meals/:id', verifyAuth, (req, res) => {
  const index = meals.findIndex(m => m.id === req.params.id && m.userId === req.cookies[authCookieName]);
  if (index === -1) {
    return res.status(404).send({ msg: 'Meal not found' });
  }
  meals.splice(index, 1);
  res.status(204).end();
});






// get user profile
apiRouter.get('/profile', verifyAuth, (req, res) => {
    const user = users.find(u => u.token === req.cookies[authCookieName]);
        if (!user) {
      return res.status(401).send({ msg: 'Unauthorized' });
    }
    res.send({ email: user.email });
  });
  

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).send({ type: err.name, message: err.message });
});

// Serve index.html for unknown routes
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});



//___________________________HELPER FUNCTIONS_____________________________________

// create user
async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { email, password: passwordHash, token: uuid.v4() };
  users.push(user);
  return user;
}

//get user
async function findUser(field, value) {
  if (!value) return null;
  return users.find((u) => u[field] === value);
}

// Set the auth cookie
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
