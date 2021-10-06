import { useEffect, useState } from "react";
import { READY, START, NEW_SELECTOR, SELECT_SUCCESS, COUNTDOWN, NEW_LEADER, GAME_OVER } from "../constants/socketEvents";

const initialPlayer = {
  id: "",
  point: 0,
  isReady: false,
  isSelector: false,
  isLeader: false,
};

function usePlayer(socket, player = initialPlayer) {
  const id = player.id || socket.id;
  const [point, setPoint] = useState(player.point);
  const [isReady, setIsReady] = useState(player.isReady);
  const [isSelector, setIsSelector] = useState(player.isSelector);
  const [isLeader, setIsLeader] = useState(player.isLeader);

  useEffect(() => {
    socket.on(READY, (isReady, playerId) => {
      if (playerId === id) {
        setIsReady(isReady);
      }
    });

    socket.on(START, () => {
      setIsReady(false);
    });

    socket.on(NEW_SELECTOR, (playerId) => {
      if (playerId === id) {
        setIsSelector(true);
      }
    });

    socket.on(SELECT_SUCCESS, (point, playerId) => {
      if (playerId === id) {
        setPoint(point);
        setIsSelector(false);
      }
    });

    socket.on(COUNTDOWN, (time) => {
      if (time === 0) {
        setIsSelector(false);
      }
    });

    socket.on(NEW_LEADER, (leaderId) => {
      if (leaderId === id) {
        setIsLeader(true);
        setIsReady(false);
      }
    });

    socket.on(GAME_OVER, () => {
      setPoint(0);
    });

    if (player.id) {
      return;
    }
  }, [id, player.id]);

  return [point, isReady, isSelector, isLeader, setIsLeader];
}

export default usePlayer;
