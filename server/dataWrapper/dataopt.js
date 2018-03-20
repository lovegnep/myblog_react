const Redis = require('redis');
const Config = require('../config');
const Bluebird = require('bluebird');
const typesKey = 'types'

let redisClient = Redis.createClient();
Bluebird.promisifyAll(Redis.RedisClient.prototype);
Bluebird.promisifyAll(Redis.Multi.prototype);

async function getTypes(){
    try{
        let result = await redisClient.lrangeAsync(typesKey, 0, -1);
        console.log(result);
        return result;
    }catch(err){
        console.log('getTypes:', err);
        
    }
    
}
async function addTypes(typeObj){
    try{
        let result = await redisClient.lpushAsync(typesKey, typeObj);
        console.log(result);
        return result;
    }catch(err){
        console.log('addTypes:', err);

    }
}
exports = {
    getTypes: getTypes,
    addTypes: addTypes,
    redisClient: redisClient
}
Object.assign(module.exports, exports);
