import ArtModel from "../models/ArtModel.js";
import { StatusCodes } from "http-status-codes";

export const createArt = async (req, res) => {
    const art = await ArtModel.create(req.body);

    return res.status(StatusCodes.CREATED).json({ art });
};

export const getAllArt = async (req, res) => {
    const allArt = await ArtModel.find({});
    res.status(StatusCodes.OK).json({ allArt });
};

export const getSingleArt = async (req, res) => {
    const { id } = req.params;

    const singleArt = await ArtModel.findById(id);

    res.status(200).json({ singleArt });
};

export const updateArt = async (req, res) => {
    const { id } = req.params;

    const updatedArt = await ArtModel.findByIdAndUpdate(id, req.body, {
        new: true,
    });

    return res
        .status(StatusCodes.OK)
        .json({ msg: "art modified", art: updatedArt });
};

export const deleteArt = async (req, res) => {
    const { id } = req.params;

    const removedArt = await ArtModel.findOneAndDelete(id);

    res.status(StatusCodes.OK).json({ msg: "art deleted", art: removedArt });
};
