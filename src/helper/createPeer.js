import Peer from "simple-peer";

function createPeer(socket, stream, id, isInitiator = true) {
  const peer = new Peer({
    initiator: isInitiator,
    stream: stream,
  });

  peer.on("signal", (data) => {
    socket.emit("signal", data, id);
  });

  return peer;
}

export default createPeer;
