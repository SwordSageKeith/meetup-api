const xss = require("xss");
const bcrypt = require("bcryptjs");

const UsersService = {
  checkPassword(password) {
    if (password.startsWith(" ") || password.endsWith(" "))
      return "Password must not start or end with a space";
    if (password.length < 8 || password.length > 72)
      return "Password must be between 8 and 72 characters";
    return null;
  },
  hasUserWithUserName(db, username) {
    return db("users")
      .where({ username })
      .first()
      .then(user => !!user);
  },
  hasUserWithEmail(db, email) {
    return db("users")
      .where({ email })
      .first()
      .then(user => !!user);
  },
  insertUser(db, newUser) {
    return db
      .into("users")
      .insert(newUser)
      .returning("*")
      .then(user => user[0]);
  },
  serializeUser(user) {
    return {
      id: user.id,
      username: xss(user.username)
    };
  },
  hashPassword(password) {
    return bcrypt.hash(password, 10);
  }
};

module.exports = UsersService;
