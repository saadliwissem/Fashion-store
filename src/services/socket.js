import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ["websocket"],
        autoConnect: true,
      });

      this.socket.on("connect", () => {
        console.log("Socket connected");
      });

      this.socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      // Set up default listeners
      this.setupDefaultListeners();
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  setupDefaultListeners() {
    // Fragment updates
    this.socket.on("fragment-update", (data) => {
      const callbacks = this.listeners.get("fragment-update") || [];
      callbacks.forEach((callback) => callback(data));
    });

    // Waitlist updates
    this.socket.on("waitlist-changed", (data) => {
      const callbacks = this.listeners.get("waitlist-changed") || [];
      callbacks.forEach((callback) => callback(data));
    });

    // Production status updates
    this.socket.on("production-status-changed", (data) => {
      const callbacks = this.listeners.get("production-status-changed") || [];
      callbacks.forEach((callback) => callback(data));
    });
  }

  subscribeToChronicle(chronicleId) {
    if (this.socket) {
      this.socket.emit("subscribe-to-chronicle", chronicleId);
    }
  }

  unsubscribeFromChronicle(chronicleId) {
    if (this.socket) {
      this.socket.emit("unsubscribe-from-chronicle", chronicleId);
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners
        .get(event)
        .filter((cb) => cb !== callback);
      this.listeners.set(event, callbacks);
    }
  }
}

export default new SocketService();
