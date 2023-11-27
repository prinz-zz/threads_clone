import mongoose from "mongoose";
import asycHandler from 'express-async-handler'

const dbConnection = asycHandler(async () => {

    let options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }; 

    const connect = await mongoose.connect(process.env.MONGO_URI, options);
    console.log('Db connection established DB name:' , connect.connection.name);
})

export {
    dbConnection,
}