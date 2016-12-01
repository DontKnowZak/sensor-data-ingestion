"use strict";
require("dotenv").config();
var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;
// insert phone number below
var recipient = "";
var client = require("twilio")(accountSid, authToken);

module.exports = {
  sendMessage: function() {
    client.messages.create({
      to: recipient,
      from: process.env.TWILIO_PHONE_NUMBER,
      body: "This is the ship that made the Kessel Run in fourteen parsecs?",
    }, function(err, message) {
      throw(message.sid);
    });
  },
};
