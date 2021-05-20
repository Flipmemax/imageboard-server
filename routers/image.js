const { Router, response } = require("express");
const Image = require("../models").image;
const User = require("../models").user;

const router = new Router();

router.get("/", async (req, res, next) => {
  try {
    const allImages = await Image.findAll();
    res.send(allImages);
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
  try {
    const userId = parseInt(req.params.userId);
    const user = await User.findByPk(userId, {
      include: { model: Image },
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

router.post("/:userId/newimage", async (req, res, next) => {
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
