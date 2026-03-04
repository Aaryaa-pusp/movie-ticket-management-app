import mongoose from "mongoose";

const showSchema = new mongoose.Schema(
    {
        movie: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie",
            required: true,
        },
        theater: { type: String, default: "QuickShow Cinema" },
        showDateTime: { type: Date, required: true },
        showPrice: { type: Number, required: true },
        occupiedSeats: {
            type: Map,
            of: String, // seatId → clerkUserId
            default: {},
        },
    },
    { timestamps: true }
);

const Show = mongoose.model("Show", showSchema);
export default Show;
