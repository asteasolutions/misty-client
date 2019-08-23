const _ = require('lodash');
const MistyRestApiClient = require('./MistyRestApiClient');
const MistyEventObserver = require('./MistyEventObserver');

const STANDARD_OPTIONS = {
  shouldEmote: true,
  normalFace: 'Homeostasis.png',
  normalArmPosition: [-45, -45],
};

class MistyFeat {
  constructor(robotIp, defaultOptions = {}) {
    this._robotIp = robotIp;
    this._mistyClient = new MistyRestApiClient(robotIp);
    this._eventObserver = null;
    this._defaultOptions = _.merge({}, STANDARD_OPTIONS, defaultOptions);
    this._isRunning = false;
    this._options = null;
  }

  // Protected methods
  async _exec(procedure, options) {
    if (this._isRunning) {
      return false;
    }

    this._isRunning = true;
    this._options = _.merge({}, this._defaultOptions, options);
    return await procedure();
  }

  async _cleanup() {
    if (this._eventObserver) {
      await this._eventObserver.destroy();
      this._eventObserver = null;
    }
    this._isRunning = false;
    this._options = null;
  }

  _initEventObserver() {
    if (!this._eventObserver) {
      this._eventObserver = new MistyEventObserver(this._robotIp);
    }
    return this._eventObserver;
  }

  async _updateExpression(fileName) {
    if (this._options && this._options.shouldEmote) {
      await this._mistyClient.postJSON('images/display', { FileName: fileName });
    }
  }

  async _resetExpression() {
    await this._updateExpression(this._options.normalFace);
  }
  
  async _updateArmPosition(leftArmPosition, rightArmPosition) {
    if (this._options && this._options.shouldEmote) {
      await this._mistyClient.postJSON('arms/set', {
        leftArmPosition,
        rightArmPosition,
        leftArmVelocity: 70,
        rightArmVelocity: 70,
        units: 'degrees',
      });
    }
  }

  async _resetArmPosition() {
    await this._updateArmPosition(...this._options.normalArmPosition);
  }
}

module.exports = MistyFeat;
