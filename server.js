const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'matthieu',
    password : 'root',
    database : 'face-brain'
  }
});

db  .select('*').from('users').then(data => {
  console.log(data);
});

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
  const hash = bcrypt.hashSync(password);
  db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return trx('users')
        .returning('*')
        .insert({
          email: loginEmail[0],
          name: name,
          joined: new Date()
        })
        .then(user => {
          res.json(user[0]);
        })
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
  .catch(err => res.status(400).json('unable to register'))
})

app.get('/profile/:id', (req, res)=> {
  const { id } = req.params;
  db
  .select('*')
  .from('users')
  .where({id})
  .then(user => {
    if (user.length) {
      res.json(user[0]);
    } else {
      res.status(400).json('not found')
    }
  })
  .catch(err => res.status(400).json('error getting user')) 
})

  app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users')
      .where('id', '=', id)
      .increment('entries', 1)
      .returning('entries')
      .then(entries => 
        res.json(entries[0])
        )
      .catch(err => res.status(400).json('unable to put entry count'));
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