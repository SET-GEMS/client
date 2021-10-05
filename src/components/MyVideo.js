import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

function MyVideo ({ stream, isMuted, isVideoOff }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current || !stream) {
      return;
    }

    const audioTracks = stream.getAudioTracks();
    const videoTracks = stream.getVideoTracks();

    audioTracks.forEach((track) => track.enabled = !isMuted);
    videoTracks.forEach((track) => track.enabled = !isVideoOff);

    videoRef.current.srcObject = stream;
  }, [stream]);

  useEffect(() => {
    if (!stream) {
      return;
    }

    const audioTracks = stream.getAudioTracks();

    audioTracks.forEach((track) => track.enabled = !isMuted);
  }, [isMuted]);

  useEffect(() => {
    if (!stream) {
      return;
    }

    const videoTracks = stream.getVideoTracks();

    videoTracks.forEach((track) => track.enabled = !isVideoOff);
  }, [isVideoOff]);

  return <video ref={videoRef} autoPlay playsInline muted="true" />;
}

MyVideo.propTypes = {
  stream: PropTypes.object,
  isMuted: PropTypes.bool,
  isVideoOff: PropTypes.bool,
  isMine: PropTypes.bool,
};

export default MyVideo;
