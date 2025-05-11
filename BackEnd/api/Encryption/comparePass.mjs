import bcrypt from 'bcrypt';

export async function isPasswordCorrect(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

export default isPasswordCorrect;