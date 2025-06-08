const { Prisma } = require('../prisma/prismaClient');

const allData = async (req,res) => {
    try {
        const playlists = await Prisma.playlist.findMany();

        return res.status(200).json({status: "Authorized", response: playlists});
    } catch(err) {
        return res.status(500).json({status: "Server Error", error: err.message});
    }
}

module.exports = { allData };