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
        console.log(parsedmsg)
        
        if(parsedmsg.type=="join"){ 
            // Check if this username and socket already exists in the room
            const existingUser = allscoketuser.find(
                u => u.roomid === parsedmsg.payload.roomid && 
                     u.username === parsedmsg.payload.username &&
                     u.socket === socket
            );
            
            // Only add user if they don't already exist
            if (!existingUser) {
                allscoketuser.push({
                    roomid: parsedmsg.payload.roomid,
                    username: parsedmsg.payload.username,
                    socket
                });
            }
            
            const roomusers = allscoketuser.filter((u)=> u.roomid === parsedmsg.payload.roomid);
            
            // to prevent duplication username to go 
            const uniqueUsernames = Array.from(new Set(roomusers.map(user => user.username)));
            let user_connection_count = uniqueUsernames.length;
            
            console.log("current user connected : ", user_connection_count);

            roomusers.forEach(u => {
                u.socket.send(JSON.stringify({
                    type: "user-count",
                    payload:{
                        usercount: user_connection_count,
                        username: uniqueUsernames
                    }       
                }));
            });
        }

        if(parsedmsg.type =="chat"){
            const userroomid = allscoketuser.find((e)=> e.socket == socket)?.roomid
            const time = new Date().toLocaleTimeString([], { hour:'2-digit', minute:"2-digit"})
            allscoketuser.forEach((u)=>{
                if(u.roomid == userroomid){
                    u.socket.send(JSON.stringify({
                        type: "chat",
                        payload: {
                            message: parsedmsg.payload.message,
                            name: parsedmsg.payload.username,
                            time:time
                        }
                    }))
                }
            })
        } 
    })

    socket.on("close", () => {
        const userData = allscoketuser.find(u => u.socket === socket);
        if (!userData) return;
      
        const roomid = userData.roomid;
      
        // Remove user who just left it from allsocket 
        allscoketuser = allscoketuser.filter(u => u.socket !== socket);
      
        // Get updated room users
        const roomUsers = allscoketuser.filter(u => u.roomid === roomid);
        
        // to prevent the duplication username  to go ...
        const uniqueUsernames = Array.from(new Set(roomUsers.map(user => user.username)));
        const user_connection_count = uniqueUsernames.length;
        
        console.log("User left room", user_connection_count);

        roomUsers.forEach(u => {
          u.socket.send(JSON.stringify({
            type: "user-left",
            payload: { 
              usercount: user_connection_count,
              roomidname: roomid,
              username: uniqueUsernames
            }
          }));
        });
      });
    
})