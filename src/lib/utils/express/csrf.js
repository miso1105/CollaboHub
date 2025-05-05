const crypto = require('crypto');

exports.generateCsrfToken = () => {
    return crypto.randomBytes(32).toString('hex');
};