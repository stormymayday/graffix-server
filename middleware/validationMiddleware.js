import { body, param, validationResult } from "express-validator";
import { BadRequestError } from "../errors/customErrors.js";
import { ART_CATEGORIES } from "../utils/constants.js";
import mongoose from "mongoose";

const withValidationErrors = (validateValues) => {
    return [
        validateValues,

        (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map((error) => {
                    return error.msg;
                });

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
    param("id")
        .custom((value) => {
            return mongoose.Types.ObjectId.isValid(value);
        })
        .withMessage("invalid id"),
]);
