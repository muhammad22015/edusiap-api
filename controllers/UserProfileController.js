const { Prisma } = require('../prisma/prismaClient');
const Joi = require('joi');

const userProfileByUserId = async (req,res) => {
    const { id } = req.query;
    const { user_id } = req.user;
    if(parseInt(id) !== parseInt(user_id)) return res.status(403).json({ error: "Tidak diizinkan mengakses data user lain" });

    try {
        const user_profile = await Prisma.user_profile.findUnique({
            where: { user_id: parseInt(id)},
            include: { 
                user: {
                    select: {
                        email: true,
                        username: true,
                        created_at: true,
                    }
                },
            },
        })
        if(!user_profile) return res.status(404).json({status: "User tidak ditemukan"});
        
        return res.status(200).json({
            status: "Authorized", 
            response: {
                ...user_profile,
                avatar: user_profile.avatar || 'https://avatar.iran.liara.run/public/31'
            }
        })
    } catch(err) {
        return res.status(500).json({status: "Server Error", error: err.message});
    }
}

const updateUserProfileByUserId = async (req,res) => {
    const schema = Joi.object({
        fullname: Joi.string().allow(null, '').optional(),
        phone: Joi.string().pattern(/^0\d{9,12}$/).allow(null, '').optional(),
        avatar: Joi.string().uri().optional()
    })

    const { error, value } = schema.validate(req.body);
    if (error) return res.status(422).json({ status: error.details[0].message, error: `Input ${error.details[0].message.match(/"([^"]*)"/)?.[1]} data tidak memenuhi format yang ditentukan` });

    const { id } = req.query;
    const { user_id } = req.user;
    if(parseInt(id) !== parseInt(user_id)) return res.status(403).json({ error: "Tidak diizinkan mengakses data user lain" });

    try {
        const user_profile = await Prisma.user_profile.update({
            where: { user_id: parseInt(id)},
            data: {
                ...value
            }
        })
        if(!user_profile) return res.status(404).json({status: "Bad Request", error: "User tidak ditemukan"})

        return res.status(200).json({ status: "Update Berhasil"})
    } catch(err) {
        return res.status(500).json({status: "Server Error", error: err.message});
    }
}

module.exports = { userProfileByUserId, updateUserProfileByUserId };