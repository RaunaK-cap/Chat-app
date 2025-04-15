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

  const [ input , setinput ] = useState("")
 

  function handler(){
    const message = { text: input , isuser:false}
    setchatmsg((prev)=>[...prev , message])
    chatmsg.forEach((data : any)=>{
      console.log(data.text)
    })
  }

  


 return <div>
  <div className=" h-screen text-white bg-[url('chatimg2.png')] bg-cover"> 
    <div className="h-[42rem] w-[30rem] bg-neutral-400/70 shadow-md shadow-white  rounded-2xl p-3 relative top-1/2 left-1/2 -translate-y-[50%] -translate-x-[50%]"> 
      <h1 className="flex justify-center items-center font-semibold text-5xl p-1 "> Chat </h1>
      <div className="w-full  py-6 mt-2 rounded-xl grid grid-cols-2 px-4 bg-zinc-300/50 text-zinc-900 "> 
        <h2> Roomid: {roomid} </h2>
        <h2> users : 2 </h2>
        <h2> Connection:2 </h2>
        <h2>Name: {username}</h2>
      </div>
      <div className="w-full h-[26rem] bg-sky-500/20  overflow-y-auto flex flex-col scroll-smooth scroll-hidden rounded-2xl p-5 m-1">
        {chatmsg.map((data, index) => (
          <div
          key={index}
          className={`flex ${data.isuser ? "justify-end" : "justify-start"} w-full`}
          >
                <div className={`bg-${data.isuser ? "blue" : "green"}-600 p-2 px-4 rounded-lg max-w-[40%] break-words whitespace-pre-wrap text-white`}>
                  <p className="text-white text-sm break-words">{data.text}</p>
                  <p className="text-xs text-gray-300">{data.isuser ? "You" : "User"}</p>
                </div>
              </div>     
            ))}
        </div>
       
        <div className="w-full fixed bottom-0 left-0  mb-1 justify-center items-center">
          <div className="flex justify-center items-center gap-2 ">

          <input
          className="outline-none p-4 px-5 w-[24rem]   rounded-xl text-black bg-neutral-200" 
          type="text"
          placeholder="Message"
          value={input} 
          onChange={(e)=>{setinput(e.target.value)}} />
          <button 
          onClick={handler}
          onKeyDown={(e)=> (e.key==='Enter' && {handler})}
          className=" bg-black text-white  rounded-xl px-4 p-4 hover:cursor-pointer"
          > Send </button>
          </div>
        </div>
    </div>
    

  </div>

 </div>
}

export default Pages
