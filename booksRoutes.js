const {client} = require("./db")
const {ObjectId} = require("mongodb");

const booksDB = client.db("booksDB").collection("books");

const getBooks = async (req, res) => {

    const queryParams = req.query;
    const search = queryParams.search || "all";
    const minYear = queryParams.minyear || 0;
    const maxYear = queryParams.maxyear || Number.MAX_SAFE_INTEGER;

    const query = {

    };

    if (search !== "all") {
        const regex = new RegExp(search, 'i');
        query.title = regex;
    }

    if (minYear || maxYear) {
        query.year = {
            $gte: parseInt(minYear),
            $lte: parseInt(maxYear)
        };

    }


    try {
        console.log(query);
        await client.connect()
        const cursor = await booksDB.find(query);
        const books = await cursor.toArray();
        res.send(books)


    } catch (error) {
        return res.status(500).send({
            status: 500,
            message: "Server Error in user processing"
        });
    }
};

const postBooks = async (req, res) => {

    const {title, year, author, imgUrl}= req.body;


    try {
        if (author && year && title && imgUrl){
            const newBooks = {title:title, year:year, author:author, imgUrl:imgUrl};
            await client.connect();
            const data = await booksDB.insertOne(newBooks)
            res.send(newBooks)
        }
    } catch (error) {
        return res.status(500).send({
            status: 500,
            message: "Server Error in user processing"
        });
    }
};

const deleteBooks = async (req, res) => {

    const id = req.params.id;
    
    try {
        if (id){
           const bookId = new ObjectId(id)
           console.log("delete");
            await client.connect();
            console.log(bookId);
            await booksDB.deleteOne({_id:bookId})
            res.send({status: "done"})
        }
    } catch (error) {
        return res.status(500).send({
            status: 500,
            message: "Server Error in user processing"
        });
    }
};

const updateBooks = async (req, res) => {
    const id = req.params.id;
    const updatedBook = req.body; 

   try {
        if (id){
           const bookId = new ObjectId(id)
           console.log("delete");
            await client.connect();
            console.log(bookId);
            await booksDB.updateOne({ _id: new ObjectId(id) }, { $set: updatedBook }, (err, result))
            res.send({status: "done"})
        }
    } catch (error) {
        return res.status(500).send({
            status: 500,
            message: "Server Error in user processing"
        });
    }
};


module.exports = {getBooks, postBooks, deleteBooks, updateBooks}