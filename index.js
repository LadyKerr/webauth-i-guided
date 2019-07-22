const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const db = require("./database/dbConfig.js");
const Users = require("./users/users-model.js");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
  res.send("It's alive!");
});

server.post("/api/register", (req, res) => {
  let user = req.body;

  //library takes the password and generates a hash 2 to the 8 times, then returns the hashed string
  //the larger the number the more secure hashes will be. Good starting point is 14. Make as large as possible
  // without making hashes too slow
  const hash = bcrypt.hashSync(user.password, 14);
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.post("/api/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      //check if password matches
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(error);
    });
});

//protect /api/users so only clients that provide credential can see the list of users
//read the username and password from the Headers

server.get("/api/users", auth, (req, res) => {
  Users.find()
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      res.status(500).json({ message: " Error connecting to users" });
    });
});

//custom middleware to validate user on /api/users
function auth(req, res, next) {
  const { username, password } = req.headers;

  //find users in db
  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        next();
      } else {
        res.status(401).json({ message: "You shall not pass" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "You shall not pass" });
    });
}

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
