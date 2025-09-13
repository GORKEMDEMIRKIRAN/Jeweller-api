

// import Redis from "ioredis";

// const redis = new Redis({
//     host: process.env.REDIS_HOST || "127.0.0.1",
//     port: Number(process.env.REDIS_PORT) || 6379,
//     username:"default",
//     password: process.env.REDIS_PASSWORD || "",
//     tls:{}
// });

// export default redis;


import {createClient} from "redis";

const redis = createClient({
    socket:{
        host:process.env.REDIS_HOST || "127.0.0.1",
        port:Number(process.env.REDIS_PORT) || 6379
    },
    username:"default",
    password:process.env.REDIS_PASSWORD || "",
})

redis.on("error",(err)=>console.log("Redis Client Error",err));
await redis.connect();
export default redis;