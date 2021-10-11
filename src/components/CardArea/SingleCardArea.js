import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

import { getAllCardInfo, shuffleCards, validateSet, findValidSet } from "../../helper/card";
import Card from "../Card";

function SingleCardArea({ onSuccess, onGameCompleted }) {
  const hintTime = 30000;
  const maxCardCount = 12;
  const cardAreaRef = useRef();
  const [hasNewCards, setHasNewCards] = useState(false);
  const [isRequiredShuffle, setIsRequiredShuffle] = useState(false);
  const [remainingCards, setRemainingCards] = useState([]);
  const [openedCards, setOpenedCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [hintTimer, setHintTimer] = useState(null);

  useEffect(() => {
    const initialCards = shuffleCards(getAllCardInfo());
    const openedCards = initialCards.splice(-maxCardCount, maxCardCount);

    setRemainingCards(initialCards);
    setOpenedCards(openedCards);
    setHasNewCards(true);
  }, []);

  useEffect(() => {
    if (!hasNewCards) {
      return;
    }

    setHasNewCards(false);

    const correctSet = findValidSet(openedCards);

    if (!correctSet.length) {
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

  const handleCardClick = (i, { currentTarget }) => {
    currentTarget.classList.toggle("selected");

    if (selectedCards.includes(i)) {
      setSelectedCards((cards) => cards.filter((cardIndex) => cardIndex !== i));
      return;
    }

    setSelectedCards((cards) => [ ...cards, i]);
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

SingleCardArea.propTypes = {
  onSuccess: PropTypes.func,
  onGameCompleted: PropTypes.func,
};

export default SingleCardArea;
