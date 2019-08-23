module.exports = {
  validateRobotAddress(robotIp) {
    if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(robotIp)) {
      throw new Error(`Invalid robot IP address: "${robotIp}".`);
    }
  }
}