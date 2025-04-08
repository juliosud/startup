const Events = {
  System: 'system',
  Message: 'message',
  Update: 'update',
};

class EventMessage {
  constructor(from, type, value) {
    this.from = from;
    this.type = type;
    this.value = value;
  }
}

class Notifier {
  events = [];
  handlers = [];
  connected = false;

  constructor() {
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    const port = window.location.port;

    const wsUrl = `${protocol}://${window.location.hostname}:${port}/ws`;
    console.log('Attempting WebSocket connection to:', wsUrl);
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log('[WebSocket] Connected');
      this.connected = true;
      this.receiveEvent(new EventMessage('Startup', Events.System, { msg: 'connected' }));
    };

    this.socket.onclose = () => {
      console.log('[WebSocket] Disconnected');
      this.connected = false;
      this.receiveEvent(new EventMessage('Startup', Events.System, { msg: 'disconnected' }));
    };

    this.socket.onmessage = async (msg) => {
      try {
        const event = JSON.parse(await msg.data.text());
        this.receiveEvent(event);
      } catch (err) {
        console.error('WebSocket parse error:', err);
      }
    };
  }

  broadcastEvent(from, type, value) {
    const event = new EventMessage(from, type, value);
    this.socket.send(JSON.stringify(event));
  }

  addHandler(handler) {
    this.handlers.push(handler);
  }

  receiveEvent(event) {
    this.events.push(event); // optional
    this.handlers.forEach((handler) => handler(event));
  }
}

export const StartupNotifier = new Notifier();
export { Events };
