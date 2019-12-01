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
          sendAllMessages(event).then(() => {
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
      callback(null, JSON.stringify(err));
    });
  }

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.sendMessageHandler = (event, context, callback) => {
  sendMessageToAllConnected(event).then(() => {
    callback(null, successfullResponse)
  }).catch (err => {
    callback(null, JSON.stringify(err));
  });
}


const addConnection = async (connectionId) => {
  const connection = connectfunc();
  connection.connect();
  let sql = 'INSERT INTO Scrum_connectiontable (connectionid) VALUES(?)'
  let result = await connection.query( sql,[connectionId], (res,err) => {
    if(err) {
      connection.end()
    }
    else{
      connection.end()
    }
  })

  return result
};

const  deleteConnection = async (connectionId) => {
  const connection = connectfunc();
  connection.connect();
  let sql = 'DELETE FROM Scrum_connectiontable where connectionid= ? '
  let result = await connection.query(sql,[connectionId], (res,err) => {
    if (err) {
      connection.end()
    }
    else {
      connection.end()
    }
  });
  
  return result
};

const sendMessageToAllConnected = async (event) => {
  const connection = connectfunc();
  connection.connect();
  let sql = 'SELECT connectionid from Scrum_connectiontable'
  let result = await connection.query(sql, (error, results, fields) => {
    if (results) {
      connection.end()
      results.map( (connectid) => {
        const body = JSON.parse(event.body);
        console.log(body)
        const message = body.data;
        const connectionId = connectid.connectionid;
        const project_id = body.project_id;
        const user = body.user;
        const goal_id = body.goal_id;
        const slack_username = body.slack_username;

        const connection1 = connectfunc(); 
        const connection2 = connectfunc(); 
        const connection3 = connectfunc(); 
        const connection4 = connectfunc();
        const connection5 = connectfunc(); 

        let sql1 = 'INSERT INTO Scrum_scrumchatmessage (user) VALUES(?)'
        let result1 = connection1.query(sql1,[user], (error, results, fields) => {
          if(results) {
            connection1.end()
          }if (error){
            connection1.end()
          }
        })
        let sql2 = 'INSERT INTO Scrum_scrumchatmessage (message) VALUES(?)'
        let result2 = connection2.query(sql2,[message], (error, results, fields) => {
          if(results) {
            connection2.end()
          }if (error){
            connection2.end()
          }
        })
        let sql3 = 'INSERT INTO Scrum_scrumchatmessage (room_id) VALUES(?)'
        let result3 = connection3.query(sql3,[project_id], (error, results, fields) => {
          if(results) {
            connection3.end()
          }if (error){
            connection3.end()
          }
        })
        let sql4 = 'INSERT INTO Scrum_scrumchatmessage (date_Time) VALUES(?)'
        let result4 = connection4.query(sql4,[date_Time], (error, results, fields) => {
          if(results) {
            connection4.end()
          }if (error){
            connection4.end()
          }
        })



        let all = 'SELECT * FROM Scrum_scrumchatmessage'
        let result5 = connection4.query(all,(error, results, fields) => {
          if(results) {
            connection5.end()
            console.log(results)
          }if (error){
            connection5.end()
          }
        })




        const endpoint = event.requestContext.domainName + "/" + event.requestContext.stage;
        const apigwManagementApi = new AWS.ApiGatewayManagementApi({
            apiVersion: "2018-11-29",
            endpoint: endpoint
      });

        const params = {
            ConnectionId: connectionId,
            Data: message,
            
        };

        return apigwManagementApi.postToConnection(params).promise();

      })
      
      console.log(results)
    }if (error){
      connection.end()
      console.log(error)
    }
  })

  return result
}

const sendAllMessages = async (event) => {

}