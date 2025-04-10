
import Homepage from './pages/Homepage'
import Pages from './pages/Chatpage'
import { Route  ,  Routes, useNavigate } from 'react-router'


import './App.css'
import { useEffect, useState } from 'react'

function App() {

      const [roomid, setroomid] = useState<string>("")
      const[username , setusername] = useState<string>("")
      const navigate = useNavigate()
      const[socket , setsocket] = useState<WebSocket>()
      
      const[chatmsg, setchatmsg] = useState([])

      function handler(){
        if(roomid && username){    
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
      <Route path='/' element = {<Homepage roomid= {roomid} setroomid={setroomid} username={username} setusername={setusername} handler={handler} />}/>

      <Route path='/chat' element={<Pages roomid={roomid} username={username} socket={socket} chatmsg={chatmsg} setchatmsg ={setchatmsg}/>}/>

    </Routes>
    


    </>
  )
}

export default App
