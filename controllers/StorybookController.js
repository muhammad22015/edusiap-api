const { Prisma } = require('../prisma/prismaClient')

const allData = async (req,res) => {
    try {
        const storybooks = await Prisma.story_book.findMany();

        return res.status(200).json({status: "Authorized", response: storybooks});
    } catch(err) {
        return res.status(500).json({status: "Server Error", error: err.message});
    }
}

const bookbyId = async (req,res) => {
    const { id } = req.query;

    try {
        const storybook = await Prisma.story_book.findUnique({
            where: { book_id: parseInt(id)}
        })
        if(!storybook) return res.status(404).json({status: "Bad Request", error: "Buku Tidak Ditemukan"});
        
        return res.status(200).json({status: "Authorized", response: storybook})
    } catch(err) {
        return res.status(500).json({status: "Server Error", error: err.message});
    }
}

module.exports = { allData, bookbyId };