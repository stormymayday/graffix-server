import { body, param, validationResult } from "express-validator";
import { BadRequestError, NotFoundError } from "../errors/customErrors.js";
import { ART_CATEGORIES } from "../utils/constants.js";
import mongoose from "mongoose";
import Artwork from "../models/ArtworkModel.js";
import Treasure from "../models/TreasureModel.js";
import User from "../models/UserModel.js";

const withValidationErrors = (validateValues) => {
    return [
        validateValues,
        (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map((error) => {
                    return error.msg;
                });

                if (errorMessages[0].startsWith("no art")) {
                    throw new NotFoundError(errorMessages);
                }

                throw new BadRequestError(errorMessages);
            }

            next();
        },
    ];
};

export const validateArtworkInput = withValidationErrors([
    body("category").notEmpty().withMessage("category is required").trim(),
    body("category")
        .isIn(Object.values(ART_CATEGORIES))
        .withMessage("invalid art category"),
    body("title").notEmpty().withMessage("title is required").trim(),
    body("description")
        .notEmpty()
        .withMessage("description is required")
        .trim(),
]);

export const validateTreasureInput = withValidationErrors([
    body("category")
        .isIn(Object.values(ART_CATEGORIES))
        .withMessage("invalid treasure category"),
]);

export const validateIdParam = withValidationErrors([
    param("id").custom(async (value) => {
        // Either 'true' or 'false'
        const isValidMongoId = mongoose.Types.ObjectId.isValid(value);

        if (!isValidMongoId) {
            throw new BadRequestError("invalid mongo id");
        }

        const singleArtwork = await Artwork.findById(value);

        if (!singleArtwork) {
            throw new NotFoundError(`no artwork with id ${value}`);
        }
    }),
]);

export const validateTreasureIdParam = withValidationErrors([
    param("id").custom(async (value) => {
        // Either 'true' or 'false'
        const isValidMongoId = mongoose.Types.ObjectId.isValid(value);

        if (!isValidMongoId) {
            throw new BadRequestError("invalid mongo id");
        }

        const singleTreasure = await Treasure.findById(value);

        if (!singleTreasure) {
            throw new NotFoundError(`no treasure with id ${value}`);
        }
    }),
]);

export const validateRegisterInput = withValidationErrors([
    body("username")
        .notEmpty()
        .withMessage("username is required")
        .custom(async (username) => {
            const user = await User.findOne({ username });
            if (user) {
                throw new BadRequestError("username already exists");
            }
        }),
    body("email")
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("invalid email format")
        .custom(async (email) => {
            const user = await User.findOne({ email });
            if (user) {
                throw new BadRequestError("email already exists");
            }
        }),
    body("password")
        .notEmpty()
        .withMessage("password is required")
        .isLength({ min: 8 })
        .withMessage("password must be at least 8 characters long"),
]);

export const validateLoginInput = withValidationErrors([
    body("email")
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("invalid email format"),
    body("password").notEmpty().withMessage("password is required"),
]);

export const validateUpdateUserInput = withValidationErrors([
    body("username")
        .notEmpty()
        .withMessage("username is required")
        .custom(async (username, { req }) => {
            const user = await User.findOne({ username });

            if (user && user._id.toString() !== req.user.userId) {
                throw new BadRequestError("username already exists");
            }
        }),
    body("email")
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("invalid email format")
        .custom(async (email, { req }) => {
            const user = await User.findOne({ email });
            if (user && user._id.toString() !== req.user.userId) {
                throw new BadRequestError("email already exists");
            }
        }),
]);
