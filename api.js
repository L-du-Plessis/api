// THIS IS THE MAIN APPLICATION FILE THAT SHOULD BE INITIATED BY NODE.JS

// include required modules
var http = require('http');
var url = require('url');
var setupdb = require('./setupdb');
var users = require('./users');
var tasks = require('./tasks');

scheduled_job(setupdb);  // call scheduled job function

setupdb.run_migrations( function() {  // run migrations to create tables if it does not exist
        
  // create a server that listens on port 8080
  http.createServer(function (req, res) {
    var q = url.parse(req.url, true);
    var qdata = q.query;
    
    var pathname = q.pathname.substr(0, 11);
    var qarray = q.pathname.split("/");
    if (qarray.length > 3) {
      var user_id = qarray[3];  // get user_id from url
    } else {
      var user_id = '';
    }
    if (qarray.length > 5) {
      var task_id = qarray[5];  // get task_id from url
    } else {
      var task_id = '';
    }
            
    // TEST URLS:
    // http://localhost:8080/api/users?username=pietp&first_name=piet&last_name=pompies
    // http://localhost:8080/api/users/1/?first_name=piet1&last_name=pompies1
    // http://localhost:8080/api/users
    // http://localhost:8080/api/users/1
    // http://localhost:8080/api/users/1/tasks?name=My task&description=Description of task&date_time=2016-05-25 14:25:00
    // http://localhost:8080/api/users/1/tasks/1/?name=My updated task
    // http://localhost:8080/api/users/1/tasks/1
    // http://localhost:8080/api/users/1/tasks
    
    // check http method
    switch(req.method) {
      case 'POST':
        if (q.pathname == '/api/users' && qdata.username && qdata.first_name && qdata.last_name) {
          users.create_user(res, qdata.username, qdata.first_name, qdata.last_name);  // call function to create a user
          break;
        }        
        if (pathname == '/api/users/' && q.pathname.substr(-6) == '/tasks' && qdata.name && qdata.description && qdata.date_time && user_id) {
          tasks.create_task(res, qdata.name, qdata.description, qdata.date_time, user_id);  // call function to create a task
        }
        break;
        
      case 'PUT':
        if (pathname == '/api/users/' && user_id && qdata.first_name && qdata.last_name) {
          users.update_user(res, user_id, qdata.first_name, qdata.last_name);  // call function to update a user
          break;
        }
        if (pathname == '/api/users/' && task_id && qdata.name) {
          tasks.update_task(res, task_id, qdata.name);  // call function to update a task
        }
        break;
        
      case 'GET':
        if (pathname == '/api/users/' && q.pathname.substr(-6) != '/tasks' && user_id && !task_id) {
          users.get_user_info(res, user_id);  // call function to get user info
          break;
        }
        if (q.pathname == '/api/users') {
          users.list_users(res);  // call function to list all users
          break;
        }
        if (pathname == '/api/users/' && task_id) {
          tasks.get_task_info(res, task_id);  // call function to get task info
          break;
        }
        if (pathname == '/api/users/' && q.pathname.substr(-6) == '/tasks' && user_id) {
          tasks.list_tasks(res, user_id);  // call function to list all tasks
        }
        break;
        
      case 'DELETE':
        if (pathname == '/api/users/' && task_id) {
          tasks.delete_task(res, task_id);  // call function to delete a task
        }
        break;
    }
    
  }).listen(8080);  
});

// scheduled job to check all tasks and update status if needed
function scheduled_job(setupdb) {
  var schedule = require('node-schedule');
 
  // get mysql connection from setupdb module
  var connection = setupdb.connection();

  var j = schedule.scheduleJob('13 0 15 * *', function(){
    var d = new Date();
    var currentDateTime = d.toISOString();    
    
    var sql = "SELECT * FROM tasks WHERE status = 'pending' AND next_execute_date_time < '" + currentDateTime + "'";
    connection.query(sql, function (err, result) {
      if (err) {
        console.log("error in listing tasks", err);  // output error
        return;
      }

      console.log(result);  // print result to the console
      
      for (var i = 0; i < result.length; i++) {
        update_task(connection, result[i].id)  // call function to update task status
      }
    });
  });
}

// function to update task status to 'done'
function update_task(connection, id) {
  var sql = "UPDATE tasks SET status = 'done' WHERE id = '" + id + "'";
  connection.query(sql, function (err, result) {
    if (err) {
      console.log("error in updating task status");  // output error
      return;
    }

    console.log("status updated for task with id " + id);  // output success message
  });
}
