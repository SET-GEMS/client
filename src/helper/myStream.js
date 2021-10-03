async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    const currentCamera = myStream.getVideoTracks();

    cameras.forEach((camera) => {
      const $option = document.createElement("option");
      $option.value = camera.deviceId;
      $option.innerText = camera.label;

      if(currentCamera.deviceId === camera.deviceId) {
        $option.selected = true;
      }

      $camerasSelect.appendChild($option);
    });
  } catch(err) {
    console.log(err);
  }
}

async function getMedia(deviceId) {
  const initialConstraints = {
    audio: true,
    video: { facingMode: "user" },
  };

  const cameraConstraints = {
    audio: !muted,
    video: { deviceId: { exact: deviceId } },
  };

  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstraints : initialConstraints,
    );

    $myFace.srcObject = myStream;

    if (!deviceId) {
      await getCameras();
    }
  } catch(err) {
    console.log(err);
  }
}
