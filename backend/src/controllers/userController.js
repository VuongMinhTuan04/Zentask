import User from "../models/User.js";

export const searchUsers = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim().length < 1) {
            return res.status(200).json({ data: [] });
        }

        const users = await User.find({
            $or: [
                { fullname: { $regex: q, $options: "i" } },
                { username: { $regex: q, $options: "i" } },
            ],
            _id: { $ne: req.user.userId }, // loại trừ chính mình
        })
        .select("_id fullname username")
        .limit(10);

        res.status(200).json({ data: users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};