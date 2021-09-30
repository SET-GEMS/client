import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import io from "socket.io-client";

import EnterForm from "../components/EnterForm";

function Multi({ onHomeButtonClick }) {
  const [roomName, setRoomName] = useState("");
  const [nickname, setNickname] = useState("");
  const [isMute, setIsMute] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [socket, setSocket] = useState(null);
  const [peers, setPeers] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:8000");

    socket.on("joined", roomMembers => {
      const peers = {};

      roomMembers.forEach(socketId => {
        peers[socketId] = socketId; //webRTC
      });

      setPeers(peers);
    });

    setSocket(socket);
  }, []);

  const handleEnterForm = function({ roomName, nickname, isMute, isVideoOff }) {
    setRoomName(roomName);
    setNickname(nickname);
    setIsMute(isMute);
    setIsVideoOff(isVideoOff);

    socket.emit("join_room", roomName, nickname);
  };

  const handleExitRoom = function() {
    setRoomName("");
    setNickname("");
    setIsMute(false);
    setIsVideoOff(false);
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
      {!roomName && <EnterForm onSubmit={handleEnterForm} />}
    </div>
  );
}

Multi.propTypes = {
  onHomeButtonClick: PropTypes.func,
};

export default Multi;
