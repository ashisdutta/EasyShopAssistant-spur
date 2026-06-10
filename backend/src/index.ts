import express from "express";
import cors from "cors";
import chatRouter from './routes/chat.js'

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json())
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://easy-shop-assistant-spur.vercel.app"
    ]
}))


app.use('/chat', chatRouter)


app.listen(PORT, ()=>{
    console.log(`app listening to port ${PORT}`)
})