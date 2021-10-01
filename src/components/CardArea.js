import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { getAllCardInfo, shuffleCards } from "../helper/card";
import Card from "../components/Card";

function CardArea() {
  const maxCardCount = 12;
  const [remainingCards, setRemainingCards] = useState([]);
  const [openedCards, setOpenedCards] = useState([]);

  useEffect(() => {
    const initialCards = shuffleCards(getAllCardInfo());
    const openedCards = initialCards.splice(-maxCardCount, maxCardCount);

    setRemainingCards(initialCards);
    setOpenedCards(openedCards);
  }, []);

  const cardElements = openedCards.map((cardProps, i) => {
    return <Card key={`card${i}`} {...cardProps} />;
  });

  return (
    <div className="card-area">
      {cardElements}
    </div>
  );
}

CardArea.propTypes = {
  //
};

export default CardArea;
