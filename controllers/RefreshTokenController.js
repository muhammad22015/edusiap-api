const { Prisma } = require('../prisma/prismaClient');
const jwt = require('jsonwebtoken');

const newAccessToken = async (req, res) => {
    const { refreshToken } = req.body;
    if(!refreshToken) return res.status(400).json({ status: "Bad Request", error: "refreshToken diperlukan"});

    try {
        const storedToken = await Prisma.refresh_token.findUnique({
            where: {
                refresh_token: refreshToken
            }
        });
        
        if(!storedToken) return res.status(403).json({ error: "Refresh Token tidak ditemukan" });      

        // Verify the refresh token and get the payload
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        
        // Create a new payload for the access token without the exp claim
        const accessTokenPayload = {
            user_id: payload.user_id,  // or whatever claims you need
            // include other necessary claims but not 'exp'
        };
        
        // Sign the new access token with expiresIn
        const accesstoken = jwt.sign(
            accessTokenPayload, 
            process.env.JWT_ACCESS_SECRET, 
            { expiresIn: "15m" }  // increased from 5m to 15m for better UX
        );

        return res.status(200).json({ 
            status: "Access Token berhasil dibuat", 
            response: accesstoken
        });
    } catch(err) {
        if (err.name === 'TokenExpiredError') {
            await Prisma.refresh_token.delete({
                where: {
                    refresh_token: refreshToken
                }
            });
            return res.status(403).json({ error: "Refresh token sudah expired" });
        }
        return res.status(500).json({ 
            status: "Server Error", 
            error: err.message
        });
    }
}

module.exports = { newAccessToken };