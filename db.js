const mongoDB = require('mongodb');
const { MongoClient } = mongoDB;

let _db;

const mongoConnect = callback => {
    MongoClient.connect('mongodb+srv://viFlan:fragHorn12@mydatabase.1cxcq.mongodb.net/adarsh-task?retryWrites=true&w=majority', {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    })
    .then(client => {
        // console.log(client);
        _db = client.db();
        console.log('Connected!!');
        callback();
    })
    .catch((error) => {
        // const error = new Error('Database connection failed!!');
        console.log(error);
    });
}

const getDB = () => {
    if(_db)
        return _db;
    throw new Error('Database connection failed!!!');
}

module.exports = {
    mongoConnect: mongoConnect,
    getDB: getDB
};