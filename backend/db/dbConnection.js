import mongoose from "mongoose";
import asycHandler from 'express-async-handler'

const dbConnection = asycHandler(async () => {

    

    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log('Db connection established DB name:' , connect.connection.name);
})

export {
    dbConnection,
}