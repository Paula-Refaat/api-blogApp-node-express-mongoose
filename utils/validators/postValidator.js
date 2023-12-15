const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.createPostValidator = [
  check("title")
    .notEmpty()
    .withMessage("Post title required")
    .isLength({ min: 2 })
    .withMessage("Post title too short")
    .isLength({ max: 100 })
    .withMessage("Post title too long"),
  check("description")
    .notEmpty()
    .withMessage("Post description required")
    .isLength({ min: 2 })
    .withMessage("Post description too short"),
  check("category").notEmpty().withMessage("Post category required"),
  check("user").isMongoId().withMessage("invalid userId formate"),
  validatorMiddleware,
];

exports.getOnePostValidator = [
  check("id").isMongoId().withMessage("invalid id formate"),
  validatorMiddleware,
];
