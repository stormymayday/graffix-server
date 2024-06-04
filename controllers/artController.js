import ArtModel from "../models/ArtModel.js";

let artwork = [
    {
        id: 1,
        category: "oil",
        title: "Sunset",
        description: "Beautiful sunset!",
        createdAt: "2023-06-01T12:00:00Z",
        updatedAt: "",
        likes: 0,
    },
];

export const createArt = async (req, res) => {
    const art = await ArtModel.create(req.body);

    return res.status(201).json({ art });
};

export const getAllArt = async (req, res) => {
    const allArt = await ArtModel.find({});
    res.status(200).json({ allArt });
};

export const getSingleArt = async (req, res) => {
    const { id } = req.params;

    const singleArt = await ArtModel.findById(id);

    if (!singleArt) {
        return res.status(404).json({ msg: `no art with id ${id}` });
    }

    res.status(200).json({ singleArt });
};

export const updateArt = async (req, res) => {
    const { category, title, description } = req.body;

    if (!category || !title || !description) {
        return res
            .status(400)
            .json({ msg: "please provide category, title, and description" });
    }

    const { id } = req.params;

    const art = artwork.find((art) => {
        return art.id === parseInt(id);
    });

    if (!art) {
        return res.status(404).json({ msg: `no art with id ${id}` });
    }

    art.category = category;
    art.title = title;
    art.description = description;
    art.updatedAt = new Date();

    return res.status(200).json({ msg: "art modified", art });
};

export const deleteArt = async (req, res) => {
    const { id } = req.params;

    const art = artwork.find((art) => {
        return art.id === parseInt(id);
    });

    if (!art) {
        return res.status(404).json({ msg: `no art with id ${id}` });
    }

    const newArtwork = artwork.filter((art) => {
        return art.id === parseInt(id);
    });

    artwork = newArtwork;

    res.status(200).json({ msg: "art deleted" });
};
