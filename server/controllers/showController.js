import Show from "../models/Show.js";

// Get all shows (optionally filter by movie)
export const getAllShows = async (req, res) => {
    try {
        const filter = {};
        if (req.query.movie) {
            filter.movie = req.query.movie;
        }
        const shows = await Show.find(filter)
            .populate("movie")
            .sort({ showDateTime: 1 });
        res.json({ success: true, shows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get show by ID
export const getShowById = async (req, res) => {
    try {
        const show = await Show.findById(req.params.id).populate("movie");
        if (!show) {
            return res.status(404).json({ success: false, message: "Show not found" });
        }
        res.json({ success: true, show });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create show (admin only)
export const createShow = async (req, res) => {
    try {
        const { movie, showDateTime, showPrice } = req.body;
        const show = await Show.create({ movie, showDateTime, showPrice });
        res.status(201).json({ success: true, show });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete show (admin only)
export const deleteShow = async (req, res) => {
    try {
        const show = await Show.findByIdAndDelete(req.params.id);
        if (!show) {
            return res.status(404).json({ success: false, message: "Show not found" });
        }
        res.json({ success: true, message: "Show deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
