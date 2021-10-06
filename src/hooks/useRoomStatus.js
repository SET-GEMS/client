import { useEffect, useState } from "react";

import createPeer from "../helper/createPeer";
import { WAITING, PLAYING, ENDED } from "../constants/playState";
import {
  JOINED, SIGNAL, NEW_PLAYER, PLAYER_LEFT,
  ALL_READY, START, COUNTDOWN, GAME_OVER,
} from "../constants/socketEvents";

function useRoomStatus(socket, stream, onChangeIsLeader) {
  const [state, setState] = useState(WAITING);
  const [players, setPlayers] = useState([]);
  const [peers, setPeers] = useState([]);
  const [isAllReady, setIsAllReady] = useState(false);
  const [selectTime, setSelectTime] = useState(0);
  const [result, setResult] = useState([]);

  useEffect(() => {
    return () => {
      setState(WAITING);
      setPeers((prev) => {
        prev.forEach(({ peer }) => {
          peer.destroy();
        });

        return [];
      });
      setPlayers([]);
      setIsAllReady(false);
      setSelectTime(0);
      setResult([]);
    };
  }, []);

  useEffect(() => {
    socket.on(JOINED, (roomMembers) => {
      if (roomMembers.length) {
        const peers = roomMembers.map(({ id }) => {
          const peer = createPeer(socket, stream, id);
          return { id, peer };
        });

        setPeers(peers);
        setPlayers(roomMembers);
      } else {
        onChangeIsLeader(true);
      }
    });

    socket.on(NEW_PLAYER, (player) => {
      const peer = createPeer(socket, stream, player.id, false);
      const newPeer = { id: player.id, peer };

      setPlayers((prev) => [...prev, player]);
      setPeers((prev) => [...prev, newPeer]);
      setIsAllReady(false);
    });

    socket.on(ALL_READY, (isAllReady) => {
      setIsAllReady(isAllReady);
    });

    socket.on(START, () => {
      setState(PLAYING);
      setResult([]);
    });

    socket.on(PLAYER_LEFT, (playerId) => {
      setPeers((prev) => {
        const peer = prev.find(({ id }) => id === playerId);

        if (peer) {
          peer.peer.destroy();
        }

        return prev.filter(({ id }) => id !== playerId);
      });

      setPlayers((prev) => prev.filter(({ id }) => id !== playerId));
    });

    socket.on(COUNTDOWN, (selectTime) => {
      setSelectTime(selectTime);
    });

    socket.on(GAME_OVER, (result) => {
      setState(ENDED);
      setResult(result);
      setIsAllReady(false);
    });
  }, [socket.id]);

  useEffect(() => {
    socket.on(SIGNAL, (data, playerId) => {
      const peer = peers.find(({ id }) => id === playerId);

      if (peer) {
        peer.peer.signal(data);
      }
    });

    return () => socket.removeAllListeners(SIGNAL);
  }, [peers.length]);

  return [state, setState, players, peers, isAllReady, selectTime, result];
}

export default useRoomStatus;
