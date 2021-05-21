const { Router } = require("express");
const User = require("../models").user;
const Image = require("../models").image;
const bcrypt = require("bcrypt");
const authMiddleware = require("../auth/middleware");

const router = new Router();

router.get("/", async (req, res, next) => {
  const limit = Math.min(req.query.limit || 25, 500);
  const offset = req.query.offset || 0;
  try {
    const result = await User.findAndCountAll({ limit, offset });
    res.send({ users: result.rows, total: result.count });
  } catch (error) {
    next(error);
  }
});

router.get("/:userId/imagefeed", async (req, res, next) => {
  const limit = Math.min(req.query.limit || 25, 500);
  const offset = req.query.offset || 0;
  try {
    const userId = parseInt(req.params.userId);
    const user = await User.findByPk(userId, {
      include: { model: Image, limit, offset },
    });
    if (user) {
      res.send(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    next(error);
  }
});

router.post("/:userId/newimage", authMiddleware, async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const user = await User.findByPk(userId);
    if (!user) {
      response.status(404).send("User not found");
    } else {
      const newImage = await Image.create({ userId, ...req.body });
      res.json(newImage);
    }
  } catch (error) {
    next(error);
  }
});

router.post("/newuser", async (req, res, next) => {
  try {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
      res.status(400).send("must provide correct paramaters");
    } else {
      //   const newUser = await User.create(req.body);
      const newUser = await User.create({
        fullname,
        email,
        password: bcrypt.hashSync(password, 10),
      });
      //both of the above options, after else, work the same. But the 2nd one makes sure no unwanted parameters are passed.
      res.json(newUser);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
