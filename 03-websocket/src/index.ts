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

