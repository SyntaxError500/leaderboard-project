import mongoose from "mongoose";
const Schema = mongoose.Schema;


const roundSchema = new Schema({
   name:{
        type:String,
        required:true,
    },
    college:{
        type:String,
        required:true,
    },
    round1:{
        type:Number,
        required:true,
        default:0
    },
    round2:{
        type:Number,
        required:true,
        default:0
    },
    round3:{
        type:Number,
        required:true,
        default:0
    }
});
    const roundModel = mongoose.models.round || mongoose.model("round", roundSchema);

export default roundModel;    