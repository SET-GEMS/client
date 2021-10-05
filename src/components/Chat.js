import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

function Chat({ roomName, socket }) {
  const [messages, setMessages] = useState([]);
  const windowRef = useRef();

  useEffect(() => {
    socket.on("chat", (message) => {
      setMessages((prev) => [...prev, message]);
      windowRef.current.scrollTo(0, "800px");
    });

    return () => {
      socket.removeAllListeners("chat");
    };
  }, []);

  useEffect(() => {
    if (!messages.length) {
      return;
    }

    const lastMessageElement = windowRef.current.children[messages.length - 1];
    lastMessageElement.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleFormSubmit = function (ev) {
    ev.preventDefault();
    const message = ev.target.message.value;

    setMessages((prev) => [...prev, `YOU: ${message}`]);
    socket.emit("chat", roomName, message);

    ev.target.message.value = "";
  };

  const messageElements = messages.map((message, i) => {
    return <p key={`message${i}`}>{message}</p>;
  });

  return (
    <div>
      <h2>CHAT</h2>
      <div className="chatting-window" ref={windowRef}>
        {messageElements}
      </div>
      <form className="chatting-form" onSubmit={handleFormSubmit}>
        <input type="text" name="message" required />
        <button>chat</button>
      </form>
    </div>
  );
}

Chat.propTypes ={
  roomName: PropTypes.string,
  socket: PropTypes.object,
};

export default Chat;
