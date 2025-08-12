import express from 'express'
import round1Routes from './routes/round1.js';
import connectDb from './config/mongodb.js';
import cors from "cors";

const app = express();
const port = 4000;
connectDb();


app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.send("working");
});

app.use('/api/round1', round1Routes);

app.listen(port,()=>{
    console.log("connection started")
});