const {getDB} = require('./db');

module.exports = class Chatlogs{
    constructor(message, timestamp, isSent, userId){
        this.message = message;
        this.timestamp = timestamp;
        this.userId = userId;
        this.isSent = isSent;
    };

    async addChatlog(){
        const db = getDB();
        const d = new Date().toISOString().split('T')[0].split('-').join('');
        console.log(d);
        try{
            const res = await db.collection('ids').findOne({prefix: d})
            if(res){
                await db.collection('ids').updateOne({prefix: d}, {$inc: {count: 1}})
                this._id = res.count + 1;
                console.log(this._id);
            }
            else{
                await db.collection('ids').insertOne({prefix: d, count: 0});
                const result = db.findOne({prefix: d})
                this._id = result.count + 1;
                console.log(this._id);
            }
            db.collection('chatlogs').insertOne(this);
            return this._id;
        }
        catch(err){
            console.log(err);
        }
    }

    static async getAllChatlogs(userId, skip, limit){
        const db = getDB();
        const res = await db.collection('chatlogs').find({userId: userId}).sort({timestamp: -1}).skip(skip).limit(limit).toArray();
        return res;
    }

    static async deleteAllChatlogs(userId){
        const db = getDB();
        const res = await db.collection('chatlogs').deleteMany();
        return res;
    }

    static async deleteMessage(userId, messageId){
        const db = getDB();
        try{
            const fc = await db.collection('chatlogs').findOne({_id: messageId});
            console.log(fc);
            if(fc){
                const res = await db.collection('chatlogs').deleteOne({_id: messageId, userId: userId});
                return res;
            }
            else{
                console.log('herer')
                return Promise.reject('not found!!');
            }
        }
        catch(err){
            return new Error('not found!!');
        }

    }
}