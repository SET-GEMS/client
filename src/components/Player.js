import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

function Player({ player }) {
  const { nickname, peer, point, isReady } = player;
  const videoRef = useRef();

  useEffect(() => {
    peer.on("stream", (stream) => {
      videoRef.current.srcObject = stream;
    });

    return () => {
      videoRef.current = null;
    };
  }, []);

  return (
    <div className={isReady ? "ready player" : "player"}>
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
  }),
};

export default Player;
