import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

import { getAllCardInfo, shuffleCards, validateSet, findValidSet } from "../helper/card";
import Card from "./Card";
import { NEW_PLAYER, SELECT_CARD, SET_CARDS } from "../constants/socketEvents";

function MultiCardArea({
  onSuccess,
  onGameCompleted,
  socket,
  roomName,
  isLeader,
}) {
  const hintTime = 1000;
  const maxCardCount = 12;
  const cardAreaRef = useRef();
  const [hasNewCards, setHasNewCards] = useState(false);
  const [isRequiredShuffle, setIsRequiredShuffle] = useState(false);
  const [remainingCards, setRemainingCards] = useState([]);
  const [openedCards, setOpenedCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [hintTimer, setHintTimer] = useState(null);

  const handleCardSelect = function (i) {
    const cardElements = cardAreaRef.current.children;
    const selectedCard = cardElements[i];

    selectedCard.classList.toggle("selected");

    if (selectedCards.includes(i)) {
      setSelectedCards((cards) => cards.filter((cardIndex) => cardIndex !== i));

      return;
    }

    setSelectedCards((cards) => [ ...cards, i]);
  };

  useEffect(() => {
    socket.on(SET_CARDS, (openedCards, remainingCards) => {
      setRemainingCards(remainingCards);
      setOpenedCards(openedCards);
      setHasNewCards(true);
    });

    socket.on(SELECT_CARD, (cardIndex) => {
      handleCardSelect(cardIndex);
    });

    socket.on(NEW_PLAYER, (player) => {
      if (isLeader) {
        socket.emit("let_join", player.id, openedCards, remainingCards);
      }
    });

    return () => {
      socket.removeAllListeners(SET_CARDS);
      socket.removeAllListeners(SELECT_CARD);
    };
  }, [isLeader, handleCardSelect]);

  useEffect(() => {
    if (!isLeader) {
      return;
    }

    const initialCards = shuffleCards(getAllCardInfo());
    const openedCards = initialCards.splice(-maxCardCount, maxCardCount);

    setRemainingCards(initialCards);
    setOpenedCards(openedCards);
    setHasNewCards(true);

    socket.emit(SET_CARDS, roomName, openedCards, initialCards);
  }, [isLeader]);

  useEffect(() => {
    if (!hasNewCards) {
      return;
    }

    setHasNewCards(false);

    const correctSet = findValidSet(openedCards);

    if (!correctSet.length && isLeader) {
      return setIsRequiredShuffle(true);
    }

    const cardElements = cardAreaRef.current.children;
    const setElements = correctSet.map((cardIndex) => cardElements[cardIndex]);

    const newHintTimer = setTimeout(() => {
      setElements.forEach((card) => {
        card.classList.add("hint");
      });
    }, hintTime);

    setHintTimer(newHintTimer);

    return () => clearTimeout(hintTimer);
  }, [hasNewCards]);

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
    setHasNewCards(true);

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
    setHasNewCards(true);

  }, [selectedCards.length]);

  const handleCardClick = function (i) {
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
