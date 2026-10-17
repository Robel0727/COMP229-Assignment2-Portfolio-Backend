
import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    // Read the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: 'Authorization token is required'
        });
    }

    // Expected format: Bearer <token>
    const parts = authHeader.split(' ');

    if (
        parts.length !== 2 ||
        parts[0] !== 'Bearer' ||
        !parts[1]
    ) {
        return res.status(401).json({
            message: 'Invalid authorization format. Use Bearer <token>'
        });
    }

    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not configured');

        return res.status(500).json({
            message: 'Authentication is not configured'
        });
    }

    try {
        const decoded = jwt.verify(parts[1], process.env.JWT_SECRET);

        req.user = decoded;

        return next();
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid or expired token'
        });
    }
};

export default authMiddleware;
