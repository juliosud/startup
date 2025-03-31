const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const app = express();
const authCookieName = 'token';
const { spawn } = require('child_process');
const db = require('./database');

// The service port
const port = process.argv.length > 2 ? process.argv[2] : 4000;

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
    req.user = user;
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};
//________________________________OPEN AI_________________________________

// chatbot
apiRouter.post('/chat', verifyAuth, async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage || typeof userMessage !== "string") {
    return res.status(400).json({ error: "Invalid message input" });
  }
  const userId = req.user.email;

  await db.addConversationMessage(userId, "user", userMessage);

  let conversation = await db.getConversationHistory(userId);
  if (conversation.length === 0) {
    await db.addConversationMessage(userId, "system", 
      "You are a food-focused assistant, limited to food, recipes, and nutritional topics. "
      + "Provide five recipe ideas with a title, a brief description, and estimated caloric value per serving. "
      + "List ingredients and provide step-by-step instructions when a recipe is chosen. "
      + "Only provide a shopping list if the user requests it. If a user mentions a dish they ate, "
      + "estimate its nutritional breakdown (Calories, Carbs, Protein, Fat). "
      + "If asked about non-food topics, respond: 'I'm sorry, I can only assist with food-related topics.'"
    );
    conversation = await db.getConversationHistory(userId);
  }

  const conversationForPython = conversation.map(msg => ({
    role: msg.role,
    content: msg.content
  }));
  const conversationString = JSON.stringify(conversationForPython);

  const pythonProcess = spawn('python3', ['chatbot.py', conversationString]);

  let responseText = "";
  pythonProcess.stdout.on('data', (data) => {
    responseText += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python Error: ${data}`);
  });

  pythonProcess.on('close', async (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: "AI response failed" });
    }

    const aiResponse = responseText.trim();

    await db.addConversationMessage(userId, "assistant", aiResponse);

    res.json({ response: aiResponse });
  });
});


// ________________________________END POINTS___________________________________

//USER ENDPOINTS

// Register a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await findUser('email', req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.email, req.body.password);

    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  }
});

// Login user
apiRouter.post('/auth/login', async (req, res) => {
  const user = await findUser('email', req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      await db.updateUser(user);
      setAuthCookie(res, user.token);
      res.send({ email: user.email });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// Logout user
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    delete user.token;
    db.updateUser(user);
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});



//MEAL ENDPOINTS

//get all meals
apiRouter.get('/meals', verifyAuth, async (req, res) => {
  const meals = await db.getMealsByEmail(req.user.email);
  res.send(meals);
});

//add a meal
apiRouter.post('/meals', verifyAuth, async (req, res) => {
  const meal = {
    id: uuid.v4(),
    userEmail: req.user.email,
    food: req.body.food,
    calories: req.body.calories,
    protein: req.body.protein,
    carbs: req.body.carbs,
    fat: req.body.fat,
    date: new Date().toISOString(),
  };
  await db.addMeal(meal);
  res.send(meal);
});

//edit meal
apiRouter.put('/meals/:id', verifyAuth, async (req, res) => {
  const mealId = req.params.id;
  const updatedMeal = {
    food: req.body.food,
    calories: req.body.calories,
    protein: req.body.protein,
    carbs: req.body.carbs,
    fat: req.body.fat
  };
  await db.updateMeal(mealId, updatedMeal);
  res.send({ id: mealId, ...updatedMeal });
});

//delete meal
apiRouter.delete('/meals/:id', verifyAuth, async (req, res) => {
  const mealId = req.params.id;
  await db.deleteMeal(mealId);
  res.status(204).end();
});

//profile
apiRouter.get('/profile', verifyAuth, (req, res) => {
  res.send({ email: req.user.email });
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
  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  };
  await db.addUser(user);
  return user;
}

// get user
async function findUser(field, value) {
  if (!value) return null;
  if (field === 'token') {
    return db.getUserByToken(value);
  }
  return db.getUser(value);
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
