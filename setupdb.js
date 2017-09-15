// THIS FILE SETS UP THE DATABASE AND TABLES

var mysql = require('mysql');
var db = 'api';

// create mysql connection
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'test'
});

// create database if it does not exist
connection.query('CREATE DATABASE IF NOT EXISTS ??', db, function(err, result) {
  if (err) {
    console.log('error in creating database', err);
    return;
  }

  console.log("connected to mysql server");
    
  if (result.affectedRows == 1) {  // database did not exist
    console.log("created 'api' database");
  }

  // use 'api' database
  connection.changeUser({
    database : db
  }, function(err) {
    if (err) {
      console.log('error in changing database', err);
      return;
    }        
  });
});

// make mysql connection available to calling module
exports.connection = function() {
    return connection;
};
  
// run migrations to create tables if it does not exist, using marv
exports.run_migrations = function(callback) {
  const path = require('path')
  const marv = require('marv')
  const mysqlDriver = require('marv-mysql-driver')
  const directory = path.join(process.cwd(), 'migrations' )
  const driver = mysqlDriver({
    table: 'db_migrations',     // defaults to 'migrations'
    connection: {               // the connection sub document is passed directly to mysql.createConnection
        host: 'localhost',
        port: 3306,
        database: 'api',
        user: 'root',
        password: 'test',
        multipleStatements: true    // See https://www.npmjs.com/package/mysql#multiple-statement-queries
    }
  })
  marv.scan(directory, (err, migrations) => {  // scan migrations folder for sql files
    if (err) throw err
    marv.migrate(migrations, driver, (err) => {
        if (err) throw err
        // migrations done
        console.log("migrations done");
        callback();
    })
  })
}

// function to output a message
exports.output_message = function (res, message, err = '') {
  res.writeHead(200, {'Content-Type': 'text/html'});
  
  console.log(message, err);
  res.end(message);
}
