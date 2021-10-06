import { useEffect, useState } from "react";
import { READY, START, NEW_SELECTOR, SELECT_SUCCESS, COUNTDOWN, NEW_LEADER, GAME_OVER } from "../constants/socketEvents";

function usePlayer(socket, player) {
  const [id, setId] = useState("");
  const [point, setPoint] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isSelector, setIsSelector] = useState(false);
  const [isLeader, setIsLeader] = useState(false);

  useEffect(() => {
    if (!player) {
      setId(socket.id);
      return;
    }

    setId(player.id);
    setPoint(player.point || 0);
    setIsReady(player.isReady);
    setIsSelector(player.isSelector);
    setIsLeader(player.isLeader);
  }, [player, socket.id]);

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
  }, [socket.id, id]);

  return [point, isReady, isSelector, isLeader, setIsLeader];
}

export default usePlayer;
