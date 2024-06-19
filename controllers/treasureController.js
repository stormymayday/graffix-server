import TreasureModel from "../models/TreasureModel.js";
import UserModel from "../models/UserModel.js";
import { StatusCodes } from "http-status-codes";
import cloudinary from "cloudinary";
import { formatImage } from "../middleware/multerMiddleware.js";

export const createTreasure = async (req, res) => {
    const { title, description, message, category, longitude, latitude } =
        req.body;

    const createdBy = req.user.userId;

    let treasureUrl, treasurePublicID;

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
        location: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        treasureUrl,
        treasurePublicID,
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

        // QR Code
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

    // QR Code

    res.status(StatusCodes.OK).json({
        msg: "Treasure deleted",
        treasure: removedTreasure,
    });
};

export const getTreasuresByCategory = async (req, res) => {
    const { category } = req.params;

    const treasures = await TreasureModel.find({ category });

    res.status(StatusCodes.OK).json(treasures);
};

export const getTreasuresByDistance = async (req, res) => {
    const { longitude, latitude, maxDistance } = req.query;

    const treasures = await TreasureModel.find({
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [parseFloat(longitude), parseFloat(latitude)],
                },
                $maxDistance: parseFloat(maxDistance),
            },
        },
    });

    res.status(StatusCodes.OK).json(treasures);
};

export const addTreasureToCollection = async (req, res) => {
    const { treasureId } = req.body;

    const userId = req.user.userId;

    const user = await UserModel.findById(userId);

    if (!user) {
        return res
            .status(StatusCodes.NOT_FOUND)
            .json({ msg: "User not found" });
    }

    if (!user.treasureCollection.includes(treasureId)) {
        user.treasureCollection.push(treasureId);

        await user.save();
    }

    res.status(StatusCodes.OK).json({
        msg: "Treasure added to collection",
    });
};
