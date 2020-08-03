const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const salt = 10;
const cors = require('cors');
const knex = require('knex')


const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'test',
        database: 'smart_brain'
    }
});

// db.select('*').from('users').then(data =>{
//     console.log(data);
// })


const app = express();
app.use(bodyParser.json());
app.use(cors())
app.use(bodyParser.urlencoded({
    extended: true
}));

const database = {
    user: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()

        },
        {
            id: '124',
            name: 'Sumukh',
            email: 'sumukh@gmail.com',
            password: 'bolu',
            entries: 0,
            joined: new Date()

        }
    ]
}


app.get('/', (req, response) => {
    response.send(database.user);
})


app.post('/signin', (req, res) => {
    // bcrypt.compare(password, hash).then(function (result) {
    //     // result == true
    // });
    // bcrypt.compare(someOtherPlaintextPassword, hash).then(function (result) {
    //     // result == false
    // });
    if (req.body.email === database.user[0].email &&
        req.body.password === database.user[0].password) {
        res.json(database.user[0]);
    }
    else {
        res.status(400).json('error logging in');
    }
})

// app.post('/signin', (req, res) => {
//     db.select('email', 'hash').from('login')
//       .where('email', '=', req.body.email)
//       .then(data => {
//         const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
//         if (isValid) {
//           return db.select('*').from('user')
//             .where('email', '=', req.body.email)
//             .then(user => {
//               res.json(user[0])
//             })
//             .catch(err => res.status(400).json('unable to get user'))
//         } else {
//           res.status(400).json('wrong credentials')
//         }
//       })
//       .catch(err => res.status(400).json('wrong credentials'))
//   })


app.post('/register', (req, res) => {
    const { email, name, password } = req.body;

    // bcrypt.hash(password, salt, null, function (error, hash) {
    //     console.log(hash);
    //     console.log("helllooooooooo");
    // });
    db('user')
        .returning('*')
        .insert({
            email: email,
            name: name,
            joined: new Date()
        })
        .then(user => {
            res.json(user[0]);
        })
        .catch(err => res.status(400).json('unable to register'))



    // res.json(database.user[database.user.length - 1]);
})


app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.user.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if (!found) {
        res.status(400).json('not found');

    }
})


app.put('/image',(req, res) => {
    const { id } = req.body;
    let found = false;
    database.user.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++
            return res.json(user.entries);
        }
    })
    if (!found) {
        res.status(400).json('not found');
    }
})


app.listen(3000, () => {
    console.log('app is running on port 3000 ');
})


