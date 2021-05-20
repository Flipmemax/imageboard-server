const { Router } = require("express");
const { toJWT } = require("../auth/jwt");
const bcrypt = require("bcrypt");
const User = require("../models").user;
const router = new Router();
const authMiddleware = require("../auth/middleware");

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(400).send("Wrong credentials");
    }

    const validPassword = bcrypt.compareSync(password, user.password);

    if (validPassword) {
      console.log("Valid!");

      const token = toJWT({ userId: user.id });
      res.send({ message: "You successfully logged in", token });
    } else {
      res.status(400).send("Wrong credentials");
    }
  } catch (error) {
    next(error);
  }
});

router.get("/test-auth", authMiddleware, (req, res) => {
  res.send({
    message: `Thanks for visiting the secret endpoint ${req.user.email}.`,
  });
});

module.exports = router;
