"use strict";
require("dotenv").config();
var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;
var recipient = process.env.RECIPIENT_PHONE_NUMBER;
var twilioNumber = process.env.TWILIO_PHONE_NUMBER;
var client = require("twilio")(accountSid, authToken);

module.exports = {
  sendMessage: function() {
    client.messages.create({
      to: recipient,
      from: twilioNumber,
      body: "This is the ship that made the Kessel Run in fourteen parsecs?",
    }, function(err, message) {
      throw(message.sid);
    });
  },
};
