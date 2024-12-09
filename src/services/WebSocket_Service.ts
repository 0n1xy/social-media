import { WebSocketServer, WebSocket } from "ws";

class WebSocketService {
  private server: WebSocketServer | null = null;
  private userConnections: Map<string, WebSocket[]> = new Map(); // Map userId to a list of WebSocket connections

  /**
   * Start the WebSocket server on the given port.
   */
  start(port: number): void {
    if (this.server) {
      console.log("WebSocket server is already running.");
      return;
    }

    this.server = new WebSocketServer({ port });
    console.log(`WebSocket server is running on port ${port}`);

    this.server.on("connection", (socket, req) => {
      const url = new URL(req.url || "", `http://${req.headers.host}`);
      const userId = url.searchParams.get("userId");

      if (!userId) {
        console.error("Connection attempted without a userId.");
        socket.close();
        return;
      }

      console.log(`User ${userId} connected via WebSocket.`);

      if (!this.userConnections.has(userId)) {
        this.userConnections.set(userId, []);
      }
      this.userConnections.get(userId)?.push(socket);

      socket.on("close", () => {
        console.log(`User ${userId} disconnected.`);
        const userSockets = this.userConnections.get(userId) || [];
        this.userConnections.set(
          userId,
          userSockets.filter((s) => s !== socket)
        );
      });
    });
  }

  /**
   * Send a message to all sockets of a userId.
   */
  sendMessageToUser(userId: string, message: any): void {
    const userSockets = this.userConnections.get(userId);
    if (userSockets) {
      userSockets.forEach((socket) => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(message));
        }
      });
    }
  }
}

// Export a singleton WebSocketService instance
const webSocketService = new WebSocketService();
export default webSocketService;
