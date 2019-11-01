const express = require("express");
const path = require("path");

const UsersService = require("./users-service");
const AuthService = require("../auth/auth-service");

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter.post("/", jsonBodyParser, (req, res, next) => {
  const { password, username, email } = req.body;
  const required = ["uersname", "passowrd", "email"];

  for (const field of required) {
    if (!req.body[field])
      return res.status(400).json({ error: `Missing ${field}` });
  }

  const passError = UsersService.checkPassword(password);
  if (passError) {
    return res.status(400).json({ error: passError });
  }

  UsersService.hasUserWithUserName(req.app.get("db"), username)
    .then(userExists => {
      if (userExists)
        return res
          .status(400)
          .json({ error: "That username is already taken" });
      return UsersService.hasUserWithEmail(req.app.get("db"), email).then(
        emailExists => {
          if (emailExists)
            return res
              .status(400)
              .json({ error: "An account is already using that email" });
          return UsersService.hashPassword(password).then(hashedPass => {
            const newUser = {
              username,
              email,
              password: hashedPass
            };
            return UsersService.insertUser(req.app.get("db"), newUser).then(
              user => {
                const userInfo = UsersService.serializeUser(user);
                const payload = { user_id: userInfo.id };
                const subject = userInfo.username;
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json({
                    authToken: AuthService.createJwt(subject, payload),
                    id: userInfo.id,
                    user_name: userInfo.user_name
                  });
              }
            );
          });
        }
      );
    })
    .catch(next);
});

module.exports = usersRouter;
