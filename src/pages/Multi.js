import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import io from "socket.io-client";

import EnterForm from "../components/EnterForm";
import MultiRoom from "../components/MultiRoom";
import { getStream } from "../helper/video";

function Multi({ onHomeButtonClick }) {
  const [roomName, setRoomName] = useState("");
  const [nickname, setNickname] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [myStream, setMyStream] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:8000", { reconnection: false });

    const handleSocketError = function () {
      setMessage("현재 같이하기 모드를 사용할 수 없습니다");

      setTimeout(() => {
        setMessage("");
        onHomeButtonClick();
      }, 1000);
    };

    socket.on("connect_error", handleSocketError);
    socket.on("connect_failed", handleSocketError);
    socket.on("disconnect", handleSocketError);

    socket.on("full_room", () => {
      setMessage("정원초과로 들어갈 수 없는 방입니다");

      setTimeout(() => {
        setMessage("");
      }, 1000);
    });

    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleEnterForm = function (values) {
    const { roomName, nickname, isMuted, isVideoOff } = values;

    setIsMuted(isMuted);
    setIsVideoOff(isVideoOff);

    async function enterRoom (nickname) {
      const myStream = await getStream();

      setMyStream(myStream);
      setRoomName(roomName);
      setNickname(nickname);
      socket.emit("join_room", roomName);
    }

    socket.emit("knock", roomName, nickname, enterRoom);
  };

  const handleExitRoom = function () {
    myStream.getTracks().forEach(track => track.stop());

    setRoomName("");
    setNickname("");
    setIsMuted(false);
    setIsVideoOff(false);
    setMyStream(null);
    socket.emit("exit_room", roomName);
  };

  const exitButton = (
    <button type="button" onClick={handleExitRoom}>
      방에서 나가기
    </button>
  );

  const homeButton = (
    <button type="button" onClick={onHomeButtonClick}>
      home
    </button>
  );

  return (
    <div>
      <div className="header">
        <h1>{roomName ? roomName : "같이하기"}</h1>
        {roomName ? exitButton : homeButton}
      </div>
      {message && <p>{message}</p>}
      {!roomName
        ? <EnterForm onSubmit={handleEnterForm} />
        : <MultiRoom
          roomName={roomName}
          nickname={nickname}
          stream={myStream}
          streamSetting={{ isMuted, isVideoOff }}
          socket={socket}
        />}
    </div>
  );
}

Multi.propTypes = {
  onHomeButtonClick: PropTypes.func,
};

export default Multi;
