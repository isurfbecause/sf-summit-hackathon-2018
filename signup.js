'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var dynamodb = new AWS.DynamoDB();

exports.signup = signup;
exports.login = login;

var DD = {
  tableName: 'day-one-space-tours-CustomerTable-NTGHJZAA831X'
};

function signup(req, res) {
}

function login(req, res) {
  let {username, password} = req.body;
  let loggedin = false;

  var params = {
    ExpressionAttributeValues: {
     ":n": {
       S: username
      }
    },
    FilterExpression: "CustomerName = :n",
    TableName: DD.tableName
   };

   dynamodb.scan(params, function(err, data) {
     if (err) {
      throw err;
     }

    data.Items.forEach((item) => {
      if (item.CustomerPassword.S === password && item.CustomerName.S === username) {
        console.log('login customer');
        loggedin = true;
      }
    })

    if (loggedin) {
      res.render('hotels');
    } else {
      res.render('index', {
        message: 'Username or pass is wrong'
      });
    }
   });
}