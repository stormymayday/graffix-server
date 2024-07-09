import TreasureModel from "../models/TreasureModel.js";
import UserModel from "../models/UserModel.js";
import { StatusCodes } from "http-status-codes";
import cloudinary from "cloudinary";
import { formatImage } from "../middleware/multerMiddleware.js";

export const createTreasure = async (req, res) => {
    const { title, description, message, category, longitude, latitude } =
        req.body;

    const createdBy = req.user.userId;

    let treasureUrl, treasurePublicID, qrCodeUrl, qrCodePublicID;

    // Two files
    if (req.files) {
        if (req.files.treasure) {
            const treasureFile = formatImage(req.files.treasure[0]);

            const treasureResponse = await cloudinary.v2.uploader.upload(
                treasureFile
            );

            treasureUrl = treasureResponse.secure_url;
            treasurePublicID = treasureResponse.public_id;
        }

        if (req.files.qrcode) {
            const qrCodeFile = formatImage(req.files.qrcode[0]);

            const qrCodeResponse = await cloudinary.v2.uploader.upload(
                qrCodeFile
            );

            qrCodeUrl = qrCodeResponse.secure_url;
            qrCodePublicID = qrCodeResponse.public_id;
        }
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
        qrCodeUrl,
        qrCodePublicID,
        createdBy,
    });

    return res.status(StatusCodes.CREATED).json({ treasure });
};

export const getAllTreasures = async (req, res) => {
    const allTreasure = await TreasureModel.find({});

    res.status(StatusCodes.OK).json(allTreasure);
};

export const getSingleTreasure = async (req, res) => {
    const { id } = req.params;

    const singleTreasure = await TreasureModel.findById(id);

    res.status(StatusCodes.OK).json(singleTreasure);
};

export const updateTreasure = async (req, res) => {
    const { id } = req.params;

    const updates = req.body;

    if (req.files) {
        const treasure = await TreasureModel.findById(id);

        if (req.files.treasure) {
            if (treasure.treasurePublicID) {
                await cloudinary.v2.uploader.destroy(treasure.treasurePublicID);
            }

            const treasureFile = formatImage(req.files.treasure[0]);

            const treasureResponse = await cloudinary.v2.uploader.upload(
                treasureFile
            );

            updates.treasureUrl = treasureResponse.secure_url;
            updates.treasurePublicID = treasureResponse.public_id;
        }

        if (req.files.qrcode) {
            if (treasure.qrCodePublicID) {
                await cloudinary.v2.uploader.destroy(treasure.qrCodePublicID);
            }

            const qrCodeFile = formatImage(req.files.qrcode[0]);

            const qrCodeResponse = await cloudinary.v2.uploader.upload(
                qrCodeFile
            );

            updates.qrCodeUrl = qrCodeResponse.secure_url;

            updates.qrCodePublicID = qrCodeResponse.public_id;
        }
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

    // Treasure
    if (removedTreasure.treasurePublicID) {
        await cloudinary.v2.uploader.destroy(removedTreasure.treasurePublicID);
    }

    // QR Code
    if (removedTreasure.qrCodePublicID) {
        await cloudinary.v2.uploader.destroy(removedTreasure.qrCodePublicID);
    }

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
    const { treasureId } = req.params;
    const userId = req.user.userId;

    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ msg: "User not found" });
        }
        const treasure = await TreasureModel.findById(treasureId);
        if (!treasure) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ msg: "Treasure not found" });
        }
        if (!user.treasureCollection.includes(treasureId)) {
            user.treasureCollection.push(treasureId);
            await user.save();
        }
        res.status(StatusCodes.OK).json({
            msg: "Treasure added to collection",
            treasureCollection: user.treasureCollection,
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            msg: "Error adding treasure to collection",
        });
    }
};

export const getTreasuresByArtist = async (req, res) => {
    const { artistId } = req.params;

    const treasures = await TreasureModel.find({ createdBy: artistId });

    res.status(StatusCodes.OK).json(treasures);
};
