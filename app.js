"use strict";

var async = require("async");
var express = require("express");
var app = express();
var r = require("rethinkdb");
var config = require("./config.js");

app.put("/data", function (req, res) {
  res.send("Got a PUT request");
});

function startExpress(connection) {
  app._rdbConn = connection;
  app.listen(3000);
  console.log("Listening on port 3000");
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
    //Create the table if needed.
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
    console.error(err);
    process.exit(1);
    return;
  }

  startExpress(connection);
});
