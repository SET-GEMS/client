import {
  JOINED, NEW_PLAYER, ALL_READY, START, PLAYER_LEFT, COUNTDOWN, GAME_OVER,
  READY, NEW_SELECTOR, SELECT_SUCCESS, NEW_LEADER, SIGNAL,
} from "../constants/socketEvents";

function removeSocketListeners(socket) {
  socket.removeAllListeners(JOINED);
  socket.removeAllListeners(NEW_PLAYER);
  socket.removeAllListeners(ALL_READY);
  socket.removeAllListeners(START);
  socket.removeAllListeners(PLAYER_LEFT);
  socket.removeAllListeners(COUNTDOWN);
  socket.removeAllListeners(GAME_OVER);
  socket.removeAllListeners(READY);
  socket.removeAllListeners(NEW_SELECTOR);
  socket.removeAllListeners(SELECT_SUCCESS);
  socket.removeAllListeners(NEW_LEADER);
};

export default removeSocketListeners;
