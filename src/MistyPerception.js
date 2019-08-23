const MistyFeat = require('./MistyFeat');

class MistyPerception extends MistyFeat {
  async start(options) {
    return await this._exec(() => this._start(), options);
  }

  async stop() {
    const result = await this._stop();
    await this._cleanup();
    return result;
  }

  // Implement in descendants.
  async _start() {}
  async _stop() {}
}

module.exports = MistyPerception;
