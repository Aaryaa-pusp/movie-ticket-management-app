import User from "../models/User.js";
import { Webhook } from "svix";

// Clerk webhook handler — syncs user data to MongoDB
export const clerkWebhook = async (req, res) => {
    try {
        const whSecret = process.env.CLERK_WEBHOOK_SECRET;

        // If no webhook secret, skip verification (dev mode)
        if (!whSecret || whSecret === "your_clerk_webhook_secret_here") {
            console.warn("⚠ Clerk webhook secret not configured — skipping verification");
            return handleWebhookEvent(req.body, res);
        }

        // Verify webhook signature
        const wh = new Webhook(whSecret);
        const payload = JSON.stringify(req.body);
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        const evt = wh.verify(payload, headers);
        return handleWebhookEvent(evt, res);
    } catch (error) {
        console.error("Webhook verification failed:", error.message);
        res.status(400).json({ success: false, message: "Webhook verification failed" });
    }
};

// Handle the actual webhook event
const handleWebhookEvent = async (evt, res) => {
    try {
        const { type, data } = evt;

        switch (type) {
            case "user.created":
            case "user.updated": {
                const { id, first_name, last_name, email_addresses, image_url } = data;
                const email = email_addresses?.[0]?.email_address;
                const name = [first_name, last_name].filter(Boolean).join(" ") || "User";

                await User.findOneAndUpdate(
                    { clerkId: id },
                    { clerkId: id, name, email, imageUrl: image_url },
                    { upsert: true, new: true }
                );
                break;
            }
            case "user.deleted": {
                await User.findOneAndDelete({ clerkId: data.id });
                break;
            }
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user by Clerk ID
export const getUserByClerkId = async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.params.clerkId }).populate("favourites");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Toggle favourite movie
export const toggleFavourite = async (req, res) => {
    try {
        const { movieId } = req.body;
        const user = await User.findOne({ clerkId: req.params.clerkId });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const index = user.favourites.indexOf(movieId);
        if (index === -1) {
            user.favourites.push(movieId);
        } else {
            user.favourites.splice(index, 1);
        }
        await user.save();

        res.json({ success: true, favourites: user.favourites });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
