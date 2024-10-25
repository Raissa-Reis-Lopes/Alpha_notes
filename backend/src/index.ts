import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import routes from "./routes/routes";
import cors from 'cors';
import fs from "fs";
import path from "path";
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { WebSocket } from 'ws';

dotenv.config();

const PORT = process.env.PORT || 3001;

const app: Express = express();

const corsOptions = {
    origin: process.env.NODE_ENV === 'production' ? 'https://alpha04.alphaedtech.org.br' : 'http://localhost:3000',
    credentials: true,
};

app.use(cors(corsOptions));
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(express.static(uploadsDir));
app.use(express.json({ limit: '10mb' })); // Ajuste o limite conforme necessário
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api", routes);

const server = app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}`);
});

// Configuração do WebSocket
const wss = new WebSocketServer({ server });

const clients: Record<string, WebSocket> = {}; // Armazena os clientes conectados


wss.on("connection", (ws, req) => {
    // Middleware de autenticação do WebSocket
    const token = req.headers.cookie?.split("; ").find((c) => c.startsWith("session_id="))?.split("=")[1];
    if (!token) {
        ws.close(1008, "Unauthorized"); // Código de fechamento para autenticação falha
        return;
    }

    // Verificação do token JWT
    jwt.verify(token, process.env.SECRET_KEY!, (err, decoded: any) => {
        if (err) {
            ws.close(1008, "Unauthorized");
            return;
        }

        // Gera um socketId único para o cliente e envia ao cliente
        const socketId = `socket_${decoded.id}_${Date.now()}`;
        clients[socketId] = ws; // Armazena o cliente com seu socketId
        ws.send(JSON.stringify({ socketId }));

        ws.on("message", (message) => {
            console.log(`Message received from client ${socketId}: ${message}`);
            // Aqui você pode processar as mensagens enviadas pelo cliente
        });

        ws.on("close", () => {
            console.log(`Client ${socketId} disconnected`);
            delete clients[socketId];
        });
    });
});

// Função para obter o cliente pelo socketId
const getClient = (socketId: string) => clients[socketId];
export default { getClient };