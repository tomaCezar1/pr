const moment = require('moment');

function formatMessageWithTime(username, text) {
  return {
    username,
    text,
    time: moment().format('h:mm a'),
  };
}

module.exports = formatMessageWithTime;
