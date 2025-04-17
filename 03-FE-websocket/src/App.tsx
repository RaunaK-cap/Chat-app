
import Homepage from './pages/Homepage'
import Pages from './pages/Chatpage'
import { data, Route  ,  Routes, useNavigate } from 'react-router'


import './App.css'
import { useEffect, useState } from 'react'

interface chatmsg{
  text:string,
  isuser:boolean
}

function App() {

      const [roomid, setroomid] = useState<string>("")
      const[username , setusername] = useState<string>("")
      const navigate = useNavigate()
      const[socket , setsocket] = useState<WebSocket|undefined>()
      
      const[chatmsg, setchatmsg] = useState<chatmsg[]>([])

      function handler(){
        if(roomid && username){    
          const datatosend = JSON.stringify({
            "type": "join",
            "payload": {
              "roomid": roomid,
              "username":username
            }
         });

        socket.send(datatosend)

         navigate('/chat')
        }else{
          alert("Enter all Information..")
        }
      }
        useEffect(() => {
        const ws= new WebSocket("ws://localhost:8080")
        setsocket(ws)
        ws.onopen = ()=>{
          console.log("connected baby")
        }  
        }, [])
        

  return (
    <>
    <Routes>
      <Route path='/' element = {<Homepage roomid= {roomid} setroomid={setroomid} username={username} setusername={setusername} handler={handler} socket={socket}  />}/>
      <Route path='/chat' element={<Pages roomid={roomid} username={username} 
      //@ts-ignore
      socket={socket} chatmsg={chatmsg} setchatmsg ={setchatmsg}/>}/>
    </Routes>

    </>
  )
}

export default App
