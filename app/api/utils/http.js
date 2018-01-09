module.exports = { sendError }

/** 
 * Logs the passed error and sends an error message using the status and msg params 
 * @param {number} status - The statusCode to send
 * @param {string} msg - The error message to send
 * @param {object} err - The error object to log
 * @param {object} res - The response object, used for sendig the message
 * @returns {void}
*/
function sendError(status, msg, err, res) {
  if (err.message != 'Faked Error')
    winston.error(err);

  res.status(status).send(msg);
}


