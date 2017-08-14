const bcrypt = require('bcryptjs'),
      db = require('../config/config')

const User = {

  // model method to create a user
  create: (name, email, password) => {
    // encrypt the password using bcrypt
    const password_digest = bcrypt.hashSync(password, 10);
    // define a recursive method to generate a token
    // we need to generate a random string that is unique to our database
    // and nearly impossible to replicate
    const generateTokenAndCreate = () => {
      // generate a random number and hash it to create a token
      const token = bcrypt.hashSync(Math.random().toString(), 10);
      // this is returning a promise to make sure the token does not already
      // exist in our database
      return db.oneOrNone('SELECT id FROM users WHERE token = $1', [token])
        .then((res) => { // once we get the response
          if(res){ // if there is a user with that token
            // redo this function and return the result
            return generateTokenAndCreate();
          } // if there is not a user with that token
          // create a new user using that token
          // we are returning the promise to do so
          // this way, in our controller, we can use then() to get the data
          // we want to send back to the client
          return db.one(`INSERT INTO users
            (name, email, password_digest, token)
            VALUES ($1, $2, $3, $4)
            RETURNING name, email, token, id`, // the information we want to send back
            [name, email, password_digest, token])
        })
        .catch(err => {
          console.log('ERROR!!!!');
          console.log(err);
        });
    }

    // return the result of the function we just made
    // which will be a promise to create a user with
    // the token we generated
    return generateTokenAndCreate();
  },

  // method to find a user given a email
  findByEmail: (email) => db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]),

  // method to find a user given a token
  // it is using db.one so that if there is not a user, it will throw an error
  // we will handle that error in the .catch()
  findByToken: (token) => db.one('SELECT * FROM users WHERE token = $1', [token])
}

module.exports = User;
