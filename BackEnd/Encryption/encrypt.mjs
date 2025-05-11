import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

async function encryptPassword(plainPassword) {
    const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);
    return hashedPassword;
}

export default encryptPassword;
