import Peer from "simple-peer";

function createPlayer(socket, stream, player, isInitiator = true) {
  const peer = new Peer({
    initiator: isInitiator,
    stream: stream,
  });

  peer.on("signal", (data) => {
    socket.emit("signal", data, player.id);
  });

  return { ...player, peer };
}

export default createPlayer;
