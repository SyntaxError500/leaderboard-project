import mongoose from "mongoose";

const connectDb = async () => {

    mongoose.connection.on('connected',()=>{
        console.log("Db con.");
    })
        await mongoose.connect(`mongodb+srv://SyntaxError500:Sahil991@leaderboard.fkc076h.mongodb.net/?retryWrites=true&w=majority&appName=Leaderboard`);
} 
export default connectDb;
