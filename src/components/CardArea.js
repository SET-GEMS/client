import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

import { getAllCardInfo, shuffleCards, validateSet } from "../helper/card";
import Card from "../components/Card";

function CardArea({ onSuccess, onGameCompleted }) {
  const hintTime = 60000;
  const maxCardCount = 12;
  const cardAreaRef = useRef();
  const [hasNewCards, setHasNewCards] = useState(false);
  const [isRequiredShuffle, setIsRequiredShuffle] = useState(false);
  const [remainingCards, setRemainingCards] = useState([]);
  const [openedCards, setOpenedCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);

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

    const correctSet = [];

    for (let i = 0; i < openedCards.length - 2; i++) {
      if(correctSet.length) {
        break;
      }

      for (let j = i + 1; j < openedCards.length - 1; j++) {
        if(correctSet.length) {
          break;
        }

        for (let k = j + 1; k < openedCards.length; k++) {
          const set = [openedCards[i], openedCards[j], openedCards[k]];
          const hasCorrectSet = validateSet(set);

          if (hasCorrectSet) {
            correctSet.push(i, j, k);
            break;
          }
        }
      }
    }

    if (!correctSet.length) {
      setIsRequiredShuffle(true);
      return;
    }

    const cardElements = cardAreaRef.current.children;
    const setElements = correctSet.map((cardIndex) => cardElements[cardIndex]);

    setTimeout(() => {
      setElements.forEach((card) => {
        card.classList.add("hint");
      });
    }, hintTime);
  }, [hasNewCards]);

  useEffect(() => {
    if (!isRequiredShuffle) {
      return;
    }

    if (!remainingCards.length) {
      onGameCompleted();
    }

    const newRemainingCards = shuffleCards(
      [...remainingCards, ...openedCards],
    );

    const newOpenedCards = newRemainingCards
      .splice(-maxCardCount, maxCardCount);

    setRemainingCards(newRemainingCards);
    setOpenedCards(newOpenedCards);
    setHasNewCards(true);
    setIsRequiredShuffle(false);
  }, [isRequiredShuffle]);

  useEffect(() => {
    if(selectedCards.length !== 3) {
      return;
    }

    const selectedSet = selectedCards
      .map((cardIndex) => openedCards[cardIndex]);

    setSelectedCards([]);

    if (!validateSet(selectedSet)) {
      const cardElements = cardAreaRef.current.children;

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

  const handleCardClick = function(i, { currentTarget }) {
    currentTarget.classList.toggle("selected");

    if (selectedCards.includes(i)) {
      setSelectedCards((cards) => cards.filter((cardIndex) => cardIndex !== i));
      return;
    }

    if (selectedCards.length === 2) {
      const openedCardElements = currentTarget.parentElement.children;

      [...openedCardElements].forEach((card) => {
        card.classList.remove("selected");
        card.classList.remove("hint");
      });

      currentTarget.classList.remove("selected");
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

CardArea.propTypes = {
  onSuccess: PropTypes.func,
  onGameCompleted: PropTypes.func,
};

export default CardArea;
