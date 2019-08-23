const WebSocket = require('ws');
const { Subject } = require('rxjs');

class WebSocketClient {
  constructor(address) {
    const subject = new Subject();
    this.observable = subject.asObservable();
    
    this.ws = new WebSocket(address);
    this.isOpen = new Promise((resolve, reject) => {
      this.ws.on('open', resolve);
      this.ws.on('error', reject);
    });
    this.ws.on('message', data => subject.next(data));
    this.ws.on('error', error => subject.error(error));
    this.ws.on('close', () => subject.complete());
  }

  async send(data) {
    await this.isOpen;
    this.ws.send(data);
  }

  async close() {
    await this.isOpen;
    // Close with status code 1000 (Normal Closure)
    this.ws.close(1000);
  }
}

module.exports = WebSocketClient;
