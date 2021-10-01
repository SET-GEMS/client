import { GEM_COLOR, GEM_SHAPE, METAL_COLOR, METAL_SHAPE } from "../constants/cardProperty";

function getAllCardInfo() {
  const allCardInfo = [];

  Object.values(GEM_COLOR).forEach(gemColor => {
    Object.values(GEM_SHAPE).forEach(gemShape => {
      Object.values(METAL_COLOR).forEach(metalColor => {
        Object.values(METAL_SHAPE).forEach(metalShape => {
          const cardInfo = { gemColor, gemShape, metalColor, metalShape };
          allCardInfo.push(cardInfo);
        });
      });
    });
  });

  return allCardInfo;
}

function shuffleCards(cards) {
  const shuffledCards = [...cards];

  cards.forEach((_, i) => {
    const randomIndex = Math.floor(Math.random() * cards.length);
    const temp = shuffledCards[i];
    shuffledCards[i] = shuffledCards[randomIndex];
    shuffledCards[randomIndex] = temp;
  });

  return shuffledCards;
}

export { getAllCardInfo, shuffleCards };
