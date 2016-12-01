"use strict";
var Joi = require('joi');

module.exports = {
  params: {
    sensorId: Joi.string(),
    since: Joi.number(),
    until: Joi.number(),
  }
};
