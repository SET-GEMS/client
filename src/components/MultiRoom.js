import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import Player from "./Player";
import MyVideo from "./MyVideo";
import Chat from "./Chat";
import MultiCardArea from "./MultiCardArea";
import createPlayer from "../helper/createPlayer";
import setTemporaryMessage from "../helper/setTemporaryMessage";
import { getCameras, getStream } from "../helper/video";
import { WAITING, PLAYING, ENDED } from "../constants/playState";
import { JOINED, NEW_LEADER, NEW_PLAYER, PLAYER_LEFT, READY, SIGNAL, START } from "../constants/socketEvents";

function MultiRoom({ roomName, nickname, stream, streamSetting, socket }) {
  const [state, setState] = useState(WAITING);
  const [myStream, setMyStream] = useState(stream);
  const [cameraId, setCameraId] = useState("");
  const [cameras, setCameras] = useState([]);
  const [isMuted, setIsMuted] = useState(streamSetting.isMuted);
  const [isVideoOff, setIsVideoOff] = useState(streamSetting.isVideoOff);
  const [isLeader, setIsLeader] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [players, setPlayers] = useState([]);
  const [waitingPlayers, setWaitingPlayers] = useState([]);
  const [myPoint, setMyPoint] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadCameras() {
      try {
        const cameras = await getCameras();
        setCameras(cameras);
      } catch(err) {
        setTemporaryMessage(err.message, setMessage);
      }
    }

    loadCameras();

    return () => {
      myStream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    const cameras = myStream.getVideoTracks();

    if (cameras.length) {
      const currentCamera = myStream.getVideoTracks()[0].getSettings();
      setCameraId(currentCamera.deviceId);
    }
  }, [myStream]);

  useEffect(() => {
    socket.on(JOINED, (roomMembers) => {
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

    socket.on(NEW_PLAYER, (player) => {
      const newPlayer = createPlayer(socket, myStream, player, false);

      setPlayers((prev) => [...prev, newPlayer]);
    });

    socket.on(SIGNAL, (data, playerId) => {
      const player = players.find(({ id }) => id === playerId);

      if (player) {
        player.peer.signal(data);
      }
    });

    socket.on(READY, (isReady, playerId) => {
      if (isReady) {
        setWaitingPlayers((prev) => [...prev, playerId]);
      } else {
        setWaitingPlayers((prev) => prev.filter((id) => id !== playerId));
      }
    });

    socket.on(START, () => {
      setWaitingPlayers([]);
      startGame();
      setIsReady(false);
    });

    socket.on(PLAYER_LEFT, (playerId) => {
      const leftPlayer = players.find(({ id }) => id !== playerId);

      if (leftPlayer) {
        leftPlayer.peer.destroy();
      }

      setPlayers((prev) => prev.filter(({ id }) => id !== playerId));
    });

    socket.on(NEW_LEADER, (leaderId) => {
      if (leaderId === socket.id) {
        setIsLeader(true);
        setIsReady(false);
      }
    });

    return () => {
      socket.removeAllListeners(JOINED);
      socket.removeAllListeners(NEW_PLAYER);
      socket.removeAllListeners(SIGNAL);
      socket.removeAllListeners(READY);
      socket.removeAllListeners(START);
      socket.removeAllListeners(PLAYER_LEFT);
      socket.removeAllListeners(NEW_LEADER);
    };
  }, [players, myStream]);

  const handleSuccess = function () {
    setMyPoint(prev => prev + 3);
  };

  const handleGameCompleted = function () {
    setState(ENDED);
  };

  const startGame = function () {
    setState(PLAYING);
  };

  const handleStartButton = function () {
    socket.emit(START, roomName, startGame);
    setWaitingPlayers([]);
  };

  const handleReadyButton = function () {
    if (!isReady) {
      socket.emit(READY, true, roomName);
      setIsReady(true);
    } else {
      socket.emit(READY, false, roomName);
      setIsReady(false);
    }
  };

  const handleMuteButton = function () {
    setIsMuted(isMuted => !isMuted);
  };

  const handleVideoButton = function () {
    setIsVideoOff(isVideoOff => !isVideoOff);
  };

  const handleCameraSelect = async function ({ target }) {
    const newStream = await getStream(false, target.value);

    players.forEach(({ peer }) => {
      peer.removeStream(peer.streams[0]);
      peer.addStream(newStream);
    });

    setMyStream(newStream);
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
      {isReady ? "WAITING" : READY}
    </button>
  );

  const waitingButton = isLeader ? startButton : readyButton;

  const cameraOptions = cameras.map((camera) => {
    return (
      <option
        key={camera.deviceId}
        value={camera.deviceId}
      >{camera.label}</option>
    );
  });

  const playerElements = players.map((player) => {
    player.isReady = waitingPlayers.includes(player.id);

    return <Player key={player.id} player={player} />;
  });

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
            <div>
              <select
                defaultValue={cameraId}
                onChange={handleCameraSelect}>
                {cameraOptions}
              </select>
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
