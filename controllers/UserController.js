const { Prisma } = require('../prisma/prismaClient')
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendVerificationMail } = require('../utils/sendMail');
// require('dotenv').config();

const register = async (req,res) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required().min(8),
    });

    const { error, value } = schema.validate(req.body);
    if (error) return res.status(422).json({status: error.details[0].message});

    const {username, email, password} = value;

    try {
        const existingUser = await Prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            if (existingUser.is_verified) {
                return res.status(409).json({ status: "Bad Request", error: 'Email sudah terdaftar' });
            }

            const NOW = new Date();
            const EMAIL_SENT = new Date(existingUser.created_at);
            const HOUR = 60 * 60 * 1000;

            if (NOW - EMAIL_SENT < HOUR) {
                return res.status(429).json({ status: "Bad Request", error: 'Link verifikasi telah dikirim, cek Email anda' });
            }

            await Prisma.user.update({
                where: { email },
                data: { created_at: new Date() }
              });              

            const token = jwt.sign({email: email}, process.env.JWT_SECRET, {expiresIn: "1h"});
            const url = `${process.env.BASE_URL}/users/verify?token=${token}`;
        
            await sendVerificationMail(email, url, username);

            return res.status(201).json({status: 'Verifikasi email telah dikirim' });
        }
    
        const existingUsername = await Prisma.user.findUnique({ where: { username } });
        if (existingUsername) {
          return res.status(409).json({ status: "Bad Request", error: 'Username sudah digunakan' });
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await Prisma.user.create({
            data: {
                email: email,
                username: username,
                password: hashedPassword
            }
        })

        await Prisma.user_profile.create({
            data: {
                fullname: "",
                phone: "",
                user_id: user.user_id,
            }
        })
        
        const token = jwt.sign({email: email}, process.env.JWT_SECRET, {expiresIn: "1h"});
        const url = `${process.env.BASE_URL}/users/verify?token=${token}`;
    
        await sendVerificationMail(email, url, username);
    
        return res.status(201).json({status: 'Verifikasi email telah dikirim' });
    } catch(err) {
        return res.status(500).json({status: "Server Error", error: err.message})
    }
}

const verify = async (req,res) => {
    const { token } = req.query;
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { email } = decoded;

        const user = await Prisma.user.findFirst({
            where: { email }
        });
        if (!user) return res.status(404).send('User tidak ditemukan atau Token kadaluarsa');
        if(user.is_verified) return res.status(404).send('Akun telah terverifikasi');

        await Prisma.user.update({
            where: { email },
            data: {
                is_verified: true,
            }
          });
        
        return res.send("Verifikasi Berhasil");
    } catch (err) {
        return res.send("Token Kadaluarsa");
    }
}

const login = async (req,res) => {
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({status: "Bad Request", error: "Email dan Password diperlukan!"});

    try {
        const user = await Prisma.user.findFirst({
            where: { email }
        });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!user || !isMatch) return res.status(401).json({status: "Bad Request", error: "Email atau Password salah!"});
        if(!user.is_verified) return res.status(401).json({status: "Bad Request", error: "Verify Akun terlebih dahulu!"});

        const payload = {
            user_id: user.user_id,
            email: user.email,
            username: user.username
        }

        const accesstoken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "5m" });
        const refreshtoken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

        await Prisma.refresh_token.create({
            data: {
                refresh_token: refreshtoken
            }
        });

        return res.status(200).json({status: "Login Berhasil", accesstoken, refreshtoken});
    } catch (err) {
        return res.status(500).json({status: "Server Error", error: err.message});
    }
}

const logout = async (req,res) => {
    const { refreshtoken } = req.body;
    if(!refreshtoken) return res.status(400).json({ status: "Bad Request", error: "refreshToken diperlukan"});

    try {
        await Prisma.refresh_token.delete({
            where: {
                refresh_token: refreshtoken
            }
        });

        return res.status(200).json({ status: "Logout Berhasil" });
    } catch(err) {
        return res.status(500).json({ status: "Server Error", error: err.message });
    }

}

module.exports = { register, verify, login, logout };