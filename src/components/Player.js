import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

function Player({ player, isReady, isSelector, point }) {
  const { nickname, peer } = player;
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
    if (isSelector) {
      playerRef.current.classList.add("selector");
    } else {
      playerRef.current.classList.remove("selector");
    }
  }, [isSelector]);

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
    peer: PropTypes.shape({
      on: PropTypes.func,
    }),
  }),
  isReady: PropTypes.bool,
  isSelector: PropTypes.bool,
  point: PropTypes.number,
};

export default Player;
