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
}

const Pages = ({
  roomid,
  username,
  socket,
  chatmsg,
  setchatmsg,
}: pageschema) => {
  const [input, setinput] = useState<string>("");
  function handler() {
    if (input) {
      const message = { text: input, isuser: true };
      setchatmsg((prev: chatmsg[]) => [...prev, message]);
    }
    socket.send(input);
    setinput("");
  }

  useEffect(() => {
    socket.onmessage = (res) => {
      const data = JSON.parse(res.data) as {type:string};
      console.log(data);
      const mess = { text: data.type, isuser: false };
      setchatmsg((prev: chatmsg[]) => [...prev, mess]);
    };
  }, [socket]);

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
            <h2> users : 2 </h2>
            <h2> Connection:2 </h2>
            <h2>Name: {username}</h2>
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
                  className={`bg-${
                    data.isuser ? "blue" : "green"
                  }-600 p-2 px-4 rounded-lg max-w-[40%] break-words whitespace-pre-wrap text-white`}
                >
                  <p className="text-white text-md break-words">{data.text}</p>
                  <p className="text-xs text-gray-300">
                    {data.isuser ? "You" : "User"}
                  </p>
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
