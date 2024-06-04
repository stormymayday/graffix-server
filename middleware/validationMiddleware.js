import { body, param, validationResult } from "express-validator";
import { BadRequestError, NotFoundError } from "../errors/customErrors.js";
import { ART_CATEGORIES } from "../utils/constants.js";
import mongoose from "mongoose";
import ArtModel from "../models/ArtModel.js";
import UserModel from "../models/UserModel.js";

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

export const validateArtInput = withValidationErrors([
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

export const validateIdParam = withValidationErrors([
    param("id").custom(async (value) => {
        // Either 'true' or 'false'
        const isValidMongoId = mongoose.Types.ObjectId.isValid(value);

        if (!isValidMongoId) {
            throw new BadRequestError("invalid mongo id");
        }

        const singleArt = await ArtModel.findById(value);

        if (!singleArt) {
            throw new NotFoundError(`no art with id ${value}`);
        }
    }),
]);

export const validateRegisterInput = withValidationErrors([
    body("username")
        .notEmpty()
        .withMessage("username is required")
        .custom(async (username) => {
            const user = await UserModel.findOne({ username });
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
            const user = await UserModel.findOne({ email });
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
