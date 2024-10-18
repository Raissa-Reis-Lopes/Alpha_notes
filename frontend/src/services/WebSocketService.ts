// services/websocketService.ts
class WebSocketService {
  private socket: WebSocket | null = null;
  private callbacks: { [key: string]: (data: any) => void } = {};

  connect() {
    this.socket = new WebSocket('ws://localhost:3001');

    this.socket.onopen = () => {
      console.log('Conectado ao WebSocket');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const callback = this.callbacks[data.noteId];
      if (callback) {
        callback(data);
      }
    };

    this.socket.onclose = () => {
      console.log('Conexão WebSocket fechada');
    };
  }

  // Registra uma função de callback para um noteId específico
  registerCallback(noteId: string, callback: (data: any) => void) {
    this.callbacks[noteId] = callback;
  }

  send(message: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  disconnect() {
    this.socket?.close();
  }
}

export const webSocketService = new WebSocketService();
