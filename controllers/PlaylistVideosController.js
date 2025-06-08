const { Prisma } = require('../prisma/prismaClient');

const playlistVideosById = async (req,res) => {
    const { id } = req.query;

    try {
        const playlist_videos = await Prisma.playlist_videos.findMany({
            where: { playlist_id: parseInt(id)},
            include: {
                playlist: {
                    select: {
                        title: true,
                    }
                },
                video: {
                    select: {
                        thumbnail: true,
                        title: true,
                        view_count: true,
                        upload_date: true,
                    }
                },
            },
            orderBy: {
                position: 'asc'
            },
        })
        if(playlist_videos.length === 0) return res.status(404).json({status: "Bad Request", error: "Playlist Videos tidak ditemukan"});
        
        return res.status(200).json({status: "Authorized", response: playlist_videos})
    } catch(err) {
        return res.status(500).json({status: "Server Error", error: err.message});
    }
}

const playlistVideoPositionUp = async (req,res) => {
    try {
        const { playlist_id, video_id } = req.body;
    
        if (!playlist_id || !video_id) {
            return res.status(400).json({ status: "Bad Request", message: "playlist_id and video_id tidak ditemukan" });
        }

        const video = await Prisma.playlist_videos.findUnique({
            where: {
                playlist_id_video_id: {
                    playlist_id,
                    video_id,
                }
            },
            select: {
                position: true,
            },
        });

        if (video.position == 1) {
            return res.status(400).json({ status: "Bad Request", message: "Video sudah berada di posisi teratas" });
        }

        const currentPosition = video.position;

        const videoAbove = await Prisma.playlist_videos.findFirst({
            where: {
                playlist_id: playlist_id,
                position: currentPosition - 1,
            },
        });

        await Prisma.$transaction([
            Prisma.playlist_videos.update({
                where: {
                    playlist_id_video_id: {
                        playlist_id: videoAbove.playlist_id,
                        video_id: videoAbove.video_id,
                    }
                },
                data: {
                    position: {
                        increment: 1,
                    },
                },
            }),
            Prisma.playlist_videos.update({
                where: {
                    playlist_id_video_id: {
                        playlist_id,
                        video_id,
                    }
                },
                data: {
                    position: {
                        decrement: 1,
                    },
                },
            })
        ])

        return res.status(200).json({status: "Success", message: "Posisi video diperbaharui"});
    } catch(err) {
        return res.status(500).json({status: "Server Error", error: err.message});
    }
}

const playlistVideoPositionDown = async (req,res) => {
    try {
        const { playlist_id, video_id } = req.body;
    
        if (!playlist_id || !video_id) {
            return res.status(400).json({ status: "Bad Request", message: "playlist_id and video_id tidak ditemukan" });
        }

        const video = await Prisma.playlist_videos.findUnique({
            where: {
                playlist_id_video_id: {
                    playlist_id,
                    video_id,
                }
            },
            select: {
                position: true,
            },
        });

        const maxPosition = await Prisma.playlist_videos.aggregate({
            where: {
                playlist_id,
            },
            _max: {
                position: true,
            },
        });

        const maxPos = maxPosition._max.position;

        if (video.position >= maxPos) {
            return res.status(400).json({ status: "Bad Request", message: "Video sudah berada di posisi terbawah" });
        }

        const currentPosition = video.position;

        const videoBelow = await Prisma.playlist_videos.findFirst({
            where: {
                playlist_id: playlist_id,
                position: currentPosition + 1,
            },
        });
        
        await Prisma.$transaction([
            Prisma.playlist_videos.update({
                where: {
                    playlist_id_video_id: {
                        playlist_id: videoBelow.playlist_id,
                        video_id: videoBelow.video_id,
                    }
                },
                data: {
                    position: {
                        decrement: 1,
                    },
                },
            }),    
            Prisma.playlist_videos.update({
                where: {
                    playlist_id_video_id: {
                        playlist_id,
                        video_id,
                    }
                },
                data: {
                    position: {
                        increment: 1,
                    },
                },
            })
        ])

        return res.status(200).json({status: "Success", message: "Posisi video diperbaharui"});
    } catch(err) {
        return res.status(500).json({status: "Server Error", error: err.message});
    }
}

module.exports = { playlistVideosById, playlistVideoPositionUp, playlistVideoPositionDown };