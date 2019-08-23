const WebSocketClient = require('./WebSocketClient');
const { map, filter } = require('rxjs/operators');
const { validateRobotAddress } = require('./utils');

const idChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function generateId(length) {
  return new Array(length).fill(0)
    .map(() => idChars.charAt(Math.floor(Math.random() * idChars.length)))
    .join('');
}

class MistyEventObserver {
  constructor(robotIp) {
    validateRobotAddress(robotIp);
    this.id = generateId(6);
    this.wsClient = new WebSocketClient(`ws://${robotIp}/pubsub`);
    this.eventIds = new Set();
  }

  startObserving(eventName, eventType, options) {
    const eventId = `${eventName}${this.id}`;
    this.eventIds.add(eventId);
    this.wsClient.send(JSON.stringify({
      $id: '1',
      Operation: 'subscribe',
      Type: eventType,
      EventName: eventId,
      ...options,
    }));
    return this.wsClient.observable
      .pipe(filter(event => event.includes(eventId)))
      .pipe(map(event => JSON.parse(event)))
      .pipe(filter(data => data.eventName === eventId))
      .pipe(filter(data => typeof data.message !== 'string' || !data.message.includes('Registration Status:')));
  }

  async stopObserving(eventName) {
    console.log(`Unsubscribing ${eventName}...`);
    await this.stopObservingById(`${eventName}${this.id}`)
  }

  async destroy() {
    this.eventIds.forEach(async eventId => await this.stopObservingById(eventId));
    await this.wsClient.close();
  }

  async stopObservingById(eventId) {
    await this.wsClient.send(JSON.stringify({
      $id: '1',
      Operation: 'unsubscribe',
      EventName: eventId,
      Message: '',
    }));
    this.eventIds.delete(eventId);
  }
}

module.exports = MistyEventObserver;
