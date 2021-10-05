import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

import { getAllCardInfo, shuffleCards, validateSet, findValidSet } from "../helper/card";
import Card from "./Card";

function MultiCardArea({
  onSuccess,
  onGameCompleted,
  socket,
  roomName,
  isLeader,
}) {
  const hintTime = 60000;
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
    if (!isLeader) {
      return;
    }

    const initialCards = shuffleCards(getAllCardInfo());
    const openedCards = initialCards.splice(-maxCardCount, maxCardCount);

    setRemainingCards(initialCards);
    setOpenedCards(openedCards);
    setHasNewCards(true);

    socket.emit("set_cards", roomName, openedCards, initialCards);
  }, [isLeader]);

  useEffect(() => {
    socket.on("set_cards", (openedCards, remainingCards) => {
      setRemainingCards(remainingCards);
      setOpenedCards(openedCards);
      setHasNewCards(true);
    });

    socket.on("select_card", (cardIndex) => {
      handleCardSelect(cardIndex);
    });

    socket.on("game_over", () => {
      onGameCompleted();
    });

    return () => {
      socket.removeAllListeners("set_cards");
      socket.removeAllListeners("select_card");
      socket.removeAllListeners("game_over");
    };
  }, [handleCardSelect]);

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

    socket.emit("set_cards", roomName, newOpenedCards, newRemainingCards);
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
    socket.emit("select_card", roomName, i);
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
