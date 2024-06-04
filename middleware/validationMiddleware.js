import { body, param, validationResult } from "express-validator";
import { BadRequestError, NotFoundError } from "../errors/customErrors.js";
import { ART_CATEGORIES } from "../utils/constants.js";
import mongoose from "mongoose";
import ArtModel from "../models/ArtModel.js";

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
