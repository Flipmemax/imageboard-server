const { Router } = require("express");
const Image = require("../models").image;
const router = new Router();

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

module.exports = router;
