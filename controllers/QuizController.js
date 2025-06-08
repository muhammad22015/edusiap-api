const { Prisma } = require('../prisma/prismaClient')

const quizbyId = async (req,res) => {
    const { video_id } = req.params;

    try {
        const quiz = await Prisma.quiz.findUnique({
          where: { video_id: parseInt(video_id) },
          include: {
                question: {
                    orderBy: {
                        position: 'asc'
                    },
                    include: {
                        answers: true
                    }
                }
          }
        });   
        if (!quiz) return res.status(404).json({ status: "Bad Request", error: "Tidak ada Quiz" });
    
        return res.status(200).json({status: "Authorized", response: quiz})
      } catch (err) {
        console.error(err);
        return res.status(500).json({ status: "Server Error", error: err.message });
      }
}

module.exports = { quizbyId };