import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import Video from "./Video";

function Player({ nickname, stream, count, muted, videoOff, isMine }) {
  const [isMuted, setIsMuted] = useState(muted);
  const [isVideoOff, setIsVideoOff] = useState(videoOff);

  useEffect(() => {
    setIsMuted(muted);
  }, [muted]);

  useEffect(() => {
    setIsVideoOff(videoOff);
  }, [videoOff]);

  const handleClick = function () {
    setIsSetting(true);
  };

  return (
    <div className="player" onClick={handleClick}>
      <p>{nickname}</p>
      <Video
        stream={stream}
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        isMine={isMine} />
      <div>
        {count}
      </div>
    </div>
  );
};

Player.propTypes = {
  nickname: PropTypes.string,
  stream: PropTypes.object,
  count: PropTypes.number,
  muted: PropTypes.bool,
  videoOff: PropTypes.bool,
  isMine: PropTypes.bool,
};

export default Player;
