async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");

    return cameras;
  } catch(err) {
    throw Error(err.message);
  }
}

async function getStream(hasVideoError) {
  const initialConstraints = {
    audio: true,
    video: !hasVideoError ? { facingMode: "user" } : false,
  };

  try {
    const myStream = await navigator.mediaDevices.getUserMedia(
      initialConstraints,
    );

    return myStream;
  } catch(err) {
    if (err.message === "Could not start video source") {
      return getStream(true);
    }

    throw Error(err.message);
  }
}

export { getCameras, getStream };
