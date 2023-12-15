const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const User = require("../../models/userModel");
const Post = require("../../models/postModel");

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

exports.updatePostValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom((val, { req }) =>
      Post.findById(val).then((post) => {
        if (!post) {
          return Promise.reject(
            new Error(`There is no post for this id ${val}`)
          );
        }
        if (post.user.toString() != req.user._id.toString()) {
          return Promise.reject(
            new Error("You are not allowed to perform this action")
          );
        }
      })
    ),
  check("title")
    .notEmpty()
    .withMessage("Post title required")
    .isLength({ min: 2 })
    .withMessage("Post title too short")
    .isLength({ max: 100 })
    .withMessage("Post title too long")
    .optional(),
  check("description")
    .notEmpty()
    .withMessage("Post description required")
    .isLength({ min: 2 })
    .withMessage("Post description too short")
    .optional(),
  check("category").notEmpty().withMessage("Post category required").optional(),
  check("user").isMongoId().withMessage("invalid userId formate").optional(),
  validatorMiddleware,
];
