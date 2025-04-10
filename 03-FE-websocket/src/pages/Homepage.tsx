
interface schema{
    roomid:string|number
    setroomid:(value: string)=> void
    username: string
    setusername:(value :string)=> void
    handler: ()=>void
}

const Homepage = ({roomid , setroomid , username , setusername , handler}: schema) => { 
  return (
    <div className={`h-screen text-white bg-linear-7 from-black to-gray-300 `}>
      
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <h1 className=' font-bold text-5xl'>Chat Here ...</h1>
      <p className=" font-thin"> Talk on Real time ...! </p>
      {/* <button className='bg-black , text-white ' onClick={()=>setcolor(!color)}>{ `${color? "white" : "dark"}`}</button> */}
      <div className="py-5">
        <input
        value={roomid}
        onChange={(e)=> {setroomid(e.target.value)}}
        className=' p-2 rounded-lg font-mono  text-black bg-white'
        placeholder='Enter the any roomid '/>
      </div>

      <input 
      value={username} 
        onChange={(e)=>{setusername(e.target.value)}} 
        className='p-2 rounded-lg text-black bg-white font-mono '
        placeholder='Enter your name '/>
      <div>

      </div>
      <button onClick={handler} className="p-2 bg-white text-black rounded-xl hover:cursor-pointer gap-1 px-3 mx-20 my-8 font-medium font-mono "> Join </button>
      
    </div>
     
    </div>
  )
}

export default Homepage
