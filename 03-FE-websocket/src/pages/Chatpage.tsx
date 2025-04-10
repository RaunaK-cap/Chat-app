import { useState } from "react"

interface pageschema{
  roomid: string|number
  username: string
  wshandler: ()=> void
  responedmsg:string[]
  chatmsg:string[]
  setchatmsg: ( value :string)=> void
  socket:WebSocket
}

const Pages = ({roomid , username , socket , chatmsg , setchatmsg}: pageschema) => {

    const[input , setinput] = useState("")
    const[responedmsg ,setresponedmsg] = useState([])

   

        function inputhandler(){
          
            console.log(input)
            
            //@ts-ignore
            setchatmsg((prev)=> [...prev , input])
            socket.send(input)
            //@ts-ignore
            socket.onmessage=(e)=>{
              //@ts-ignore
              setresponedmsg((prev)=>[...prev , e.data])
              console.log(e.data)
            }
          
        }
  return (
    <div className="relative bg-linear-7 from-black to-gray-300   h-screen flex justify-center items-center">
      
      <div className=" text-white  h-[30rem] w-[20rem]">
        <div className="flex justify-between  items-end relative -top-10">
          <h1 className="text-black font-mono relative top-3"> Roomid: {roomid} </h1>
          <h1 className="text-6xl font-bold relative -top-10  "> Chat... </h1>
          <h1 className="text-black font-mono relative top-3"> User: {username}</h1>
        </div>
        <div className="w-[20rem] h-[20rem]  p-2 overflow-y-auto scroll flex flex-col-reverse space-y-2">
          {responedmsg.map((data )=> (
            <p className="flex justify-start items-start  p-3 text-white px-2">
               {data}
            <p className="font-extralight text-sm relative top-4"> user 
          </p></p>
          ))}
          {}
          
          
          {
            chatmsg.map((data)=>(
              <p className="flex justify-end items-end p-3 text-white m-2"> 
              {data}
              <p className="font-extralight text-sm relative top-4"> you</p></p>
            ))
          }
   
        </div>
          
        <div className="  relative left-5 ">
        <input onChange={(e)=> setinput(e.target.value)} className=" p-2 px-9   rounded-xl  bg-gray-300 text-black font-mono  font-thin" placeholder="Message......"/>
        <button onClick={inputhandler} className="p-2 px-2 mx-1 bg-purple-700 text-white rounded-lg  font-mono font-semibold hover:cursor-pointer"> Send</button>  
        </div>
      </div>
        
    </div>
  )
}

export default Pages
