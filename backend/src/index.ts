import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import routes from "./routes/routes";
import cors from 'cors';
import { WebSocketServer } from "ws";
import WebSocketService from "./services/webSocketServices";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "./config";
import { auth } from './middlewares/auth';
import { IncomingMessage } from "http"; // Importando IncomingMessage

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
app.use(express.json());
app.use(cookieParser());
app.use("/api", routes);

// Configuração do WebSocket Server
const wss = new WebSocketServer({ noServer: true });
const webSocketService = new WebSocketService(wss);

const server = app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}`);
});

// Lógica de upgrade para WebSocket
server.on('upgrade', (request: IncomingMessage, socket, head) => {
    console.log("CHegou dentro do upgrade do websocket")
    const res: any = {
        writeHead: (statusCode: number, headers: any) => {
            socket.write(`HTTP/1.1 ${statusCode} Unauthorized\r\n\r\n`);
            socket.destroy();
        },
        end: () => {
            socket.destroy();
        },
    };

    const next = () => {
        // Chama o handleUpgrade sem gerar um novo socketId
        wss.handleUpgrade(request, socket, head, (ws) => {
            console.log("CHegou dentro do handleUpgrade do websocket")
            wss.emit('connection', ws, request);
        });
    };

    // Chama o middleware de autenticação
    auth(request as Request, res as Response, next);
});

// Exporta a instância do WebSocketService
export default webSocketService;

// server.on('upgrade', (request, socket, head) => {
//     try {

//         console.log("Acessou aqui dentro do websocket no backend no server.on upgrade")
//         // Acessa diretamente os cookies já processados pelo cookieParser
//         const cookies = (request as any).cookies;
//         const token = cookies.session_id;

//         console.log("Cookies dentro do webscoket", cookies)
//         console.log("Token dentro do webscoket", token)

//         if (typeof token !== 'string') {
//             socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
//             socket.destroy();
//             return;
//         }

//         // Verifica o JWT
//         jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
//             if (err) {
//                 socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
//                 socket.destroy();
//                 return;
//             }

//             // Armazena o usuário autenticado no request
//             (request as any).user = decoded;

//             console.log("Decoded no backend ws", decoded)

//             // Se for bem-sucedido, faz o upgrade da conexão para WebSocket
//             wss.handleUpgrade(request, socket, head, (ws) => {
//                 wss.emit('connection', ws, request);
//             });
//         });
//     } catch (err) {
//         console.error('WebSocket authentication error:', err);
//         socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
//         socket.destroy();
//     }
// });

// export default webSocketService;