import { useEffect, useState } from "react";

interface pageschema {
  roomid: string | number;
  username: string;
  wshandler: () => void;
  responedmsg: string[];
  chatmsg: chatmsg[];
  setchatmsg: (value: chatmsg[] | ((prev: chatmsg[]) => chatmsg[])) => void;
  socket: WebSocket;
}

interface chatmsg {
  text: string;
  isuser: boolean;
  time:string;
}

const Pages = ({
  roomid,
  username,
  socket,
  chatmsg,
  setchatmsg,
}: pageschema) => {
  const [input, setinput] = useState<string>("");
  const [user , setuser] = useState<string[]>([])
  const [usercount , setusercount] = useState<number>(0)
  const [Joined, setJoined] = useState<boolean>(false)

  function handler() {
    if (input) {
      const message = { 
        text: input, 
        isuser: true, 
        time:new Date().toLocaleTimeString()
      };

      setchatmsg((prev: chatmsg[]) => [...prev, message]);
    }
    const datatosend = JSON.stringify({
      "type": "chat",
      "payload": {
        "message": input,
        "username":username
      }
   });

    socket.send(datatosend)
    setinput("");
  }

  // Send join message only once when component mounts
  useEffect(() => {
    const sendJoinMessage = () => {
      if (!Joined) {
        console.log("Sending join message");
        socket.send(JSON.stringify({
          "type": "join",
          "payload": {
            "roomid": roomid,
            "username": username
          }
        }));
        setJoined(true);
      }
    };

    if (socket.readyState === WebSocket.OPEN) {
      sendJoinMessage();
    } else {
      const handleOpen = () => {
        sendJoinMessage();
      };
      socket.addEventListener('open', handleOpen, { once: true });
      return () => {
        socket.removeEventListener('open', handleOpen);
      };
    }
  }, [socket, roomid, username, Joined]);

  useEffect(() => {
    const handlemessage= (res : MessageEvent) => {
      const data = JSON.parse(res.data);

      if (data.type === "chat") {
        const mess = { 
          text: data.payload.message, 
          isuser: false, 
          time: new Date().toLocaleTimeString() 
        };

        if (data.payload.name !== username) {
          setchatmsg((prev: chatmsg[]) => [...prev, mess]);
        }
      } 
    
      if (data.type === "user-count" || data.type === "user-left") {
        console.log("your usercount room:", data.payload.usercount);
        setusercount(data.payload.usercount);

        if (Array.isArray(data.payload.username)) {
          // Ensure unique usernames
          const uniqueUsernames = [...new Set(data.payload.username)];
          //@ts-ignore
          setuser(uniqueUsernames);
        }
      }
    };

    socket.addEventListener("message", handlemessage);
    
    return () => {
      socket.removeEventListener("message", handlemessage);
    };
  }, [socket, username]);

  useEffect(() => {
    console.log("user's array:", user);
  }, [user]);

  return (
    <div>
      <div className=" h-screen text-white bg-black bg-cover">
        <div className="h-[42rem] w-[30rem]  shadow-sm shadow-white  rounded-2xl p-3 relative top-1/2 left-1/2 -translate-y-[50%] -translate-x-[50%]">
          <h1 className="flex justify-center items-center font-semibold text-5xl p-1 ">
            {" "}
            Chat{" "}
          </h1>
          <div className="w-full  py-6 mt-2 rounded-xl grid grid-cols-2 px-4 bg-zinc-500/50 text-zinc-200  font-mono">
            <h2> Roomid: {roomid} </h2>
            <h2> Users : {usercount} </h2>
            <h3> 
            { <div className="col-span-2  gap-1">
              <h2> Username:</h2>
              {user.map((name, index) => (
                <p key={index} className="text-sm">
                  {name}
                </p>
              ))}
            </div> }
            </h3>
            
          </div>
          <div className="w-full h-[26rem]   overflow-y-auto flex flex-col scroll-smooth scroll-hidden rounded-2xl p-5 m-1">
            {chatmsg.map((data, index) => (
              <div
                key={index}
                className={`flex ${
                  data.isuser ? "justify-end" : "justify-start"
                } w-full`}
              >
                <div
                  className={` ${data.isuser ? "bg-blue-600":"bg-zinc-800"} p-2 m-1 px-4 rounded-lg max-w-[40%] break-words whitespace-pre-wrap text-white`}
                >
                  <p className="text-white text-md break-words">{data.text}</p>
                  <p className="text-[10px] text-gray-300">
                    {data.isuser ? "You" : "User"}
                  </p>
                  <p className="text-[10px] text-zinc-200 text-right"
                  > {data.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full fixed bottom-0 left-0  mb-1 justify-center items-center">
            <div className="flex justify-center items-center gap-2 ">
              <input
                className="outline-none p-3 px-5 w-[24rem]   rounded-2xl text-black bg-neutral-300"
                type="text"
                placeholder="Message..."
                value={input}
                onChange={(e) => {
                  setinput(e.target.value);
                }}
                onKeyDown={(e)=>{
                  if(e.key === "Enter"){
                    handler()
                  }
                }}
              />

              <button
                onClick={handler}
                className=" bg-black text-white  rounded-2xl border border-zinc-500  px-4 p-3 hover:cursor-pointer font-semibold"
              >
                {" "}
                Send{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pages;