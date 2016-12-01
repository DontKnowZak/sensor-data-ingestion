"use strict";

var async = require("async");
var express = require("express");
var validation = require("./validation");
var app = express();
var r = require("rethinkdb");
var config = require("./config.js");
var bodyParser = require("body-parser");
var validate = require("express-validation");
var lowerThreshold = 0;
var upperThreshold = 10;

app.use(bodyParser.json());

app.put("/data", validate(validation.putData), insertInTable);

app.get("/data", validate(validation.getData), retrieveData);

function insertInTable(req, res) {
  var dataPoint = req.body;

  r.branch(
    r.table("sensorDataPoints").filter({
      sensorId: req.body.sensorId,
      time: req.body.time,
    }).isEmpty(),
    r.table("sensorDataPoints").insert(dataPoint),
    {}
  ).run(req.app._rdbConn, function(err, result, next) {
    if(err) {
      return next(err);
    }
    if (result.generated_keys) {
      res.sendStatus(204);
      checkThresholds(req.body.value);
    } else {
      res.sendStatus(409);
    }
  });
}

function retrieveData(req, res, next) {
  var responseData = [];
  var id = req.query.sensorId;
  var since = req.query.since;
  var until = req.query.until;
  r.table("sensorDataPoints")
    .between(since, until, { rightBound: "closed", index: "time" })
    .filter(r.row("sensorId").eq(id))
  .run(req.app._rdbConn, function(err, cursor) {
    if(err) {
      return next(err);
    }

    cursor.eachAsync(function (row, rowFinished) {
      responseData.push(row);
      rowFinished();
    }, function () {
      res.json(responseData);
    });
  });
}

function checkThresholds(value) {
  if (upperThreshold) {
    if (value >= upperThreshold) {

    }
  }
  if (lowerThreshold) {
    if (value <= lowerThreshold) {

    }
  }
}

function startExpress(connection) {
  app._rdbConn = connection;
  app.listen(3000);
}

async.waterfall([
  function connect(callback) {
    r.connect(config.rethinkdb, callback);
  },
  function createDatabase(connection, callback) {
    r.dbList().contains(config.rethinkdb.db).do(function(containsDb) {
      return r.branch(
        containsDb,
        { created: 0 },
        r.dbCreate(config.rethinkdb.db)
      );
    }).run(connection, function(err) {
      callback(err, connection);
    });
  },
  function createTable(connection, callback) {
    r.tableList().contains("sensorDataPoints").do(function(containsTable) {
      return r.branch(
        containsTable,
        { created: 0 },
        r.tableCreate("sensorDataPoints")
      );
    }).run(connection, function(err) {
      callback(err, connection);
    });
  },
], function(err, connection) {
  if(err) {
    process.exit(1);
    return;
  }

  startExpress(connection);
});
