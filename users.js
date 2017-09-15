// THIS FILE CONTAINS USER FUNCTIONS

var setupdb = require('./setupdb');

// get mysql connection from setupdb module
var connection = setupdb.connection();

// function to create a user
exports.create_user = function (res, username, first_name, last_name) {
  var sql = "INSERT INTO users (username, first_name, last_name) VALUES ('" + username + "', '" + first_name + "', '" + last_name + "')";
  connection.query(sql, function (err, result) {
    if (err) {
      setupdb.output_message(res, "error in creating user", err);  // output error
      return;
    }

    setupdb.output_message(res, "user created");  // output success message
  });
}

// function to update a user
exports.update_user = function (res, id, first_name, last_name) {
  var sql = "UPDATE users SET first_name = '" + first_name + "', last_name = '" + last_name + "' WHERE id = '" + id + "'";
  connection.query(sql, function (err, result) {
    if (err) {
      setupdb.output_message(res, "error in updating user", err);  // output error
      return;
    }

    setupdb.output_message(res, "user updated");  // output success message
  });
}

// function to list all users
exports.list_users = function (res) {
  var sql = "SELECT * FROM users";
  connection.query(sql, function (err, result) {
    if (err) {
      console.log("error in listing users", err);  // output error
      return;
    }

    res.writeHead(200, {'Content-Type': 'application/json'});
    
    console.log("users listed");  // output success message
    res.end(JSON.stringify(result));  // output result as json data
  });
}

// function to get user info
exports.get_user_info = function (res, id) {
  var sql = "SELECT * FROM users WHERE id = '" + id + "'";
  connection.query(sql, function (err, result) {
    if (err) {
      console.log("error in getting user info", err);  // output error
      return;
    }

    res.writeHead(200, {'Content-Type': 'application/json'});
    
    console.log("user info supplied");  // output success message
    res.end(JSON.stringify(result));  // output result as json data
  });
}
