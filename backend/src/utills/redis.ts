import {Redis} from 'ioredis'
require('dotenv').config()

const redisClient = () => {
    try {
        if(process.env.REDIS_URL){
            console.log("Redis Connected")
            return new Redis(process.env.REDIS_URL);
        }
    } catch (error:any) {
        console.log(error.message)
        throw error
    }
}

export default redisClient(); 