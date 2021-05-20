const { Router, response } = require("express");
const Image = require("../models").image;
const User = require("../models").user;
const router = new Router();
const authMiddleware = require("../auth/middleware");

router.get("/", async (req, res, next) => {
  const limit = Math.min(req.query.limit || 25, 500);
  const offset = req.query.offset || 0;
  try {
    const result = await Image.findAndCountAll({ limit, offset });
    res.send({ images: result.rows, total: result.count });
  } catch (error) {
    next(error);
  }
});

router.get("/:imageId", async (req, res, next) => {
  try {
    const imageId = parseInt(req.params.imageId);
    const image = await Image.findByPk(imageId);
    if (!image) {
      res.status(404).send("No images found");
    } else {
      res.send(image);
    }
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

module.exports = router;
