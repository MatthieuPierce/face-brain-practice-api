const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();
const knex = require('knex');
const register = require('./controllers/register.js');
const signin = require('./controllers/signin.js');
const profile = require('./controllers/profile.js');
const image = require('./controllers/image.js');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'matthieu',
    password : 'root',
    database : 'face-brain'
  }
});

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send(database.users);
});

app.post('/signin', signin.handleSignin(db, bcrypt))

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) 
})

app.get('/profile/:id', (req, res) => {
  profile.handleProfileGet(req, res, db)
})

app.put('/image', (req, res) => image.handleImage(req, res, db))
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

app.listen(3002, ()=> {
  console.log(`server is running on port 3002`);
});