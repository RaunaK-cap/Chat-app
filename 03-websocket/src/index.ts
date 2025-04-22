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
let alluserconnection: any = []
let user_connection_count = ''


ws.on("connection", (socket)=>{
   
    socket.on("message",(message)=>{
        const parsedmsg = JSON.parse(message.toString())
        console.log(parsedmsg)
        
        if(parsedmsg.type=="join"){
            alluserconnection.push(parsedmsg.payload.username,)
            // console.log("connection:" , alluserconnection)
            allscoketuser.push({
                roomid:parsedmsg.payload.roomid,
                username:parsedmsg.payload.message,
                socket

            })

            const userroomid = allscoketuser.find((e)=> e.socket == socket)?.roomid
            const roomusers = allscoketuser.filter((u)=> u.roomid === userroomid)
            let user_connection_count = roomusers.length
            console.log("current user connected : " , user_connection_count)

            roomusers.forEach(u=>{
                u.socket.send(JSON.stringify({
                    type: "user-count",
                    payload:{
                        usercount:user_connection_count
                        
                    }       
                }))
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
                            name: parsedmsg.payload.username
                          
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
      
        // Remove user
        allscoketuser = allscoketuser.filter(u => u.socket !== socket);
      
        // Get updated room users
        const roomUsers = allscoketuser.filter(u => u.roomid === roomid);
        const user_connection_count = roomUsers.length;
        console.log("User left room", user_connection_count);

        roomUsers.forEach(u => {
          u.socket.send(JSON.stringify({
            type: "user-left",
            payload: { 
              userCount: user_connection_count,
              roomidname:roomid
            }
          }));
        });
      });
    
})
