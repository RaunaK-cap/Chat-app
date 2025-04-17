import { json } from "express";
import { WebSocket, WebSocketServer } from "ws";
const ws = new WebSocketServer({ port: 8080 });

let userconnection: number = 0;
let allsocket: WebSocket[] = [];
interface schemaroom {
    roomid : any
    username:string
    socket:any,
}
let allscoketuser : schemaroom[]= []


ws.on("connection", (socket)=>{
    socket.on("message",(message)=>{
        const parsedmsg = JSON.parse(message.toString())
        if(parsedmsg.type=="join"){
            allscoketuser.push({
                roomid:parsedmsg.payload.roomid,
                username:parsedmsg.payload.message,
                socket

            })
        }

        if(parsedmsg.type =="chat"){
            const userroomid = allscoketuser.find((e)=> e.socket == socket)?.roomid

            allscoketuser.forEach((u)=>{
            
                if(u.roomid == userroomid){
                    u.socket.send(JSON.stringify({
                        type: "chat",
                        payload: {
                            message: parsedmsg.payload.message,
                            name: parsedmsg.payload.username  // add more fields if needed
                        }
                    }))
                }
            })
        }
    })
})



// ws.on("connection", (socket)=>{
//         socket.on("message", (message)=>{
//             const parsedmsg = JSON.parse(message.toString())
//             console.log(parsedmsg)
//             userconnection = userconnection+1

//             if(parsedmsg.type == "join"){
//                 allscoketuser.push({
//                     room :parsedmsg.payload.roomid,
//                     socket
//                 })
//             }

//             console.log(allscoketuser)

//             if(parsedmsg.type =="chat"){
//             let userroom = allscoketuser.find((e)=> e.socket == socket)?.room

//             allscoketuser.forEach((u)=> {
//                 if(u.room == userroom){
//                     u.socket.send(parsedmsg.payload.message)
//                 }
//             })
//         }
//         socket.close=()=>{
//                 userconnection = userconnection-1
//         }

//         setInterval(()=>{
//             socket.send(userconnection)
//         }, 1000)
//         })
// })


// // ws.on("connection", function (socket) {
    // //   allsocket.push(socket);
// //   console.log("user connected succesfully");
// //   socket.send(" it's working");
// //   socket.send(` userconnected : ${usercount}`);
// //   usercount = usercount + 1;
// //   socket.on("message", function (e) {
// //     if (e.toString() == "ping") {
// //       socket.send("pong");
// //     }
// //   });

// //   socket.onclose = function () {
// //     usercount = usercount - 1;
// //   };

// //   socket.on("message", (message) => {
// //     allsocket.forEach((s) => s.send(message.toString()));
// //   });
// //   //IN here we are sending all the message comming from the user to all the
// //   // user that is stored in the allsocket[]
// // });

// // setInterval(() => {
// //   console.log(usercount);
// // }, 6000);


// import { json } from 'express'
// import { WebSocket, WebSocketServer } from 'ws'

// const ws = new WebSocketServer({ port: 8080 })
// let userconnection: number = 0;


// interface socketschema {
//     socket: WebSocket
//     roomid: string,
// }
// let allsocketuser: socketschema[] = []


// ws.on("connection" , (socket)=>{

//     userconnection++

//     socket.on("message" , function(message){
//         allsocketuser.push(socket)
//         allsocketuser.forEach((alluser)=>{ alluser.send(message.toString())})

//         // if(message.toString() == "ping"){
//         //     socket.send("pong")
//         // }
//     })

//     socket.close= function(){
//         userconnection-- 
//     }



//     setInterval(()=>{

//         socket.send(userconnection)

//     } , 6000)
// })

// ws.on("connection", (socket) => {
//     userconnection++

//     socket.on("message", (message) => {
//         const parsedmsg = JSON.parse(message.toString())
//         if (parsedmsg.type == "join") {
//             allsocketuser.push({
//                 socket,
//                 roomid: parsedmsg.payload.roomid
//             })
//         }
//         if (parsedmsg.type == "chat") {
//             const userroom = allsocketuser.find((user) => user.socket == socket)?.roomid
//             console.log(parsedmsg.payload.message)
//             allsocketuser.forEach((e) => {
//                 if (e.roomid == userroom) {
//                     e.socket.send(parsedmsg.payload.message)
//                 }
//             })
//         }
//         socket.close = (e) => {
//             userconnection--
//         }
//         setInterval(() => {
//             socket.send(userconnection)
//         }, 5000);
//     })

// })




// ws.on("connection" , (socket)=>{

//     userconnection++
//     const broadcastUserCount = () => {
//         const message = JSON.stringify({ count: userconnection });
//         ws.clients.forEach((client) => {
//             if (client.readyState === WebSocket.OPEN) {
//                 client.send(message);
//             }
//         });
//     };

//     // Broadcast the updated userconnection count when a new client connects
//     broadcastUserCount();

//     socket.on("message" , (message)=>{
//         console.log(message.toString())
        
        
//         if(message.toString()=="ping"){
//             setInterval(()=>{

//             socket.send(JSON.stringify({type:"pong" , userconnection:userconnection}))
//             }, 5000)
//         }
//     })
//     socket.close=()=>{
//         userconnection--
//         broadcastUserCount()
        

//     }

    
//     setInterval(()=>{
//         console.log(userconnection)
//     } , 10000)
    
// })