import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

function Player({ player }) {
  const { nickname, peer, point, isReady, isSetter } = player;
  const playerRef = useRef();
  const videoRef = useRef();

  useEffect(() => {
    peer.on("stream", (stream) => {
      videoRef.current.srcObject = stream;
    });

    return () => {
      videoRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (isReady) {
      playerRef.current.classList.add("ready");
    } else {
      playerRef.current.classList.remove("ready");
    }
  }, [isReady]);

  useEffect(() => {
    if (isSetter) {
      playerRef.current.classList.add("setter");
    } else {
      playerRef.current.classList.remove("setter");
    }
  }, [isSetter]);

  return (
    <div className="player" ref={playerRef}>
      <p>{nickname}</p>
      <video ref={videoRef} autoPlay playsInline />
      <div>
        {point || 0}
      </div>
    </div>
  );
};

Player.propTypes = {
  player: PropTypes.shape({
    id: PropTypes.string,
    nickname: PropTypes.string,
    peer: PropTypes.object,
    point: PropTypes.number,
    isReady: PropTypes.bool,
    isSetter: PropTypes.bool,
  }),
};

export default Player;
