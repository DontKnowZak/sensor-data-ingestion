"use strict";
var Joi = require("joi");

module.exports = {
  query: {
    sensorId: Joi.string(),
    since: Joi.number(),
    until: Joi.number(),
  },
};
