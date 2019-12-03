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


module.exports.sendHandler = (event,context,callback) => {
  
  sendMessage(event).then(() => {
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



const sendMessage = async (event) => {

  const body = JSON.parse(event.body);
  console.log(body)
  const message = body.data;
  const project_id = body.project_id;
  const user = body.user;
  const date_Time = new Date();
  const profile_picture = "nothing";
  const name = "none";
  const hash = "hash";

  const connection1 = connectfunc();
  let sql2 = 'SELECT id from Scrum_scrumchatroom where id = ?'
  let result6 = connection1.query(sql2, [project_id], (error,results,fields) => {
    console.log("result",results)
    if (results.length === 0) {
      connection1.end()

      const sql5 = 'INSERT INTO Scrum_scrumchatroom (id,name,hash) VALUES(?,?,?)'
      const connection2 = connectfunc();
      let newresult = connection2.query(sql5,[project_id,name,hash], (error,results,fields) => {
      if(results){
        console.log("DONE1")
        connection2.end()
        console.log(results)
      }if(error){
        console.log("DONE2")
        console.log(error)
        connection2.end()
      }
}) 
    
    }
});

let sql = 'SELECT connectionid from Scrum_connectiontable'
  const connection4 = connectfunc();
  let result = connection4.query(sql, (error, results, fields) => {
  if (results) {
    console.log(results)

    let sql1 = 'INSERT INTO Scrum_scrumchatmessage (message,user,room_id,date_Time,profile_picture) VALUES(?,?,?,?,?)'
    const connection3 = connectfunc();
    let result1 = connection3.query(sql1,[message,user,project_id,date_Time,profile_picture], (error, results, fields) => {
            if(results) {
                connection3.end()
            }if (error){
                connection3.end()
                console.log(error)
                }
            })
    

    connection4.end()
    results.map((connectid) => {

      const connectionId = connectid.connectionid;

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
        }

      })


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

  const connection1 = connectfunc();
  let sql2 = 'SELECT id from Scrum_scrumchatroom where id = ?'
  let result6 = connection1.query(sql2, [project_id], (error,results,fields) => {
    console.log("result",results)
    if (results.length === 0) {
      connection1.end()
      console.log(results.length)

      const sql5 = 'INSERT INTO Scrum_scrumchatroom (id,name,hash) VALUES(?,?,?)'
      const connection2 = connectfunc();
      let newresult = connection2.query(sql5,[project_id,name,hash], (error,results,fields) => {
      if(results){
        console.log("DONE1")
        connection2.end()
        console.log(results)
      }if(error){
        console.log("DONE2")
        console.log(error)
        connection2.end()
      }
}) 
    
    }
});


  let sql = 'SELECT connectionid from Scrum_connectiontable'
  const connection4 = connectfunc();
  let result = connection4.query(sql, (error, results, fields) => {
  if (results) {
    console.log(results)
    connection4.end()
    let sql1 = 'INSERT INTO Scrum_scrumchatmessage (message,user,room_id,date_Time,profile_picture) VALUES(?,?,?,?,?)'
    const connection3 = connectfunc();
    let result1 = connection3.query(sql1,[message,user,project_id,date_Time,profile_picture], (error, results, fields) => {
            if(results) {
                connection3.end()
            }if (error){
                connection3.end()
                console.log(error)
                }
            })
    results.map((connectid) => {

      const connectionId = connectid.connectionid;

      let all = 'SELECT * FROM Scrum_scrumchatmessage'
      const connection5 = connectfunc();
      let result5 = connection5.query(all,(error, results, fields) => {
      if(results) {
        connection5.end()
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
        connection5.end() 
          }
      })
      
        })
        }

      })
      

        
}

        




        

        

      






  


