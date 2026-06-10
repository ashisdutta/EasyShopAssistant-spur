import express from "express";
import cors from "cors";
import chatRouter from './routes/chat.js'

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json())
app.use(cors())


app.use('/chat', chatRouter)


app.listen(PORT, ()=>{
    console.log(`app listening to port ${PORT}`)
})