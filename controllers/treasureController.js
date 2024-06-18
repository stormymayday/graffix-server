import TreasureModel from "../models/TreasureModel.js";
import { StatusCodes } from "http-status-codes";
import cloudinary from "cloudinary";
import { formatImage } from "../middleware/multerMiddleware.js";

export const createTreasure = async (req, res) => {
    const { title, description, message, category, coordinates } = req.body;
    const createdBy = req.user.userId;
    let treasureUrl, treasurePublicID, qrCodeUrl, qrCodeUrlPublicID;

    if (req.file) {
        const file = formatImage(req.file);
        const response = await cloudinary.v2.uploader.upload(file);

        treasureUrl = response.secure_url;
        treasurePublicID = response.public_id;
    }

    const treasure = await TreasureModel.create({
        title,
        description,
        message,
        category,
        coordinates,
        treasureUrl,
        treasurePublicID,
        qrCodeUrl,
        qrCodeUrlPublicID,
        createdBy,
    });

    return res.status(StatusCodes.CREATED).json({ treasure });
};

export const getAllTreasures = async (req, res) => {
    const allTreasures = await TreasureModel.find({});
    res.status(StatusCodes.OK).json({ allTreasures });
};

export const getSingleTreasure = async (req, res) => {
    const { id } = req.params;
    const singleTreasure = await TreasureModel.findById(id);
    res.status(StatusCodes.OK).json({ singleTreasure });
};

export const updateTreasure = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (req.file) {
        const treasure = await TreasureModel.findById(id);
        if (treasure.treasurePublicID) {
            await cloudinary.v2.uploader.destroy(treasure.treasurePublicID);
        }

        const file = formatImage(req.file);
        const response = await cloudinary.v2.uploader.upload(file);

        updates.treasureUrl = response.secure_url;
        updates.treasurePublicID = response.public_id;
    }

    const updatedTreasure = await TreasureModel.findByIdAndUpdate(id, updates, {
        new: true,
    });

    return res
        .status(StatusCodes.OK)
        .json({ msg: "Treasure updated", treasure: updatedTreasure });
};

export const deleteTreasure = async (req, res) => {
    const { id } = req.params;
    const removedTreasure = await TreasureModel.findByIdAndDelete(id);

    if (removedTreasure.treasurePublicID) {
        await cloudinary.v2.uploader.destroy(removedTreasure.treasurePublicID);
    }

    res.status(StatusCodes.OK).json({
        msg: "Treasure deleted",
        treasure: removedTreasure,
    });
};
