"use strict";
var Joi = require('joi');

module.exports = {
  body: {
    sensorId: Joi.string().required(),
    time: Joi.number().integer().required(),
    value: Joi.number().required(),
  }
};
