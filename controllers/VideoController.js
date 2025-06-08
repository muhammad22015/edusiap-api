const { Prisma } = require('../prisma/prismaClient');

const allData = async (req,res) => {
    const { id, category } = req.query

    const whereClause = {};
    if (id) whereClause.video_id = parseInt(id);
    if (category) whereClause.category = category;
    
    try {
        const videos = await Prisma.video.findMany({
            where: whereClause,
        });
        if(videos.length === 0) return res.status(404).json({status: "Bad Request", error: "Video Tidak Ditemukan"});

        return res.status(200).json({status: "Authorized", response: videos});
    } catch(err) {
        return res.status(500).json({status: "Server Error", error: err.message});
    }
}

module.exports = { allData };