const downloadFile = require('./download');
const uploadFile = require('./upload');
const handleSIGINT = require('./handleSigInt');
const createLocalTunnel = require('./local-tunnel');

module.exports = {
  downloadFile,
  uploadFile,
  handleSIGINT,
  createLocalTunnel,
};
