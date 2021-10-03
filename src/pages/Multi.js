import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import io from "socket.io-client";

import EnterForm from "../components/EnterForm";
import CardArea from "../components/CardArea";
import Player from "../components/Player";
import { WAITING, PLAYING, ENDED } from "../constants/playState";

function Multi({ onHomeButtonClick }) {
  const [state, setState] = useState(WAITING);
  const [roomName, setRoomName] = useState("");
  const [nickname, setNickname] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [socket, setSocket] = useState(null);
  const [isLeader, setIsLeader] = useState(false);
  const [peers, setPeers] = useState({});
  const [message, setMessage] = useState("");
  const [myStream, setMyStream] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:8000");

    socket.on("full-room", () => {
      setMessage("정원초과로 들어갈 수 없는 방입니다");

      setTimeout(() => {
        setMessage("");
      }, 1000);
    });

    socket.on("joined", (nickname, roomMembers) => {
      setNickname(nickname);
      console.log(nickname);

      if (roomMembers.length) {
        const peers = {};

        roomMembers.forEach(socket => {
          peers[socket.Id] = socket; //webRTC
        });

        setPeers(peers);
      } else {
        setIsLeader(true);
      }
    });

    setSocket(socket);
  }, []);

  useEffect(() => {
    if (!roomName) {
      return;
    }

    async function getCameras() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter((device) => device.kind === "videoinput");

        return cameras;
      } catch(err) {
        console.log(err);
      }
    }

    async function getMedia(hasVideoError) {
      const cameras = await getCameras();

      console.log(cameras);
      const initialConstraints = {
        audio: true,
        video: cameras.length && !hasVideoError ? { facingMode: "user" } : false,
      };

      try {
        const myStream = await navigator.mediaDevices.getUserMedia(
          initialConstraints,
        );

        console.log(myStream);

        setMyStream(myStream);
      } catch(err) {
        console.log(err);

        if (err.message === "Could not start video source") {
          return getMedia(true);
        }

        setMessage(err.message);

        setTimeout(() => {
          setMessage("");
        }, 1000);
      }
    }

    getMedia();
  }, [roomName]);

  const handleEnterForm = function (values) {
    const { roomName, nickname, isMuted, isVideoOff } = values;

    function enterRoom () {
      setRoomName(roomName);
      setNickname(nickname);
      setIsMuted(isMuted);
      setIsVideoOff(isVideoOff);
    }

    socket.emit("join_room", roomName, nickname, enterRoom);
  };

  const handleExitRoom = function () {
    setRoomName("");
    setNickname("");
    setIsMuted(false);
    setIsVideoOff(false);
  };

  const startGame = function () {
    console.log("Start");
    setState(PLAYING);
  };

  const handleStartButton = function () {
    socket.emit("start", roomName, startGame);
  };

  const handleReadyButton = function ({ target }) {
    if (target.innerText === "READY") {
      socket.emit("ready", roomName);
      target.innerText = "WAITING";
    } else {
      socket.emit("not ready", roomName);
      target.innerText = "READY";
    }
  };

  const handleMuteButton = function () {
    setIsMuted(isMuted => !isMuted);
  };

  const handleVideoButton = function () {
    setIsVideoOff(isVideoOff => !isVideoOff);
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

  const startButton = (
    <button type="button" onClick={handleStartButton}>
      START
    </button>
  );

  const readyButton = (
    <button type="button" onClick={handleReadyButton}>
      READY
    </button>
  );

  const waitingButton = isLeader ? startButton : readyButton;

  return (
    <div>
      <div className="header">
        <h1>{roomName ? roomName : "같이하기"}</h1>
        {roomName ? exitButton : homeButton}
      </div>
      {message && <p>{message}</p>}
      {!roomName
        ? <EnterForm onSubmit={handleEnterForm} />
        : <div className="play">
        <div className="main">
          {state === WAITING
            && <div>채팅</div>}
          {state === PLAYING
            && <CardArea
            onSuccess={handleSuccess}
            onGameCompleted={handleGameCompleted} />}
          {state === ENDED
            && <div>게임결과</div>}
        </div>
        <div className="sub">
          {roomName
            && <div>
              <Player
                nickname={nickname}
                stream={myStream}
                count={0}
                videoOff={isVideoOff}
                muted={isMuted}
                isMine
              />
              <button onClick={handleMuteButton}>
                {isMuted ? "UNMUTE" : "MUTE"}
              </button>
              <button onClick={handleVideoButton}>
                {isVideoOff ? "VIDEO ON" : "VIDEO OFF"}
              </button>
            </div>}
        </div>
        <div className="button">
          {WAITING && waitingButton}
        </div>
      </div>}
    </div>
  );
}

Multi.propTypes = {
  onHomeButtonClick: PropTypes.func,
};

export default Multi;
