const fs = require('fs');

const config = {
  host: process.env.HOST,
  port: process.env.PORT || 22,
  username: process.env.USER_NAME,
  privateKey: fs.readFileSync(process.env.PRIVATE_KEY_PATH),
};

for (let key of Object.keys(config)) {
  if (config[key] === undefined) {
    throw Error('Please provide all necessary configs');
  }
}

module.exports = config;