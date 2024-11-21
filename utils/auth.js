import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Hash password
export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Compare password with hash
export const verifyPassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

// Generate JWT
export const generateJWT = (user) => {
    const payload = {
        userId: user.id,
        email: user.email,
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Verify JWT
export const verifyJWT = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};
