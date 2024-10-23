import dotenv from "dotenv";
import express, { Express } from "express";
import cookieParser from "cookie-parser";
import routes from "./routes/routes";
import cors from 'cors';
import { WebSocketServer } from "ws";
import WebSocketService from "./services/webSocketServices";
import https from "https"; // Importa o módulo https
import fs from "fs"; // Para ler arquivos do sistema de arquivos

dotenv.config();

const PORT = process.env.PORT || 3001; // Defina um valor padrão

const app: Express = express();

const corsOptions = {
    origin: process.env.NODE_ENV === 'production' ? 'https://alpha04.alphaedtech.org.br' : 'http://localhost:3000',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.static('uploads'));
app.use(express.json());
app.use(cookieParser());
app.use("/api", routes);

// Configuração do WebSocket Server
const wss = new WebSocketServer({ noServer: true });
const webSocketService = new WebSocketService(wss);

const sslOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/alpha04.alphaedtech.org.br/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/alpha04.alphaedtech.org.br/fullchain.pem')
};

const server = https.createServer(sslOptions, app);

server.listen(PORT, () => {
    console.log(`Server running on: https://alpha04.alphaedtech.org.br:${PORT}`);
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

export default webSocketService;




// import dotenv from "dotenv";
// import express, { Express } from "express";
// import cookieParser from "cookie-parser";
// import routes from "./routes/routes";
// import { pool } from "./database/connection";
// import cors from 'cors';
// import { WebSocketServer } from "ws";
// import WebSocketService from "./services/webSocketServices";

// dotenv.config();


// const PORT = process.env.PORT;


// const app: Express = express();

// const corsOptions = {
//     origin: 'http://localhost:3000',
//     credentials: true,
// };

// app.use(cors(corsOptions));

// app.use(express.static('uploads'));
// app.use(express.json());
// app.use(cookieParser());
// app.use("/api", routes);

// // Configuração do WebSocket Server
// const wss = new WebSocketServer({ noServer: true });
// const webSocketService = new WebSocketService(wss);

// // Integrando WebSocket com o servidor HTTP
// const server = app.listen(PORT, () => {
//     console.log(`Server running on: http://localhost:${PORT}`);
// });

// // Tratando upgrade de conexão para WebSocket
// server.on('upgrade', (request, socket, head) => {
//     wss.handleUpgrade(request, socket, head, (ws) => {
//         wss.emit('connection', ws, request);
//     });
// });

// export default webSocketService;
