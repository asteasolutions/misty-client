const fetch = require('node-fetch');
const qs = require('querystring');
const { validateRobotAddress } = require('./utils');

function getApiEndpoint(robotIp, endpoint, queryParams) {
  let url = `http://${robotIp}/api/${endpoint}`;
  if (queryParams) {
    url += `?${qs.stringify(queryParams)}`;
  }
  return url;
}

async function makeRequest(url, options) {
  const response = await fetch(url, options);
  const jsonResponse = await response.json();
  if (jsonResponse.status === 'Success') {
    return jsonResponse.result;
  }
  throw new Error(jsonResponse.error);
}

class MistyRestApiClient {
  constructor(robotIp) {
    validateRobotAddress(robotIp);
    this.robotIp = robotIp;
  }

  async getRaw(endpoint, queryParams) {
    return await fetch(getApiEndpoint(this.robotIp, endpoint, queryParams));
  }

  async get(endpoint, queryParams) {
    return makeRequest(getApiEndpoint(this.robotIp, endpoint, queryParams));
  }
  
  async post(endpoint, body) {
    return makeRequest(getApiEndpoint(this.robotIp, endpoint), { body, method: 'POST', });
  }

  async postJSON(endpoint, data) {
    return makeRequest(getApiEndpoint(this.robotIp, endpoint), {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

module.exports = MistyRestApiClient;
