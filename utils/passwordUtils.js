import bcryptjs from "bcryptjs";

export const hashPassword = async (password) => {
    // Generating Salt
    const salt = await bcryptjs.genSalt(10);

    // Hashing the password
    const hashedPassword = await bcryptjs.hash(password, salt);

    return hashedPassword;
};
