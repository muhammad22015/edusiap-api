const jwt = require('jsonwebtoken');

const authenticate = (req,res,next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization token salah' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decodedToken;
        next();
    } catch {
        return res.status(401).json({ error: "Token Expired"})
    }
}

module.exports = { authenticate }