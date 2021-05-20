const { Router } = require("express");
const Image = require("../models").image;
const { toData } = require("../auth/jwt");

const router = new Router();

router.get("/auth/messy", async (req, res, next) => {
  const auth =
    req.headers.authorization && req.headers.authorization.split(" ");
  if (auth && auth[0] === "Bearer" && auth[1]) {
    try {
      const data = toData(auth[1]);
      const allImages = await Image.findAll();
      res.json(allImages);
    } catch (e) {
      res.status(400).send("Invalid JWT token");
    }
  } else {
    res.status(401).send({
      message: "Please supply some valid credentials",
    });
  }
});

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

router.post("/newimage", async (req, res, next) => {
  try {
    const { title, url } = req.body;
    if (!title || !url) {
      res.status(400).send("must provide correct paramaters");
    } else {
      const newImage = await Image.create(req.body);
      res.json(newImage);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
