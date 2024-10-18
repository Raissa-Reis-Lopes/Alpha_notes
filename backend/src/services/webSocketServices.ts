import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';

class WebSocketService {
    private clients: { [key: string]: WebSocket } = {};  // Mapa de clientes com UUID como chave

    constructor(private wss: WebSocketServer) {
        this.initialize();
    }

    public getClient(clientId: string): WebSocket | undefined {
        return this.clients[clientId];  // Método para obter um cliente
    }


    private initialize() {
        this.wss.on('connection', (ws: WebSocket) => {
            const clientId = uuidv4();  // Gerando um UUID para o cliente
            console.log(`Client connected with ID: ${clientId}`);

            this.clients[clientId] = ws;  // Guardando o WebSocket no mapa de clientes

            // Enviar o clientId (socketId) para o cliente assim que a conexão for estabelecida
            ws.send(JSON.stringify({ type: 'uuid', socketId: clientId }));

            ws.on('message', (message: string) => {
                console.log(`received from ${clientId}:`, message);
                // Lógica para tratar mensagens recebidas de clientes
            });

            ws.on('close', () => {
                console.log(`Client with ID: ${clientId} disconnected`);
                delete this.clients[clientId];  // Removendo o cliente quando a conexão for fechada
            });
        });
    }

}

export default WebSocketService;
