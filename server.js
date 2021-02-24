const express = require('express')
const app = express()
const cors = require('cors')
const bp = require('body-parser')

app.use(bp.urlencoded({ extended: "false" }));
app.use(bp.json());


require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//add user
const addUser = require('./repositories/userRepository.js').createAndSave;
app.post('/api/exercise/new-user', async (req, res) => {
  let newUser = await addUser(req.body.username)
  res.json(newUser);
});

//all users
const getAll = require('./repositories/userRepository.js').getAll;
app.get('/api/exercise/users', async (req, res) => {
  let allUsers = await getAll();
  res.json(allUsers);
});

//add excercise
const addExercise = require('./repositories/exerciseRepository.js').createAndSaveExercise;
app.post('/api/exercise/add', async (req, res) => {
  let { userId, description, duration, date } = req.body
  let newExercise = await addExercise({ userId, description, duration, date })
  if(newExercise.error){
    return res.status(400).end(newExercise.error);
  }
  res.json(newExercise);
});

//get exercises
const logExercise = require('./repositories/exerciseRepository.js').logExercise;
app.get('/api/exercise/log', async (req, res) => {
  let { userId, from, to, limit } = req.query;
  let getLog = await logExercise(userId, from, to, limit);
  res.json(getLog);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
