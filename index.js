const express = require('express');
const bodyParser = require('body-parser');

const Chatlogs = require('./chatlogs');
const db = require('./db');


const app = express();

app.use(bodyParser.json());


app.use((req, res, next) => {
    console.log('hello world!!');
    next();
});

app.get('/chatlogs/:userId', (req, res, next) => {
    const userId = req.params.userId;
    const limit = Number(req.query.limit);
    const skip = Number(req.query.start);
    Chatlogs.getAllChatlogs(userId, skip, limit)
    .then(result => {
        console.log(result);
        res.status(200).json(result);   
    })
    .catch(err => console.log(err));
});

app.post('/chatlogs/:userId', (req, res, next) => {
    const userId = req.params.userId;
    const msg = req.body.message;
    const timestamp = req.body.timestamp;
    const isSent = req.body.isSent;
    const chatlog = new Chatlogs(msg, timestamp, isSent, userId);
    chatlog.addChatlog()
    .then(result => {
        res.status(201).json(result);
    })
    .catch(err => {
        console.log(err);
    });
});

app.delete('/chatlogs/:userId/:messageId', (req, res, next) => {
    const userId = req.params.userId;
    const msgId = req.params.messageId;
    Chatlogs.deleteMessage(userId, msgId)
    .then(result => {
        console.log('message deleted');
        console.log(result);
        res.status(200).json('deleted');
    })
    .catch(err => {
        console.log(err)
        res.status(400).json('not found');
    });
});

app.delete('/chatlogs/:userId', (req, res, next) => {
    const userId = req.params.userId;
    Chatlogs.deleteAllChatlogs()
    .then(result=> {
        console.log('deleted all chatlogs!!');
        res.status(200).json('Deleted all chatlogs!!');
    })
    .catch(err => {
        console.log(err)
        res.status(400).json('not found');
    });
});

db.mongoConnect(() => {
    app.listen(5000, () => {
        console.log('server started');
    });
});
