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

module.exports = router;
