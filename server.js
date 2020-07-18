const express = require('express');
// const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();
const knex = require('knex');

const postgres = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'matthieu',
    password : '',
    database : 'face-brain'
  }
});

console.log(postgres.select('*').from('users'));

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());


const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@email.com',
      password: 'cookies',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'sally',
      email: 'sally@email.com',
      password: 'bananas',
      entries: 0,
      joined: new Date()
    },
  ],
  login: [
    {
      id: '988',
      hash: '',
      email: "john@example.com",
    }
  ]
};

app.get('/', (req, res) => {
  res.send(database.users);
});

app.post('/signin', (req, res) => {
  if (req.body.email === database.users[0].email &&
      req.body.password === database.users[0].password) {
        res.json(database.users[0]);      
      } else {
        res.status(400).json(`error logging in`);
      }
  res.json(`signin post working`)
})

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  // bcrypt.hash(password, 8, function(err, hash) {
  //   console.log(hash);
  // });
  database.users.push(    {
    id: '125',
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  });
  res.json(database.users[database.users.length - 1]);
})

app.get('/profile/:id', (req, res)=> {
  const { id } = req.params;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      return res.json(user);
      found = true;
    }
  })
    if (!found) {
      res.status(404).json(`no such user`);
    }
  })

  app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
      if (user.id === id) {
        user.entries++;
        found = true;
        return res.json(user.entries);
      }
    })
      if (!found) {
        res.status(404).json(`no such user found`);
      }

  })

  // bcrypt.hash('bacon', 8, function(err, hash) {
  // });

  // // Load hash from your password DB.
  // bcrypt.compare("B4c0/\/", hash, function(err, res) {
  //   // res === true
  // });
  // bcrypt.compare("not_bacon", hash, function(err, res) {
  //   // res === false
  // });

  // // As of bcryptjs 2.4.0, compare returns a promise if callback is omitted:
  // bcrypt.compare("B4c0/\/", hash).then((res) => {
  //   // res === true
  // });



app.listen(3002, ()=> {
  console.log(`server is running on port 3002`);
});