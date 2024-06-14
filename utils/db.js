import mongoose from "mongoose";

export const connectDB = async() => {
    try{

        await mongoose.connect("mongodb+srv://evesteve94:4oZmTn4M0kSn5a4Y@seriescluster.njkha63.mongodb.net/boiler-malmo")
        .then(console.log("MongoDB is connected"))

    } catch(error){
        console.log(error.message)
    }
}

