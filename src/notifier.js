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
  
    constructor() {
      const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
      const port = window.location.port;

      const wsUrl = `${protocol}://${window.location.hostname}:${port}/ws`;
      console.log('Attempting WebSocket connection to:', wsUrl);
      this.socket = new WebSocket(wsUrl);

    //   this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);
  
      this.socket.onopen = () => {
        this.receiveEvent(new EventMessage('Startup', Events.System, { msg: 'connected' }));
      };
  
      this.socket.onclose = () => {
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
  
    // Simon-style replay logic
    receiveEvent(event) {
      this.events.push(event);
  
      this.events.forEach((e) => {
        this.handlers.forEach((handler) => {
          handler(e);
        });
      });
    }
  }
  
export const StartupNotifier = new Notifier();
export { Events };
// let notifierInstance;
// function getNotifier() {
//   if (!notifierInstance) {
//     notifierInstance = new Notifier();
//   }
//   return notifierInstance;
// }

// export { getNotifier, Events };