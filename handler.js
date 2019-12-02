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



/* const checkId = (project_id) => {

  let sql2 = 'SELECT id from Scrum_scrumchatroom where id = ?'
  let result6 = connection3.query(sql2, [project_id], (error,results,fields) => {
    console.log("result",results)
    if (results.length === 0) {
      connection3.end()
      console.log(results.length)
      return true     
    }
});

} */

const AddId = (project_id,name,hash) => {
  

}



const sendMessageToAllConnected = async (event) => {
 

  const body = JSON.parse(event.body);
  console.log(body)
  const message = body.data;
  const project_id = body.project_id;
  const user = body.user;
  const date_Time = new Date();
  const profile_picture = "nothing";
  const name = "none";
  const hash = "hash";
  let alldata;


  const connection = connectfunc();
  let sql2 = 'SELECT id from Scrum_scrumchatroom where id = ?'
  let result6 = connection.query(sql2, [project_id], (error,results,fields) => {
    console.log("result",results)
    if (results.length === 0) {
      connection.end()
      console.log(results.length)

      
      const sql5 = 'INSERT INTO Scrum_scrumchatroom (id,name,hash) VALUES(?,?,?)'

      let newresult = connection.query(sql5,[project_id,name,hash], (error,results,fields) => {
      if(results){
        console.log("DONE1")
      connection.end()
        console.log(results)
      }if(error){
        console.log("DONE2")
        console.log(error)
      connection.end()
      }
}) 
    
    }
});


  let sql1 = 'INSERT INTO Scrum_scrumchatmessage (message,user,room_id,date_Time,profile_picture) VALUES(?,?,?,?,?)'
      
  let result1 = connection.query(sql1,[message,user,project_id,date_Time,profile_picture], (error, results, fields) => {
            if(results) {
                connection.end()
            }if (error){
                connection.end()
                console.log(error)
                }
            })
    


  let sql = 'SELECT connectionid from Scrum_connectiontable'
  let result = await connection.query(sql, (error, results, fields) => {
  if (results) {
    console.log(results)
    connection.end()
    results.map((connectid) => {

      const connectionId = connectid.connectionid;

      let all = 'SELECT * FROM Scrum_scrumchatmessage'
      let result5 = connection.query(all,(error, results, fields) => {
      if(results) {
        connection.end()
          alldata = JSON.stringify(results);

          const endpoint = event.requestContext.domainName + "/" + event.requestContext.stage;
          const apigwManagementApi = new AWS.ApiGatewayManagementApi({
          apiVersion: "2018-11-29",
          endpoint: endpoint
          });
  
          const params = {
            ConnectionId: connectionId,
            Data: alldata,
          };


          return apigwManagementApi.postToConnection(params).promise();
      }if (error){
        connection.end() 
          }
      })
      
        })
        }if (error) {
          connection.end()
        }

      })
      

        
}

        




        

        

      






  


