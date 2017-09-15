// THIS FILE CONTAINS TASK FUNCTIONS

var setupdb = require('./setupdb');

// get mysql connection from setupdb module
var connection = setupdb.connection();

// function to create a task
exports.create_task = function (res, name, description, date_time, user_id) {
  var sql = "INSERT INTO tasks (name, description, date_time, user_id) VALUES ('" + name + "', '" + description + "', '" + date_time + "', '" + user_id + "')";
  connection.query(sql, function (err, result) {
    if (err) {
      setupdb.output_message(res, "error in creating task", err);  // output error
      return;
    }

    setupdb.output_message(res, "task created");  // output success message
  });
}

// function to update a task
exports.update_task = function (res, id, name) {
  var sql = "UPDATE tasks SET name = '" + name + "' WHERE id = '" + id + "'";
  connection.query(sql, function (err, result) {
    if (err) {
      setupdb.output_message(res, "error in updating task", err);  // output error
      return;
    }

    setupdb.output_message(res, "task updated");  // output success message
  });
}

// function to delete a task
exports.delete_task = function (res, id) {
  var sql = "DELETE FROM tasks WHERE id = '" + id + "'";
  connection.query(sql, function (err, result) {
    if (err) {
      setupdb.output_message(res, "error in deleting task", err);  // output error
      return;
    }

    res.writeHead(200, {'Content-Type': 'application/json'});
    
    setupdb.output_message(res, "task deleted");  // output success message
  });
}

// function to get task info
exports.get_task_info = function (res, id) {
  var sql = "SELECT * FROM tasks WHERE id = '" + id + "'";
  connection.query(sql, function (err, result) {
    if (err) {
      console.log("error in getting task info", err);  // output error
      return;
    }

    res.writeHead(200, {'Content-Type': 'application/json'});
    
    console.log("task info supplied");  // output success message
    res.end(JSON.stringify(result));  // output result as json data
  });
}

// function to list all tasks for a user
exports.list_tasks = function (res, user_id) {
  var sql = "SELECT * FROM tasks WHERE user_id = '" + user_id + "'";
  connection.query(sql, function (err, result) {
    if (err) {
      console.log("error in listing tasks", err);  // output error
      return;
    }

    res.writeHead(200, {'Content-Type': 'application/json'});
    
    console.log("tasks listed");  // output success message
    res.end(JSON.stringify(result));  // output result as json data
  });
}
