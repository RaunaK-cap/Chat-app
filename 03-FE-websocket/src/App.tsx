
import Homepage from './pages/Homepage'
import Pages from './pages/Chatpage'
import {  Route  ,  Routes, useNavigate } from 'react-router'
// import toast , {Toaster} from 'react-hot-toast'


import './App.css'
import { useEffect, useState } from 'react'
import Loader from './pages/Loader'

interface chatmsg{
  text:string,
  isuser:boolean
}

function App() {

      const [roomid, setroomid] = useState<string>("")
      const[username , setusername] = useState<string>("")
      const navigate = useNavigate()
      const[socket , setsocket] = useState<WebSocket|undefined>()
      const [loader , setloader] = useState(false)
      
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
        //@ts-ignore
        socket.send(datatosend)

          setloader(true)

          setTimeout(()=>{
            setloader(false)
            navigate('/chat')
            
          } , 3000)

        }else{
          alert("Enter all Information..")
          // toast.error("Enter all Information")
        }
      }
        useEffect(() => {
        const ws= new WebSocket("wss://backend-for-quick-chat-app.onrender.com")
        setsocket(ws)
        ws.onopen = ()=>{
          console.log("connected baby")
        }  
        }, [])
        

  return (
    <>
    {/* <Toaster position='top-right' /> */}
    { loader ? (<Loader/>) : (
    <Routes>
      <Route path='/' element = {<Homepage roomid= {roomid} setroomid={setroomid} username={username} setusername={setusername} handler={handler}
      //@ts-ignore
      socket={socket}  />}/>
      <Route path='/chat' element={<Pages roomid={roomid} username={username} 
      //@ts-ignore
      socket={socket} chatmsg={chatmsg} setchatmsg ={setchatmsg}/>}/>
    </Routes>
    )}

    </>
  )
}

export default App
