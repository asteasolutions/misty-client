const MistyFeat = require('./MistyFeat');

class MistyAction extends MistyFeat {
  async do(params, options = {}) {
    const execResult = await this._exec(async () => this._do(params), options);
    if (execResult !== false) {
      await this._cleanup();
    }
  }

  // Implement in descendants.
  async _do() {}
}

module.exports = MistyAction;
