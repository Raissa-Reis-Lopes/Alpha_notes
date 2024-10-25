class WebSocketService {
  private socket: WebSocket | null = null;
  private callbacks: { [key: string]: (data: any) => void } = {};

  connect() {
    if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
      this.socket = new WebSocket(`wss://alpha04.alphaedtech.org.br`);
      console.log("this socket", this.socket);

      this.socket.onopen = () => {
        console.log('Conectado ao WebSocket');
      };

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        console.log("Event data", data);

        if (data.type && data.type === 'uuid') {
          console.log('SockeId received');
          if (this.callbacks['uuid']) {
            this.callbacks['uuid'](data);
          }
        }

        if (data.status && data.status === 'pending') {
          console.log('Embedding pending data');
          if (this.callbacks['pending']) {
            this.callbacks['pending'](data);
          }
        }

        if (data.status && data.status === 'processing') {
          console.log('Embedding processing data');
          if (this.callbacks['processing']) {
            this.callbacks['processing'](data);
          }
        }

        if (data.status && data.status === 'completed') {
          console.log('Embedding Completed');
          if (this.callbacks['completed']) {
            this.callbacks['completed'](data);
          }
        }

        const callback = this.callbacks[data.noteId];
        if (callback) {
          callback(data);
        }
      };

      this.socket.onerror = (error) => {
        console.error('Erro no WebSocket:', error);
      };

      this.socket.onclose = (event) => {
        console.log('Conexão WebSocket fechada. Código:', event.code, 'Motivo:', event.reason);
        this.socket = null; // Limpa o socket ao fechá-lo
      };
    }
  }

  registerCallback(noteId: string, callback: (data: any) => void) {
    this.callbacks[noteId] = callback;
  }

  send(message: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null; // Limpa o socket ao desconectar
      this.callbacks = {}; // Limpa os callbacks ao desconectar
    }
  }
}

export const webSocketService = new WebSocketService();
