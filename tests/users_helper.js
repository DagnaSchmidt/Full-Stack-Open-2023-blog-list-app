import User from "../models/user.js";

export const usersInDB = async () => {
    const users = await User.find({});
    return users.map(user => user.toJSON());
};