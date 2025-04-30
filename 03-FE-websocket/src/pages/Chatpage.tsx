import { useEffect, useState, useRef } from "react";

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
  time: string;
}

const Pages = ({
  roomid,
  username,
  socket,
  chatmsg,
  setchatmsg,
}: pageschema) => {
  const [input, setinput] = useState<string>("");
  const [user, setuser] = useState<string[]>([]);
  const [usercount, setusercount] = useState<number>(0);
  const [Joined, setJoined] = useState<boolean>(false);
  
  // Create a ref for the messages container
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  function handler() {
    if (input) {
      const message = { 
        text: input, 
        isuser: true, 
        time: new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})
      };

      setchatmsg((prev: chatmsg[]) => [...prev, message]);
      
      // Schedule a scroll after state update
      setTimeout(scrollToBottom, 100);
    }
    const datatosend = JSON.stringify({
      "type": "chat",
      "payload": {
        "message": input,
        "username": username
      }
    });

    socket.send(datatosend);
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
    const handlemessage = (res: MessageEvent) => {
      const data = JSON.parse(res.data);
      console.log(data.payload.time)

      if (data.type === "chat") {
        const mess = { 
          text: data.payload.message, 
          isuser: false, 
          time: new Date().toLocaleTimeString([] , {hour:"2-digit", minute:"2-digit"}) 
        };

        if (data.payload.name !== username) {
          setchatmsg((prev: chatmsg[]) => [...prev, mess]);
          // Schedule a scroll after receiving a message
          setTimeout(scrollToBottom, 100);
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

  // Auto-scroll when chatmsg updates
  useEffect(() => {
    scrollToBottom();
  }, [chatmsg]);

  useEffect(() => {
    console.log("user's array:", user);
  }, [user]);

  return (
    <div>
      <div className="min-h-screen text-white bg-black bg-cover">
        {/* Main chat container - Changed fixed dimensions to responsive */}
        <div className="w-full md:w-[90%] lg:w-[70%] xl:w-[50%] max-w-md mx-auto h-screen md:h-[42rem] sm:absolute sm:shadow-sm sm:shadow-white rounded-2xl p-2 md:p-3 relative md:top-1/2 md:left-1/2 md:-translate-y-[50%] md:-translate-x-[50%]">
          <h1 className="flex justify-center items-center font-semibold text-3xl md:text-5xl p-1">
            Chat
          </h1>
          {/* Room info section - Made responsive */}
          <div className="w-full py-2 md:py-2 mt-2 rounded-xl grid grid-cols-2 px-2 md:px-4 bg-zinc-500/50 text-zinc-200 font-mono text-sm md:text-base">
            <h2 className="font-semibold text-red-500"> Roomid: {roomid} </h2>
            <h2> Users: {usercount} </h2>
            <h3> 
            { <div className="col-span-2 gap-1">
              <h2> Users-name:</h2>
              {user.map((name, index) => (
                <p key={index} className="text-xs md:text-sm font-mono">
                  {name}
                </p>
              ))}
            </div> }
            </h3>
            <h2 className="text-sm"> 
              <h1 className="text-red-500 font-semibold">How to use it:</h1> 
              share roomid with your friends & tell them to join with that same roomid 
            </h2>
          </div>
          
          {/* Chat messages area with auto-scroll behavior */}
          <div 
            ref={messagesContainerRef}
            className="w-full h-[60vh]  md:h-[26rem] overflow-y-auto flex flex-col scroll-smooth scroll-hidden rounded-2xl p-3 md:p-5 m-1"
          >
            {chatmsg.map((data, index) => (
              <div
                key={index}
                className={`flex ${
                  data.isuser ? "justify-end" : "justify-start"
                } w-full`}
              >
                <div
                  className={` ${data.isuser ? "bg-blue-600":"bg-zinc-800"} p-1 m-1 px-3 md:px-4 rounded-lg max-w-[80%] md:max-w-[40%] break-words whitespace-pre-wrap text-white`}
                >
                  <p className="text-white text-sm md:text-md break-words">{data.text}</p>
                  <p className="text-[8px] md:text-[10px] text-right text-gray-300">
                    {data.isuser ? "You" : "User"}
                  </p>
                  <p className="text-[8px] md:text-[10px] text-zinc-200 text-right">
                    {data.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input area - Made responsive */}
          <div className="w-full fixed bottom-0 left-0 pb-2 md:mb-1 justify-center items-center">
            <div className="flex justify-center items-center gap-1 md:gap-2 px-2">
              <input
                className="outline-none p-2 md:p-3 px-3 md:px-5 w-[70%] md:w-[24rem] rounded-xl md:rounded-2xl text-white bg-black border border-blue-800 text-sm md:text-base"
                type="text"
                placeholder="Message..."
                value={input}
                onChange={(e) => {
                  setinput(e.target.value);
                }}
                onKeyDown={(e) => {
                  if(e.key === "Enter"){
                    handler();
                  }
                }}
              />

              <button
                onClick={handler}
                className="bg-black text-white rounded-xl md:rounded-2xl border border-blue-800 px-2 md:px-4 p-2 md:p-3 hover:cursor-pointer font-semibold text-sm md:text-base"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pages;