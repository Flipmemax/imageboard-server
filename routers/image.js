const { Router, response } = require("express");
const Image = require("../models").image;

const router = new Router();

router.get("/", async (req, res, next) => {
  try {
    const allImages = await Image.findAll();
    res.send(allImages);
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
