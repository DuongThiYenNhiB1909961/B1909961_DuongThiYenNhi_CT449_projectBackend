const express = require("express");
const literaries = require("../controllers/literary.controller");

const router = express.Router();

router.route("/")
    .get(literaries.findAll)
    .post(literaries.create)
    .delete(literaries.deleteAll)

router.route("/favorite")
    .get(literaries.findAllFavorite);

router.route("/:id")
    .get(literaries.findOne)
    .put(literaries.update)
    .delete(literaries.delete)

module.exports = router;