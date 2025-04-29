
interface schema{
    roomid:string|number
    setroomid:(value: string)=> void
    username: string
    setusername:(value :string)=> void
    handler: ()=>void
    
}

const Homepage = ({roomid , setroomid , username , setusername , handler }: schema) => { 

  return (
    <div className={`h-screen text-white bg-black bg-cover `}>
      
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <h1 className=' font-bold sm:text-5xl sm:mb-2 relative left-0 text-4xl sm:relative sm:left-0'>Quick-Chat...</h1>
      <p className=" font-thin"> Talk on Real time ...! </p>
      <div className="py-6">
        <input
        
        value={roomid}
        onChange={(e)=> {setroomid(e.target.value)}}
        className=' p-2 px-12 rounded-xl font-mono  outline-none text-white bg-black text-left pl-3 border border-neutral-500 hover:border-white'
        placeholder='Any Name for Roomid '/>
      </div>

      <input 
      value={username} 
        onChange={(e)=>{setusername(e.target.value)}} 
        className='p-2 px-12 rounded-xl text-white bg-black border border-neutral-500 text-left pl-3 font-mono outline-none hover:border-white '
        placeholder='Your UserName '/>
      <div>

      </div>
      <button onClick={handler} className="p-2  bg-black text-white border border-zinc-300 rounded-xl hover:cursor-pointer gap-1 px-8 mx-20 my-8 font-medium font-mono hover:border-blue-700 "> Join </button>
      
    </div>
     
    </div>
  )
}

export default Homepage
