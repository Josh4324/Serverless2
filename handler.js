'use strict';

const AWS = require('aws-sdk');
require('aws-sdk/clients/apigatewaymanagementapi');
const mysql = require('mysql')

 const successfullResponse = {
  statusCode: 200,
  body: 'everything is alright'
};

const connectfunc = () => {
  const params = {
    host: '34.217.176.147',
    user :'linuxjobber',
    password: '8iu7*IU&',
    database : 'chatscrum',
    port: '3000'
  }

  return mysql.createConnection(params)
}
 

module.exports.connectionHandler = (event, context, callback) => {
  console.log(event);
  const connection = connectfunc();
  connection.connect();

  if (event.requestContext.eventType === 'CONNECT') {
    //Handle Connection
    connectionId = event.requestContext.connectionId
    let sql = 'INSERT INTO Scrum_connectiontable (connectionid) VALUES(?)'
    connection.query( sql,[connectionId], (res,err) => {
      if(err) {
        connection.end()
      }
      else{
        connection.end()
      }
    })
  
  } else if (event.requestContext.eventType === 'MESSAGE') {
          sendInit(event).then(() => {
               callback(null, successfullResponse)
           }).catch(err => {
               callback(null, JSON.stringify(err));
          });
  }

 else if (event.requestContext.eventType === 'DISCONNECT') {
    //Handle disconnection
    connectionId = event.requestContext.connectionId
    let sql = 'DELETE FROM Scrum_connectiontable where connectionid= ? '
    connection.query(sql,[connectionId], (res,err) => {
      if (err) {
        connection.end()
      }
      else {
        connection.end()
      }
    }); 
  }

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};





