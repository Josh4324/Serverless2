'use strict';

const AWS = require('aws-sdk');
require('aws-sdk/clients/apigatewaymanagementapi');
const mysql = require('serverless-mysql')()

mysql.config({
  host: '34.217.176.147',
  database : 'chatscrum',
  user :'root',
  password: '8iu7*IU&'
 })

 const successfullResponse = {
  statusCode: 200,
  body: 'everything is alright'
};

module.exports.connectionHandler = (event, context, callback) => {
  console.log(event);

  if (event.requestContext.eventType === 'CONNECT') {
    //Handle Connection
    addConnection(event.requestContext.connectionId)
      .then(() => {
        callback(null, successfullResponse);
      })
      .catch(err => {
        console.log(err);
        callback(null, JSON.stringify(err));
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
      })
      .catch(err => {
        console.log(err);
        callback(null, {
          statusCode: 500,
          body: 'Failed to connect: ' + JSON.stringify(err)
        });
      });
  }

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

const addConnection = async (connectionId) => {
  let post = {connectionid : connectionId}
  let sql = "INSERT INTO Scrum_connectiontable SET ?"

  let results = await mysql.query(sql, post, (error,results,fields) => {
    if (error) throw error;
  })
  // let results = await mysql.query('INSERT INTO Scrum_connectiontable(connectionid) VALUES(connectionId)')

  await mysql.end()

  return results
};

const deleteConnection = async (connectionId) => {

  let results = await mysql.query('DELETE FROM Scrum_connectiontable WHERE connectionid = connectionId')


  await mysql.end()

  return results
};



