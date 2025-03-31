const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const userCollection = db.collection('user');
const mealCollection = db.collection('meal');
const conversationCollection = db.collection('conversation');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log(`Connected to database`);
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
})();

// user functions
function getUser(email) {
  return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function addUser(user) {
  await userCollection.insertOne(user);
}

async function updateUser(user) {
  await userCollection.updateOne({ email: user.email }, { $set: user });
}


// meal functions
async function addMeal(meal) {
  await mealCollection.insertOne(meal);
}

function getMealsByEmail(userEmail) {
  return mealCollection.find({ userEmail }).toArray();
}
async function updateMeal(mealId, updatedMeal) {
  await mealCollection.updateOne({ id: mealId }, { $set: updatedMeal });
}

async function deleteMeal(mealId) {
  await mealCollection.deleteOne({ id: mealId });
}

//conversation functions
async function addConversationMessage(userEmail, role, content) {
  await conversationCollection.insertOne({
    userEmail,
    role,
    content,
    timestamp: new Date().toISOString(),
  });
}

async function getConversationHistory(userEmail) {
  return await conversationCollection
    .find({ userEmail })
    .sort({ timestamp: 1 })
    .toArray();
}

module.exports = {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  addMeal,
  getMealsByEmail,
  updateMeal,
  deleteMeal,
  addConversationMessage,
  getConversationHistory,
};
