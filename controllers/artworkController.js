import ArtModel from "../models/ArtworkModel.js";
import { StatusCodes } from "http-status-codes";

export const createArtwork = async (req, res) => {
    const art = await ArtModel.create(req.body);

    return res.status(StatusCodes.CREATED).json({ art });
};

export const getAllArtworks = async (req, res) => {
    const allArt = await ArtModel.find({});
    res.status(StatusCodes.OK).json({ allArt });
};

export const getSingleArtwork = async (req, res) => {
    const { id } = req.params;

    const singleArt = await ArtModel.findById(id);

    res.status(200).json({ singleArt });
};

export const updateArtwork = async (req, res) => {
    const { id } = req.params;

    const updatedArt = await ArtModel.findByIdAndUpdate(id, req.body, {
        new: true,
    });

    return res
        .status(StatusCodes.OK)
        .json({ msg: "art modified", art: updatedArt });
};

export const deleteArtwork = async (req, res) => {
    const { id } = req.params;

    const removedArt = await ArtModel.findOneAndDelete(id);

    res.status(StatusCodes.OK).json({ msg: "art deleted", art: removedArt });
};
