import dotenv from "dotenv";
import express, { Express } from "express";
import cookieParser from "cookie-parser";
import routes from "./routes/routes";
import { pool } from "./database/connection";
import cors from 'cors';

dotenv.config();


const PORT = process.env.PORT;


const app: Express = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use("/api", routes);

pool
    .connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on: http://localhost:${PORT}`);
        });
    })
    .catch((error: any) => {
        if (error instanceof Error) {
            console.error("Error connecting to database:", error.message);
        } else {
            console.error("Error connecting to database:", error);
        }
        console.error("Failed to connect to the database with URL:", process.env.DATABASE_URL);
    });