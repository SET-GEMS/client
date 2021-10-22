import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

import Card from "../Card";
import { getAllCardInfo, shuffleCards, validateSet, findValidSet } from "../../helper/card";
import { NEW_PLAYER, SELECT_CARD, SET_CARDS, LET_JOIN } from "../../constants/socketEvents";

function MultiCardArea({
  onSuccess,
  onGameCompleted,
  socket,
  roomName,
  isLeader,
}) {
  const hintTime = 30000;
  const maxCardCount = 12;
  const cardAreaRef = useRef();
  const [isRequiredShuffle, setIsRequiredShuffle] = useState(false);
  const [remainingCards, setRemainingCards] = useState([]);
  const [openedCards, setOpenedCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);

  useEffect(() => {
    if (!isLeader) {
      return;
    }

    const initialCards = shuffleCards(getAllCardInfo());
    const openedCards = initialCards.splice(-maxCardCount, maxCardCount);

    setRemainingCards(initialCards);
    setOpenedCards(openedCards);

    socket.emit(SET_CARDS, roomName, openedCards, initialCards);
  }, []);

  useEffect(() => {
    const handleCardSelect = (i) => {
      const cardElements = cardAreaRef.current.children;
      const selectedCard = cardElements[i];

      selectedCard.classList.toggle("selected");

      if (selectedCards.includes(i)) {
        setSelectedCards((prev) => prev.filter((cardIndex) => cardIndex !== i));
        return;
      }

      setSelectedCards((prev) => [ ...prev, i]);
    };

    socket.on(SET_CARDS, (openedCards, remainingCards) => {
      setRemainingCards(remainingCards);
      setOpenedCards(openedCards);
    });

    socket.on(SELECT_CARD, handleCardSelect);

    return () => {
      socket.removeAllListeners(SET_CARDS);
      socket.removeAllListeners(SELECT_CARD);
    };
  }, [socket.id, isLeader, cardAreaRef.current]);

  useEffect(() => {
    const handleNewPlayer = (player) => {
      if (isLeader) {
        socket.emit(LET_JOIN, player.id, openedCards, remainingCards);
      }
    };

    socket.on(NEW_PLAYER, handleNewPlayer);

    return () => socket.off(NEW_PLAYER, handleNewPlayer);
  }, [openedCards, remainingCards, isLeader]);

  useEffect(() => {
    const correctSet = findValidSet(openedCards);

    if (!correctSet.length && isLeader) {
      return setIsRequiredShuffle(true);
    }

    const cardElements = cardAreaRef.current.children;
    const setElements = correctSet.map((cardIndex) => cardElements[cardIndex]);

    const hintTimer = setTimeout(() => {
      setElements.forEach((card) => {
        card.classList.add("hint");
      });
    }, hintTime);

    return () => {
      clearTimeout(hintTimer);
    };
  }, [openedCards, remainingCards]);

  useEffect(() => {
    if (!isRequiredShuffle) {
      return;
    }

    setIsRequiredShuffle(false);

    if (!remainingCards.length) {
      return onGameCompleted();
    }

    const newRemainingCards = shuffleCards(
      [...remainingCards, ...openedCards],
    );

    const newOpenedCards = newRemainingCards
      .splice(-maxCardCount, maxCardCount);

    setRemainingCards(newRemainingCards);
    setOpenedCards(newOpenedCards);

    socket.emit(SET_CARDS, roomName, newOpenedCards, newRemainingCards);
  }, [isRequiredShuffle]);

  useEffect(() => {
    if (selectedCards.length !== 3) {
      return;
    }

    setSelectedCards([]);

    const cardElements = cardAreaRef.current.children;

    [...cardElements].forEach((card) => {
      card.classList.remove("selected");
      card.classList.remove("hint");
    });

    const selectedSet = selectedCards
      .map((cardIndex) => openedCards[cardIndex]);

    if (!validateSet(selectedSet)) {
      selectedCards.forEach(cardIndex => {
        const animationTime = 300;

        cardElements[cardIndex].classList.add("wrong");

        setTimeout(() => {
          cardElements[cardIndex].classList.remove("wrong");
        }, [animationTime]);
      });

      return;
    }

    const newOpenedCards = [...openedCards];
    const newRemainingCards = [...remainingCards];

    selectedCards.forEach((deletedIndex) => {
      if (!newRemainingCards.length) {
        newOpenedCards.splice(deletedIndex, 1);
        return;
      }

      newOpenedCards[deletedIndex] = newRemainingCards.pop();
    });

    const cardCount = newOpenedCards.length + newRemainingCards.length;

    onSuccess(cardCount);
    setOpenedCards(newOpenedCards);
    setRemainingCards(newRemainingCards);
  }, [selectedCards.length]);

  const handleCardClick = (i) => {
    socket.emit(SELECT_CARD, roomName, i);
  };

  const cardElements = openedCards.map((cardProps, i) => {
    return <Card key={`card${i}`} {...cardProps} onClick={handleCardClick.bind(null, i)}/>;
  });

  return (
    <div className="card-area" ref={cardAreaRef}>
      {cardElements}
    </div>
  );
}

MultiCardArea.propTypes = {
  onSuccess: PropTypes.func,
  onGameCompleted: PropTypes.func,
  socket: PropTypes.object,
  roomName: PropTypes.string,
  isLeader: PropTypes.bool,
};

export default MultiCardArea;
