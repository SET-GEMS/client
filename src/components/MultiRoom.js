import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

import Player from "./Player";
import MyVideo from "./MyVideo";
import Chat from "./Chat";
import createPlayer from "../helper/player";
import MultiCardArea from "./MultiCardArea";
import { getCameras, getStream } from "../helper/video";
import { WAITING, PLAYING, ENDED } from "../constants/playState";

function MultiRoom({ roomName, nickname, stream, streamSetting, socket }) {
  const [state, setState] = useState(WAITING);
  const [myStream, setMyStream] = useState(stream);
  const [cameraId, setCameraId] = useState("");
  const [isMuted, setIsMuted] = useState(streamSetting.isMuted);
  const [isVideoOff, setIsVideoOff] = useState(streamSetting.isVideoOff);
  const [isLeader, setIsLeader] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [players, setPlayers] = useState([]);
  const [waitingPlayers, setWaitingPlayers] = useState([]);
  const [myPoint, setMyPoint] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("joined", (roomMembers) => {
      if (roomMembers.length) {
        const waitingPlayers = [];

        const players = roomMembers.map((player) => {
          if (player.isReady) {
            waitingPlayers.push(player.id);
          }

          return createPlayer(socket, myStream, player);
        });

        setPlayers(players);
        setWaitingPlayers(waitingPlayers);
      } else {
        setIsLeader(true);
      }
    });

    socket.on("new_player", (player) => {
      const newPlayer = createPlayer(socket, myStream, player, false);

      setPlayers((prev) => [...prev, newPlayer]);
    });

    socket.on("signal", (data, playerId) => {
      const player = players.find(({ id }) => id === playerId);

      if (player) {
        player.peer.signal(data);
      }
    });

    socket.on("ready", (isReady, playerId) => {
      if (isReady) {
        setWaitingPlayers((prev) => [...prev, playerId]);
      } else {
        setWaitingPlayers((prev) => prev.filter((id) => id !== playerId));
      }
    });

    socket.on("start", () => {
      setWaitingPlayers([]);
      startGame();
      setIsReady(false);
    });

    socket.on("player_left", (playerId) => {
      const leftPlayer = players.find(({ id }) => id !== playerId);

      if (leftPlayer) {
        leftPlayer.peer.destroy();
      }

      setPlayers((prev) => prev.filter(({ id }) => id !== playerId));
    });

    return () => {
      socket.removeAllListeners("joined");
      socket.removeAllListeners("new_player");
      socket.removeAllListeners("signal");
      socket.removeAllListeners("ready");
      socket.removeAllListeners("start");
      socket.removeAllListeners("player_left");
    };
  }, [players]);

  const startGame = function () {
    setState(PLAYING);
  };

  const handleStartButton = function () {
    socket.emit("start", roomName, startGame);
    setWaitingPlayers([]);
  };

  const handleReadyButton = function () {
    if (!isReady) {
      socket.emit("ready", true, roomName);
      setIsReady(true);
    } else {
      socket.emit("ready", false, roomName);
      setIsReady(false);
    }
  };

  const handleMuteButton = function () {
    setIsMuted(isMuted => !isMuted);
  };

  const handleVideoButton = function () {
    setIsVideoOff(isVideoOff => !isVideoOff);
  };

  const isAbleToStart = players.length
    && players.length === waitingPlayers.length;

  const startButton = (
    <button
      type="button"
      onClick={handleStartButton}
      disabled={!isAbleToStart}
    >
      {isAbleToStart ? "START" : "WAITING"}
    </button>
  );

  const readyButton = (
    <button type="button" onClick={handleReadyButton}>
      {isReady ? "WAITING" : "READY"}
    </button>
  );

  const waitingButton = isLeader ? startButton : readyButton;

  const playerElements = players.map((player) => {
    player.isReady = waitingPlayers.includes(player.id);

    return <Player key={player.id} player={player} />;
  });

  const handleSuccess = function () {
    setMyPoint(prev => prev + 3);
  };

  const handleGameCompleted = function () {
    setState(ENDED);
  };

  return (
    <div>
      {message && <p>{message}</p>}
      <div className="play">
        <div className="main">
          {state === WAITING
            && <Chat roomName={roomName} socket={socket} />}
          {state === PLAYING
            && <MultiCardArea
              onSuccess={handleSuccess}
              onGameCompleted={handleGameCompleted}
              roomName={roomName}
              socket={socket}
              isLeader={isLeader}
            />}
          {state === ENDED
            && <div>게임결과</div>}
        </div>
        <div className="sub">
          <div className="players">
            <div>
              <button onClick={handleMuteButton}>
                {isMuted ? "UNMUTE" : "MUTE"}
              </button>
              <button onClick={handleVideoButton}>
                {isVideoOff ? "VIDEO ON" : "VIDEO OFF"}
              </button>
            </div>
            <div className={isReady ? "ready player" : "player"}>
              <p>{nickname}</p>
              <MyVideo
                stream={myStream}
                isMuted={isMuted}
                isVideoOff={isVideoOff}
              />
              <div>
                {myPoint}
              </div>
            </div>
            {playerElements}
          </div>
        </div>
        <div className="button">
          {WAITING && waitingButton}
        </div>
      </div>
    </div>
  );
}

MultiRoom.propTypes = {
  roomName: PropTypes.string,
  nickname: PropTypes.string,
  stream: PropTypes.object,
  streamSetting: PropTypes.shape({
    isMuted: PropTypes.bool,
    isVideoOff: PropTypes.bool,
  }),
  socket: PropTypes.object,
};

export default MultiRoom;
