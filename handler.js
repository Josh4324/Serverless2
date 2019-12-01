'use strict';

const AWS = require('aws-sdk');
require('aws-sdk/clients/apigatewaymanagementapi');
const mysql = require('mysql')

const connection = mysql.createConnection({
  host: '34.217.176.147',
  user :'linuxjobber',
  password: '8iu7*IU&',
  database : 'chatscrum',
  port: '3000'
});

connection.connect();


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

  if (event.requestContext.eventType === 'CONNECT') {
    //Handle Connection
    addConnection(event.requestContext.connectionId)
      .then(() => {
        callback(null, successfullResponse);
        connection.end()
      })
      .catch(err => {
        console.log(err);
        callback(null, JSON.stringify(err));
        connection.end()
      });
  } else if (event.requestContext.eventType === 'MESSAGE') {
          sendInit(event).then(() => {
               callback(null, successfullResponse)
           }).catch(err => {
               callback(null, JSON.stringify(err));
          });
  }

 else if (event.requestContext.eventType === 'DISCONNECT') {
    //Handle disconnection
    deleteConnection(event.requestContext.connectionId)
      .then(() => {
        callback(null, successfullResponse);
        connection.end()
      })
      .catch(err => {
        console.log(err);
        callback(null, {
          statusCode: 500,
          body: 'Failed to connect: ' + JSON.stringify(err)
        });
        connection.end()
      });
  }

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

const addConnection = async (connectionId) => {
  
  let sql = 'INSERT INTO Scrum_connectiontable (connectionid) VALUES(?)'

  // let results = await mysql.query('INSERT INTO Scrum_connectiontable(connectionid) VALUES(connectionId)')
  let results = await connection.query( sql,[connectionId] )


  return results

 

}

const deleteConnection = async (connectionId) => {

  let sql = 'DELETE FROM Scrum_connectiontable where connectionid= ? '
  let results = await connection.query(sql,[connectionId])

  return results
};



