import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

function Video ({ stream, isMuted, isVideoOff, isMine }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current || !stream) {
      return;
    }

    videoRef.current.srcObject = stream;

    stream.getAudioTracks()
    .forEach((track) => track.enabled = !isMuted);
    stream.getVideoTracks()
      .forEach((track) => track.enabled = !isVideoOff);
  }, [stream]);

  useEffect(() => {
    if (!stream) {
      return;
    }

    stream.getAudioTracks()
      .forEach((track) => track.enabled = !isMuted);
  }, [isMuted]);

  useEffect(() => {
    if (!stream) {
      return;
    }

    stream.getVideoTracks()
      .forEach((track) => track.enabled = !isVideoOff);
  }, [isVideoOff]);

  return <video ref={videoRef} autoPlay playsInline muted={isMine} />;
}

Video.propTypes = {
  stream: PropTypes.object,
  isMuted: PropTypes.bool,
  isVideoOff: PropTypes.bool,
  isMine: PropTypes.bool,
};

export default Video;
