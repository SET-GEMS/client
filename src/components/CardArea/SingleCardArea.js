import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";

import { getAllCardInfo, shuffleCards, validateSet, findValidSet } from "../../helper/card";
import Card from "../Card";

function SingleCardArea({ onSuccess, onGameCompleted }) {
  const hintTime = 30000;
  const maxCardCount = 12;
  const [isRequiredShuffle, setIsRequiredShuffle] = useState(false);
  const [remainingCards, setRemainingCards] = useState([]);
  const [openedCards, setOpenedCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [hintCard, setHintCard] = useState([]);
  const [isWrong, setIsWrong] = useState(false);

  useEffect(() => {
    const initialCards = shuffleCards(getAllCardInfo());
    const openedCards = initialCards.splice(-maxCardCount, maxCardCount);

    setRemainingCards(initialCards);
    setOpenedCards(openedCards);
  }, []);

  useEffect(() => {
    const correctSet = findValidSet(openedCards);

    if (!correctSet.length) {
      return setIsRequiredShuffle(true);
    }

    const hintTimer = setTimeout(() => {
      setHintCard(correctSet);
    }, hintTime);

    return () => clearTimeout(hintTimer);
  }, [openedCards]);

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
  }, [isRequiredShuffle]);

  useEffect(() => {
    if (selectedCards.length !== 3) {
      return;
    }

    const selectedSet = selectedCards
      .map((cardIndex) => openedCards[cardIndex]);

    if (!validateSet(selectedSet)) {
      const animationTime = 300;
      setIsWrong(true);

      setTimeout(() => {
        setIsWrong(false);
      }, [animationTime]);

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

  useEffect(() => {
    if (isWrong) {
      return;
    }

    setSelectedCards([]);
    setHintCard([]);
  }, [isWrong, openedCards]);

  const handleCardClick = useCallback((i) => {
    if (selectedCards.includes(i)) {
      setSelectedCards((cards) => cards.filter((cardIndex) => cardIndex !== i));
      return;
    }

    setSelectedCards((cards) => [ ...cards, i]);
  }, []);

  const cardElements = openedCards.map((cardProps, i) => {
    let state = "";

    if (hintCard.includes(i)) {
      state = "hint";
    }

    if (selectedCards.includes(i)) {
      state = isWrong ? "wrong" : "selected";
    }

    return (
      <Card
        key={JSON.stringify(cardProps)}
        state={state}
        index={i}
        {...cardProps}
        onClick={handleCardClick}
      />
    );
  });

  return (
    <div className="card-area">
      {cardElements}
    </div>
  );
}

SingleCardArea.propTypes = {
  onSuccess: PropTypes.func,
  onGameCompleted: PropTypes.func,
};

export default React.memo(SingleCardArea);
