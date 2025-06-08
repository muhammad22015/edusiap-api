const { Prisma } = require('../prisma/prismaClient');

const scoreById = async (req, res) => {
    const { user_id } = req.user;
    // Get quiz_id from params instead of body for GET requests
    const quiz_id = req.params.quiz_id ? parseInt(req.params.quiz_id) : null;
    
    // Debug logging
    console.log('Debug scoreById:');
    console.log('req.user:', req.user);
    console.log('req.params:', req.params);
    console.log('user_id:', user_id);
    console.log('quiz_id (raw):', req.params.quiz_id);
    console.log('quiz_id (parsed):', quiz_id);
    
    if (!user_id || !quiz_id || isNaN(quiz_id)) {
        return res.status(400).json({ 
            status: "Bad Request", 
            error: `user_id atau quiz_id tidak ditemukan. user_id: ${user_id}, quiz_id: ${quiz_id}`
        });
    }

    try {
        const userquiz = await Prisma.user_quiz.findUnique({
            where: {
                user_id_quiz_id: {
                    user_id,
                    quiz_id
                }
            }
        });
        
        if (!userquiz) {
            return res.status(404).json({ 
                status: "Not Found", 
                error: "Belum Mengerjakan Quiz"
            });
        }

        return res.status(200).json({ 
            status: "Authorized", 
            response: userquiz
        });
    } catch (err) {
        return res.status(500).json({ 
            status: "Server Error", 
            error: err.message
        });
    }
}

const uploadScoreById = async (req, res) => {
    const { user_id } = req.user;
    const { quiz_id, score } = req.body;
    
    if (!user_id || !quiz_id) {
        return res.status(400).json({ 
            status: "Bad Request", 
            error: "user_id atau quiz_id tidak ditemukan"
        });
    }

    try {
        await Prisma.user_quiz.upsert({
            where: {
                user_id_quiz_id: {
                    user_id, 
                    quiz_id
                }
            },
            create: {
                user_id,
                quiz_id,
                score
            },
            update: {
                score
            },
        });

        return res.status(200).json({ 
            status: "Success", 
            message: "UserQuiz Score terbaharui"
        });
    } catch (err) {
        return res.status(500).json({ 
            status: "Server Error", 
            error: err.message 
        });
    }
}

module.exports = { scoreById, uploadScoreById };